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
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Rider Agreement</h1>
      <p class="text-sm text-gray-400 mb-10">Last updated: January 15, 2026</p>
      <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-8">
        <section>
          <h2 class="text-xl font-bold text-gray-900">1. Independent Contractor Status</h2>
          <p>Riders on the Errandr platform are independent contractors, not employees of Errandr Technologies Ltd. You control when, where, and how you deliver. You are free to accept or decline any delivery request without penalty.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">2. Eligibility</h2>
          <p>To deliver on Errandr, you must be at least 16 years of age and currently enrolled as a student at a supported university. You agree to provide accurate identification documents and student verification during the registration process.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">3. Delivery Standards</h2>
          <p>You agree to handle all deliveries with care, ensuring food items are delivered in the same condition as received from the vendor. Tampering with any order content is strictly prohibited and will result in immediate, permanent removal from the platform.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">4. Compensation</h2>
          <p>Riders receive the delivery fee associated with each completed delivery. Fees are credited to your Errandr wallet immediately upon delivery confirmation. You may withdraw earnings to your linked bank account at any time. Errandr does not deduct commissions from rider delivery fees.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">5. Conduct & Safety</h2>
          <p>You agree to conduct yourself professionally at all times while making deliveries. This includes following all campus rules and regulations, treating students and vendors with respect, and prioritizing safety. Harassment, intimidation, or threatening behavior of any kind will result in permanent account suspension.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">6. Insurance & Liability</h2>
          <p>Errandr does not provide insurance for riders. You are responsible for your own safety during deliveries. Errandr is not liable for accidents, injuries, or losses incurred during delivery activities.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">7. Termination</h2>
          <p>Either party may terminate this agreement at any time. Errandr reserves the right to immediately suspend or terminate a rider account for violations of these terms, including but not limited to: order tampering, harassment, repeated complaints, or fraudulent activity. Outstanding earnings will be paid within 7 business days of termination.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">8. Contact</h2>
          <p>For questions about this agreement, please contact <a href="mailto:legal@errandr.com" class="text-[#065fdb] font-bold hover:underline">legal@errandr.com</a>.</p>
        </section>
      </div>
    </main>
    <footer class="bg-gray-50 border-t border-gray-200 py-8"><div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium"><p>&copy; {{ new Date().getFullYear() }} Errandr Inc.</p><div class="flex items-center gap-6"><NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { Bike } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ title: 'Rider Agreement - Errandr' })
</script>
