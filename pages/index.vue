<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300" :class="{'py-4': !scrolled, 'py-3 shadow-sm': scrolled}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-parentPrimary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-parentPrimary/20">
              <Bike class="w-5 h-5" />
            </div>
            <span class="text-2xl font-black text-parentPrimary tracking-tighter">Errandr <span class="text-gray-400 font-medium text-lg ml-1">For Riders</span></span>
          </div>
          
          <div class="hidden md:flex items-center gap-8">
            <a href="#benefits" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">Benefits</a>
            <a href="#how-it-works" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">How it works</a>
          </div>

          <div class="flex items-center gap-4">
            <NuxtLink to="/auth/login" class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-parentPrimary transition-colors">
              <LogIn class="w-4 h-4" /> Log in
            </NuxtLink>
            <NuxtLink to="/auth/register" class="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Apply Now <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-parentPrimary/10 rounded-full blur-[100px] translate-x-1/3"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <Zap class="w-4 h-4 text-amber-500 fill-amber-500" />
              Now Hiring Campus Riders
            </div>
            <h1 class="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-gray-900">
              Walk to class. <br />
              <span class="text-parentPrimary isolate relative">
                Earn cash.
                <svg class="absolute w-full h-3 -bottom-0 left-0 text-parentPrimary/20 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>
              </span>
            </h1>
            <p class="text-xl text-gray-500 font-medium mb-10 leading-relaxed max-w-lg">
              Deliver food to your fellow students on your way. Be your own boss, choose your hours, and get paid instantly directly to your bank account.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <NuxtLink to="/auth/register" class="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-black transition-all text-center flex items-center justify-center gap-2 group">
                Start Earning Today
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </div>
          
          <div class="relative py-10">
            <div class="relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
               <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=800&fit=crop" alt="Student on campus" class="rounded-[3rem] shadow-2xl object-cover h-[600px] w-full border-8 border-white" />
            </div>
            
            <!-- Floating Elements -->
            <div class="absolute -right-6 top-32 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20 animate-bounce" style="animation-duration: 3.5s;">
              <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                <Banknote class="w-6 h-6" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Payout Complete</p>
                <p class="text-lg font-black text-emerald-600 tracking-tight">+ ₦1,200</p>
              </div>
            </div>

            <div class="absolute -left-10 bottom-24 bg-white p-5 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20 animate-bounce" style="animation-duration: 4.2s;">
              <div class="w-14 h-14 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary shadow-inner">
                 <MapPin class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">New Delivery Request</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">From: Pizza Hut (0.5km)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section id="benefits" class="py-24 bg-gray-50 border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl font-black text-gray-900 tracking-tight mb-4">Why ride with Errandr?</h2>
          <p class="text-gray-500 font-medium text-lg">Designed specifically for students. Work when you want, how you want.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-parentPrimary/30 transition-all group">
            <div class="w-16 h-16 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary mb-6 group-hover:scale-110 transition-transform">
              <Clock class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 tracking-tight">Flexible Hours</h3>
            <p class="text-gray-500 font-medium leading-relaxed">No shifts, no bosses. Turn on the app between classes to accept deliveries and turn it off when you need to study.</p>
          </div>
          
          <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-emerald-300 transition-all group">
            <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <LogOut class="w-8 h-8 transform rotate-90" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 tracking-tight">Instant Withdrawals</h3>
            <p class="text-gray-500 font-medium leading-relaxed">Get paid for every delivery instantly. Withdraw your earnings straight to your bank account with zero waiting period.</p>
          </div>

          <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-blue-300 transition-all group">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <Footprints class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Vehicle Needed</h3>
            <p class="text-gray-500 font-medium leading-relaxed">Most deliveries are within campus boundaries. Walk, skate, or cycle—deliver food using the method that suits you best.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works & CTA -->
    <section id="how-it-works" class="py-24 relative overflow-hidden bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-900 rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl">
          <div class="absolute -top-40 -left-40 w-96 h-96 bg-parentPrimary/20 rounded-full blur-[100px]"></div>
          
          <div class="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto text-white">
            <h2 class="text-4xl md:text-5xl font-black tracking-tighter mb-6">Start earning in 3 simple steps</h2>
            <p class="text-lg text-gray-400 mb-12 font-medium">Signing up is fast and completely free.</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mb-12">
              <div class="flex flex-col items-center">
                <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                   <UserCheck class="w-6 h-6" />
                </div>
                <h4 class="font-bold mb-2">Sign Up</h4>
                <p class="text-sm text-gray-400">Create your account and verify your student ID.</p>
              </div>
              <div class="flex flex-col items-center relative">
                <div class="hidden sm:block absolute top-8 -left-1/2 w-full h-[1px] bg-white/20"></div>
                <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/20 relative z-10">
                   <Wifi class="w-6 h-6" />
                </div>
                <h4 class="font-bold mb-2">Go Online</h4>
                <p class="text-sm text-gray-400">Open the app whenever you are free and accept orders.</p>
              </div>
              <div class="flex flex-col items-center relative">
                <div class="hidden sm:block absolute top-8 -left-1/2 w-full h-[1px] bg-white/20"></div>
                <div class="w-16 h-16 rounded-2xl bg-parentPrimary flex items-center justify-center mb-4 border border-parentPrimary relative z-10 shadow-lg shadow-parentPrimary/50 text-white">
                   <Banknote class="w-6 h-6" />
                </div>
                <h4 class="font-bold mb-2 text-parentPrimary">Get Paid</h4>
                <p class="text-sm text-gray-400">Deliver the food and get your money instantly.</p>
              </div>
            </div>

            <NuxtLink to="/auth/register" class="inline-flex items-center justify-center px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 transition-all group">
              Apply to Ride
              <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

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
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><NuxtLink to="/about" class="hover:text-parentPrimary transition-colors">About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-parentPrimary transition-colors">Rider Support</NuxtLink></li>
              <li><NuxtLink to="/faq" class="hover:text-parentPrimary transition-colors">FAQ</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Rider Agreement</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Privacy Policy</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Errandr Network</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="http://student.localhost:3000" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Utensils class="w-4 h-4" /> Order Food</a></li>
              <li><a href="http://vendor.localhost:3000" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Store class="w-4 h-4" /> Open a Store</a></li>
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
import { 
  ArrowRight, LogIn, Bike, MapPin, Banknote, Zap, 
  Clock, Footprints, LogOut, UserCheck, Wifi, Utensils, Store
} from 'lucide-vue-next'

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
