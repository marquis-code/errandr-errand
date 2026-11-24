<template>
  <div class="earn-page">
    <!-- Back and title on one line: the empty band above them was the header padding stacked with the page padding. -->
    <div class="page-header">
      <PageBack class="lg:hidden" />
      <div class="page-header-text">
        <h1 class="page-title">Earnings</h1>
        <p class="page-sub">Withdraw what you have earned, and see where it came from.</p>
      </div>
    </div>
    <!-- Skeleton -->
    <div v-if="loading" class="pay-hero-skeleton animate-pulse" />

    <template v-else>
      <!-- The balance and the one thing to do with it, in one place -->
      <section class="pay-hero">
        <p class="pay-label">Available to withdraw</p>
        <p class="pay-amount"><span class="pay-currency">₦</span>{{ balance?.toLocaleString() || '0' }}</p>

        <p v-if="wallet?.totalEarned" class="pay-lifetime">
          ₦{{ wallet.totalEarned.toLocaleString() }} earned in total
        </p>

        <button
          type="button"
          class="pay-cta"
          :disabled="balance < minimumPayout"
          @click="showWithdrawDrawer = true"
        >
          {{ balance >= minimumPayout ? 'Request payout' : `₦${(minimumPayout - balance).toLocaleString()} more to withdraw` }}
        </button>

        <button type="button" class="pay-secondary" @click="showStatementModal = true">
          Generate a statement
        </button>
      </section>
    </template>

      <!-- Payout settings: how the money leaves, in one card -->
      <section class="settings-card">
        <div class="settings-head">
          <h2 class="settings-title">Payout settings</h2>
          <p class="settings-sub">Where and how often your earnings are paid out.</p>
        </div>

        <p class="settings-label">Settlement frequency</p>
        <div class="freq-row">
          <button
            v-for="p in ['manual', 'daily', 'weekly', 'monthly']"
            :key="p"
            type="button"
            class="freq"
            :class="{ on: wallet?.payoutPreference === p }"
            @click="handleUpdateFrequency(p)"
          >
            {{ p }}
          </button>
        </div>
        <p class="settings-note">Daily settlements may carry a processing fee. Weekly and monthly are free.</p>

        <div class="bank-row">
          <div class="bank-info">
            <p class="bank-name">{{ wallet?.bankDetails?.bankName || 'No bank linked' }}</p>
            <p class="bank-number">{{ wallet?.bankDetails?.accountNumber || '•••• •••• ••••' }}</p>
            <p class="bank-owner">{{ wallet?.bankDetails?.accountName || 'Not set up yet' }}</p>
          </div>
          <button type="button" class="bank-edit" @click="showBankDrawer = true">
            {{ wallet?.bankDetails?.accountNumber ? 'Change' : 'Add bank' }}
          </button>
        </div>
      </section>

      <!-- Ledger -->
      <section class="bg-white rounded-lg border border-gray-25 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-gray-900 text-sm">Ledger History</h3>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-semibold">{{ filteredTransactions.length }}</span>
            </div>
            
            <!-- Filters: a type row you can hit, then the dates as one pair -->
            <div class="ledger-filters">
              <div class="type-row">
                <button
                  v-for="opt in [{ label: 'All', value: 'all' }, { label: 'In', value: 'credit' }, { label: 'Out', value: 'debit' }]"
                  :key="opt.value"
                  type="button"
                  class="type-chip"
                  :class="{ on: filterType === opt.value }"
                  @click="filterType = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>

              <div class="date-row">
                <RangeDatePicker v-model="filterRange" class="range-picker" />
                <button
                  v-if="filterType !== 'all' || filterRange?.length"
                  type="button"
                  class="clear-chip"
                  @click="clearFilters"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <EmptyState
            v-if="filteredTransactions.length === 0"
            :icon="transactions.length === 0 ? Wallet : SearchX"
            :title="transactions.length === 0 ? 'No earnings yet' : 'Nothing in that range'"
            :body="transactions.length === 0 ? 'Complete a delivery and the credit shows up here within a minute, with a receipt you can download.' : 'Try a wider date range, or switch the type filter back to All.'"
          />
          
          <!-- A ledger reads as a list on a phone: four columns cannot survive 390px. -->
          <div v-else>
            <div class="md:hidden">
              <div v-for="tx in filteredTransactions" :key="'m-' + tx._id" class="ledger-row">
                <div class="ledger-main">
                  <span class="ledger-dot" :class="tx.type === 'credit' ? 'in' : 'out'">
                    <span v-if="tx.type === 'credit'">+</span><span v-else>−</span>
                  </span>
                  <div class="ledger-text">
                    <p class="ledger-desc">{{ tx.description }}</p>
                    <p class="ledger-meta">
                      {{ new Date(tx.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) }}
                      ·
                      {{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                      <template v-if="tx.order"> · {{ tx.order.slice(-8) }}</template>
                    </p>
                  </div>
                </div>
                <div class="ledger-side">
                  <p class="ledger-amount" :class="tx.type === 'credit' ? 'plus' : 'minus'">
                    {{ tx.type === 'credit' ? '+' : '−' }}₦{{ tx.amount.toLocaleString() }}
                  </p>
                  <button type="button" class="ledger-receipt" @click="downloadReceipt(tx._id)">Receipt</button>
                </div>
              </div>
            </div>

            <!-- The table still earns its keep where there is room for it -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-100">
                    <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide">Description</th>
                    <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Amount</th>
                    <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Date</th>
                    <th class="py-3 px-4 font-semibold text-gray-500 text-[11px] uppercase tracking-wide text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="tx in filteredTransactions" :key="tx._id" class="hover:bg-gray-50/50 transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'" class="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                          <span class="text-xs font-bold">{{ tx.type === 'credit' ? '+' : '−' }}</span>
                        </div>
                        <div>
                          <p class="text-sm text-gray-900 font-semibold">{{ tx.description }}</p>
                          <p v-if="tx.order" class="text-[10px] text-gray-400 font-mono mt-0.5">{{ tx.order.slice(-8) }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <p :class="tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'" class="text-sm font-bold">
                        {{ tx.type === 'credit' ? '+' : '−' }}₦{{ tx.amount.toLocaleString() }}
                      </p>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <p class="text-sm text-gray-700 font-medium">{{ new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
                      <p class="text-[10px] text-gray-400 mt-0.5">{{ new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button @click="downloadReceipt(tx._id)" class="px-2.5 py-1 rounded text-[10px] font-semibold text-gray-500 hover:text-[#FF5C1A] hover:bg-orange-50 transition-colors">
                        Receipt
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

  <!-- Statement Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showStatementModal" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" @click.self="showStatementModal = false">
        <div class="bg-white rounded-lg w-full max-w-md p-6 space-y-5">
          <div>
            <h3 class="text-base font-bold text-gray-900">Generate Statement</h3>
            <p class="text-sm text-gray-500 mt-1">Select a date range to download your earnings statement as CSV.</p>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500 mb-1 block">From</label>
              <UiDatePicker v-model="statementFrom" class="w-full" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500 mb-1 block">To</label>
              <UiDatePicker v-model="statementTo" class="w-full" />
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="showStatementModal = false" class="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
            <button @click="generateStatement" :disabled="!statementFrom || !statementTo" class="flex-1 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40">Download CSV</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Bank Details SideDrawer -->
  <SideDrawer :isOpen="showBankDrawer" @close="showBankDrawer = false">
    <div class="space-y-5">
      <div class="border-b border-gray-100 pb-3">
        <h3 class="text-lg font-bold text-gray-900">Bank Information</h3>
        <p class="text-gray-500 text-sm mt-1">Your earnings will be sent to this account.</p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-500 mb-1 block">Select Bank</label>
          <UiSelectInput v-model="bankForm.bankCode" :options="banks" class="w-full" @update:modelValue="onBankChange" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500 mb-1 block">Account Number</label>
          <div class="relative">
            <input v-model="bankForm.accountNumber" @input="isAccountVerified = false" type="text" maxlength="10" class="w-full pl-3 pr-20 py-2.5 bg-gray-50 border border-gray-25 rounded-lg text-sm font-medium focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all" placeholder="10-digit NUBAN">
            <button 
              @click="resolveAccount" 
              :disabled="bankForm.accountNumber.length !== 10 || !bankForm.bankCode || resolving"
              class="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-gray-900 text-white text-sm font-semibold disabled:opacity-30 hover:bg-gray-800 transition-all"
            >
              {{ resolving ? 'Wait...' : 'Verify' }}
            </button>
          </div>
        </div>
        <Transition name="fade">
          <div v-if="bankForm.accountName" class="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <p class="text-sm text-emerald-600 font-semibold">Verified Beneficiary</p>
            <p class="text-sm text-emerald-900 font-bold">{{ bankForm.accountName }}</p>
          </div>
        </Transition>
      </div>
      
      <div class="pt-4 border-t border-gray-100">
        <button @click="handleSaveBank" :disabled="!isAccountVerified" class="w-full py-2.5 bg-[#FF5C1A] text-white rounded-lg text-sm font-semibold disabled:opacity-30 hover:bg-[#E54D12] transition-all">Update Bank Account</button>
      </div>
    </div>
  </SideDrawer>

  <!-- Withdraw SideDrawer -->
  <SideDrawer :isOpen="showWithdrawDrawer" @close="showWithdrawDrawer = false">
    <div class="space-y-5">
      <div class="text-center border-b border-gray-100 pb-4">
        <div class="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">💸</div>
        <h3 class="text-lg font-bold text-gray-900">Request Payout</h3>
        <p class="text-gray-500 text-sm">Withdraw to your linked bank account.</p>
      </div>

      <div class="space-y-3">
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-gray-400">₦</span>
          <input v-model="formattedWithdrawAmount" type="text" class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-25 rounded-lg text-xl font-bold text-center focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all" placeholder="0">
        </div>
        <p class="text-sm text-gray-400 text-center">Available: ₦{{ balance?.toLocaleString() }}</p>
      </div>

      <div class="space-y-3">
        <!-- Instant Toggle -->
        <label class="flex items-center justify-between p-3 bg-gray-50 border border-gray-25 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <div>
            <span class="text-sm font-semibold text-gray-900">Instant Withdrawal</span>
            <span class="text-[10px] text-gray-500 block">Max ₦5,000</span>
          </div>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isInstant" class="sr-only peer" :disabled="withdrawAmount > 5000">
            <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </div>
        </label>
        <p v-if="isInstant && withdrawAmount > 5000" class="text-[10px] text-red-500 font-medium text-center">Instant withdrawal is limited to ₦5,000</p>
        
        <button @click="handleWithdraw" :disabled="withdrawAmount < minimumPayout || withdrawAmount > (balance || 0) || (isInstant && withdrawAmount > 5000)" class="w-full py-2.5 bg-[#FF5C1A] text-white rounded-lg font-semibold text-sm hover:bg-[#E54D12] disabled:opacity-30 transition-all">
          Confirm Withdrawal
        </button>
        <p v-if="withdrawAmount > 0 && withdrawAmount < minimumPayout" class="text-[10px] text-red-500 font-medium text-center">Minimum payout is ₦{{ minimumPayout.toLocaleString() }}</p>
      </div>
    </div>
  </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import PageBack from '@/components/ui/PageBack.vue'
import RangeDatePicker from '@/components/ui/RangeDatePicker.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { Wallet, SearchX } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue';
import { useWallet } from '@/composables/modules/wallets';
import { wallets_api } from '@/api_factory/modules/wallets';
import { settings_api } from '@/api_factory/modules/settings';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';
import SideDrawer from '@/components/ui/SideDrawer.vue';

const { showToast } = useCustomToast();
const { balance, wallet, fetchWallet, withdrawFunds, updatePreferences, downloadReceipt } = useWallet();
const transactions = ref<any[]>([]);
const loading = ref(true);
const minimumPayout = ref(1000);
const showWithdrawDrawer = ref(false);
const showBankDrawer = ref(false);
const showStatementModal = ref(false);
const withdrawAmount = ref(0);
const isInstant = ref(false);

// Filters
const filterType = ref('all');

/** A range, from one control: two fields asked the rider to make the same decision twice. */
const filterRange = ref<Date[] | null>(null);

// Statement
const statementFrom = ref('');
const statementTo = ref('');

const formattedWithdrawAmount = computed({
  get() {
    if (withdrawAmount.value === 0 || withdrawAmount.value === null || withdrawAmount.value === undefined) return '';
    return withdrawAmount.value.toLocaleString('en-US');
  },
  set(val) {
    const clean = val.replace(/[^0-9.]/g, '');
    withdrawAmount.value = clean ? Number(clean) : 0;
  }
});

const filteredTransactions = computed(() => {
  let result = [...transactions.value];
  
  if (filterType.value !== 'all') {
    result = result.filter(tx => tx.type === filterType.value);
  }
  
  const [start, end] = Array.isArray(filterRange.value) ? filterRange.value : [];
  if (start) {
    const from = new Date(start);
    from.setHours(0, 0, 0, 0);
    result = result.filter(tx => new Date(tx.createdAt) >= from);
  }
  if (end) {
    const to = new Date(end);
    to.setHours(23, 59, 59, 999);
    result = result.filter(tx => new Date(tx.createdAt) <= to);
  }
  
  return result;
});

const clearFilters = () => {
  filterType.value = 'all';
  filterRange.value = null;
};

const banks = ref<any[]>([]);
const resolving = ref(false);
const isAccountVerified = ref(false);

definePageMeta({ layout: 'errander' });

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

    try {
      const pRes = await settings_api.getPayoutSettings();
      if (pRes.data) minimumPayout.value = pRes.data.amount || 1000;
    } catch(e) {
      console.error('Failed to load minimum payout setting', e);
    }

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
  if (selectedBank) bankForm.value.bankName = selectedBank.name;
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
    showToast({ title: 'Verification Failed', message: e.data?.message || 'Failed to resolve account', toastType: 'error' });
  } finally {
    resolving.value = false;
  }
};

const handleUpdateFrequency = async (preference: string) => {
  await updatePreferences({ preference });
};

const handleSaveBank = async () => {
  if (!isAccountVerified.value) return;
  await updatePreferences({ preference: wallet.value?.payoutPreference || 'manual', bankDetails: bankForm.value });
  showBankDrawer.value = false;
};

const handleWithdraw = async () => {
  if (withdrawAmount.value <= 0 || withdrawAmount.value > balance.value) return;
  if (isInstant.value && withdrawAmount.value > 5000) {
    showToast({ title: 'Error', message: 'Instant withdrawals are limited to ₦5,000', toastType: 'error' });
    return;
  }
  await withdrawFunds(withdrawAmount.value, isInstant.value);
  withdrawAmount.value = 0;
  showWithdrawDrawer.value = false;
  await loadData();
};

const generateStatement = () => {
  if (!statementFrom.value || !statementTo.value) return;
  
  const from = new Date(statementFrom.value);
  from.setHours(0, 0, 0, 0);
  const to = new Date(statementTo.value);
  to.setHours(23, 59, 59, 999);
  
  const filtered = transactions.value.filter(tx => {
    const d = new Date(tx.createdAt);
    return d >= from && d <= to;
  });
  
  if (filtered.length === 0) {
    showToast({ title: 'No Data', message: 'No transactions found for the selected period.', toastType: 'error' });
    return;
  }
  
  // Build CSV
  const headers = ['Date', 'Time', 'Type', 'Description', 'Amount (₦)', 'Reference'];
  const rows = filtered.map(tx => [
    new Date(tx.createdAt).toLocaleDateString(),
    new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tx.type,
    `"${tx.description || ''}"`,
    `${tx.type === 'credit' ? '+' : '-'}${tx.amount}`,
    tx.order?.slice(-8) || ''
  ]);
  
  // Summary row
  const totalCredit = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  rows.push([]);
  rows.push(['Summary']);
  rows.push(['Total Credits', '', '', '', `+${totalCredit}`]);
  rows.push(['Total Debits', '', '', '', `-${totalDebit}`]);
  rows.push(['Net', '', '', '', `${totalCredit - totalDebit}`]);
  
  const csv = [headers.join(','), ...rows.map(r => (r as any[]).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `errandr-statement-${statementFrom.value}-to-${statementTo.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  showStatementModal.value = false;
  showToast({ title: 'Downloaded', message: `Statement with ${filtered.length} transactions downloaded.`, toastType: 'success' });
};

onMounted(loadData);
useHead({ title: 'Earnings - Errandr Dashboard' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Two buttons and a number are all this screen is for; make them readable at arm's length. */
.earn-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 640px) {
  .earn-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .earn-actions button {
    justify-content: center;
    padding: 12px 10px;
    font-size: 13.5px;
  }
}

.earn-balance {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #14110d;
}

.earn-currency {
  font-size: 17px;
  font-weight: 700;
  color: #9aa1ac;
  margin-right: 2px;
}

/* Ledger on a phone */
.ledger-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #f4f5f7;
}

.ledger-main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.ledger-dot {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  flex: none;
}

.ledger-dot.in {
  background: #ecfdf5;
  color: #059669;
}

.ledger-dot.out {
  background: #fef2f2;
  color: #dc2626;
}

.ledger-text {
  min-width: 0;
}

.ledger-desc {
  margin: 0;
  font-size: 13.5px;
  font-weight: 650;
  color: #14110d;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ledger-meta {
  margin: 3px 0 0;
  font-size: 11.5px;
  color: #9aa1ac;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ledger-side {
  text-align: right;
  flex: none;
}

.ledger-amount {
  margin: 0;
  font-size: 14.5px;
  font-weight: 800;
}

.ledger-amount.plus {
  color: #059669;
}

.ledger-amount.minus {
  color: #14110d;
}

.ledger-receipt {
  margin-top: 4px;
  padding: 3px 8px;
  border: 1px solid #eef0f3;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
}

.ledger-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

@media (min-width: 768px) {
  .ledger-filters {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
}

.type-row {
  display: flex;
  gap: 6px;
}

.type-chip {
  padding: 7px 14px;
  border: 1px solid #eef0f3;
  border-radius: 999px;
  background: #fff;
  color: #6b7280;
  font-size: 12.5px;
  font-weight: 750;
}

.type-chip.on {
  background: #14110d;
  border-color: #14110d;
  color: #fff;
}

.date-row {
  display: flex;
  gap: 6px;
  min-width: 0;
}

.date-row > * {
  flex: 1;
  min-width: 0;
}

.clear-chip {
  padding: 7px 12px;
  border: 0;
  background: transparent;
  color: #ff5c1a;
  font-size: 12.5px;
  font-weight: 750;
}

/* The payout hero: one card answers "what can I take out, and how". */
.pay-hero {
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(160deg, #1b1613 0%, #14110d 60%);
  color: #fff;
}

.pay-hero-skeleton {
  height: 190px;
  border-radius: 20px;
  background: #f1f2f4;
}

.pay-label {
  margin: 0;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8f877c;
}

.pay-amount {
  margin: 6px 0 0;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.pay-currency {
  font-size: 20px;
  font-weight: 700;
  color: #b9b0a4;
  margin-right: 2px;
}

.pay-lifetime {
  margin: 6px 0 0;
  font-size: 13px;
  color: #b9b0a4;
}

.pay-cta {
  width: 100%;
  margin-top: 18px;
  padding: 14px;
  border: 0;
  border-radius: 13px;
  background: #ff5c1a;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
}

.pay-cta:disabled {
  background: rgba(255, 255, 255, 0.14);
  color: #d8d2c8;
}

.pay-secondary {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border: 0;
  border-radius: 13px;
  background: transparent;
  color: #b9b0a4;
  font-size: 13.5px;
  font-weight: 700;
}

/* One range control, sized like the chips beside it. */
.date-row :deep(.range-picker) {
  flex: 1;
}

.date-row :deep(.range-picker input) {
  height: 40px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 650;
}

.earn-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 28px;
}

.earn-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.earn-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: #14110d;
}

.earn-sub {
  margin: 2px 0 0;
  font-size: 13px;
  color: #9aa1ac;
}

.settings-card {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #eef0f3;
  background: #fff;
}

.settings-head {
  margin-bottom: 14px;
}

.settings-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #14110d;
}

.settings-sub {
  margin: 3px 0 0;
  font-size: 13px;
  color: #9aa1ac;
}

.settings-label {
  margin: 0 0 8px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9aa1ac;
}

.freq-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: #f4f5f7;
}

.freq {
  padding: 9px 4px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #6b7280;
  font-size: 12.5px;
  font-weight: 750;
  text-transform: capitalize;
}

.freq.on {
  background: #fff;
  color: #14110d;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.settings-note {
  margin: 8px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #9aa1ac;
}

.bank-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f4f5f7;
}

.bank-info {
  flex: 1;
  min-width: 0;
}

.bank-name {
  margin: 0;
  font-size: 14px;
  font-weight: 750;
  color: #14110d;
}

.bank-number {
  margin: 2px 0 0;
  font-size: 13px;
  font-weight: 650;
  color: #6b7280;
  letter-spacing: 0.04em;
}

.bank-owner {
  margin: 2px 0 0;
  font-size: 12px;
  color: #9aa1ac;
}

.bank-edit {
  flex: none;
  padding: 9px 14px;
  border: 1px solid #eef0f3;
  border-radius: 10px;
  background: #fff;
  color: #14110d;
  font-size: 12.5px;
  font-weight: 750;
}
</style>
