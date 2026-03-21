<template>
  <div class="min-h-screen bg-white">
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-[#065fdb] flex items-center justify-center"><Bike class="w-4 h-4 text-white" /></div><span class="text-lg font-black text-gray-900 tracking-tight">Errandr <span class="text-gray-400 font-medium text-sm">Riders</span></span></NuxtLink>
        <div class="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <NuxtLink to="/about" class="hover:text-[#065fdb]">About</NuxtLink><NuxtLink to="/contact" class="hover:text-[#065fdb]">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-[#065fdb]">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-[#065fdb]">Terms</NuxtLink><NuxtLink to="/auth/login" class="text-[#065fdb] font-bold">Sign In</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">About Errandr for Riders</h1>
      <p class="text-lg text-gray-500 mb-10">Earn money between lectures by delivering food and essentials across campus.</p>
      <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
        <p>Errandr for Riders is the delivery arm of the Errandr campus platform. We connect students who want to earn extra income with delivery opportunities right on their university campus. No vehicle required — most campus deliveries are walkable.</p>
        <h2 class="text-xl font-bold text-gray-900 !mt-10">How Riding Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
            <div class="w-10 h-10 bg-[#065fdb]/10 rounded-xl flex items-center justify-center text-[#065fdb] mx-auto mb-3"><Bell class="w-5 h-5" /></div>
            <h3 class="font-bold text-gray-900 text-sm mb-1">Get Notified</h3>
            <p class="text-xs text-gray-500">Receive orders near your current campus location.</p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
            <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mx-auto mb-3"><Package class="w-5 h-5" /></div>
            <h3 class="font-bold text-gray-900 text-sm mb-1">Pick Up</h3>
            <p class="text-xs text-gray-500">Collect the order from the vendor's location.</p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
            <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mx-auto mb-3"><Banknote class="w-5 h-5" /></div>
            <h3 class="font-bold text-gray-900 text-sm mb-1">Earn</h3>
            <p class="text-xs text-gray-500">Deliver to the student and earn delivery fees instantly.</p>
          </div>
        </div>
        <h2 class="text-xl font-bold text-gray-900 !mt-10">Why Ride with Errandr?</h2>
        <ul class="space-y-3 list-none pl-0">
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /><span><strong>Flexible Hours:</strong> Go online when you want, go offline when you need to study. No shifts, no commitments.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /><span><strong>No Vehicle Needed:</strong> Campus deliveries are short — you can walk, bike, or use a skateboard.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /><span><strong>Instant Payouts:</strong> Earnings are available in your Errandr wallet immediately after delivery confirmation.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-[#065fdb] mt-0.5 shrink-0" /><span><strong>Safety First:</strong> All orders are trackable and both riders and students can rate each other, building community trust.</span></li>
        </ul>
        <h2 class="text-xl font-bold text-gray-900 !mt-10">Requirements</h2>
        <p>You must be a currently enrolled student at a supported university. You'll need to verify your student ID during registration. No special equipment is required.</p>
      </div>
    </main>
    <footer class="bg-gray-50 border-t border-gray-200 py-8"><div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium"><p>&copy; {{ new Date().getFullYear() }} Errandr Inc.</p><div class="flex items-center gap-6"><NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { Bike, Bell, Package, Banknote, CheckCircle } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ title: 'About - Errandr Riders', meta: [{ name: 'description', content: 'Learn how to earn money delivering food on campus with Errandr.' }] })
</script>
