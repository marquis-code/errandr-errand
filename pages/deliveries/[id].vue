<template>
 <div class="max-w-4xl w-full mx-auto space-y-4 md:space-y-6 md:space-y-10 pb-32 animate-fade-in mt-6" v-if="order">
 <!-- Stunning Header -->
 <div class="relative p-4 md:p-5 rounded-xl md:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-950 via-gray-900 to-black group">
 <!-- Animated Background Effects -->
 <div class="absolute -right-20 -top-20 w-64 h-64 bg-[#FF5C1A]/30 rounded-full blur-[80px] group-hover:scale-150 group-hover:opacity-70 transition-all duration-1000 ease-in-out" />
 <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:scale-150 transition-all duration-1000 ease-in-out" />
 
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 mb-10 relative z-10">
 <div class="space-y-2">
 <div class="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 ">
 <span class="w-2 h-2 rounded-full bg-[#FF5C1A] animate-pulse"></span>
 <p class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Live Delivery Tracking</p>
 </div>
 <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">Order #{{ order.orderNumber }}</h1>
 </div>
 <div class="flex items-center gap-3 bg-white/5 p-2 rounded-2xl backdrop-blur-md border border-white/5 ">
 <StatusBadge :status="order.status" class="scale-110 " />
 </div>
 </div>

 <div class="space-y-4 relative z-10 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm ">
 <div class="flex items-center justify-between">
 <span class="text-xs font-bold text-gray-400 tracking-wide uppercase">Delivery Progress</span>
 <span class="text-xs font-black text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-full border border-[#FF5C1A]/20">Step {{ currentStep + 1 }} of 4</span>
 </div>
 <div class="flex items-center gap-3">
 <div v-for="(step, i) in steps" :key="step" class="flex-1 h-2.5 rounded-full transition-all duration-1000 relative overflow-hidden " :class="currentStep >= i ? 'bg-gradient-to-r from-[#FF5C1A] to-orange-500 shadow-[0_0_10px_rgba(255,92,26,0.5)]' : 'bg-gray-800'">
 <div v-if="currentStep === i" class="absolute inset-0 bg-white/30 animate-pulse" />
 </div>
 </div>
 </div>
 </div>

 <div class="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-10">
 <!-- Delivery Info & Content -->
 <div class="lg:col-span-3 space-y-4 md:space-y-6">
 <!-- Delivery Points -->
 <div class="bg-white p-4 md:p-4 rounded-2xl border border-gray-100 space-y-5 md:space-y-8 relative group">
 <div class="flex items-start gap-3 md:gap-6 relative">
 <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-sm border border-amber-100/20 flex-shrink-0 group-hover:scale-105 transition-transform">🏪</div>
 <div class="min-w-0 pt-0.5 w-full">
 <p class="text-[10px] font-bold text-amber-600 tracking-wider mb-1 uppercase">Pickup Location</p>
 <p class="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">
 {{ order.type === 'custom_errand' ? (order.customDetails?.pickupLocation || 'Custom Pickup') : order.vendor?.storeName }}
 </p>
 <p class="text-xs font-medium text-gray-500 mb-2">{{ order.type === 'custom_errand' ? 'Special Request Pickup' : (order.vendor?.address || 'Vendor Address') }}</p>
 
 <button 
 v-if="order.type !== 'custom_errand' && order.vendor"
 @click="openChat(String(order.vendor?.owner || order.vendor?._id || ''), order.vendor?.storeName + ' (Store)', order.vendor?.logo || order.vendor?.storeLogo)" 
 class="w-full sm:w-auto px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold hover:bg-amber-100 transition-all transform active:scale-95 border border-amber-100 flex items-center justify-center gap-1.5"
 >
 <MessageSquare class="w-3 h-3" /> Message Store
 </button>
 </div>
 </div>
 
 <div class="absolute left-[1.75rem] top-20 bottom-24 w-px border-l-2 border-dashed border-gray-100" />
 
 <div class="flex items-start gap-3 md:gap-6 relative">
 <div class="w-8 h-8 rounded-lg bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center text-sm border border-[#FF5C1A]/20 flex-shrink-0 group-hover:scale-105 transition-transform">📍</div>
 <div class="min-w-0 pt-0.5">
 <p class="text-[10px] font-bold text-[#FF5C1A] tracking-wider mb-1 uppercase">Drop-off Point</p>
 <p class="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
 <p class="text-xs font-medium text-gray-500 line-clamp-2">{{ order.deliveryAddress }} {{ order.type === 'custom_errand' ? `(${order.customDetails?.dropoffLocation})` : '' }}</p>
 </div>
 </div>
 </div>

 <!-- Order Items / Custom Description -->
 <div class="bg-gray-900 p-4 md:p-4 rounded-2xl border border-gray-800 relative overflow-hidden group">
 <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
 <h3 class="text-sm font-bold text-gray-500 -wider mb-6 flex items-center gap-3 uppercase">
 <div class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A]" /> 
 {{ order.type === 'custom_errand' ? 'Request Details' : `Order Content (${order.items?.length} items)` }}
 </h3>
 
 <div v-if="order.type === 'custom_errand'" class="space-y-4">
 <div class="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-200 -relaxed font-bold">
 {{ order.customDetails?.description }}
 </div>
 <div class="flex items-center justify-between p-4 bg-parentPrimary/10 rounded-xl border border-parentPrimary/20">
 <span class="text-sm font-medium text-parentPrimary uppercase -widest">Est. Item Cost</span>
 <span class="text-sm font-medium text-white">₦{{ order.customDetails?.estimatedItemCost?.toLocaleString() || 0 }}</span>
 </div>
 </div>

 <div v-else class="space-y-3">
 <div v-for="item in order.items" :key="item._id" class="flex flex-col p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
 <div class="flex items-start justify-between">
 <div>
 <span class="text-sm font-bold text-gray-200 tracking-tight">{{ item.name }}</span>
 <p v-if="item.customizations?.length" class="text-[10px] font-medium text-gray-400 mt-1">Base: ₦{{ item.price?.toLocaleString() || 0 }}</p>
 </div>
 <div class="flex flex-col items-end gap-1">
 <span class="text-sm font-bold text-white px-2.5 py-1 bg-[#FF5C1A] rounded-md ">x{{ item.quantity }}</span>
 <span class="text-xs font-bold text-gray-300">₦{{ item.price?.toLocaleString() || 0 }}</span>
 </div>
 </div>
 
 <div v-if="item.customizations?.length" class="mt-3 mb-2 pl-3 border-l-2 border-white/10 space-y-1.5">
 <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-[11px] text-gray-400 flex justify-between font-medium">
 <span class="truncate flex items-center gap-1">
 <span class="text-white/30">+</span>
 {{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}
 </span>
 <span v-if="c.price > 0" class="text-gray-500 shrink-0">+₦{{ c.price.toLocaleString() }}</span>
 </p>
 </div>
 
 <div class="flex justify-end mt-2 pt-2 border-t border-white/5">
 <span class="text-xs font-bold text-[#FF5C1A]">Total: ₦{{ (item.subtotal || (item.price * item.quantity)).toLocaleString() }}</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Delivery Location (Interactive) -->
 <div class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative group aspect-[2/1]">
 <div class="absolute inset-0 bg-[url('/img/map-pattern.png')] opacity-10 bg-repeat bg-center" />
 <div class="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent opacity-80" />
 
 <div class="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-4 text-center">
 <div class="relative mb-4">
 <div class="absolute inset-0 bg-[#FF5C1A] rounded-full animate-ping opacity-20" />
 <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl relative z-10 border border-gray-50">📍</div>
 </div>
 <p class="text-sm font-bold text-gray-400 -wider mb-1">Live Location </p>
 <p class="text-sm text-gray-300 font-medium -wide max-w-[150px]">Coordinate is active and shared with the customer.</p>
 </div>
 </div>
 </div>

 <!-- Sidebar: Actions & Customer -->
 <div class="lg:col-span-2 space-y-4 md:space-y-6"> 
 <!-- Customer Details Card -->
 <div class="bg-gradient-to-b from-gray-50 to-white p-4 md:p-5 rounded-xl md:rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 hover: transition-all duration-500 relative overflow-hidden">
 <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500"></div>
 
 <div class="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4 group-hover:rotate-6 transition-transform border-4 border-white relative overflow-hidden">
 <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
 {{ order.customer?.firstName?.[0] }}{{ order.customer?.lastName?.[0] }}
 </div>
 
 <p class="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 ">Primary Contact</p>
 <h4 class="text-lg font-black text-gray-900 mb-6 truncate w-full tracking-tight">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</h4>
 
 <div class="flex flex-col gap-3 w-full">
 <a :href="`tel:${order.customer?.phone}`" class="w-full py-3.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white hover: hover:shadow-emerald-500/20 transition-all transform active:scale-95 border border-emerald-200 flex items-center justify-center gap-2">
 <Phone class="w-4 h-4" /> Call Customer
 </a>
 <button @click="openChat(String(order.customer?._id || ''), order.customer?.firstName + ' ' + order.customer?.lastName, order.customer?.avatar)" class="w-full py-3.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white hover: hover:shadow-blue-500/20 transition-all transform active:scale-95 border border-blue-200 flex items-center justify-center gap-2">
 <MessageSquare class="w-4 h-4" /> Message Customer
 </button>
 </div>
 </div>

 <!-- Status Update Actions -->
 <div v-if="order.status === 'confirmed' || order.status === 'ready_for_pickup' || order.status === 'picked_up'" class="space-y-4">
 <div v-if="order.status === 'confirmed' || order.status === 'ready_for_pickup'" class="animate-bounce-subtle space-y-2">
 <button @click="updateStatus('picked_up')" :disabled="updatingStatus" class="w-full py-3 bg-[#FF5C1A] text-white rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2 group">
 <Loader2 v-if="updatingStatus" class="w-4 h-4 animate-spin" />
 <span v-else class="text-lg group-hover:rotate-12 transition-transform">📦</span> 
 <template v-if="order.type === 'custom_errand'">
   {{ updatingStatus ? 'UPDATING...' : 'I have picked up the item' }}
 </template>
 <template v-else>
   {{ updatingStatus ? 'UPDATING...' : 'Confirm Food Pickup' }}
 </template>
 </button>
 <p v-if="order.type === 'custom_errand'" class="text-[10px] text-gray-400 text-center font-medium px-4 leading-tight">
  Only click this button AFTER you have physically arrived at the location and picked up the item.
 </p>
 <p v-else class="text-[10px] text-gray-400 text-center font-medium px-4 leading-tight">
  Only click this after you have collected the food from the vendor.
 </p>
 </div>
 
 <div v-if="order.status === 'picked_up'" class="space-y-3">
 <button @click="updateStatus('in_transit')" :disabled="updatingStatus" class="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center justify-center gap-2 group">
 <Loader2 v-if="updatingStatus" class="w-4 h-4 animate-spin" />
 <span v-else class="text-lg group-hover:scale-110 transition-transform">🚀</span> 
 {{ updatingStatus ? 'UPDATING...' : 'Start Delivery' }}
 </button>
 <p class="text-xs text-gray-400 text-center font-medium">Update status once you depart.</p>
 </div>
 </div>

 <!-- Reconciliation Interface (For Custom Errands with Item Cost) -->
 <div v-if="order.type === 'custom_errand' && order.customDetails?.estimatedItemCost > 0 && order.reconciliationStatus !== 'approved'" class="bg-amber-50 rounded-2xl p-4 md:p-4 space-y-4 border border-amber-100">
 <div class="flex items-start gap-3">
 <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
 💰
 </div>
 <div>
 <h3 class="text-amber-900 font-bold text-sm">Item Cost Reconciliation</h3>
 <p class="text-amber-700 text-xs mt-1 leading-relaxed">
 You were sent ₦{{ order.customDetails?.estimatedItemCost?.toLocaleString() }}. If the actual cost was different, submit it below. The customer must approve to refund any difference.
 </p>
 </div>
 </div>
 
 <div v-if="order.reconciliationStatus === 'submitted'" class="bg-amber-100 text-amber-800 p-3 rounded-xl text-sm font-bold text-center border border-amber-200">
 Reconciliation submitted! Awaiting customer approval for ₦{{ order.actualItemCost?.toLocaleString() }} actual cost.
 </div>
 <div v-else class="space-y-3 pt-2 border-t border-amber-100">
 <div>
 <label class="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">Actual Cost (₦)</label>
 <input
 v-model.number="actualItemCost"
 type="number"
 placeholder="Enter exact amount spent"
 class="bg-white text-gray-900 font-bold w-full p-3 rounded-xl border border-amber-200 focus:border-amber-500 transition-all focus:outline-none"
 />
 </div>
 <button 
 @click="submitReconciliation" 
 :disabled="!actualItemCost || actualItemCost < 0 || submittingReconciliation"
 class="w-full py-3 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
 >
 <Loader2 v-if="submittingReconciliation" class="w-4 h-4 animate-spin" />
 <span v-else>✅</span> 
 {{ submittingReconciliation ? 'SUBMITTING...' : 'Submit Actual Cost' }}
 </button>
 </div>
 </div>

 <!-- Premium Verification Interface -->
 <div v-if="order.status === 'in_transit' || order.status === 'picked_up'" class="bg-white rounded-xl md:rounded-3xl p-4 md:p-5 space-y-4 md:space-y-6 relative overflow-hidden group border border-gray-100 shadow-sm">
 <div class="absolute -right-32 -top-32 w-64 h-64 bg-[#FF5C1A]/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
 
 <div class="text-center space-y-2 relative z-10">
 <h3 class="text-[#FF5C1A] text-2xl font-black tracking-tight leading-none">Security PIN</h3>
 <p class="text-gray-500 text-xs font-bold tracking-[0.1em] uppercase">Request the 4-digit code from the user</p>
 </div>
 
 <div class="flex justify-center relative z-10 px-4">
 <input
 v-model="verificationCode"
 type="text"
 maxlength="4"
 placeholder="••••"
 class="bg-gray-50 text-gray-900 text-3xl font-black text-center tracking-[1em] pl-[1em] w-full py-4 rounded-2xl border border-gray-200 focus:border-[#FF5C1A] focus:bg-white focus:ring-4 focus:ring-[#FF5C1A]/10 transition-all focus:outline-none placeholder:text-gray-300"
 />
 </div>
 
 <button 
 @click="completeOrder" 
 :disabled="verificationCode.length !== 4 || completing"
 class="w-full py-4 bg-[#FF5C1A] text-white rounded-xl text-sm font-black shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all relative z-10 group active:scale-95"
 >
 <Loader2 v-if="completing" class="w-5 h-5 animate-spin flex-shrink-0" />
 <span v-else class="text-lg group-hover:scale-110 transition-transform">✅</span> 
 {{ completing ? 'VERIFYING SECURE PIN...' : 'Finalize Secure Delivery' }}
 </button>
 
 <div class="pt-6 mt-6 border-t border-gray-100 text-center relative z-10 space-y-3">
 <p class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Customer unavailable?</p>
 <label class="block w-full cursor-pointer py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 transition-all active:scale-95">
 <input type="file" class="hidden" accept="image/*" @change="handleContactlessDropoff" :disabled="uploadingDropoff" />
 <div class="flex items-center justify-center gap-2">
 <Loader2 v-if="uploadingDropoff" class="w-4 h-4 animate-spin text-[#FF5C1A]" />
 <span v-else class="text-lg opacity-80">📸</span>
 <span :class="uploadingDropoff ? 'text-[#FF5C1A]' : ''">{{ uploadingDropoff ? 'UPLOADING PROOF...' : 'Contactless Drop-off' }}</span>
 </div>
 </label>
 </div>
 </div>

 <!-- Delivery Completed State -->
 <div v-if="order.status === 'delivered'" class="bg-emerald-500 rounded-2xl p-4 md:p-5 text-center space-y-4 md:space-y-6 relative overflow-hidden group border border-white/10">
 <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-90" />
 <div class="absolute -right-16 -bottom-16 w-38 h-38 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
 
 <div class="relative z-10 space-y-4 md:space-y-6">
 <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto text-3xl border border-emerald-50 text-emerald-600 transform rotate-6 animate-pulse">💰</div>
 <div>
 <h3 class="text-white font-medium text-2xl -tight -none mb-3">Delivery Completed</h3>
 <p class="text-white/90 font-medium text-xl -tight -none">+ ₦{{ (order.erranderPayout || order.deliveryFee || 0)?.toLocaleString() }} Earned</p>
 </div>
 
 <div class="max-w-xs mx-auto">
 <p class="text-emerald-100 text-xs font-medium mb-6">Funds have been added to your wallet.</p>
 
 <NuxtLink to="/deliveries" class="block w-full py-3 bg-white text-emerald-600 rounded-lg font-bold text-sm hover:bg-emerald-50 active:scale-95 transition-all">
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
import { useCustomToast } from "@/composables/core/useCustomToast"
import { Phone, MessageSquare, Loader2 } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';

const { user } = useUser();

definePageMeta({
 layout: 'errander'
})

const order = ref<any>(null);
const verificationCode = ref('');
const completing = ref(false);

const getGroupedCustomizations = (customizations: any[]) => {
 if (!customizations) return [];
 const grouped: Record<string, any> = {};
 customizations.forEach(c => {
 if (grouped[c.name]) {
 grouped[c.name].quantity += 1;
 grouped[c.name].price += c.price;
 } else {
 grouped[c.name] = { ...c, quantity: 1 };
 }
 });
 return Object.values(grouped);
};

const steps = ['confirmed', 'picked_up', 'in_transit', 'delivered'];
const currentStep = computed(() => order.value ? steps.indexOf(order.value.status) : -1);
const formatStatus = (s: string) => s?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const { connect, emit, on } = useSocket('');

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

const { showToast } = useCustomToast();

const updatingStatus = ref(false);

const actualItemCost = ref<number | null>(null);
const submittingReconciliation = ref(false);

const submitReconciliation = async () => {
 if (!actualItemCost.value || actualItemCost.value < 0) return;
 submittingReconciliation.value = true;
 try {
 const res = await api.put<any>(`/orders/${route.params.id}/reconcile`, {
 actualItemCost: actualItemCost.value
 });
 
 if (res && res.type === 'ERROR') {
 showToast({
 title: 'Submission Failed',
 message: res.data?.message || 'Failed to submit reconciliation',
 toastType: 'error'
 });
 return;
 }

 order.value = res.data;
 showToast({
 title: 'Submitted',
 message: 'Actual cost submitted to customer for approval.',
 toastType: 'success'
 });
 } catch (e: any) {
 showToast({
 title: 'Submission Failed',
 message: e.response?.data?.message || 'Failed to submit reconciliation',
 toastType: 'error'
 });
 } finally {
 submittingReconciliation.value = false;
 }
};

const updateStatus = async (status: string) => {
 updatingStatus.value = true;
 try {
 const res = await api.put<any>(`/orders/${route.params.id}/status`, { status });
 
 if (res && res.type === 'ERROR') {
 showToast({
 title: 'Update Failed',
 message: res.data?.message || 'Failed to update order status',
 toastType: 'error'
 });
 return;
 }

 order.value = res.data;
 emit('orderStatusUpdate', { orderId: route.params.id, status });
 showToast({
 title: 'Status Updated',
 message: `Order is now ${status.replace(/_/g, ' ')}`,
 toastType: 'success'
 });
 } catch (e: any) { 
 showToast({
 title: 'Update Failed',
 message: e.data?.message || e.response?.data?.message || 'Failed to update order status',
 toastType: 'error'
 });
 }
 finally { updatingStatus.value = false; }
};

const completeOrder = async () => {
 if (verificationCode.value.length !== 4) return;
 completing.value = true;
 try {
 const res = await api.post<any>(`/orders/${route.params.id}/complete`, { 
 verificationCode: verificationCode.value.toUpperCase() 
 });
 
 if (res && res.type === 'ERROR') {
 showToast({
 title: 'Verification Failed',
 message: res.data?.message || 'Invalid PIN. Verify and try again.',
 toastType: 'error'
 });
 return;
 }

 order.value = res.data;
 emit('orderStatusUpdate', { orderId: route.params.id, status: 'delivered' });
 showToast({
 title: 'Delivery Confirmed',
 message: 'Order completed successfully!',
 toastType: 'success'
 });
 } catch (e: any) { 
 showToast({
 title: 'Verification Failed',
 message: e.data?.message || e.response?.data?.message || 'Invalid PIN. Verify and try again.',
 toastType: 'error'
 });
 } finally {
 completing.value = false;
 }
};

const uploadingDropoff = ref(false);
const handleContactlessDropoff = async (event: Event) => {
 const target = event.target as HTMLInputElement;
 const file = target.files?.[0];
 if (!file) return;

 uploadingDropoff.value = true;
 try {
 const formData = new FormData();
 formData.append('file', file);
 
 const resUpload = await api.post<any>('/upload?resourceType=image', formData, {
 headers: { 'Content-Type': 'multipart/form-data' }
 });
 
 if (!resUpload || !resUpload.url) throw new Error('Upload failed');

 const res = await api.post<any>(`/orders/${route.params.id}/complete-contactless`, { 
 imageUrl: resUpload.url 
 });
 
 if (res && res.type === 'ERROR') {
 throw new Error(res.data?.message || 'Failed to complete contactless delivery');
 }

 order.value = res.data;
 emit('orderStatusUpdate', { orderId: route.params.id, status: 'delivered' });
 showToast({
 title: 'Drop-off Confirmed',
 message: 'Photo submitted successfully!',
 toastType: 'success'
 });
 } catch (e: any) {
 showToast({
 title: 'Upload Failed',
 message: e.message || e.response?.data?.message || 'Could not upload photo.',
 toastType: 'error'
 });
 } finally {
 uploadingDropoff.value = false;
 }
};

const getStatusBg = (s: string) => {
 if (['delivered', 'confirmed'].includes(s)) return 'bg-emerald-50 text-emerald-600';
 if (['in_transit', 'picked_up'].includes(s)) return 'bg-blue-50 text-blue-600';
 if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'bg-amber-50 text-amber-600';
 return 'bg-gray-50 text-gray-400';
}

const startLocation = () => {
 if ('geolocation' in navigator) {
 navigator.geolocation.watchPosition(
 (pos) => {
 const coords = [pos.coords.longitude, pos.coords.latitude];
 emit('updateLocation', {
 erranderId: (order.value as any)?.errander?.toString(),
 orderId: route.params.id,
 coordinates: coords,
 });
 api.put('/erranders/location', { coordinates: coords }).catch(() => {});
 },
 () => {},
 { enableHighAccuracy: true, timeout: 10000 },
 );
 }
};

 onMounted(async () => {
  const loadOrder = async () => {
    try {
      const res = await api.get<any>(`/orders/${route.params.id}`);
      order.value = res.data;
    } catch (e) { console.error(e); }
  };
  
  await loadOrder();

  connect();
  emit('trackOrder', { orderId: route.params.id });
  startLocation();
  
  on('notification:order-status-update', (payload: any) => {
    if (payload.orderId === route.params.id || payload.data?.orderId === route.params.id) {
      loadOrder();
    }
  });
  
  on('notification:order-accepted', (payload: any) => {
    if (payload.orderId === route.params.id || payload.data?.orderId === route.params.id) {
      loadOrder();
    }
  });
});

useHead({ title: computed(() => `Delivery #${order.value?.orderNumber || ''} - Errandr`) });
</script>
