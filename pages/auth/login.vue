<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
    <!-- Left Side: Image Panel -->
    <div class="hidden md:block w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=1600&fit=crop" alt="Campus delivery rider" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#065fdb]/80 via-[#065fdb]/70 to-black/80"></div>
      <div class="relative z-10 flex flex-col justify-between h-full p-12 lg:p-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <Bike class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-black text-white tracking-tighter">Errandr</span>
        </div>
        <div class="max-w-md">
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Walk to class. Get paid on arrival.</h2>
          <p class="text-white/70 text-lg font-medium leading-relaxed">Sign in to view your deliveries, earnings, and payout history.</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10">
      <div class="mb-12">
        <div class="flex items-center gap-2 mb-8 md:hidden">
          <div class="w-8 h-8 rounded-lg bg-[#065fdb] flex items-center justify-center"><Bike class="w-4 h-4 text-white" /></div>
          <span class="text-xl font-bold text-gray-900 tracking-tight">Errandr</span>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Rider Login</h1>
        <p class="text-gray-500 text-lg">Sign in to accept deliveries and track earnings</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 max-w-md">
        <UiAnimatedInput v-model="email" type="email" label="Email" required />
        <UiAnimatedInput v-model="password" type="password" label="Password" required />
        <div class="flex items-center justify-between">
          <NuxtLink to="/auth/forgot-password" class="text-sm font-semibold text-[#065fdb] hover:underline">Forgot your password?</NuxtLink>
        </div>

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-3 bg-[#065fdb] hover:bg-[#054ec0] text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#065fdb]/20">
          <Loader2 v-if="loading" class="animate-spin w-6 h-6" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="text-center text-gray-600 font-medium mt-8">
          Want to become a rider? <NuxtLink to="/auth/register" class="text-[#065fdb] font-bold hover:underline">Apply Now</NuxtLink>
        </p>
      </form>

      <div class="mt-auto pt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Bike } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuth } from '@/composables/modules/auth'
definePageMeta({ layout: false })
const { login, loading } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const handleLogin = async () => {
  error.value = ''
  try { await login({ email: email.value, password: password.value }) }
  catch (e: any) { error.value = e.data?.message || 'Invalid credentials' }
}
useHead({ title: 'Rider Sign In - Errandr' })
</script>
