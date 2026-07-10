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

  // Store listener references for proper cleanup
  let newMessageHandler: ((message: any) => void) | null = null;
  let userTypingHandler: ((data: any) => void) | null = null;

  const fetchMessages = async () => {
    loading.value = true;
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);
    const targetUserId = toValue(targetUserIdArg);
    try {
      const res = await api.get(`/chat/order/${orderId}`);
      if (currentUserId && targetUserId) {
        messages.value = (res.data || []).filter((m: any) => {
          const sId = String(m.senderId || m.sender?._id || m.sender || '');
          const rId = String(m.receiverId || m.receiver?._id || m.receiver || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());
          const tIds = String(targetUserId).split(',').map(id => id.trim());
          const isGeneric = !rId || rId === 'undefined';
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
      createdAt: new Date().toISOString()
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
      newMessageHandler = null;
    }
    if (userTypingHandler) {
      off('userTyping', userTypingHandler);
      userTypingHandler = null;
    }
  };

  const setupListeners = () => {
    connect();

    const sock = getSocket();
    const orderId = toValue(orderIdArg);
    const currentUserId = toValue(currentUserIdArg);

    // Join the order room
    emit('joinOrder', { orderId });

    // Re-join on reconnect
    if (sock) {
      const reconnectHandler = () => {
        console.log(`[useOrderChat] Reconnected, rejoining order:${orderId}`);
        emit('joinOrder', { orderId: toValue(orderIdArg) });
      };
      sock.on('connect', reconnectHandler);
    }

    // Mark as read when chat is opened
    if (currentUserId) {
      emit('markRead', { orderId, userId: currentUserId });
    }

    // Clean up old listeners before adding new ones
    cleanupListeners();

    // Create the newMessage handler
    newMessageHandler = (message: any) => {
      const orderId = toValue(orderIdArg);
      const currentUserId = toValue(currentUserIdArg);
      const targetUserId = toValue(targetUserIdArg);
      const msgOrderId = String(message.orderId || message.order?._id || message.order || '');
      
      if (msgOrderId === String(orderId)) {
        if (currentUserId && targetUserId) {
          const sId = String(message.senderId || message.sender?._id || message.sender || '');
          const rId = String(message.receiverId || message.receiver?._id || message.receiver || '');
          const cIds = String(currentUserId).split(',').map(id => id.trim());
          const tIds = String(targetUserId).split(',').map(id => id.trim());
          const isGeneric = !rId || rId === 'undefined';
          const isRelevant = isGeneric || (cIds.includes(sId) && tIds.includes(rId)) || (tIds.includes(sId) && cIds.includes(rId));
          if (!isRelevant) return;
        }

        // Strict deduplication by _id
        if (!message._id || !messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }

        if (currentUserId) {
          emit('markRead', { orderId, userId: currentUserId });
        }
      }
    };

    userTypingHandler = (data: { userId: string, isTyping: boolean }) => {
      isTyping.value = data.isTyping;
    };

    on('newMessage', newMessageHandler);
    on('userTyping', userTypingHandler);
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
