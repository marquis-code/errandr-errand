<template>
  <div class="max-w-4xl mx-auto space-y-10 pb-32 animate-fade-in mt-6" v-if="order">
    <!-- Delivery Header -->
    <div class="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm relative overflow-hidden group">
      <div class="absolute -right-16 -top-16 w-48 h-48 bg-[#065fdb]/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
        <div class="space-y-1">
          <p class="text-[9px] font-bold text-[#065fdb] tracking-wider leading-none mb-2">Delivery Details</p>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight leading-none">Order #{{ order.orderNumber }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <StatusBadge :status="order.status" class="scale-100" />
        </div>
      </div>

      <div class="space-y-4 relative z-10">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-bold text-gray-400 tracking-wider">Delivery Progress</span>
          <span class="text-[9px] font-bold text-[#065fdb] tracking-wider">Step {{ currentStep + 1 }} / 4</span>
        </div>
        <div class="flex items-center gap-2">
          <div v-for="(step, i) in steps" :key="step" class="flex-1 h-2 rounded-full transition-all duration-1000 relative overflow-hidden border border-gray-50" :class="currentStep >= i ? 'bg-[#065fdb]' : 'bg-gray-100'">
            <div v-if="currentStep === i" class="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <!-- Delivery Info & Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Delivery Points -->
        <div class="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm space-y-8 relative group">
          <div class="flex items-start gap-6 relative">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shadow-inner border border-amber-100/20 flex-shrink-0 group-hover:scale-105 transition-transform">🏪</div>
            <div class="min-w-0 pt-0.5">
              <p class="text-[8px] font-bold text-amber-600 tracking-wider mb-1.5 leading-none">Pickup Location</p>
              <p class="text-lg font-black text-gray-900 tracking-tight leading-none mb-1.5 truncate">{{ order.vendor?.storeName }}</p>
              <p class="text-[10px] font-bold text-gray-400 leading-relaxed">{{ order.vendor?.address || 'Vendor Address' }}</p>
            </div>
          </div>
          
          <div class="absolute left-[1.75rem] top-20 bottom-24 w-px border-l-2 border-dashed border-gray-100" />
          
          <div class="flex items-start gap-6 relative">
            <div class="w-10 h-10 rounded-xl bg-[#065fdb]/10 text-[#065fdb] flex items-center justify-center text-xl shadow-inner border border-[#065fdb]/20 flex-shrink-0 group-hover:scale-105 transition-transform">📍</div>
            <div class="min-w-0 pt-0.5">
              <p class="text-[8px] font-bold text-[#065fdb] tracking-wider mb-1.5 leading-none">Drop-off Point</p>
              <p class="text-lg font-black text-gray-900 tracking-tight leading-none mb-1.5 truncate">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
              <p class="text-[10px] font-bold text-gray-400 leading-relaxed line-clamp-2">{{ order.deliveryAddress }}</p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group">
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <h3 class="text-[9px] font-bold text-gray-500 tracking-wider mb-6 flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-[#065fdb]" /> Order Content ({{ order.items?.length }} items)
          </h3>
          <div class="space-y-3">
            <div v-for="item in order.items" :key="item._id" class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <span class="text-xs font-bold text-gray-200 tracking-tight">{{ item.name }}</span>
              <span class="text-[9px] font-bold text-white px-2.5 py-1 bg-[#065fdb] rounded-md shadow-md">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Location (Interactive) -->
        <div class="bg-gray-50 rounded-2xl border border-gray-100 shadow-inner overflow-hidden relative group aspect-[2/1]">
          <div class="absolute inset-0 bg-[url('/img/map-pattern.png')] opacity-10 bg-repeat bg-center" />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent opacity-80" />
          
          <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div class="relative mb-4">
              <div class="absolute inset-0 bg-[#065fdb] rounded-full animate-ping opacity-20" />
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg relative z-10 border border-gray-50">📍</div>
            </div>
            <p class="text-[8px] font-bold text-gray-400 tracking-wider mb-1">Live Location Tracking</p>
            <p class="text-[8px] text-gray-300 font-medium tracking-wide max-w-[150px]">Coordinate tracking is active and shared with the customer.</p>
          </div>
        </div>
      </div>

      <!-- Sidebar: Actions & Customer -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Customer Details -->
        <div class="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all">
          <div class="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl mb-4 group-hover:-translate-y-1 transition-transform border-4 border-white">
            {{ order.customer?.firstName?.[0] }}{{ order.customer?.lastName?.[0] }}
          </div>
          <p class="text-[8px] font-bold text-[#065fdb] tracking-wider mb-2 leading-none bg-[#065fdb]/5 px-2.5 py-1 rounded-full">Primary Contact</p>
          <h4 class="text-xl font-black text-gray-900 tracking-tight mb-6 truncate w-full leading-none">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</h4>
          
          <div class="flex flex-col gap-2 w-full">
            <a :href="`tel:${order.customer?.phone}`" class="w-full py-3.5 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-bold tracking-wider hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95 border border-emerald-100 flex items-center justify-center gap-2.5">
              <Phone class="w-4 h-4" /> Call Customer
            </a>
            <button @click="openChat(order.customer?._id, order.customer?.firstName + ' ' + order.customer?.lastName, order.customer?.avatar)" class="w-full py-3.5 bg-[#065fdb]/5 text-[#065fdb] rounded-xl text-[9px] font-bold tracking-wider hover:bg-[#065fdb] hover:text-white transition-all transform active:scale-95 border border-[#065fdb]/10 flex items-center justify-center gap-2.5">
              <MessageSquare class="w-4 h-4" /> Message Customer
            </button>
          </div>
        </div>

        <!-- Status Update Actions -->
        <div v-if="order.status === 'confirmed' || order.status === 'ready_for_pickup' || order.status === 'picked_up'" class="space-y-4">
          <div v-if="order.status === 'confirmed' || order.status === 'ready_for_pickup'" class="animate-bounce-subtle">
            <button @click="updateStatus('picked_up')" class="w-full py-5 bg-[#065fdb] text-white rounded-xl text-[11px] font-black tracking-widest shadow-xl hover:brightness-110 transform active:scale-95 transition-all flex items-center justify-center gap-3 group">
              <span class="text-xl group-hover:rotate-12 transition-transform">📦</span> Confirm Pickup
            </button>
          </div>
          
          <div v-if="order.status === 'picked_up'" class="space-y-4">
            <button @click="updateStatus('in_transit')" class="w-full py-5 bg-indigo-600 text-white rounded-xl text-[11px] font-black tracking-widest shadow-xl hover:brightness-110 transform active:scale-95 transition-all flex items-center justify-center gap-3 group">
              <span class="text-xl group-hover:scale-125 transition-transform">🚀</span> Start Delivery
            </button>
            <p class="text-[8px] text-gray-400 text-center font-bold tracking-wider">Update status once you depart.</p>
          </div>
        </div>

        <!-- Verification Interface -->
        <div v-if="order.status === 'in_transit' || order.status === 'picked_up'" class="bg-gray-900 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden group border border-white/5">
          <div class="absolute -right-32 -top-32 w-64 h-64 bg-[#065fdb]/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
           
          <div class="text-center space-y-2 relative z-10">
            <h3 class="text-white text-lg font-black tracking-tight leading-none">Verification Code</h3>
            <p class="text-gray-500 text-[8px] font-bold tracking-wider">Request the 6-digit code from user</p>
          </div>
           
          <div class="flex justify-center relative z-10">
            <input
              v-model="verificationCode"
              type="text"
              maxlength="6"
              placeholder="000000"
              class="bg-white/5 text-white text-2xl font-black text-center tracking-widest w-full py-4 rounded-xl border-2 border-white/10 focus:border-[#065fdb]/50 focus:bg-white/10 transition-all focus:outline-none placeholder:text-white/5 shadow-inner"
            />
          </div>
          
          <button 
            @click="completeOrder" 
            :disabled="verificationCode.length !== 6 || completing"
            class="w-full py-4 bg-white text-gray-900 rounded-xl text-[10px] font-black tracking-widest shadow-xl hover:bg-[#065fdb] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transition-all relative z-10 group"
          >
            <div v-if="completing" class="w-4 h-4 border-2 border-gray-900/10 border-t-gray-900 rounded-full animate-spin group-hover:border-white/10 group-hover:border-t-white" />
            <span v-else class="text-base">✅</span> {{ completing ? 'Verifying...' : 'Finalize Delivery' }}
          </button>
        </div>

        <!-- Delivery Completed State -->
        <div v-if="order.status === 'delivered'" class="bg-emerald-500 rounded-2xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden group border border-white/10">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-90" />
          <div class="absolute -right-16 -bottom-16 w-38 h-38 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
           
          <div class="relative z-10 space-y-6">
            <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto text-3xl shadow-lg border-2 border-emerald-50 text-emerald-600 transform rotate-6 animate-pulse">💰</div>
            <div>
              <h3 class="text-white font-black text-2xl tracking-tight leading-none mb-3">Delivery Completed</h3>
              <p class="text-white/90 font-black text-xl tracking-tight leading-none">+ ₦{{ order.deliveryFee?.toLocaleString() }} Earned</p>
            </div>
             
            <div class="max-w-xs mx-auto">
              <p class="text-emerald-100 text-[9px] font-bold tracking-wider leading-relaxed mb-8">Funds have been added to your wallet.</p>
               
              <NuxtLink to="/deliveries" class="block w-full py-4 bg-white text-emerald-600 rounded-xl font-black text-[10px] tracking-widest shadow-lg hover:bg-emerald-50 active:scale-95 transition-all">
                Return to Deliveries
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Chat Component -->
    <OrderChat
      v-if="order"
      :is-open="isChatOpen"
      :order-id="order._id"
      :current-user-id="user?._id || ''"
      :receiver-id="chatReceiverId"
      :receiver-name="chatReceiverName"
      :receiver-avatar="chatReceiverAvatar"
      @close="isChatOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import OrderChat from '@/components/core/OrderChat.vue';
