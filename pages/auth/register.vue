<template>
  <div class="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    <div class="w-full max-w-[500px] relative z-10">
      
      <!-- Back to Login -->
      <!-- <NuxtLink v-if="!showSuccess" to="/auth/login" class="absolute -top-12 left-0 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to login
      </NuxtLink> -->

        <div class="w-full">
          <!-- Header -->
          <div class="text-center space-y-3 mb-8">
                    <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
          </div>
            <h1 class="text-3xl font-medium text-gray-900 tracking-tight mb-2">Become an Errand Ninja! 🥷</h1>
            <p class="text-gray-500 font-medium text-sm">Create your account and start delivering</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <UiAnimatedInput v-model="form.firstName" type="text" label="First Name" required />
              <UiAnimatedInput v-model="form.lastName" type="text" label="Last Name" required />
            </div>
            <UiAnimatedInput v-model="form.email" type="email" label="Email Address" required />
            <UiAnimatedInput v-model="form.phone" type="tel" label="Phone Number" />
            <UiAnimatedInput v-model="form.password" type="password" label="Password" required minlength="6" />
            <UiAnimatedInput v-model="form.referredBy" type="text" label="Referral Code (Optional)" @input="formatReferralCode" />

            <transition name="fade">
              <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-bold text-red-600">
                <AlertCircle class="w-4 h-4 shrink-0" />
                {{ error }}
              </div>
            </transition>

            <button type="submit" :disabled="loading || validatingReferral"
              class="w-full py-3 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-2xl font-medium text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-[#FF5C1A]/20 active:scale-[0.98] group mt-4">
              <Loader2 v-if="loading || validatingReferral" class="animate-spin w-5 h-5" />
              <span v-else>Apply to Ride</span>
              <ArrowRight v-if="!loading && !validatingReferral" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p class="text-center text-gray-500 text-sm font-medium mt-6">
              Already have an account? <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in</NuxtLink>
            </p>
          </form>
          
          <div class="mt-8 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400 border-t border-gray-100 pt-8">
            <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <NuxtLink to="/terms" class="hover:text-gray-600 transition-colors">Terms & Privacy</NuxtLink>
          </div>
          </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { ref, reactive, watch } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })
useHead({ title: 'Become a Rider - Errandr' })

const { register, loading } = useAuth()
const error = ref('')
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'errander', referredBy: '' })


const validatingReferral = ref(false)

const formatReferralCode = () => {
  if (!form.referredBy) return;
  let val = form.referredBy;
  let formatted = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (formatted.startsWith('ERR-')) {
    formatted = formatted.substring(4);
  } else if (formatted.startsWith('ERR')) {
    formatted = formatted.substring(3);
  } else if (formatted.startsWith('ER')) {
    formatted = formatted.substring(2);
  } else if (formatted.startsWith('E')) {
    formatted = formatted.substring(1);
  }
  
  if (formatted.length > 0) {
    form.referredBy = 'ERR-' + formatted.replace(/-/g, '');
  } else if (val.length > 0 && !['ERR', 'ER', 'E'].includes(val.toUpperCase())) {
     form.referredBy = 'ERR-';
  } else {
    form.referredBy = val.toUpperCase();
  }
}

const handleRegister = async () => {
  error.value = ''
  if (form.referredBy) {
    validatingReferral.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get(`/referrals/validate-code/${form.referredBy}`);
      if (res?.data?.type === 'ERROR' || res?.type === 'ERROR') throw res;
    } catch (e: any) {
       error.value = e?.response?.data?.message || e?.data?.message || 'Invalid referral code';
       return;
    } finally {
      validatingReferral.value = false
    }
  }
  try { 
    await register(form, { redirect: false }) 
    navigateTo(`/auth/verify-email?email=${encodeURIComponent(form.email)}`)
  }
  catch (e: any) { error.value = e.data?.message || 'Registration failed' }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
