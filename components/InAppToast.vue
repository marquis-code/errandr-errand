<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-md pointer-events-none">
      <div
        v-for="toast in activeToasts"
        :key="toast.id"
        class="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-in"
        @mouseenter="pauseDismiss(toast.id)"
        @mouseleave="resumeDismiss(toast.id)"
      >
        <!-- Colored top bar based on type -->
        <div
          :class="{
            'bg-gradient-to-r from-[#065fdb] to-blue-500': toast.type === 'NEW_ORDER_AVAILABLE',
            'bg-gradient-to-r from-emerald-500 to-green-500': toast.type === 'ORDER_ACCEPTED',
            'bg-gradient-to-r from-amber-500 to-orange-500': toast.type === 'ORDER_STATUS_UPDATE',
            'bg-gradient-to-r from-gray-700 to-gray-900': !['NEW_ORDER_AVAILABLE', 'ORDER_ACCEPTED', 'ORDER_STATUS_UPDATE'].includes(toast.type),
          }"
          class="h-1"
        />
        
        <div class="p-4">
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div
              :class="{
                'bg-blue-50 text-blue-600': toast.type === 'NEW_ORDER_AVAILABLE',
                'bg-emerald-50 text-emerald-600': toast.type === 'ORDER_ACCEPTED',
                'bg-amber-50 text-amber-600': toast.type === 'ORDER_STATUS_UPDATE',
                'bg-gray-50 text-gray-600': !['NEW_ORDER_AVAILABLE', 'ORDER_ACCEPTED', 'ORDER_STATUS_UPDATE'].includes(toast.type),
              }"
              class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            >
              {{ getTypeEmoji(toast.type) }}
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-bold text-gray-900 mb-0.5">{{ toast.title }}</h4>
              <p class="text-xs text-gray-500 leading-relaxed">{{ toast.body }}</p>
              
              <!-- Earnings for new orders -->
              <div v-if="toast.type === 'NEW_ORDER_AVAILABLE' && toast.data?.erranderShare" class="mt-2 flex items-center gap-2">
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                  💰 Earn ₦{{ toast.data.erranderShare.toLocaleString() }}
                </span>
                <span class="text-[10px] text-gray-400">
                  {{ toast.data.itemCount || 0 }} item{{ (toast.data.itemCount || 0) !== 1 ? 's' : '' }}
                </span>
              </div>
            </div>
            
            <!-- Close button -->
            <button @click="dismissToast(toast.id)" class="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <!-- Action buttons for new orders -->
          <div v-if="toast.type === 'NEW_ORDER_AVAILABLE'" class="flex items-center gap-2 mt-3">
            <button
              @click="viewManifest(toast)"
              class="flex-1 py-2.5 text-xs font-semibold text-[#065fdb] bg-[#065fdb]/5 border border-[#065fdb]/10 rounded-xl hover:bg-[#065fdb]/10 transition-all"
            >
              View Details
            </button>
            <button
              @click="acceptOrder(toast)"
              :disabled="toast.accepting"
              class="flex-1 py-2.5 text-xs font-bold text-white bg-[#065fdb] rounded-xl hover:brightness-110 transition-all shadow-md shadow-[#065fdb]/20 disabled:opacity-50"
            >
              {{ toast.accepting ? 'Accepting...' : '✅ Accept Order' }}
            </button>
          </div>
          
          <!-- Action button for status updates -->
          <div v-else-if="toast.data?.orderId" class="mt-3">
            <NuxtLink
              :to="`/deliveries/${toast.data.orderId}`"
              @click="dismissToast(toast.id)"
              class="block w-full py-2 text-xs font-semibold text-center text-[#065fdb] bg-[#065fdb]/5 border border-[#065fdb]/10 rounded-xl hover:bg-[#065fdb]/10 transition-all"
            >
              View Order →
            </NuxtLink>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { showToast } = useCustomToast()

const emit = defineEmits<{
  (e: 'accept', data: any): void
  (e: 'view', data: any): void
  (e: 'dismiss', id: string): void
}>()

interface InAppToast {
  id: string
  title: string
  body: string
  type: string
  data?: any
  accepting?: boolean
  timer?: ReturnType<typeof setTimeout>
  createdAt?: string
}

const activeToasts = ref<InAppToast[]>([])
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>()

const getTypeEmoji = (type: string) => {
  switch (type) {
    case 'NEW_ORDER_AVAILABLE': return '🚀'
    case 'ORDER_ACCEPTED': return '✅'
    case 'ORDER_STATUS_UPDATE': return '📦'
    default: return '🔔'
  }
}

const addToast = (toast: InAppToast) => {
  // Prevent duplicates
  if (activeToasts.value.some(t => t.id === toast.id)) return
  
  // Limit to 5 visible toasts
  if (activeToasts.value.length >= 5) {
    const oldest = activeToasts.value[activeToasts.value.length - 1]
    dismissToast(oldest.id)
  }
  
  activeToasts.value.unshift(toast)
  
  // Auto-dismiss after 15 seconds for new orders, 8 seconds for others
  const duration = toast.type === 'NEW_ORDER_AVAILABLE' ? 15000 : 8000
  const timer = setTimeout(() => dismissToast(toast.id), duration)
  dismissTimers.set(toast.id, timer)
  
  // Play notification sound
  playNotificationSound()
}

const dismissToast = (id: string) => {
  activeToasts.value = activeToasts.value.filter(t => t.id !== id)
  const timer = dismissTimers.get(id)
  if (timer) {
    clearTimeout(timer)
    dismissTimers.delete(id)
  }
  emit('dismiss', id)
}

const pauseDismiss = (id: string) => {
  const timer = dismissTimers.get(id)
  if (timer) {
    clearTimeout(timer)
    dismissTimers.delete(id)
  }
}

const resumeDismiss = (id: string) => {
  const toast = activeToasts.value.find(t => t.id === id)
  if (!toast) return
  const duration = toast.type === 'NEW_ORDER_AVAILABLE' ? 15000 : 8000
  const timer = setTimeout(() => dismissToast(id), duration)
  dismissTimers.set(id, timer)
}

const viewManifest = (toast: InAppToast) => {
  emit('view', toast.data)
  navigateTo(`/deliveries/${toast.data?.orderId}`)
  dismissToast(toast.id)
}

const acceptOrder = async (toast: InAppToast) => {
  toast.accepting = true
  try {
    const res = await api.put(`/orders/${toast.data?.orderId}/accept`)
    if (res && (res as any).type !== 'ERROR') {
      showToast({
        title: '🎉 Order Accepted!',
        message: `You've accepted order #${toast.data?.orderNumber}. Head to the store for pickup!`,
        toastType: 'success',
        duration: 5000,
      })
      dismissToast(toast.id)
      emit('accept', toast.data)
      // Navigate to the order details
      navigateTo(`/deliveries/${toast.data?.orderId}`)
    } else {
      showToast({
        title: 'Could not accept',
        message: (res as any)?.data?.message || 'This order may have been accepted by another rider.',
        toastType: 'error',
        duration: 5000,
      })
    }
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e?.response?.data?.message || 'Failed to accept order. It may already be taken.',
      toastType: 'error',
      duration: 5000,
    })
  } finally {
    toast.accepting = false
  }
}

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  } catch (e) {
    // Silent fail — user hasn't interacted with page yet
  }
}

// Expose for parent component
defineExpose({ addToast, dismissToast, activeToasts })
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(100px) scale(0.95); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
.toast-enter-active {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  animation: slideOut 0.3s ease-in forwards;
}
@keyframes slideOut {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to { opacity: 0; transform: translateX(100px) scale(0.95); }
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
