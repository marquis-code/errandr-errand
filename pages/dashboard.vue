<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {{ user?.firstName || 'Errander' }}!</h1>
        <p class="text-gray-500 mt-1">Ready to complete some errands today?</p>
      </div>
      <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
          Available for Errands
        </div>
        <div class="w-10 h-10 rounded-full bg-parentPrimary/10 flex items-center justify-center text-parentPrimary font-bold">
          {{ user?.firstName?.charAt(0) || 'E' }}
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-parentPrimary/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
        
        <div class="flex items-center justify-between mb-4 relative">
          <div :class="stat.bgClass" class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white">
            {{ stat.emoji }}
          </div>
          <span v-if="stat.trend" :class="stat.trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'" class="text-[10px] font-bold px-2 py-1 rounded-lg border border-transparent">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
        </div>
        
        <div class="relative">
          <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <h3 class="text-2xl font-bold text-gray-900 tracking-tight">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Active/Recent Errands -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden border-b-4 border-b-parentPrimary">
          <div class="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 tracking-tight">Active Errand</h3>
            <span class="text-[10px] font-bold text-parentPrimary bg-parentPrimary/5 px-2 py-1 rounded-lg uppercase tracking-wider">In Progress</span>
          </div>
          <div v-if="activeErrand" class="p-8 flex flex-col md:flex-row gap-6 items-start">
             <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner border border-gray-100">
                📦
             </div>
             <div class="flex-1 space-y-4">
                <div>
                   <h4 class="font-bold text-xl text-gray-900 tracking-tight">{{ activeErrand.title }}</h4>
                   <p class="text-sm text-gray-500 font-medium">Order #{{ activeErrand.id }} • {{ activeErrand.distance }}km away</p>
                </div>
                <div class="flex flex-wrap gap-4">
                   <div class="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                      <span>📍</span> {{ activeErrand.pickup }}
                   </div>
                   <div class="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                      <span>🏁</span> {{ activeErrand.dropoff }}
                   </div>
                </div>
             </div>
             <button class="w-full md:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all">
                Continue Task
             </button>
          </div>
          <div v-else class="p-12 text-center">
             <div class="text-4xl mb-4 opacity-30">🚲</div>
             <p class="text-gray-500 font-bold mb-6">No active errand right now.</p>
             <NuxtLink to="/deliveries" class="inline-block px-8 py-3 bg-parentPrimary text-white rounded-2xl font-bold text-sm shadow-lg shadow-parentPrimary/20 hover:brightness-110 transition-all">
                Browse Marketplace
             </NuxtLink>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 tracking-tight">Recent Deliveries</h3>
            <NuxtLink to="/deliveries" class="text-xs font-bold text-parentPrimary hover:underline">View History</NuxtLink>
          </div>
          <div class="p-2">
            <div v-for="errand in recentErrands" :key="errand.id" class="p-4 hover:bg-gray-50 rounded-2xl transition-colors flex items-center gap-4">
               <div :class="errand.statusBg" class="w-10 h-10 rounded-full flex items-center justify-center text-xs shadow-sm">
                  {{ errand.emoji }}
               </div>
               <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-sm text-gray-900 truncate">{{ errand.title }}</h4>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{{ errand.date }} • {{ errand.id }}</p>
               </div>
               <div class="text-right">
                  <p class="font-bold text-sm text-gray-900">₦{{ errand.earnings }}</p>
                  <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">+ ₦{{ errand.tip }} Tip</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Sidebar -->
      <div class="space-y-6">
        <div class="bg-parentPrimary rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          <h3 class="text-lg font-bold mb-2 relative z-10">Earnings Goal</h3>
          <p class="text-white/70 text-sm mb-6 relative z-10 font-medium">You've earned ₦24,500 of your ₦50,000 weekly goal.</p>
          <div class="h-3 bg-white/20 rounded-full mb-6 relative z-10 overflow-hidden shadow-inner">
             <div class="h-full bg-white rounded-full transition-all duration-1000 shadow-sm" style="width: 49%" />
          </div>
          <NuxtLink to="/earnings" class="block w-full py-3 bg-white text-parentPrimary rounded-2xl font-bold text-sm text-center shadow-lg hover:bg-gray-50 transition-all relative z-10">
            Analytics & Wallet
          </NuxtLink>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
           <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-amber-50 rounded-full blur-2xl" />
           <h3 class="font-bold text-gray-900 mb-4 relative">Errander Rating</h3>
           <div class="flex items-center gap-1 mb-2 relative">
              <span v-for="i in 5" :key="i" class="text-amber-400 text-lg">★</span>
           </div>
           <p class="text-2xl font-bold text-gray-900 relative">4.92 <span class="text-xs text-gray-400 font-medium ml-1">/ 5.0</span></p>
           <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 relative">Based on 124 Errandrs</p>
        </div>

        <div class="bg-gray-900 rounded-3xl p-6 text-white shadow-xl">
           <h3 class="font-bold mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Support
           </h3>
           <p class="text-xs text-gray-400 mb-6 leading-relaxed">Having trouble with a delivery? Our priority support for erranders is available 24/7.</p>
           <button class="w-full py-3 bg-gray-800 border border-gray-700 rounded-2xl text-xs font-bold hover:bg-gray-700 transition-all">
              Chat with Agent
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/modules/auth/user'
const { user } = useUser()

definePageMeta({
  layout: 'errander'
})

useHead({
  title: 'Dashboard - Errandr',
  meta: [
    { name: 'description', content: 'Manage your errands, track earnings, and complete deliveries with Errandr.' }
  ]
})

const stats = [
  { label: 'Completed', value: '1,402', emoji: '🏁', bgClass: 'bg-emerald-100 text-emerald-600', trend: 12 },
  { label: 'Total Earned', value: '₦405,200', emoji: '💰', bgClass: 'bg-amber-100 text-amber-600', trend: 8 },
  { label: 'Avg. Rating', value: '4.92', emoji: '⭐', bgClass: 'bg-purple-100 text-purple-600' },
  { label: 'Current Rank', value: 'Gold', emoji: '🏆', bgClass: 'bg-blue-100 text-blue-600' },
]

const activeErrand = ref({
   id: 'ER-9042',
   title: 'Grocery Run for Jide',
   pickup: 'Shoprite, Ikeja Mall',
   dropoff: 'Maryland Estate, G-Lane',
   distance: '3.2'
})

const recentErrands = [
   { id: 'ER-8930', title: 'Pharmacy Pick-up', date: '2 hours ago', earnings: '1,200', tip: '200', emoji: '💊', statusBg: 'bg-blue-50 text-blue-600' },
   { id: 'ER-8928', title: 'Food Delivery: Chowdeck', date: '5 hours ago', earnings: '1,500', tip: '500', emoji: '🍔', statusBg: 'bg-amber-50 text-amber-600' },
   { id: 'ER-8925', title: 'Laundry Drop-off', date: 'Yesterday', earnings: '1,000', tip: '0', emoji: '🧺', statusBg: 'bg-purple-50 text-purple-600' },
   { id: 'ER-8912', title: 'Document Courier', date: 'Yesterday', earnings: '2,400', tip: '1,000', emoji: '📄', statusBg: 'bg-emerald-50 text-emerald-600' },
]
</script>