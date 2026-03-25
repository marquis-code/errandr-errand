<template>
 <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
 <!-- Navbar -->
 <nav class="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300" :class="{'py-4': !scrolled, 'py-3 shadow-sm': scrolled}">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="flex justify-between items-center">
  <div class="flex items-center gap-4 group cursor-pointer" @click="router.push('/')">
  <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  <span class="text-2xl font-black text-parentPrimary tracking-tighter">For Riders</span>
  </div>
 
 <div class="hidden md:flex items-center gap-8">
 <a href="#benefits" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">Benefits</a>
 <a href="#how-it-works" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">How it works</a>
 </div>

 <div class="flex items-center gap-4">
 <template v-if="!isLoggedIn">
 <NuxtLink to="/auth/login" class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-parentPrimary transition-colors">
 <LogIn class="w-4 h-4" /> Log in
 </NuxtLink>
 <NuxtLink to="/auth/register" class="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
 Apply Now <ArrowRight class="w-4 h-4" />
 </NuxtLink>
 </template>
 <template v-else>
 <NuxtLink to="/dashboard" class="px-6 py-2.5 bg-[#065fdb] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#065fdb]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
 Go to Dashboard <ArrowRight class="w-4 h-4" />
 </NuxtLink>
 </template>
 </div>
 </div>
 </div>
 </nav>

 <!-- Hero Section -->
 <section class="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden bg-white">
  <div class="absolute inset-0 z-0">
  <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-parentPrimary/5 rounded-full blur-[120px] translate-x-1/4"></div>
  <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4"></div>
  </div>
  
  <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
  <div class="max-w-2xl">
  <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-parentPrimary/5 border border-parentPrimary/10 text-parentPrimary text-[11px] font-black tracking-widest uppercase mb-10 shadow-sm">
  <Zap class="w-4 h-4 text-parentPrimary animate-pulse" />
  Join 1,000+ Campus Riders
  </div>
  <h1 class="text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] mb-10 text-gray-900">
  Walk to class. <br />
  <span class="text-parentPrimary relative inline-block">
  Earn cash.
  <svg class="absolute -bottom-2 left-0 w-full h-4 text-parentPrimary/20" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/></svg>
  </span>
  </h1>
  <p class="text-lg text-gray-500 font-bold mb-6 leading-relaxed max-w-lg">
  Turn your daily commute into a high-yield side hustle. Deliver food on your way to lectures and get paid instantly.
  </p>
  
  <div class="flex flex-col sm:flex-row items-center gap-6">
  <NuxtLink :to="isLoggedIn ? '/dashboard' : '/auth/register'" class="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-parentPrimary transition-all text-center flex items-center justify-center gap-3 group active:scale-95">
  {{ isLoggedIn ? 'Go to Dashboard' : 'Start Earning Today' }}
  <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
  </NuxtLink>
  </div>
  </div>
  
  <div class="relative py-10 lg:py-0">
  <div class="absolute -inset-10 bg-parentPrimary/10 blur-[100px] rounded-full animate-pulse-slow"></div>
  <div class="relative z-10 transform perspective-[1000px] -rotate-y-3 hover:rotate-0 transition-all duration-1000 group">
  <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=1000&fit=crop" alt="Student on campus" class="rounded-[4rem] shadow-[0_48px_96px_-16px_rgba(0,0,0,0.15)] object-cover h-[700px] w-full border-8 border-white" />
  
  <!-- Earnings Overlay -->
  <div class="absolute -right-12 top-1/4 bg-white/90 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 max-w-[280px] z-20 animate-float">
  <div class="flex items-center gap-5 mb-6">
  <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-100/50">
  <Banknote class="w-7 h-7" />
  </div>
  <div>
  <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Instant Payout</p>
  <p class="text-2xl font-black text-emerald-600 tracking-tight">+ ₦1,200</p>
  </div>
  </div>
  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4">Direct to Bank Account</p>
  </div>

  <!-- Delivery Alert -->
  <div class="absolute -left-12 bottom-24 bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-[320px] z-20 animate-float-slow">
  <div class="flex items-center gap-5 mb-6">
  <div class="w-16 h-16 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary shadow-xl border border-parentPrimary/20">
  <MapPin class="w-8 h-8" />
  </div>
  <div>
  <p class="text-base font-black text-white leading-tight">New Request Available</p>
  <p class="text-[10px] font-black text-parentPrimary uppercase tracking-widest mt-1.5">Pizza Hut • 0.5km away</p>
  </div>
  </div>
  <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
  <div class="bg-parentPrimary h-full w-2/3 animate-progress"></div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </section>
  <section id="benefits" class="py-32 bg-gray-50 border-y border-gray-100">
  <div class="max-w-7xl mx-auto px-6 sm:px-10">
  <div class="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
  <div class="max-w-2xl">
  <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-parentPrimary/5 border border-parentPrimary/10 text-parentPrimary text-[11px] font-black tracking-widest uppercase mb-8 shadow-sm">
  Student First
  </div>
  <h2 class="text-5xl font-black text-gray-900 tracking-tighter leading-tight">Why ride with <span class="text-parentPrimary">Errandr?</span></h2>
  </div>
  <p class="text-gray-500 font-bold text-lg max-w-sm mb-2">Designed specifically for student life. Work when you want, how you want, wherever you are.</p>
  </div>
 
  <div class="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
  <div class="group bg-white p-12 rounded-[3.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-parentPrimary/30 transition-all duration-500 hover:-translate-y-2">
  <div class="w-20 h-20 bg-parentPrimary/10 rounded-3xl flex items-center justify-center text-parentPrimary border border-parentPrimary/20 mb-10 group-hover:scale-110 group-hover:bg-parentPrimary group-hover:text-white transition-all duration-500 shadow-xl shadow-parentPrimary/5">
  <Clock class="w-10 h-10" />
  </div>
  <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-5">Ultra-Flexible Hours</h3>
  <p class="text-gray-500 font-bold leading-relaxed">No shifts, no bosses. Turn on the app between classes to accept deliveries and turn it off when you need to study or relax.</p>
  </div>
  
  <div class="group bg-white p-12 rounded-[3.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2">
  <div class="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 border border-emerald-100 mb-10 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-emerald-500/5">
  <Banknote class="w-10 h-10" />
  </div>
  <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-5">Instant Withdrawals</h3>
  <p class="text-gray-500 font-bold leading-relaxed">Get paid for every delivery instantly. Withdraw your earnings straight to your bank account with zero waiting period. Real cash, real fast.</p>
  </div>
 
  <div class="group bg-white p-12 rounded-[3.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2">
  <div class="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-parentPrimary border border-parentPrimary/10 mb-10 group-hover:scale-110 group-hover:bg-parentPrimary group-hover:text-white transition-all duration-500 shadow-xl shadow-parentPrimary/5">
  <Footprints class="w-10 h-10" />
  </div>
  <h3 class="text-2xl font-black text-gray-900 tracking-tight mb-5">Zero Vehicle Required</h3>
  <p class="text-gray-500 font-bold leading-relaxed">Most deliveries are within campus boundaries. Walk, skate, or cycle—deliver food using the method that suits your campus rhythm best.</p>
  </div>
  </div>
  </div>
  </section>
  <section id="how-it-works" class="py-20 relative overflow-hidden bg-white">
  <div class="max-w-7xl mx-auto px-6 sm:px-10">
  <div class="bg-gray-900 rounded-[3rem] p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-3xl">
  <!-- Dynamic Glows -->
  <div class="absolute -top-40 -left-20 w-[600px] h-[600px] bg-parentPrimary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
  <div class="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow opacity-30"></div>
  
  <div class="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto text-white">
  <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-parentPrimary text-xs font-black tracking-widest uppercase mb-8 shadow-inner">
  <Sparkles class="w-4 h-4" />
  Faster than a Lecture
  </div>
  <h2 class="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.95]">Start earning in <br /><span class="text-parentPrimary">3 minutes.</span></h2>
  <p class="text-xl text-gray-400 mb-12 font-bold max-w-2xl leading-relaxed">The fastest onboarding on campus. No paperwork, just profits.</p>
 
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-16 lg:gap-24 w-full mb-24">
  <div class="flex flex-col items-center group/item">
  <div class="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover/item:bg-parentPrimary group-hover/item:border-parentPrimary group-hover/item:scale-110 transition-all duration-500 shadow-2xl">
  <UserCheck class="w-10 h-10 group-hover/item:text-white transition-colors" />
  </div>
  <h4 class="text-xl font-black mb-4 tracking-tight">Express Sign-Up</h4>
  <p class="text-sm text-gray-500 font-bold leading-relaxed px-4">Create your account and snap a photo of your student ID.</p>
  </div>
  <div class="flex flex-col items-center relative group/item">
  <div class="hidden sm:block absolute top-12 -left-1/2 w-full h-[2px] bg-white/5"></div>
  <div class="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover/item:bg-parentPrimary group-hover/item:border-parentPrimary group-hover/item:scale-110 transition-all duration-500 shadow-2xl relative z-10">
  <Wifi class="w-10 h-10 group-hover/item:text-white transition-colors" />
  </div>
  <h4 class="text-xl font-black mb-4 tracking-tight">Go Online</h4>
  <p class="text-sm text-gray-500 font-bold leading-relaxed px-4">Toggle live status whenever you're walking between classes.</p>
  </div>
  <div class="flex flex-col items-center relative group/item">
  <div class="hidden sm:block absolute top-12 -left-1/2 w-full h-[2px] bg-white/5"></div>
  <div class="w-24 h-24 rounded-[2rem] bg-parentPrimary flex items-center justify-center mb-8 border border-parentPrimary relative z-10 shadow-2xl shadow-parentPrimary/20 text-white group-hover/item:scale-110 transition-all duration-500">
  <TrendingUp class="w-10 h-10" />
  </div>
  <h4 class="text-xl font-black mb-4 tracking-tight text-white">Bank Profits</h4>
  <p class="text-sm text-gray-500 font-bold leading-relaxed px-4">Deliver the meal and see the balance hit your dashboard instantly.</p>
  </div>
  </div>
 
  <NuxtLink to="/auth/register" class="group inline-flex items-center justify-center px-16 py-8 bg-white text-gray-900 rounded-[2.5rem] font-black text-xl shadow-[0_32px_64px_-16px_rgba(255,255,255,0.1)] hover:bg-parentPrimary hover:text-white transition-all transform hover:-translate-y-2 active:scale-95 uppercase tracking-widest">
  Launch My Career
  <ArrowRight class="w-7 h-7 ml-4 group-hover:translate-x-3 transition-transform" />
  </NuxtLink>
  </div>
  </div>
  </div>
  </section>
