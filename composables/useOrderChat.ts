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

export const useOrderChat = (orderId: string) => {
  const { connect, emit, on, off } = useSocket('chat');
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const isTyping = ref(false);
  const typingTimeout = ref<any>(null);

  const fetchMessages = async () => {
    loading.value = true;
    try {
      const res = await api.get(`/chat/order/${orderId}`);
      messages.value = res.data;
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
    emit('joinOrder', { orderId });

    on('newMessage', (message: any) => {
      const msgOrderId = message.orderId || message.order;
      if (msgOrderId === orderId) {
        messages.value.push(message);
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
