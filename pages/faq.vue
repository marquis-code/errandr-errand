<template>
  <div class="min-h-screen bg-white">
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-[#065fdb] flex items-center justify-center"><Bike class="w-4 h-4 text-white" /></div><span class="text-lg font-black text-gray-900 tracking-tight">Errandr <span class="text-gray-400 font-medium text-sm">Riders</span></span></NuxtLink>
        <div class="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <NuxtLink to="/about" class="hover:text-[#065fdb]">About</NuxtLink><NuxtLink to="/contact" class="hover:text-[#065fdb]">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-[#065fdb]">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-[#065fdb]">Terms</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Rider FAQ</h1>
      <p class="text-lg text-gray-500 mb-10">Common questions about delivering with Errandr.</p>
      <div class="space-y-6">
        <div v-for="(faq, i) in faqs" :key="i" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          <button @click="openIndex = openIndex === i ? -1 : i" class="w-full flex items-center justify-between p-6 text-left">
            <span class="font-bold text-gray-900">{{ faq.q }}</span>
            <ChevronDown class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': openIndex === i }" />
          </button>
          <div v-show="openIndex === i" class="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{{ faq.a }}</div>
        </div>
      </div>
    </main>
    <footer class="bg-gray-50 border-t border-gray-200 py-8"><div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium"><p>&copy; {{ new Date().getFullYear() }} Errandr Inc.</p><div class="flex items-center gap-6"><NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { Bike, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'
definePageMeta({ layout: false })
useHead({ title: 'FAQ - Errandr Riders' })
const openIndex = ref(0)
const faqs = [
  { q: 'How do I become a rider?', a: 'Create an account on the Errandr Riders portal, complete your profile with your student details, and upload a valid student ID. Our team will verify your identity within 24 hours. Once approved, you can start accepting deliveries immediately.' },
  { q: 'Do I need a bike or vehicle?', a: 'No. Most campus deliveries are within walking distance. You can use a bicycle, skateboard, or simply walk. The important thing is delivering orders promptly and in good condition.' },
  { q: 'How much can I earn?', a: 'Earnings vary based on how many deliveries you complete and the delivery fees set by vendors. Most active riders earn between ₦5,000 and ₦15,000 per week during peak meal times. Bonus incentives are offered during high-demand periods.' },
  { q: 'When do I get paid?', a: 'Delivery fees are credited to your Errandr wallet instantly after each delivery is confirmed. You can withdraw to your bank account at any time — there is no minimum withdrawal amount.' },
  { q: 'Can I choose which orders to accept?', a: 'Yes! You have full control over which orders you accept. When an order is available, you will see the pickup location, drop-off location, and delivery fee before deciding.' },
  { q: 'What if the vendor takes too long to prepare the order?', a: 'If you have been waiting for more than 15 minutes past the estimated preparation time, you can report it through the app. You will not be penalized for vendor delays.' },
  { q: 'What happens if a student is unavailable at delivery?', a: 'Attempt to contact the student via the in-app chat. If they do not respond within 10 minutes, mark the order as "Customer Unavailable." You will still receive your delivery fee.' },
  { q: 'Can I ride on multiple campuses?', a: 'Yes, if Errandr is active on multiple campuses near you. Simply toggle between campuses from your app settings to start receiving orders at a different campus.' },
]
</script>
