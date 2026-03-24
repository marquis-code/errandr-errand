import { ref, computed } from 'vue'
import { notifications_api } from '@/api_factory/modules/notifications'

const notifications = ref<any[]>([])
const loading = ref(false)

export const useNotifications = () => {
  const unreadCount = computed(() =>
    notifications.value.filter((n: any) => !n.read).length
  )

  const fetchNotifications = async () => {
    loading.value = true
    try {
      const res = await notifications_api.getAll()
      if (res && (res as any).type !== 'ERROR' && res.data?.data) {
        notifications.value = res.data.data
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await notifications_api.markAsRead(notificationId)
      const idx = notifications.value.findIndex((n: any) => n.id === notificationId)
      if (idx !== -1) {
        notifications.value[idx].read = true
      }
    } catch (e) {
      console.error('Failed to mark as read:', e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notifications_api.markAllAsRead()
      notifications.value.forEach((n: any) => { n.read = true })
    } catch (e) {
      console.error('Failed to mark all as read:', e)
    }
  }

  const addNotification = (notification: any) => {
    // Prevent duplicates
    if (notifications.value.some((n: any) => n.id === notification.id)) return
    notifications.value.unshift(notification)
  }

  const dismissNotification = (notificationId: string) => {
    notifications.value = notifications.value.filter((n: any) => n.id !== notificationId)
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    dismissNotification,
  }
}
