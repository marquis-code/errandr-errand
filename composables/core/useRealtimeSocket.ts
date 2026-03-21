import { io, type Socket } from 'socket.io-client'
import { useStorage } from '@vueuse/core'
import { useUser } from '@/composables/modules/auth/user'

const SOCKET_KEY = 'realtime_socket'
const SOCKET_CONNECTED_KEY = 'realtime_socket_connected'
const SOCKET_CONNECTING_KEY = 'realtime_socket_connecting'

const createSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

export const useRealtimeSocket = () => {
  const { token } = useUser()
  const socket = useState<Socket | null>(SOCKET_KEY, () => null)
  const isConnected = useState<boolean>(SOCKET_CONNECTED_KEY, () => false)
  const isConnecting = useState<boolean>(SOCKET_CONNECTING_KEY, () => false)
  const guestSessionId = useStorage('chat_guest_session_id', createSessionId())
  const guestId = useStorage('chat_guest_id', '')

  const connectSocket = () => {
    if (!process.client) return
    if (socket.value && (socket.value.connected || isConnecting.value)) return

    const baseUrl = import.meta.env.VITE_BASE_URL as string
    isConnecting.value = true

    socket.value = io(`${baseUrl}/realtime`, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      auth: {
        token: token.value || undefined,
        sessionId: guestSessionId.value,
      },
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      isConnecting.value = false
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      isConnecting.value = false
    })

    socket.value.on('connect_error', () => {
      isConnected.value = false
      isConnecting.value = false
    })

    socket.value.on('guest:registered', (payload: { guestId?: string }) => {
      if (payload?.guestId) {
        guestId.value = payload.guestId
      }
    })
  }

  const disconnectSocket = () => {
    if (!socket.value) return
    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
    isConnecting.value = false
  }

  const emitWithAck = <T = any>(event: string, payload: any): Promise<T> => {
    return new Promise((resolve) => {
      if (!socket.value) {
        resolve(undefined as T)
        return
      }
      socket.value.emit(event, payload, (response: T) => resolve(response))
    })
  }

  watch(token, (newToken, oldToken) => {
    if (!process.client) return
    if (newToken === oldToken) return
    if (!socket.value) return

    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
    isConnecting.value = false

    if (newToken || guestSessionId.value) {
      connectSocket()
    }
  })

  return {
    socket,
    isConnected,
    isConnecting,
    guestSessionId,
    guestId,
    connectSocket,
    disconnectSocket,
    emitWithAck,
  }
}
