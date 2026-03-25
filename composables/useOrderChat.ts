import { ref, onUnmounted, computed } from 'vue';
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

export const useOrderChat = (orderId: string, currentUserId?: string, targetUserId?: string) => {
  const { connect, emit, on, off } = useSocket('chat');
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const isTyping = ref(false);
  const typingTimeout = ref<any>(null);

  const fetchMessages = async () => {
    loading.value = true;
    try {
      const res = await api.get(`/chat/order/${orderId}`);
      if (currentUserId && targetUserId) {
        messages.value = (res.data || []).filter((m: any) => {
          const sId = String(m.senderId || m.sender?._id || m.sender || '');
          const rId = String(m.receiverId || m.receiver?._id || m.receiver || '');
          const cId = String(currentUserId);
          const tId = String(targetUserId);
          return (sId === cId && rId === tId) || (sId === tId && rId === cId);
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

  const sendMessage = (text: string, receiverId: string, senderId: string, type: 'text' | 'image' | 'voice' = 'text', attachment?: string) => {
    emit('sendMessage', {
      orderId,
      senderId,
      receiverId,
      message: text,
      messageType: type,
      attachment
    });
  };

  const sendTyping = (userId: string) => {
    emit('typing', { orderId, userId });
    if (typingTimeout.value) clearTimeout(typingTimeout.value);
    typingTimeout.value = setTimeout(() => {
      emit('stopTyping', { orderId, userId });
    }, 2000);
  };

  const setupListeners = () => {
    connect();
    
    off('newMessage');
    off('userTyping');
    
    emit('joinOrder', { orderId });

    on('newMessage', (message: any) => {
      const msgOrderId = message.orderId || message.order;
      if (msgOrderId === orderId) {
        if (currentUserId && targetUserId) {
          const sId = String(message.senderId || message.sender?._id || message.sender || '');
          const rId = String(message.receiverId || message.receiver?._id || message.receiver || '');
          const cId = String(currentUserId);
          const tId = String(targetUserId);
          const isRelevant = (sId === cId && rId === tId) || (sId === tId && rId === cId);
          if (!isRelevant) return;
        }

        // Strict deduplication by _id
        if (!message._id || !messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }
      }
    });

    on('userTyping', (data: { userId: string, isTyping: boolean }) => {
      isTyping.value = data.isTyping;
    });
  };

  onUnmounted(() => {
    emit('leaveOrder', { orderId });
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
