import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useUser } from '@/composables/modules/auth/user'

const LISTENERS_KEY = 'realtime_notification_listeners_v2'

/**
 * Connects to the /realtime WebSocket namespace and listens for all
 * notification events. Must be called once in the layout/app root.
 * 
 * Returns refs to the in-app toast queue for the InAppToast component.
 */
const toastQueue = ref<any[]>([])

export const useRealtimeNotifications = () => {
  const { socket, connectSocket } = useRealtimeSocket()
  const { user } = useUser()
  const { addNotification } = useNotifications()
  const listenersAttached = useState<boolean>(LISTENERS_KEY, () => false)
  
  // Queue for in-app toast display (consumed by InAppToast component)



  const pushToast = (notification: any) => {
    toastQueue.value.push(notification)
    // Also add to persistent notifications store
    addNotification(notification)
  }

  const handleNewOrder = (payload: any) => {
    if (!payload) return
    pushToast({
      id: payload.id || `order_${Date.now()}`,
      title: payload.title || '🚀 New Order Available!',
      body: payload.body || `Order from ${payload.vendorName || 'a store'}`,
      type: 'NEW_ORDER_AVAILABLE',
      data: payload.data || payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    })
  }

  const handleNotification = (payload: any) => {
    if (!payload) return
    pushToast({
      id: payload.id || `notif_${Date.now()}`,
      title: payload.title || 'Notification',
      body: payload.body || payload.message || 'You have a new update',
      type: payload.type || 'GENERAL',
      data: payload.data,
      createdAt: payload.createdAt || new Date().toISOString(),
    })
  }

  const handleOrderAccepted = (payload: any) => {
    if (!payload) return
    pushToast({
      id: `accepted_${Date.now()}`,
      title: '✅ Order Accepted!',
      body: `Your order #${payload.orderNumber} has been accepted by ${payload.errander?.firstName || 'a rider'}`,
      type: 'ORDER_ACCEPTED',
      data: payload,
      createdAt: new Date().toISOString(),
    })
  }

  const handleOrderStatusUpdate = (payload: any) => {
    if (!payload) return
    pushToast({
      id: `status_${Date.now()}`,
      title: payload.title || '📦 Order Update',
      body: payload.body || `Order status changed to ${payload.status?.replace(/_/g, ' ')}`,
      type: 'ORDER_STATUS_UPDATE',
      data: payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    })
  }

  const setupListeners = () => {
    if (!socket.value || listenersAttached.value) return
    listenersAttached.value = true

    // Register the user with the socket server
    if (user.value?._id) {
      socket.value.emit('register', { userId: user.value._id })
    }

    // Listen for all notification events
    socket.value.on('notification:new-order', handleNewOrder)
    socket.value.on('notification:new', handleNotification)
    socket.value.on('notification:order-accepted', handleOrderAccepted)
    socket.value.on('notification:order-status-update', handleOrderStatusUpdate)
  }

  const teardownListeners = () => {
    if (!socket.value || !listenersAttached.value) return
    socket.value.off('notification:new-order', handleNewOrder)
    socket.value.off('notification:new', handleNotification)
    socket.value.off('notification:order-accepted', handleOrderAccepted)
    socket.value.off('notification:order-status-update', handleOrderStatusUpdate)
    listenersAttached.value = false
  }

  onMounted(() => {
    connectSocket()
    // Wait a tick for the socket to connect before setting up listeners
    setTimeout(() => setupListeners(), 500)

    // Also watch for socket reconnection
    if (socket.value) {
      socket.value.on('connect', () => {
        if (user.value?._id) {
          socket.value?.emit('register', { userId: user.value._id })
        }
      })
    }
  })

  onBeforeUnmount(() => {
    teardownListeners()
  })

  return {
    toastQueue,
    setupListeners,
    teardownListeners,
  }
}