import { useUser } from '@/composables/modules/auth/user';
import { Phone, MessageSquare } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';

const { user } = useUser();

definePageMeta({
  layout: 'errander'
})

const order = ref<any>(null);
const verificationCode = ref('');
const completing = ref(false);

const steps = ['confirmed', 'picked_up', 'in_transit', 'delivered'];
const currentStep = computed(() => order.value ? steps.indexOf(order.value.status) : -1);
const formatStatus = (s: string) => s?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const { connect, emit, on } = useSocket('tracking');

const isChatOpen = ref(false);
const chatReceiverId = ref('');
const chatReceiverName = ref('');
const chatReceiverAvatar = ref('');

const openChat = (receiverId: string | undefined, name: string, avatar?: string) => {
  if (!receiverId) return;
  chatReceiverId.value = receiverId;
  chatReceiverName.value = name;
  chatReceiverAvatar.value = avatar || '';
  isChatOpen.value = true;
};

const updateStatus = async (status: string) => {
  try {
    const res = await api.put<any>(`/orders/${route.params.id}/status`, { status });
    order.value = res.data;
    emit('orderStatusUpdate', { orderId: route.params.id, status });
  } catch (e: any) { alert(e.data?.message || 'Update failed'); }
};

const completeOrder = async () => {
  if (verificationCode.value.length !== 6) return;
  completing.value = true;
  try {
    const res = await api.post<any>(`/orders/${route.params.id}/complete`, { 
      verificationCode: verificationCode.value.toUpperCase() 
    });
    order.value = res.data;
    emit('orderStatusUpdate', { orderId: route.params.id, status: 'delivered' });
  } catch (e: any) { 
    alert(e.data?.message || 'Invalid code. Verify and try again.'); 
  } finally {
    completing.value = false;
  }
};

const getStatusBg = (s: string) => {
  if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600';
  if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600';
  if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600';
  return 'bg-gray-50 text-gray-400';
}

const startLocationTracking = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        emit('updateLocation', {
          erranderId: (order.value as any)?.errander?.toString(),
          orderId: route.params.id,
          coordinates: coords,
        });
        api.put('/errandr/location', { coordinates: coords }).catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }
};

onMounted(async () => {
  try {
    const res = await api.get<any>(`/orders/${route.params.id}`);
    order.value = res.data;
  } catch (e) { console.error(e); }

  connect();
  emit('trackOrder', { orderId: route.params.id });
  startLocationTracking();
});

useHead({ title: computed(() => `Delivery #${order.value?.orderNumber || ''} - Errandr`) });
</script>
