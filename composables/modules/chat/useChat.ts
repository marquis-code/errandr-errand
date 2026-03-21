import { chat_api } from '@/api_factory/modules/chat'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useUser } from '@/composables/modules/auth/user'
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'
import { useStorage } from '@vueuse/core'

export interface ChatMessage {
  id?: string
  roomId?: string
  businessId?: string
  senderId?: string | null
  senderType?: 'customer' | 'staff' | 'system' | 'bot' | 'guest'
  senderName?: string
  messageType?: string
  content?: string
  attachments?: string[]
  isRead?: boolean
  readAt?: string
  isAutomated?: boolean
  isFAQ?: boolean
  createdAt?: string
  updatedAt?: string
  metadata?: Record<string, any>
}

export interface ChatRoom {
  _id: string
  roomType: string
  roomName: string
  businessId: string
  metadata?: Record<string, any>
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  category?: string
  order?: number
  isActive?: boolean
}

export interface AutoResponse {
  _id: string
  trigger: string
  response: string
  keywords?: string[]
  isActive?: boolean
}

const ROOM_KEY = 'chat_active_room'
const MESSAGES_KEY = 'chat_room_messages'
const FAQS_KEY = 'chat_faqs'
const AUTO_RESPONSES_KEY = 'chat_auto_responses'

