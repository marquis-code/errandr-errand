<template>
 <div class="space-y-4 animate-fade-in max-w-7xl mx-auto pb-10">
 <!-- Header Space -->
 <div class="flex items-center justify-between gap-4 mb-4 mt-2">
 <!-- We can keep a search bar or just space for consistency -->
 <div class="flex-1 relative max-w-2xl">
 <h1 class="text-2xl font-bold text-gray-900 tracking-tight mb-1">Earnings & Payouts</h1>
 <p class="text-gray-500 text-sm">Track your delivery tips, base fees, and withdrawal history.</p>
 </div>
 <button v-if="balance > 0" @click="showWithdrawDrawer = true" class="px-6 py-2.5 bg-parentPrimary text-white rounded-full font-bold text-xs shadow-sm shadow-parentPrimary/20 hover:brightness-110 active:scale-[0.98] transition-all tracking-widest flex items-center gap-2">
 Request Payout
 </button>
 </div>

 <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div v-for="i in 2" :key="i" class="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse h-40" />
 </div>

 <div v-else class="space-y-8 animate-fade-in">
 <!-- Balance Cards -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div class="bg-white p-8 rounded-[2.5rem] relative overflow-hidden group border border-gray-100 shadow-sm">
 <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/5 rounded-full group-hover:scale-110 transition-all duration-700"></div>
 <p class="text-[10px] font-bold text-gray-400 tracking-widest mb-2 relative z-10">Available for Payout</p>
 <h2 class="text-5xl font-bold text-gray-900 mb-2 relative z-10 tracking-tighter">₦{{ balance?.toLocaleString() || '0' }}</h2>
 <div class="flex items-center gap-2 relative z-10">
 <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
 <p class="text-[10px] text-emerald-600 font-bold tracking-wider">Verified Balance</p>
 </div>
 </div>

 <div class="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-200/50 shadow-inner relative overflow-hidden">
 <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-200/20 rounded-full blur-3xl"></div>
 <p class="text-[10px] font-semibold text-gray-400 tracking-wider mb-2">Lifetime Earnings</p>
 <h2 class="text-5xl font-bold text-gray-400 tracking-tighter">₦{{ wallet?.totalEarned?.toLocaleString() || '0' }}</h2>
 <p class="text-[10px] text-gray-500 mt-2 font-medium">Total revenue from all completed errands.</p>
 </div>
 </div>

 <!-- Payout Preferences -->
 <section class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
 <div class="flex items-center gap-3">
 <div class="w-10 h-10 rounded-2xl bg-parentPrimary/10 text-parentPrimary flex items-center justify-center text-xl shadow-inner border border-white">🏦</div>
 <h3 class="text-xl font-bold text-gray-900 tracking-tight">Payout Settings</h3>
 </div>
 
 <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
 <div class="space-y-4">
 <label class="text-[10px] font-bold text-gray-400 tracking-widest ml-1">Payout Schedule</label>
 <div class="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
 <button v-for="p in ['instant', 'weekly']" :key="p"
 @click="handleUpdateFrequency(p)"
 class="flex-1 py-3 rounded-xl text-[11px] font-bold tracking-widest transition-all"
 :class="wallet?.payoutPreference === p ? 'bg-white text-parentPrimary shadow-md' : 'text-gray-500 hover:text-gray-700'"
 >
 {{ p }}
 </button>
 </div>
 <p class="text-[10px] text-gray-400 font-medium px-2 italic">Standard processing fees may apply for instant settlements.</p>
 </div>

 <div class="space-y-4">
 <label class="text-[10px] font-semibold text-gray-400 tracking-wider ml-1">Your Bank Account</label>
 <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200/50 space-y-2 relative overflow-hidden">
 <div class="absolute top-0 right-0 p-3">
 <span class="text-xs">🛡️</span>
 </div>
 <p class="text-sm text-gray-900 font-bold tracking-tight">{{ wallet?.bankDetails?.bankName || 'No Bank Linked' }}</p>
 <p class="text-xs text-gray-600 font-mono">{{ wallet?.bankDetails?.accountNumber || 'xxxx xxxx xxxx' }}</p>
 <p class="text-[10px] text-gray-400 font-bold tracking-widest">{{ wallet?.bankDetails?.accountName || 'Not configured' }}</p>
 </div>
 <button @click="showBankDrawer = true" class="text-[11px] font-bold text-parentPrimary tracking-widest hover:underline flex items-center gap-1 group">
 Update Bank Details <span class="group-hover:translate-x-1 transition-transform">→</span>
 </button>
 </div>
 </div>
 </section>

 <!-- History -->
 <section class="mt-8 space-y-4">
 <div class="flex items-center justify-between px-2">
 <h3 class="font-bold text-gray-900 tracking-tight text-xl">Transaction History</h3>
 <span class="text-[10px] font-bold text-gray-400 tracking-widest">{{ transactions.length }} Events</span>
 </div>
 
 <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden pb-10">
 <div v-if="transactions.length === 0">
 <EmptyState 
 title="No earnings yet" 
 description="Complete your first delivery to see your tips and service fees here!"
 >
 <template #icon>
 🚚
 </template>
 </EmptyState>
 </div>
 <div v-else class="overflow-x-auto">
 <table class="w-full text-left border-collapse">
 <thead>
 <tr class="border-b border-gray-100">
 <th class="py-4 px-6 font-medium text-gray-400 text-[11px] whitespace-nowrap">Description</th>
 <th class="py-4 px-6 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Amount</th>
 <th class="py-4 px-6 font-medium text-gray-400 text-[11px] whitespace-nowrap text-right">Date</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50/50">
 <tr v-for="tx in transactions" :key="tx._id" class="hover:bg-gray-50/80 transition-colors group cursor-default">
 <td class="py-4 px-6 min-w-[200px]">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100">
 <span class="text-xs">{{ tx.type === 'credit' ? '📥' : '📤' }}</span>
 </div>
 <div>
 <p class="text-[13px] text-gray-900 font-bold tracking-tight">{{ tx.description }}</p>
 <p v-if="tx.order" class="text-[10px] text-gray-400 font-medium tracking-wider mt-0.5 ">Order #{{ tx.order.slice(-8) }}</p>
 </div>
 </div>
 </td>
 <td class="py-4 px-6 text-right">
 <p :class="tx.type === 'credit' ? 'text-emerald-600 bg-emerald-50/50' : 'text-rose-600 bg-rose-50/50'" class="text-[13px] font-bold tracking-tighter inline-block px-3 py-1 rounded-lg">
 {{ tx.type === 'credit' ? '+' : '-' }} ₦{{ tx.amount.toLocaleString() }}
 </p>
 </td>
 <td class="py-4 px-6 text-right">
 <p class="text-[11px] text-gray-900 font-medium ">{{ new Date(tx.createdAt).toLocaleDateString() }}</p>
 <p class="text-[10px] text-gray-400 font-medium">{{ new Date(tx.createdAt).toLocaleTimeString() }}</p>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 </section>
 </div>

 <!-- Modals -->
 <!-- Bank Details SideDrawer -->
 <SideDrawer :isOpen="showBankDrawer" @close="showBankDrawer = false">
 <div class="space-y-6">
 <div class="border-b border-gray-100 pb-4">
 <h3 class="text-2xl font-bold text-gray-900 tracking-tight">Bank Information</h3>
 <p class="text-gray-500 text-sm mt-1">Your earnings will be sent to this bank account.</p>
 </div>

 <div class="space-y-5">
 <div class="space-y-1.5">
 <label class="text-[10px] font-semibold text-gray-400 ml-1 tracking-wider">Select Bank</label>
 <div class="relative group">
 <select v-model="bankForm.bankCode" @change="onBankChange" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-parentPrimary/20 focus:bg-white transition-all appearance-none cursor-pointer">
 <option value="" disabled>Choose your bank</option>
 <option v-for="bank in banks" :key="bank.code" :value="bank.code">{{ bank.name }}</option>
 </select>
 <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">⌄</div>
 </div>
 </div>
 <div class="space-y-1.5">
 <label class="text-[10px] font-semibold text-gray-400 ml-1 tracking-wider">Account Number</label>
 <div class="relative">
 <input v-model="bankForm.accountNumber" @input="isAccountVerified = false" type="text" maxlength="10" class="w-full pl-4 pr-24 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-parentPrimary/20 focus:bg-white transition-all" placeholder="10-digit NUBAN">
 <button 
 @click="resolveAccount" 
 :disabled="bankForm.accountNumber.length !== 10 || !bankForm.bankCode || resolving"
 class="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-lg bg-gray-900 text-white text-[10px] font-bold tracking-widest disabled:opacity-30 hover:bg-black transition-all shadow-lg shadow-gray-900/10"
 >
 {{ resolving ? 'Wait...' : 'Verify' }}
 </button>
 </div>
 </div>
 <Transition name="fade">
 <div v-if="bankForm.accountName" class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1 shadow-inner">
 <p class="text-[9px] text-emerald-600 font-bold tracking-widest">Verified Beneficiary</p>
 <p class="text-sm text-emerald-900 font-bold ">{{ bankForm.accountName }}</p>
 </div>
 </Transition>
 </div>
 
 <div class="pt-6 border-t border-gray-100 flex gap-4 mt-6">
 <button @click="handleSaveBank" :disabled="!isAccountVerified" class="w-full py-4 bg-parentPrimary text-white rounded-xl text-xs font-bold tracking-widest shadow-xl shadow-parentPrimary/20 disabled:opacity-30 hover:brightness-110 active:scale-[0.98] transition-all">Update Bank Account</button>
 </div>
 </div>
 </SideDrawer>

 <!-- Withdraw SideDrawer -->
 <SideDrawer :isOpen="showWithdrawDrawer" @close="showWithdrawDrawer = false">
 <div class="flex flex-col items-center justify-center py-6 border-b border-gray-100 space-y-4">
 <div class="w-20 h-20 bg-parentPrimary/10 text-parentPrimary rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border border-white">💸</div>
 <div class="text-center">
 <h3 class="text-2xl font-bold text-gray-900 tracking-tight mb-1">Request Payout</h3>
 <p class="text-gray-500 text-sm">Withdraw your earnings to your linked bank account.</p>
 </div>
 </div>

 <div class="space-y-6 pt-6">
 <div class="space-y-2">
 <div class="relative">
 <span class="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₦</span>
 <input v-model.number="withdrawAmount" type="number" class="w-full pl-12 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-3xl text-3xl font-bold text-center focus:ring-4 focus:ring-parentPrimary/10 focus:bg-white transition-all shadow-inner" placeholder="0">
 </div>
 <p class="text-[10px] text-gray-400 font-black tracking-widest text-center">Available: ₦{{ balance?.toLocaleString() }}</p>
 </div>

 <div class="pt-6 border-t border-gray-100 flex flex-col gap-3">
 <button @click="handleWithdraw" :disabled="withdrawAmount <= 0 || withdrawAmount > (balance || 0)" class="w-full py-4 bg-parentPrimary text-white rounded-xl font-bold text-xs shadow-xl shadow-parentPrimary/20 hover:brightness-110 disabled:opacity-30 active:scale-[0.98] transition-all tracking-widest">
 Confirm Withdrawal
 </button>
 </div>
 </div>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWallet } from '@/composables/modules/wallets';
