<template>
  <nav class="fixed w-full z-50 transition-all duration-500" :class="navClasses">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer group" @click="router.push('/')">
          <div class="relative">
            <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-9 w-auto object-contain transition-all duration-500 group-hover:scale-110" />
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-sm font-black tracking-tight leading-none" :class="scrolled ? 'text-gray-900' : 'text-white'">Errandr</span>
            <span class="text-[9px] font-bold uppercase tracking-[0.25em]" :class="scrolled ? 'text-parentPrimary' : 'text-white/60'">Dispatch</span>
          </div>
        </div>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center">
          <div class="flex items-center gap-1 p-1 rounded-2xl" :class="scrolled ? 'bg-gray-100' : 'bg-white/10 backdrop-blur-sm'">
            <a href="#benefits" class="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-white/20" :class="scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' : 'text-white/80 hover:text-white'">Benefits</a>
            <a href="#how-it-works" class="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-white/20" :class="scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' : 'text-white/80 hover:text-white'">How it works</a>
            <a href="#earnings" class="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-white/20" :class="scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-200' : 'text-white/80 hover:text-white'">Earnings</a>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <template v-if="!isLoggedIn">
            <NuxtLink to="/auth/login" class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all" :class="scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'">
              <LogIn class="w-3.5 h-3.5" /> Sign in
            </NuxtLink>
            <NuxtLink to="/auth/register" class="group relative px-5 py-2.5 bg-parentPrimary text-white text-xs font-black rounded-xl overflow-hidden shadow-lg shadow-parentPrimary/25 hover:shadow-xl hover:shadow-parentPrimary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <span class="relative z-10">Apply Now</span>
              <ArrowRight class="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div class="absolute inset-0 bg-gradient-to-r from-parentPrimary to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/dashboard" class="group px-5 py-2.5 bg-parentPrimary text-white text-xs font-black rounded-xl shadow-lg shadow-parentPrimary/25 hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Dashboard <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </template>

          <!-- Mobile Menu Toggle -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-xl transition-colors" :class="scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'">
            <component :is="mobileOpen ? X : Menu" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileOpen" class="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl">
        <div class="px-6 py-6 space-y-2">
          <a href="#benefits" @click="mobileOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-parentPrimary/5 hover:text-parentPrimary transition-colors">
            <Sparkles class="w-4 h-4 text-parentPrimary" /> Benefits
          </a>
          <a href="#how-it-works" @click="mobileOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-parentPrimary/5 hover:text-parentPrimary transition-colors">
            <Zap class="w-4 h-4 text-parentPrimary" /> How it works
          </a>
          <a href="#earnings" @click="mobileOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-parentPrimary/5 hover:text-parentPrimary transition-colors">
            <TrendingUp class="w-4 h-4 text-parentPrimary" /> Earnings
          </a>
          <div class="pt-4 border-t border-gray-100 space-y-2">
            <NuxtLink v-if="!isLoggedIn" to="/auth/login" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
              <LogIn class="w-4 h-4" /> Sign in
            </NuxtLink>
            <NuxtLink :to="isLoggedIn ? '/dashboard' : '/auth/register'" class="flex items-center justify-center gap-2 px-4 py-3 bg-parentPrimary text-white rounded-xl text-sm font-black shadow-lg shadow-parentPrimary/20">
              {{ isLoggedIn ? 'Go to Dashboard' : 'Apply Now' }} <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/modules/auth/user'
import { LogIn, ArrowRight, Menu, X, Sparkles, Zap, TrendingUp } from 'lucide-vue-next'

const { isLoggedIn } = useUser()
const router = useRouter()

const scrolled = ref(false)
const mobileOpen = ref(false)

const navClasses = computed(() => {
  if (scrolled.value) {
    return 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
  }
  return 'bg-transparent'
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