export const useChat = () => {
  const { showToast } = useCustomToast()
  const { user, isLoggedIn } = useUser()
  const { business } = useGetBusiness()
  const { socket, emitWithAck, isConnected, connectSocket, guestSessionId } = useRealtimeSocket()
  const listenersAttached = useState<boolean>('chat_socket_listeners', () => false)

  const room = useState<ChatRoom | null>(ROOM_KEY, () => null)
  const messages = useState<ChatMessage[]>(MESSAGES_KEY, () => [])
  const faqs = useState<FAQ[]>(FAQS_KEY, () => [])
  const autoResponses = useState<AutoResponse[]>(AUTO_RESPONSES_KEY, () => [])
  const loading = ref(false)
  const sending = ref(false)
  const loadingFaqs = ref(false)

  const guestProfile = useStorage('chat_guest_profile', {
    name: '',
    email: '',
    phone: '',
  })

  const userId = computed(() => {
    const profile = user.value as any
    return profile?._id || profile?.id || profile?.userId || ''
  })

  const isGuest = computed(() => !isLoggedIn.value)

  const mySessionId = computed(() => guestSessionId.value)

  const displayName = computed(() => {
    if (!isGuest.value) {
      const profile = user.value as any
      if (!profile) return 'User'
      return profile?.fullName || profile?.name || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User'
    }
    return guestProfile.value.name || 'Guest'
  })

  const displayEmail = computed(() => {
    if (!isGuest.value) {
      const profile = user.value as any
      return profile?.email || ''
    }
    return guestProfile.value.email || ''
  })

  const ensureRoom = async () => {
    if (room.value?._id) return room.value

    const route = useRoute()
    
    // Try to get businessId and subdomain from multiple sources
    let businessId = (business.value as any)?._id
    let subdomain = (route.query.subdomain as string) || (business.value as any)?.subdomain

    // If no business loaded yet but we have subdomain, fetch it
    if (!businessId && subdomain) {
      const { getBusiness } = useGetBusiness()
      await getBusiness(subdomain)
      businessId = (business.value as any)?._id
    }

    // If still no business, try to get from cached business in useGetBusiness
    if (!businessId) {
      const { cachedBusiness } = useGetBusiness()
      if (cachedBusiness.value) {
        businessId = (cachedBusiness.value as any)?._id
        subdomain = (cachedBusiness.value as any)?.subdomain
      }
    }

    if (!businessId && !subdomain) {
      throw new Error('Business information missing. Please refresh the page or log in again.')
    }

    if (isGuest.value && (!guestProfile.value.name || !guestProfile.value.email)) {
      throw new Error('Name and email are required for guest chat')
    }

    loading.value = true
    try {
      const payload = {
        userId: isGuest.value ? mySessionId.value : userId.value,
        userName: displayName.value,
        userEmail: displayEmail.value,
        userPhone: isGuest.value ? guestProfile.value.phone : (user.value as any)?.phone,
        businessId,
        subdomain,
        isGuest: isGuest.value,
        guestInfo: isGuest.value
          ? {
              sessionId: mySessionId.value,
              userName: guestProfile.value.name,
              email: guestProfile.value.email,
            }
          : undefined,
      }

      console.log('Creating chat room with payload:', payload)

      const res = (await chat_api.createRoom(payload)) as any
      console.log('Chat room API response:', res)
      if([200, 201].includes(res.status)) {
              room.value = res.data
            if (room.value?._id) {
                await joinRoomSocket(room.value._id)
                await loadMessages()
      }

      return room.value
      }    
      
    } catch (error: any) {
      showToast({
        title: 'Chat error',
        message: error?.message || 'Unable to start chat',
        toastType: 'error',
        duration: 4000,
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const joinRoomSocket = async (roomId: string) => {
    connectSocket()
    if (!socket.value) return

    const response = await emitWithAck<any>('chat:join-room', { roomId })
    if (response?.success && Array.isArray(response.messages)) {
      messages.value = response.messages
    }
  }

  const loadMessages = async () => {
    if (!room.value?._id) return

    const currentUserId = isGuest.value ? mySessionId.value : userId.value
    const res = (await chat_api.getRoomMessages(room.value._id, { userId: currentUserId, limit: 50 })) as any
    if ([200, 201].includes(res?.status)) {
      const payload = res.data?.data || res.data
      messages.value = payload?.messages || payload || []
    }
  }

  const getBusinessId = () => {
    let businessId = (business.value as any)?._id
    if (!businessId) {
      const { cachedBusiness } = useGetBusiness()
      businessId = (cachedBusiness.value as any)?._id
    }
    return businessId
  }

  const loadFaqs = async () => {
    const businessId = getBusinessId()
    if (!businessId) return

    loadingFaqs.value = true
    try {
      const res = (await chat_api.getFaqs(businessId)) as any
      if ([200, 201].includes(res?.status)) {
        const payload = res.data?.data || res.data
        faqs.value = Array.isArray(payload) ? payload : payload?.faqs || []
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error)
    } finally {
      loadingFaqs.value = false
    }
  }

  const loadAutoResponses = async () => {
    const businessId = getBusinessId()
    if (!businessId) return

    try {
      const res = (await chat_api.getAutoResponses(businessId)) as any
      if ([200, 201].includes(res?.status)) {
        const payload = res.data?.data || res.data
        autoResponses.value = Array.isArray(payload) ? payload : payload?.autoResponses || []
      }
    } catch (error) {
      console.error('Failed to load auto responses:', error)
    }
  }

  const sendFaqQuestion = async (faq: FAQ) => {
    // Send the question as a user message
    await sendMessage(faq.question)
    
    // Add the FAQ answer as a bot response after a short delay
    setTimeout(() => {
      const faqResponse: ChatMessage = {
        id: `faq_${Date.now()}`,
        roomId: room.value?._id,
        senderId: 'system',
        senderType: 'bot',
        senderName: 'FAQ Bot',
        content: faq.answer,
        messageType: 'text',
        isFAQ: true,
        createdAt: new Date().toISOString(),
      }
      messages.value = [...messages.value, faqResponse]
    }, 500)
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return
    if (!room.value?._id) await ensureRoom()
    if (!room.value?._id) return

    sending.value = true
    try {
      // Optimistically add message to UI immediately
      const optimisticMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        roomId: room.value._id,
        senderId: isGuest.value ? mySessionId.value : userId.value,
        senderType: 'customer',
        senderName: displayName.value,
        content,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        metadata: isGuest.value ? { guestId: mySessionId.value } : {},
      }
      messages.value = [...messages.value, optimisticMessage]

      // Try WebSocket first for real-time experience
      if (isConnected.value && socket.value) {
        const response = await emitWithAck<any>('chat:send-message', {
             roomId: room.value._id,
            content,
            attachments: [],
            senderType: 'customer',
            senderId: isGuest.value ? mySessionId.value : userId.value,
            senderName: displayName.value,
            messageType: 'text'
          // roomId: room.value._id,
          // content,
          // attachments: [],
        })

        if (!response?.success) {
          // WebSocket failed, fall back to REST API
          console.warn('WebSocket send failed, falling back to REST:', response?.error)
          await sendViaRest(content)
        }
      } else {
        // Not connected via WebSocket, use REST API
        await sendViaRest(content)
      }
    } catch (error: any) {
      // Remove optimistic message on error
      messages.value = messages.value.filter(m => !m.id?.startsWith('temp_'))
      showToast({
        title: 'Chat error',
        message: error?.message || 'Unable to send message',
        toastType: 'error',
        duration: 4000,
      })
      throw error
    } finally {
      sending.value = false
    }
  }

  const sendViaRest = async (content: string) => {
    if (!room.value?._id) return

    const payload = {
      senderId: isGuest.value ? mySessionId.value : userId.value,
      senderType: 'customer' as const,
      senderName: displayName.value,
      content,
      messageType: 'text',
    }

    const res = (await chat_api.sendMessage(room.value._id, payload)) as any
    if (![200, 201].includes(res?.status)) {
      throw new Error(res?.data?.message || res?.data?.error || 'Message failed to send')
    }
    // Refresh messages if REST was used (WebSocket won't broadcast our own message back)
    await loadMessages()
  }

  const markAsRead = async () => {
    if (!room.value?._id) return
    const readerId = isGuest.value ? mySessionId.value : userId.value
    if (!readerId) return

    await chat_api.markMessagesAsRead(room.value._id, readerId)
  }

  const attachSocketListeners = () => {
    if (!socket.value || listenersAttached.value) return
    listenersAttached.value = true

    socket.value.on('chat:new-message', (message: ChatMessage) => {
      // Replace optimistic message with real one, or add if new
      const existingIndex = messages.value.findIndex(
        m => m.id?.startsWith('temp_') && m.content === message.content
      )
      if (existingIndex >= 0) {
        // Replace optimistic message with real server message
        const updated = [...messages.value]
        updated[existingIndex] = message
        messages.value = updated
      } else {
        // Check if message already exists (avoid duplicates)
        const exists = messages.value.some(m => m.id === message.id)
        if (!exists) {
          messages.value = [...messages.value, message]
        }
      }
    })

    socket.value.on('chat:auto-response', (message: ChatMessage) => {
      const exists = messages.value.some(m => m.id === message.id)
      if (!exists) {
        messages.value = [...messages.value, message]
      }
    })

    socket.value.on('chat:faq-response', (message: ChatMessage) => {
      const exists = messages.value.some(m => m.id === message.id)
      if (!exists) {
        messages.value = [...messages.value, message]
      }
    })
  }

  const detachSocketListeners = () => {
    if (!socket.value) return
    listenersAttached.value = false
    socket.value.off('chat:new-message')
    socket.value.off('chat:auto-response')
    socket.value.off('chat:faq-response')
  }

  const isMine = (message: ChatMessage) => {
    if (isGuest.value) {
      return message?.metadata?.guestId === mySessionId.value
    }
    return message?.senderId === userId.value
  }

  return {
    room,
    messages,
    faqs,
    autoResponses,
    loading,
    sending,
    loadingFaqs,
    isGuest,
    displayName,
    displayEmail,
    guestProfile,
    isConnected,
    ensureRoom,
    loadMessages,
    loadFaqs,
    loadAutoResponses,
    sendMessage,
    sendFaqQuestion,
    markAsRead,
    joinRoomSocket,
    attachSocketListeners,
    detachSocketListeners,
    isMine,
  }
}
