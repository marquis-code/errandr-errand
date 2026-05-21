<template>
  <div class="relative min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-b from-slate-50/80 via-white to-white overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>
    <!-- Left Side: Image Panel -->
    <div class="hidden md:block w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=1600&fit=crop" alt="Campus life students" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#FF5C1A]/80 via-[#FF5C1A]/70 to-black/80"></div>
      <div class="relative z-10 flex flex-col justify-between h-full p-12 lg:p-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <Bike class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-black text-white tracking-tighter">Errandr</span>
        </div>
        <div class="max-w-md">
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Earn money. Set your own hours.</h2>
          <p class="text-white/70 text-lg font-medium leading-relaxed">Register as a campus rider and start earning from deliveries between lectures.</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10 overflow-y-auto">
      <transition name="fade" mode="out-in">
        <div v-if="!showSuccess" class="w-full max-w-md mx-auto">
          <div class="mb-10">
        <div class="flex items-center gap-2 mb-6 md:hidden">
          <div class="w-8 h-8 rounded-lg bg-[#FF5C1A] flex items-center justify-center"><Bike class="w-4 h-4 text-white" /></div>
          <span class="text-xl font-bold text-gray-900 tracking-tight">Errandr</span>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Become a Rider</h1>
        <p class="text-gray-500 text-lg">Create your account and start delivering</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5 max-w-md">
        <div class="grid grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.firstName" type="text" label="First Name" required />
          <UiAnimatedInput v-model="form.lastName" type="text" label="Last Name" required />
        </div>
        <UiAnimatedInput v-model="form.email" type="email" label="Email" required />
        <UiAnimatedInput v-model="form.phone" type="tel" label="Phone Number" />
        <UiAnimatedInput v-model="form.password" type="password" label="Password" required minlength="6" />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-3 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#FF5C1A]/20 mt-4">
          <Loader2 v-if="loading" class="animate-spin w-6 h-6" />
          {{ loading ? 'Applying...' : 'Apply to Ride' }}
        </button>

        <p class="text-center text-gray-600 font-medium">
          Already have an account? <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in</NuxtLink>
        </p>
      </form>

      <div class="mt-12 pt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 font-medium border-t border-gray-50">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
          </div>
        </div>

        <!-- Success Modal -->
        <div v-else class="w-full flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] bg-white rounded-[2rem] relative z-20 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(255,92,26,0.1)] p-8 max-w-md mx-auto">
          <div class="relative w-28 h-28 flex items-center justify-center mb-4">
            <div class="absolute inset-0 bg-[#FF5C1A]/10 rounded-full animate-ping" style="animation-duration: 2s;"></div>
            <div class="absolute inset-2 bg-[#FF5C1A]/20 rounded-full animate-ping" style="animation-duration: 2s; animation-delay: 0.5s;"></div>
            <div class="w-24 h-24 bg-gradient-to-br from-[#FF5C1A] to-[#FFA785] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#FF5C1A]/40 relative z-10 animate-bounce">
              <Check class="w-12 h-12" stroke-width="3" />
            </div>
          </div>
          
          <div class="space-y-3">
            <h2 class="text-3xl font-black text-gray-900 tracking-tight">Welcome to the fleet! 🎉</h2>
            <div class="relative">
              <p class="text-gray-500 font-medium leading-relaxed max-w-[300px] mx-auto text-[15px]">
                You're officially a campus rider. Get ready to hit the road and start earning! 🚀
              </p>
            </div>
          </div>

          <div class="w-full pt-8 mt-auto">
            <button @click="proceedToDashboard" class="w-full py-4.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-2xl font-black text-[17px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#FF5C1A]/25 active:scale-[0.98] group">
              Proceed to Dashboard <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Bike, ArrowRight, Check } from 'lucide-vue-next'
import { ref, reactive, nextTick } from 'vue'
import confetti from 'canvas-confetti'
import { useAuth } from '@/composables/modules/auth'
definePageMeta({ layout: false })
const { register, loading } = useAuth()
const error = ref('')
const showSuccess = ref(false)
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'errander' })

const handleRegister = async () => {
  error.value = ''
  try { 
    await register(form, { redirect: false }) 
    showSuccess.value = true
    nextTick(() => {
      triggerConfetti()
    })
  }
  catch (e: any) { error.value = e.data?.message || 'Registration failed' }
}

const triggerConfetti = () => {
  const duration = 3500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.6 },
      colors: ['#FF5C1A', '#FFA785', '#FFF', '#FFD700', '#FF69B4']
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.6 },
      colors: ['#FF5C1A', '#FFA785', '#FFF', '#FFD700', '#FF69B4']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

const proceedToDashboard = () => {
  navigateTo('/dashboard')
}

useHead({ title: 'Become a Rider - Errandr' })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
