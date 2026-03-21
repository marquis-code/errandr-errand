import { onMounted, onBeforeUnmount } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'

const LISTENERS_KEY = 'realtime_notification_listeners'

export const useRealtimeNotifications = () => {
  const { showToast } = useCustomToast()
  const { socket, connectSocket } = useRealtimeSocket()
  const listenersAttached = useState<boolean>(LISTENERS_KEY, () => false)

  const handleNotification = (payload: any) => {
    if (!payload) return

    showToast({
      title: payload.title || 'Notification',
      message: payload.message || payload.type || 'You have a new update',
      toastType: payload.priority === 'high' ? 'warning' : 'info',
      duration: 5000,
    })
  }

  const handleAudit = (payload: any) => {
    if (!payload) return
    showToast({
      title: payload.action ? `Audit: ${payload.action}` : 'Audit Update',
      message: payload.description || 'A new audit log was recorded',
      toastType: 'info',
      duration: 5000,
    })
  }

  onMounted(() => {
    connectSocket()

    if (listenersAttached.value || !socket.value) return
    listenersAttached.value = true

    socket.value.on('notification:new', handleNotification)
    socket.value.on('audit:log', handleAudit)
  })

  onBeforeUnmount(() => {
    if (!socket.value || !listenersAttached.value) return

    socket.value.off('notification:new', handleNotification)
    socket.value.off('audit:log', handleAudit)
    listenersAttached.value = false
  })
}