import { wallets_api } from '@/api_factory/modules/wallets';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';
import { ShieldCheck, ChevronRight, History } from 'lucide-vue-next';

const { balance, wallet, fetchWallet, withdrawFunds, updatePreferences } = useWallet();
const transactions = ref<any[]>([]);
const loading = ref(true);
const showWithdrawDrawer = ref(false);
const showBankDrawer = ref(false);
const withdrawAmount = ref(0);
const banks = ref<any[]>([]);
const resolving = ref(false);
const isAccountVerified = ref(false);

definePageMeta({
 layout: 'errander'
})

const bankForm = ref({
 bankName: '',
 bankCode: '',
 accountNumber: '',
 accountName: '',
});

const loadData = async () => {
 loading.value = true;
 try {
 const txRes = await wallets_api.getTransactions();
 transactions.value = txRes.data;
 await fetchWallet();
 if (wallet.value?.bankDetails) {
 bankForm.value = { ...wallet.value.bankDetails };
 isAccountVerified.value = !!wallet.value.bankDetails.accountName;
 }
 const banksRes: any = await api.get('/payments/banks');
 banks.value = banksRes.data || [];
 } catch (e) {
 console.error(e);
 } finally {
 loading.value = false;
 }
};

const onBankChange = () => {
 const selectedBank = banks.value.find(b => b.code === bankForm.value.bankCode);
 if (selectedBank) {
 bankForm.value.bankName = selectedBank.name;
 }
 isAccountVerified.value = false;
 bankForm.value.accountName = '';
};

