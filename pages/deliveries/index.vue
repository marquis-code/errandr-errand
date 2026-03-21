<template>
  <div class="space-y-4 animate-fade-in max-w-7xl mx-auto pb-10">
    <!-- Header with Search Bar -->
    <div class="flex items-center justify-between gap-4 mb-4 mt-2">
      <div class="flex-1 relative max-w-2xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search deliveries by tracker ID or store name" 
          class="w-full pl-11 pr-14 py-2.5 bg-gray-50/70 hover:bg-gray-100 transition-colors border-none rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-parentPrimary/20"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">⌘</kbd>
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">K</kbd>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-500 hidden md:block">Total Errands: <strong class="text-gray-900">{{ orders.length }}</strong></span>
      </div>
    </div>

    <!-- Title & Filters -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight font-display mb-1">My Deliveries</h1>
          <p class="text-gray-500 text-sm font-medium">Manage your active tasks and review completed errands.</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors border border-gray-200">
          <ListFilter class="w-4 h-4" />
          Filters
        </button>
        <span class="text-sm font-medium text-gray-400">Status filter applied</span>
        
        <div class="ml-auto flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button
             v-for="status in filters" 
             :key="status.key" 
             @click="activeFilter = status.key"
             class="px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap"
             :class="activeFilter === status.key ? 'bg-parentPrimary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 bg-gray-50 border border-transparent'"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table Content -->
    <div v-if="loading" class="p-10 text-center">
       <div class="space-y-4">
         <div v-for="i in 8" :key="i" class="h-12 bg-gray-100 rounded-2xl animate-pulse"></div>
       </div>
    </div>

    <div v-else-if="filteredOrders.length === 0">
       <EmptyState 
         :title="activeFilter === 'all' ? 'No deliveries found' : `No ${activeFilter} deliveries`" 
         :description="activeFilter === 'all' ? 'Accept available orders from the marketplace to get started!' : 'Check back later for updates.'"
         :actionLabel="activeFilter === 'all' ? 'Go to Marketplace' : undefined"
         @action="$router.push('/')"
       >
         <template #icon>
           📦
         </template>
       </EmptyState>
    </div>

    <div v-else class="bg-white">
      <div class="overflow-x-auto pb-20">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Errand ID</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Store</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Dropoff</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Earn / Value</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Status</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50/50">
            <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-gray-50/80 transition-colors group cursor-pointer" @click="selectedOrder = order">
              <td class="py-4 px-2 min-w-[150px]">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] shadow-sm flex-shrink-0 border border-white">
                    {{ statusEmoji(order.status) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-[13px] tracking-tight truncate max-w-[100px]">#{{ order.orderNumber }}</h3>
                    <p class="text-[10px] text-gray-500 font-medium">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-2 min-w-[150px]">
                <p class="text-[13px] font-medium text-gray-900 leading-tight truncate max-w-[150px]">
                  {{ order.vendor?.storeName || 'Unknown Store' }}
                </p>
              </td>
              <td class="py-4 px-2 min-w-[180px]">
                <p class="text-[12px] font-medium text-gray-700 truncate max-w-[180px]" :title="order.deliveryAddress">{{ order.deliveryAddress }}</p>
              </td>
              <td class="py-4 px-2 text-right">
                 <!-- Wait, the original code had order.total for the whole order, not for Errand earning specifically in this view, 
                      unless Errand earning is order.deliveryFee ? Just kept order.total for now matching original -->
                <p class="text-[13px] font-bold text-gray-900 tracking-tighter">₦{{ order.total?.toLocaleString() }}</p>
              </td>
              <td class="py-4 px-2 text-right w-24">
                <span :class="getStatusBg(order.status)" class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border inline-block text-center w-full">
                  {{ order.status?.replace(/_/g, ' ') }}
                </span>
              </td>
              <td class="py-4 px-2 text-right w-10">
                <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SideDrawer for Delivery Details -->
    <SideDrawer :isOpen="!!selectedOrder" @close="selectedOrder = null">
      <template v-if="selectedOrder">
        <div class="flex flex-col items-center justify-center py-6 border-b border-gray-100">
           <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl shadow-sm mb-3 border border-white">
             {{ statusEmoji(selectedOrder.status) }}
           </div>
           <h3 class="text-xl font-bold text-gray-900 tracking-tight">Delivery #{{ selectedOrder.orderNumber }}</h3>
           
           <span :class="getStatusBg(selectedOrder.status)" class="mt-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm">
             {{ selectedOrder.status?.replace(/_/g, ' ') }}
           </span>
        </div>

        <div class="py-6 space-y-6">
          <div class="bg-gray-50/80 rounded-2xl p-6 space-y-4 shadow-inner border border-gray-100/50">
             <div class="flex justify-between items-center mb-2">
               <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Routing Info</p>
               <span class="text-[10px] font-bold text-gray-500">{{ new Date(selectedOrder.createdAt).toLocaleDateString() }}</span>
             </div>
             
             <div class="space-y-4 relative">
               <div class="absolute left-3 top-4 bottom-4 w-px bg-gray-200"></div>
               
               <div class="flex items-start gap-4 relative z-10">
                 <div class="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] shadow-sm">🏪</div>
                 <div>
                    <p class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">Pickup</p>
                    <p class="text-sm font-bold text-gray-900">{{ selectedOrder.vendor?.storeName || 'Store' }}</p>
                 </div>
               </div>
               
               <div class="flex items-start gap-4 relative z-10">
                 <div class="w-6 h-6 rounded-full bg-parentPrimary/10 border border-parentPrimary/20 flex items-center justify-center text-parentPrimary text-[10px] shadow-sm">📍</div>
                 <div>
                    <p class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">Dropoff</p>
                    <p class="text-sm font-bold text-gray-900">{{ selectedOrder.deliveryAddress }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ selectedOrder.customer?.firstName }} {{ selectedOrder.customer?.lastName }}</p>
                 </div>
               </div>
             </div>
             
             <div class="pt-4 mt-4 border-t border-gray-200/50 flex justify-between items-center">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Order Amount Breakdown</span>
                <span class="text-xl font-black text-gray-900 tracking-tight">₦{{ selectedOrder.total?.toLocaleString() }}</span>
             </div>
          </div>

          <div class="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Actionable Steps</h4>
            
            <NuxtLink 
               :to="`/deliveries/${selectedOrder._id}`" 
               class="w-full px-5 py-4 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              Open Live Tracker <span class="group-hover:translate-x-1 inline-block transition-transform">→</span>
            </NuxtLink>
            
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { Search, ListFilter, ChevronRight } from 'lucide-vue-next';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'errander'
})

