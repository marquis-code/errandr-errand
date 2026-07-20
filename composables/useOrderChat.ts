import { ref, onUnmounted, toValue, type MaybeRefOrGetter } from 'vue';
import { useSocket } from '@/composables/useSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

export interface Message {
  _id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType?: 'text' | 'image' | 'voice';
  attachment?: string;
  sender?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  status?: string;
}

export const useOrderChat = (
  orderIdArg: MaybeRefOrGetter<string>,
  currentUserIdArg?: MaybeRefOrGetter<string | undefined>,
  targetUserIdArg?: MaybeRefOrGetter<string | undefined>
) => {
  const { connect, emit, on, off, getSocket } = useSocket('chat');
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const isTyping = ref(false);
  const typingTimeout = ref<any>(null);

  let newMessageHandler: ((message: any) => void) | null = null;
  let userTypingHandler: ((data: any) => void) | null = null;
  let confirmedHandler: ((message: any) => void) | null = null;

  const fetchMessages = async () => {
    loading.value = true;
    const orderId = toValue(orderIdArg);
    try {
      const res = await api.get(`/chat/order/${orderId}`);
      const targetUserId = toValue(targetUserIdArg);
      const currentUserId = toValue(currentUserIdArg);
      if (currentUserId && targetUserId) {
        messages.value = (res.data || []).filter((m: any) => {
          const sId = String(m.senderId || m.sender?._id || m.sender || '');
          const rId = String(m.receiverId || m.receiver?._id || m.receiver || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());
          const tIds = String(targetUserId).split(',').map(id => id.trim());
          const isGeneric = !rId || rId === 'undefined' || rId === '[object Object]';
          return isGeneric || (cIds.includes(sId) && tIds.includes(rId)) || (tIds.includes(sId) && cIds.includes(rId));
        });
      } else {
        messages.value = res.data || [];
      }
    } catch (e) {
      console.error('Failed to fetch messages', e);
    } finally {
      loading.value = false;
    }
  };

  const extractObjectId = (str: string) => {
    if (!str) return '';
    const parts = String(str).split(',');
    for (const p of parts) {
      const t = p.trim();
      if (/^[0-9a-fA-F]{24}$/.test(t)) return t;
    }
    return String(str).split(',')[0]?.trim() || '';
  };

  const sendMessage = (text: string, receiverId: string, senderId: string, type: 'text' | 'image' | 'voice' = 'text', attachment?: string) => {
    const orderId = toValue(orderIdArg);
    const cleanSenderId = extractObjectId(senderId);
    const cleanReceiverId = extractObjectId(receiverId);
    
    const tempMsg = {
      _id: Date.now().toString(),
      orderId,
      senderId: cleanSenderId,
      receiverId: cleanReceiverId,
      message: text,
      content: text,
      messageType: type,
      attachment,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    messages.value.push(tempMsg as any);

    emit('sendMessage', {
      orderId,
      senderId: cleanSenderId,
      receiverId: cleanReceiverId,
      message: text,
      messageType: type,
      attachment
    });
  };

  const sendTyping = (userId: string) => {
    const orderId = toValue(orderIdArg);
    emit('typing', { orderId, userId });
    if (typingTimeout.value) clearTimeout(typingTimeout.value);
    typingTimeout.value = setTimeout(() => {
      emit('stopTyping', { orderId, userId });
    }, 2000);
  };

  const cleanupListeners = () => {
    if (newMessageHandler) {
      off('newMessage', newMessageHandler);
      off('chat:new-message', newMessageHandler);
      off('newMessageNotification', newMessageHandler);
      newMessageHandler = null;
    }
    if (userTypingHandler) {
      off('userTyping', userTypingHandler);
      off('chat:user-typing', userTypingHandler);
      userTypingHandler = null;
    }
    if (confirmedHandler) {
      off('messageConfirmed', confirmedHandler);
      confirmedHandler = null;
    }
  };

  const setupListeners = () => {
    connect();

    const sock = getSocket();
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);

    console.log(`[useOrderChat] Setting up listeners for order:${orderId}, currentUser:${currentUserId}`);
    emit('joinOrder', { orderId });

    if (sock) {
      const reconnectHandler = () => {
        console.log(`[useOrderChat] Reconnected, rejoining order:${orderId}`);
        emit('joinOrder', { orderId: toValue(orderIdArg) });
      };
      sock.on('connect', reconnectHandler);
    }

    if (currentUserId) {
      emit('markRead', { orderId, userId: currentUserId });
    }

    cleanupListeners();

    newMessageHandler = (message: any) => {
      const orderId = toValue(orderIdArg);
      const currentUserId = toValue(currentUserIdArg);
      const msgOrderId = String(message.orderId || message.order?._id || message.order || '');
      
      console.log(`[useOrderChat] Received message event. msgOrderId=${msgOrderId}, expected=${orderId}, msg=`, message.message?.substring(0, 30));
      
      if (msgOrderId === String(orderId)) {
        const targetUserId = toValue(targetUserIdArg);
        if (targetUserId) {
          const mSender = String(message.senderId || message.sender?._id || message.sender || '');
          const mReceiver = String(message.receiverId || message.receiver?._id || message.receiver || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());
          const tIds = String(targetUserId).split(',').map(id => id.trim());
          const isGeneric = !mReceiver || mReceiver === 'undefined' || mReceiver === '[object Object]';
          const isRelevant = isGeneric || (cIds.includes(mSender) && tIds.includes(mReceiver)) || (tIds.includes(mSender) && cIds.includes(mReceiver));
          
          if (!isRelevant) {
            console.log(`[useOrderChat] Ignoring message meant for different thread.`);
            return;
          }
        }
        if (currentUserId) {
          const sId = String(message.senderId || message.sender?._id || message.sender || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());

          if (cIds.includes(sId)) {
            // It's our own message, check for pending optimistic update
            const pendingIdx = messages.value.findIndex(m => m.status === 'pending' && m.message === message.message && (m.messageType || 'text') === (message.messageType || 'text'));
            if (pendingIdx !== -1) {
              messages.value[pendingIdx] = message;
              return;
            }
          }
        }

        if (!message._id || !messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
          console.log(`[useOrderChat] Message pushed to list. Total messages: ${messages.value.length}`);
        }

        if (currentUserId) {
          emit('markRead', { orderId, userId: currentUserId });
        }
      }
    };

    userTypingHandler = (data: { userId: string, isTyping: boolean }) => {
      isTyping.value = data.isTyping;
    };

    confirmedHandler = (message: any) => {
      const msgOrderId = String(message.orderId || message.order?._id || message.order || '');
      if (msgOrderId === String(toValue(orderIdArg))) {
        // Upgrade the optimistic message with the DB _id
        const idx = messages.value.findIndex(m => m._id === message.tempId || (m.status === 'pending' && m.message === message.message));
        if (idx !== -1) {
          messages.value[idx] = message;
        } else if (!messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }
      }
    };

    // Listen on ALL event names the backend emits
    on('newMessage', newMessageHandler);
    on('chat:new-message', newMessageHandler);
    on('newMessageNotification', newMessageHandler);
    on('userTyping', userTypingHandler);
    on('chat:user-typing', userTypingHandler);
    on('messageConfirmed', confirmedHandler);
  };

  onUnmounted(() => {
    cleanupListeners();
    emit('leaveOrder', { orderId: toValue(orderIdArg) });
  });

  return {
    messages,
    loading,
    isTyping,
    fetchMessages,
    sendMessage,
    sendTyping,
    setupListeners
  };
};
