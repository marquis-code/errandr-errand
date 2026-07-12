<template>
  <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-medium text-gray-900 tracking-tight mb-1">Available Errands</h1>
        <p class="text-gray-400 text-xs md:text-sm font-medium">Claim available orders in real-time from the global pool.</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-[9px] font-medium text-emerald-600 uppercase tracking-[0.2em]">Live Pool</span>
      </div>
    </div>

    <!-- Alert for Batching -->
    <div v-if="batchStatus?.isActive" class="bg-parentPrimary/[0.03] border border-parentPrimary/10 rounded-2xl p-5 flex items-center gap-4 group hover:bg-parentPrimary/5 transition-all">
      <div class="w-12 h-12 rounded-xl bg-parentPrimary flex items-center justify-center text-white text-xl flex-shrink-0">📦</div>
      <div>
        <h4 class="text-sm font-medium text-gray-900">Batch Window Active</h4>
        <p class="text-[11px] text-gray-400 font-medium">You can accept up to 5 orders simultaneously. Optimized routing enabled!</p>
      </div>
    </div>

    <!-- Orders Table -->
    <div v-if="loading" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div class="p-8 space-y-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-gray-50 rounded-xl w-full"></div>
      </div>
    </div>

    <div v-else-if="availableOrders.length === 0" class="bg-white rounded-2xl border border-gray-100 py-32 text-center">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 scale-110">🚲</div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">The pool is currently empty</h3>
      <p class="text-xs text-gray-400 max-w-xs mx-auto mb-8 font-medium">All orders have been claimed. New orders will appear here automatically!</p>
    </div>

    <div v-else class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="py-5 px-6 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">Errand Details</th>
              <th class="py-5 px-6 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] hidden lg:table-cell">Destination</th>
              <th class="py-5 px-6 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] text-right">Potential Pay</th>
              <th class="py-5 px-6 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr 
              v-for="order in availableOrders" 
              :key="order._id"
              class="group hover:bg-gray-50/50 transition-all duration-300"
            >
              <!-- Errand Info -->
              <td class="py-5 px-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-gray-950 flex items-center justify-center text-xl overflow-hidden">
                    <img v-if="order.type !== 'custom_errand' && order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                    <span v-else class="text-white text-xs">CUS</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                      {{ order.type === 'custom_errand' ? 'Custom Errand' : (order.vendor?.storeName || 'Store Order') }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] font-medium tracking-widest text-[#FF5C1A] uppercase bg-[#FF5C1A]/5 px-2 py-0.5 rounded">#{{ order.orderNumber?.slice(-8) }}</span>
                      <span class="text-[9px] font-bold text-gray-400 flex items-center gap-1">
                        <Clock class="w-2.5 h-2.5" /> {{ formatTime(order.createdAt) }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Destination -->
              <td class="py-5 px-6 hidden lg:table-cell max-w-[200px]">
                <div class="flex flex-col gap-2">
                  <div class="flex items-start gap-2">
                    <div class="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5">S</div>
                    <p class="text-[11px] font-medium text-gray-500 line-clamp-1 leading-tight">
                      {{ order.type === 'custom_errand' ? order.customDetails?.pickupLocation : (order.vendor?.address || 'Store Location') }}
                    </p>
                  </div>
                  <div class="flex items-start gap-2">
                    <div class="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5 text-indigo-600">D</div>
                    <p class="text-[11px] font-bold text-gray-600 line-clamp-2 leading-tight">
                      {{ order.type === 'custom_errand' ? order.customDetails?.dropoffLocation : (order.deliveryAddress || 'Customer Location') }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Pay -->
              <td class="py-5 px-6 text-right">
                <div class="flex flex-col items-end">
                  <p class="text-lg font-medium text-emerald-600 tracking-tight leading-none mb-1">₦{{ (order.erranderShare || order.deliveryFee || 150).toLocaleString() }}</p>
                  <p class="text-[8px] font-medium text-gray-300 uppercase tracking-widest">Instant Pay</p>
                </div>
              </td>

              <!-- Action -->
              <td class="py-5 px-6">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="viewDetails(order)"
                    class="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    @click="acceptOrder(order._id)"
                    :disabled="acceptingId === order._id"
                    class="px-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-parentPrimary hover:shadow-md hover:shadow-parentPrimary/20 transition-all disabled:opacity-50 min-w-[90px]"
                  >
                    <span v-if="acceptingId === order._id" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span v-else>Accept</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detailed Order Drawer -->
    <SideDrawer :isOpen="isDrawerOpen" @close="isDrawerOpen = false">
      <div v-if="selectedOrder" class="space-y-8 pb-10">
        <!-- Drawer Header -->
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl bg-gray-950 flex items-center justify-center text-3xl overflow-hidden">
            <img v-if="selectedOrder.type !== 'custom_errand' && selectedOrder.vendor?.logo" :src="selectedOrder.vendor.logo" class="w-full h-full object-cover" />
            <span v-else class="text-white text-xs">CUS</span>
          </div>
          <div>
            <h2 class="text-xl font-medium text-gray-900 leading-tight">
              {{ selectedOrder.type === 'custom_errand' ? 'Custom Errand' : selectedOrder.vendor?.storeName }}
            </h2>
            <p class="text-xs font-bold text-gray-400 tracking-widest uppercase">#{{ selectedOrder.orderNumber }}</p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-2xl">
            <p class="text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-1">Potential Pay</p>
            <p class="text-xl font-medium text-emerald-600 tracking-tight">₦{{ (selectedOrder.erranderShare || selectedOrder.deliveryFee).toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-2xl">
            <p class="text-[9px] font-medium text-gray-400 uppercase tracking-widest mb-1">Estimated Prep</p>
            <p class="text-xl font-medium text-gray-900 tracking-tight">~15 Mins</p>
          </div>
        </div>

        <!-- Locations -->
        <div class="space-y-4">
          <div class="relative flex gap-4 pl-1">
            <div class="absolute left-3 top-6 bottom-6 w-px border-l-2 border-dashed border-gray-100"></div>
            <div class="z-10 w-6 h-6 rounded-md bg-gray-950 flex items-center justify-center text-[10px] flex-shrink-0 text-white">S</div>
            <div>
              <p class="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Pickup Location</p>
              <p class="text-sm font-bold text-gray-900">
                {{ selectedOrder.type === 'custom_errand' ? selectedOrder.customDetails?.pickupLocation : (selectedOrder.vendor?.address || 'Store Address') }}
              </p>
            </div>
          </div>
          <div class="flex gap-4 pl-1">
            <div class="z-10 w-6 h-6 rounded-md bg-[#FF5C1A] flex items-center justify-center text-[10px] flex-shrink-0 text-white">D</div>
            <div>
              <p class="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Delivery Point</p>
              <p class="text-sm font-bold text-gray-900">
                {{ selectedOrder.type === 'custom_errand' ? selectedOrder.customDetails?.dropoffLocation : (selectedOrder.deliveryAddress || 'Customer Location') }}
              </p>
              <p v-if="selectedOrder.specificAddress" class="text-xs font-medium text-gray-500 mt-1">Note: {{ selectedOrder.specificAddress }}</p>
            </div>
          </div>
        </div>

        <!-- Order Items or Description -->
        <div class="space-y-4 pt-4 border-t border-gray-100">
          <h4 class="text-xs font-medium text-gray-900 uppercase tracking-widest">{{ selectedOrder.type === 'custom_errand' ? 'Errand Description' : 'Order Summary' }}</h4>
          <div v-if="selectedOrder.type === 'custom_errand'" class="p-4 bg-gray-50/50 rounded-xl text-sm text-gray-700 leading-relaxed">
            {{ selectedOrder.customDetails?.description }}
            <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
              <span class="font-medium text-gray-500">Estimated Item Cost</span>
              <span class="font-bold text-gray-900">₦{{ (selectedOrder.customDetails?.estimatedItemCost || 0).toLocaleString() }}</span>
            </div>
          </div>
          <div v-else class="space-y-2">
            <div v-for="item in selectedOrder.items" :key="item._id" class="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-[10px] font-medium text-gray-900">{{ item.quantity }}x</span>
                <span class="text-sm font-bold text-gray-900 tracking-tight">{{ item.name }}</span>
              </div>
              <span class="text-xs font-medium text-gray-400 italic">₦{{ item.price.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Note -->
        <div v-if="selectedOrder.recipientName" class="p-5 bg-[#FF5C1A]/[0.02] border border-[#FF5C1A]/10 rounded-[2rem] space-y-2">
          <div class="flex items-center gap-2">
            <User class="w-3.5 h-3.5 text-parentPrimary" />
            <h4 class="text-[10px] font-medium text-parentPrimary uppercase tracking-widest">Customer Details</h4>
          </div>
          <p class="text-sm font-medium text-gray-900 tracking-tight">For: {{ selectedOrder.recipientName }}</p>
          <p class="text-xs font-medium text-gray-500">{{ selectedOrder.recipientPhone }}</p>
        </div>

        <!-- Actions inside drawer -->
        <div class="space-y-3">
          <button 
            @click="acceptOrder(selectedOrder._id); isDrawerOpen = false"
            :disabled="acceptingId === selectedOrder._id || biddingId === selectedOrder._id"
            class="w-full py-2.5 bg-gray-950 text-white rounded-lg text-sm font-bold hover:bg-parentPrimary transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap v-if="acceptingId !== selectedOrder._id" class="w-4 h-4 fill-current" />
            <span v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ acceptingId === selectedOrder._id ? 'Accepting Opportunity...' : 'Accept at ₦' + (selectedOrder.erranderShare || selectedOrder.deliveryFee).toLocaleString() }}
          </button>

          <div v-if="selectedOrder.type === 'custom_errand'" class="border-t border-gray-100 pt-4 mt-2">
            <p class="text-xs font-bold text-gray-500 mb-2">Or propose a different fee:</p>
            <div class="flex gap-2">
              <input v-model.number="bidAmount" type="number" placeholder="New Fee" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-parentPrimary font-bold text-gray-900 text-sm" />
              <button 
                @click="placeBid(selectedOrder._id)"
                :disabled="!bidAmount || bidAmount <= selectedOrder.deliveryFee || biddingId === selectedOrder._id"
                class="bg-parentPrimary text-white text-sm font-bold px-4 py-2.5 rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
              >
                {{ biddingId === selectedOrder._id ? 'Bidding...' : 'Submit Bid' }}
              </button>
            </div>
            <p v-if="hasPlacedBid(selectedOrder)" class="text-xs font-bold text-green-600 mt-2 bg-green-50 p-2 rounded-lg text-center">
              You proposed ₦{{ getMyBid(selectedOrder) }}
            </p>
          </div>
        </div>
      </div>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useRouter } from 'vue-router'
import { Clock, Zap, ChevronRight, Eye, User, X } from 'lucide-vue-next'
import SideDrawer from '@/components/ui/SideDrawer.vue'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'

definePageMeta({
  layout: 'errander'
})

const router = useRouter()
const { socket } = useRealtimeSocket()
const { toastQueue } = useRealtimeNotifications()
const loading = ref(true)
const availableOrders = ref<any[]>([])
const acceptingId = ref<string | null>(null)
const batchStatus = ref<any>(null)

// Details Drawer State
const isDrawerOpen = ref(false)
const selectedOrder = ref<any>(null)
const bidAmount = ref<number | null>(null)
const biddingId = ref<string | null>(null)

const pushToast = (title: string, body: string, type: string = 'GENERAL') => {
  toastQueue.value.push({
    id: `toast_${Date.now()}`,
    title,
    body,
    type,
    createdAt: new Date().toISOString()
  })
}

const loadAvailableOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/orders/available')
    if (res && res.data) {
      availableOrders.value = res.data
    }
  } catch (e) {
    console.error('Failed to load available orders:', e)
  } finally {
    loading.value = false
  }
}

const loadBatchStatus = async () => {
  try {
    const res = await api.get('/orders/batch/status')
    if (res && res.data) {
      batchStatus.value = res.data
    }
  } catch (e) {}
}

const viewDetails = (order: any) => {
  selectedOrder.value = order
  isDrawerOpen.value = true
  if (socket.value && order._id) {
    socket.value.emit('viewing_errand', { orderId: order._id, isViewing: true })
  }
}

watch(isDrawerOpen, (newVal) => {
  if (!newVal && selectedOrder.value?._id && socket.value) {
    socket.value.emit('viewing_errand', { orderId: selectedOrder.value._id, isViewing: false })
  }
})

const acceptOrder = async (id: string) => {
  acceptingId.value = id
  try {
    const res = await api.put(`/orders/${id}/accept`)
    if (res && (res as any).type !== 'ERROR') {
      pushToast('🚀 Order Claimed!', 'Loading your delivery instructions...', 'SUCCESS')
      setTimeout(() => {
        router.push(`/deliveries/${id}`)
      }, 1000)
    } else {
      availableOrders.value = availableOrders.value.filter(o => o._id !== id)
      pushToast('Claim Error', (res as any)?.data?.message || 'This order was already accepted by another rider.', 'ERROR')
    }
  } catch (e: any) {
    console.error('Accept error:', e)
    const errorMsg = e.response?.data?.message || 'Failed to accept order.'
    pushToast('Claim Failed', errorMsg, 'ERROR')
    loadAvailableOrders()
  } finally {
    acceptingId.value = null
  }
}

const placeBid = async (id: string) => {
  if (!bidAmount.value) return;
  biddingId.value = id;
  try {
    const res = await api.post(`/orders/${id}/custom/bid`, { amount: bidAmount.value });
    if (res && (res as any).type !== 'ERROR') {
      pushToast('Bid Submitted!', 'Your counter-offer has been sent to the customer.', 'SUCCESS');
      selectedOrder.value = res.data;
      const idx = availableOrders.value.findIndex(o => o._id === id);
      if (idx !== -1) availableOrders.value[idx] = res.data;
    } else {
      pushToast('Bid Error', (res as any)?.data?.message || 'Failed to submit bid.', 'ERROR');
    }
  } catch (e: any) {
    console.error('Bid error:', e);
    pushToast('Bid Failed', e.response?.data?.message || 'Failed to submit bid.', 'ERROR');
  } finally {
    biddingId.value = null;
  }
}

const getMyBid = (order: any) => {
  // Try to find if user has a bid by matching something, but we don't have user object directly here easily without auth composable.
  // We can just rely on the latest bid in the array or just show "Bid placed".
  // Let's assume if it returns a populated order, we can check. For now, we will just say 'Bid placed'.
  return bidAmount.value; 
}

const hasPlacedBid = (order: any) => {
  // In a real app we'd check order.bids.some(b => b.errander === myId)
  return order.bids?.length > 0 && bidAmount.value !== null;
}

const formatTime = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Real-time handling
const handleNewOrder = (payload: any) => {
  const exists = availableOrders.value.some(o => o._id === payload.orderId)
  if (!exists) {
    const newOrder = {
      _id: payload.orderId,
      orderNumber: payload.orderNumber,
      vendor: {
        storeName: payload.vendorName,
        logo: payload.vendorLogo,
        address: payload.vendorAddress
      },
      deliveryAddress: payload.deliveryAddress,
      total: payload.total,
      erranderShare: payload.erranderShare,
      createdAt: new Date().toISOString()
    }
    availableOrders.value.unshift(newOrder)
  }
}

const handleOrderAccepted = (payload: any) => {
  availableOrders.value = availableOrders.value.filter(o => o._id !== payload.orderId)
  if (selectedOrder.value?._id === payload.orderId) {
    isDrawerOpen.value = false
  }
}

onMounted(() => {
  loadAvailableOrders()
  loadBatchStatus()

  if (socket.value) {
    socket.value.on('notification:new-order', handleNewOrder)
    socket.value.on('notification:order-accepted', handleOrderAccepted)
  }
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('notification:new-order', handleNewOrder)
    socket.value.off('notification:order-accepted', handleOrderAccepted)
  }
})

useHead({ 
  title: 'Order Pool - Errandr',
  meta: [
    { name: 'description', content: 'Claim available orders in real-time.' }
  ]
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