const loading = ref(true);
const orders = ref<any[]>([]);
const activeFilter = ref('all');
const searchQuery = ref('');
const selectedOrder = ref<any>(null);

const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Done' },
];

const filteredOrders = computed(() => {
  let list = orders.value;
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'active') {
      list = list.filter(o => !['delivered', 'cancelled'].includes(o.status));
    } else {
      list = list.filter(o => o.status === activeFilter.value);
    }
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(o => 
      o.orderNumber?.toLowerCase().includes(q) ||
      o.vendor?.storeName?.toLowerCase().includes(q) ||
      o.deliveryAddress?.toLowerCase().includes(q)
    );
  }
  return list;
});

const statusEmoji = (s: string) => ({
  pending: '⏳',
  confirmed: '✅',
  preparing: '👨‍🍳',
  ready_for_pickup: '📦',
  picked_up: '🏃',
  in_transit: '🚀',
  delivered: '🎉',
  cancelled: '❌'
}[s] || '📋');

const getStatusBg = (s: string) => {
  if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600';
  if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600';
  if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600';
  return 'bg-gray-50 text-gray-400';
}

onMounted(async () => {
  try { 
    const res = await api.get<any[]>('/orders/errander');
    orders.value = res.data;
  }
  catch (e) { console.error(e); }
  finally { loading.value = false; }
});

useHead({ title: 'Deliveries - Errandr' });
</script>
