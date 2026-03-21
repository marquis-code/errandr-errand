<template>
  <div class="max-w-3xl mx-auto space-y-6 pb-20" v-if="order">
    <!-- Order Header -->
    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/5 rounded-full blur-3xl" />
      
      <div class="flex items-center justify-between mb-8 relative z-10">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Delivery</p>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ order.orderNumber }}</h1>
        </div>
        <div :class="getStatusBg(order.status)" class="px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-current opacity-80 backdrop-blur-sm">
          {{ formatStatus(order.status) }}
        </div>
      </div>

      <div class="space-y-4 relative z-10">
        <div class="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           <span>Progress Tracking</span>
           <span>Step {{ currentStep + 1 }} of 4</span>
        </div>
        <div class="flex items-center gap-2">
          <div v-for="(step, i) in steps" :key="step" class="flex-1 h-2 rounded-full transition-all duration-700" :class="currentStep >= i ? 'bg-parentPrimary shadow-sm shadow-parentPrimary/20' : 'bg-gray-100'" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Pickup & Dropoff -->
      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner border border-white flex-shrink-0">📍</div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup point</p>
            <p class="text-base font-bold text-gray-900 tracking-tight mt-0.5 truncate">{{ order.vendor?.storeName }}</p>
            <p class="text-xs text-gray-500 font-medium">{{ order.vendor?.address || 'University Campus' }}</p>
          </div>
        </div>
        
        <div class="border-l-2 border-dashed border-gray-100 ml-5 h-8 w-px" />
        
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner border border-white flex-shrink-0">🏠</div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery point</p>
            <p class="text-base font-bold text-gray-900 tracking-tight mt-0.5 truncate">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
            <p class="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">{{ order.deliveryAddress }}</p>
          </div>
        </div>
      </div>

      <!-- Items Summary -->
      <div class="bg-gray-50 p-6 rounded-[2rem] border border-gray-200/50 shadow-inner relative overflow-hidden group">
        <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-white/50 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative">
           <span class="w-1.5 h-1.5 rounded-full bg-parentPrimary" /> Items to Pickup ({{ order.items?.length }})
        </h3>
        <div class="space-y-3 relative">
          <div v-for="item in order.items" :key="item._id" class="flex items-center justify-between text-sm font-medium">
             <span class="text-gray-700">{{ item.name }}</span>
             <span class="text-gray-900 font-bold px-2 py-0.5 bg-white rounded-lg border border-gray-100 text-xs shadow-sm">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact & Map -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Customer Card -->
       <div class="md:col-span-1 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group">
          <div class="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-bold shadow-xl mb-4 group-hover:-translate-y-1 transition-transform">
            {{ order.customer?.firstName?.[0] }}{{ order.customer?.lastName?.[0] }}
          </div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Recipient</p>
          <h4 class="font-bold text-gray-900 tracking-tight mb-4 truncate w-full">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</h4>
          
          <div class="flex gap-2 w-full">
             <a :href="`tel:${order.customer?.phone}`" class="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100">Call</a>
             <button @click="openChat = !openChat" class="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100">Chat</button>
          </div>
       </div>

       <!-- Map Placeholder -->
       <div class="md:col-span-2 bg-gray-100 rounded-[2rem] border border-gray-200/50 shadow-inner overflow-hidden relative group">
          <div class="absolute inset-0 bg-[url('/img/map-pattern.png')] opacity-10" />
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
             <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-lg mb-3 animate-bounce">📍</div>
             <p class="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Location tracking enabled</p>
             <p class="text-[10px] text-gray-300 font-medium mt-1">Live updates are being sent to recipient</p>
          </div>
          <div class="absolute bottom-4 right-4 group-hover:scale-110 transition-transform">
             <div class="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl">Live View</div>
          </div>
       </div>
    </div>

    <!-- Status Actions -->
    <div class="pt-6 border-t border-gray-100">
      <div v-if="order.status === 'confirmed' || order.status === 'ready_for_pickup'">
        <button @click="updateStatus('picked_up')" class="w-full py-5 bg-parentPrimary text-white rounded-[2rem] text-lg font-bold shadow-xl shadow-parentPrimary/20 hover:brightness-110 transition-all flex items-center justify-center gap-3">
          <span>📦</span> Confirm Item Pickup
        </button>
      </div>
      
      <div v-if="order.status === 'picked_up'" class="space-y-4">
        <button @click="updateStatus('in_transit')" class="w-full py-5 bg-blue-600 text-white rounded-[2rem] text-lg font-bold shadow-xl shadow-blue-600/20 hover:brightness-110 transition-all flex items-center justify-center gap-3">
          <span>🚀</span> Start Moving Now
        </button>
        <p class="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">Update this as soon as you depart pickup location</p>
      </div>

      <!-- Delivery Completion with Code -->
      <div v-if="order.status === 'in_transit'" class="bg-gray-900 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-60 h-60 bg-parentPrimary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        <div class="text-center space-y-2 relative z-10">
          <h3 class="text-white text-2xl font-bold tracking-tight">Enter Delivery Code</h3>
          <p class="text-gray-400 text-sm font-medium">Ask the recipient for their 6-digit confirmation code.</p>
        </div>
        
        <div class="flex gap-4 justify-center relative z-10">
          <input
            v-model="verificationCode"
            type="text"
            maxlength="6"
            placeholder="000000"
            class="bg-white/10 text-white text-3xl font-black text-center tracking-[0.4em] w-64 py-5 rounded-[2rem] border-2 border-white/20 focus:border-parentPrimary/50 focus:bg-white/20 transition-all focus:outline-none placeholder:text-white/10 shadow-inner"
          />
        </div>

        <button 
          @click="completeOrder" 
          :disabled="verificationCode.length !== 6 || completing"
          class="w-full py-5 bg-parentPrimary text-white rounded-[2rem] text-lg font-bold shadow-xl shadow-parentPrimary/20 hover:brightness-110 disabled:opacity-20 flex items-center justify-center gap-3 transition-all relative z-10"
        >
          <svg v-if="completing" class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span v-else>✅</span> {{ completing ? 'Verifying Code...' : 'Complete & Get Paid' }}
        </button>
      </div>

      <div v-if="order.status === 'delivered'" class="bg-emerald-50 rounded-[2.5rem] p-10 text-center space-y-4 border border-emerald-100 border-b-8 shadow-lg shadow-emerald-500/5">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm border border-emerald-100 shadow-emerald-500/10">💰</div>
        <div>
           <h3 class="text-emerald-900 font-bold text-2xl tracking-tight">Job Well Done!</h3>
           <p class="text-emerald-600 font-bold text-lg mt-1 tracking-tighter italic">+ ₦{{ order.deliveryFee?.toLocaleString() }} Earned</p>
        </div>
        <p class="text-emerald-500/70 text-xs font-medium max-w-xs mx-auto">Funds have been added to your Errandr wallet and are available for payout.</p>
        <button @click="navigateTo('/deliveries')" class="mt-4 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg hover:bg-emerald-700 transition-all uppercase tracking-widest">
           Back to History
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

definePageMeta({
  layout: 'errander'
})

const order = ref<any>(null);
const openChat = ref(false);
const verificationCode = ref('');
const completing = ref(false);

const steps = ['confirmed', 'picked_up', 'in_transit', 'delivered'];
const currentStep = computed(() => order.value ? steps.indexOf(order.value.status) : -1);
const formatStatus = (s: string) => s?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const { connect, emit, on } = useSocket('tracking');

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
