import { io, Socket } from 'socket.io-client';
import { useUser } from '@/composables/modules/auth/user';
import { ref, computed, onUnmounted } from 'vue';


export const useSocket = (namespace: string) => {
  const config = useRuntimeConfig();
  const { user } = useUser();

  let socket: Socket | null = null;

  const connect = () => {
    if (socket) return socket;

    socket = io(`${config.public.wsBase}/${namespace}`, {
      query: {
        userId: user.value?._id,
      },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log(`Connected to ${namespace} namespace`);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from ${namespace} namespace`);
    });

    return socket;
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const emit = (event: string, data: any) => {
    if (!socket) connect();
    socket?.emit(event, data);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (!socket) connect();
    socket?.on(event, callback);
  };

  const off = (event: string) => {
    socket?.off(event);
  };

  onUnmounted(() => {
    disconnect();
  });

  return { connect, disconnect, emit, on, off, socket: computed(() => socket) };
};
