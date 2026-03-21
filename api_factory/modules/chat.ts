import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const chat_api = {
  createRoom: (payload: {
    userId: string
    userName: string
    userEmail?: string
    userPhone?: string
    businessId?: string
    subdomain?: string
    isGuest?: boolean
    guestInfo?: any
  }) => {
    const url = '/chat/rooms/create'
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  getRoomMessages: (roomId: string, params: {
    userId: string
    page?: number
    limit?: number
    beforeMessageId?: string
  }) => {
    const url = `/chat/rooms/${roomId}/messages`
    return GATEWAY_ENDPOINT.get(url, { params })
  },

  sendMessage: (roomId: string, payload: {
    senderId: string
    senderType: 'customer' | 'staff' | 'system' | 'bot'
    senderName: string
    content: string
    messageType?: string
    attachments?: string[]
    replyToMessageId?: string
  }) => {
    const url = `/chat/rooms/${roomId}/messages`
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  markMessagesAsRead: (roomId: string, userId: string) => {
    const url = `/chat/rooms/${roomId}/messages/read`
    return GATEWAY_ENDPOINT.put(url, { userId })
  },

  getBusinessRooms: (params?: {
    roomType?: string
    isActive?: boolean
    priority?: string
    page?: number
    limit?: number
  }) => {
    const url = '/chat/rooms'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },

  getFaqs: (businessId: string) => {
    const url = '/chat/faqs'
    return GATEWAY_ENDPOINT.get(url, { params: { businessId } })
  },

  getAutoResponses: (businessId: string) => {
    const url = '/chat/auto-responses'
    return GATEWAY_ENDPOINT.get(url, { params: { businessId } })
  },
}