const resolveAccount = async () => {
 if (bankForm.value.accountNumber.length !== 10 || !bankForm.value.bankCode) return;
 resolving.value = true;
 try {
 const res: any = await api.post('/payments/resolve-account', {
 account_number: bankForm.value.accountNumber,
 bank_code: bankForm.value.bankCode
 });
 bankForm.value.accountName = res.data.account_name;
 isAccountVerified.value = true;
 } catch (e: any) {
 alert(e.data?.message || 'Failed to resolve account');
 } finally {
 resolving.value = false;
 }
};

const handleUpdateFrequency = async (preference: string) => {
 await updatePreferences({ preference });
};

const handleSaveBank = async () => {
 if (!isAccountVerified.value) return;
 await updatePreferences({
 preference: wallet.value?.payoutPreference || 'weekly',
 bankDetails: bankForm.value
 });
 showBankDrawer.value = false;
};

const handleWithdraw = async () => {
 if (withdrawAmount.value <= 0 || withdrawAmount.value > balance.value) return;
 await withdrawFunds(withdrawAmount.value);
 showWithdrawDrawer.value = false;
 await loadData();
};

onMounted(loadData);
useHead({ title: 'Earnings - Errandr Dashboard' });
</script>

<style scoped>
.animate-fade-in {
 animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-scale-in {
 animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
 from { opacity: 0; transform: scale(0.9) translateY(10px); }
 to { opacity: 1; transform: scale(1) translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