tion>

 <!-- Footer -->
 <footer class="bg-gray-50 border-t border-gray-200 py-16">
 <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
 <div class="md:col-span-1">
 <div class="flex items-center gap-2 mb-6">
 <div class="w-8 h-8 bg-parentPrimary rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
 <Bike class="w-4 h-4" />
 </div>
 <span class="text-xl font-black text-parentPrimary tracking-tighter">Errandr Riders</span>
 </div>
 <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">Join thousands of students earning extra cash simply by walking to class. </p>
 </div>
 
 <div>
 <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-xs">Platform</h4>
 <ul class="space-y-4 text-sm font-medium text-gray-500">
 <li><NuxtLink to="/about" class="hover:text-parentPrimary transition-colors">About Us</NuxtLink></li>
 <li><NuxtLink to="/contact" class="hover:text-parentPrimary transition-colors">Rider Support</NuxtLink></li>
 <li><NuxtLink to="/faq" class="hover:text-parentPrimary transition-colors">FAQ</NuxtLink></li>
 </ul>
 </div>

 <div>
 <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-xs">Legal</h4>
 <ul class="space-y-4 text-sm font-medium text-gray-500">
 <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Rider Agreement</NuxtLink></li>
 <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Privacy Policy</NuxtLink></li>
 </ul>
 </div>
 
 <div>
 <h4 class="font-bold text-gray-900 mb-6 tracking-wider text-xs">Errandr Network</h4>
 <ul class="space-y-4 text-sm font-medium text-gray-500">
 <li><a href="http://errandr.shop" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Utensils class="w-4 h-4" /> Order Food</a></li>
 <li><a href="http://vendor.errandr.shop" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Store class="w-4 h-4" /> Open a Store</a></li>
 </ul>
 </div>
 </div>
 
 <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
 <p class="text-sm font-medium text-gray-400">
 &copy; {{ new Date().getFullYear() }} Errandr Inc. All rights reserved. For Riders.
 </p>
 </div>
 </div>
 </footer>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { 
 ArrowRight, LogIn, Bike, MapPin, Banknote, Zap, 
 Clock, Navigation, LogOut, UserCheck, Wifi, Utensils, Store,
 Repeat, ShieldCheck, History
} from 'lucide-vue-next'

const { isLoggedIn } = useUser()
const router = useRouter()

definePageMeta({
 layout: false
})

useHead({
 title: 'Errandr for Riders | Earn Money on Campus',
 meta: [
 { name: 'description', content: 'Deliver food to fellow students and earn money on your own schedule. Join Errandr as a campus rider today.' }
 ]
})

const scrolled = ref(false)

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
