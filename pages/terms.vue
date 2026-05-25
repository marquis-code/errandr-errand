<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">


    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden bg-gray-50/30">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-parentPrimary/5 rounded-full blur-[120px] translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-100 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-8 shadow-sm">
          <ShieldCheck class="w-3.5 h-3.5 text-parentPrimary" />
          Rider Agreement
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          Dispatch <span class="text-parentPrimary italic">Mandate.</span>
        </h1>
        <p class="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase">Last updated: January 26, 2026</p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-24 bg-white">
      <div class="max-w-4xl mx-auto px-6 sm:px-10">
        <div class="space-y-16">
          <div v-for="(section, index) in termsSections" :key="index" class="group">
            <div class="flex gap-8">
              <span class="text-4xl font-medium text-parentPrimary/10 group-hover:text-parentPrimary/20 transition-colors tabular-nums">
                {{ (index + 1).toString().padStart(2, '0') }}
              </span>
              <div class="space-y-4 text-left">
                <h2 class="text-2xl font-medium text-gray-900 tracking-tight">{{ section.title }}</h2>
                <div class="text-lg text-gray-500 font-bold leading-relaxed tracking-tight" v-html="section.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
definePageMeta({ layout: 'landing' })
useHead({ 
  title: 'Rider Agreement - Errandr Dispatch',
  meta: [{ name: 'description', content: 'Legal framework and safety guidelines for student dispatchers on the Errandr campus platform.' }] 
})

const termsSections = [
  {
    title: "Independent Contractor",
    content: "Riders are independent contractors. You have total autonomy over when, where, and how you deliver. Accept or decline requests freely without penalty."
  },
  {
    title: "Student Verification",
    content: "Must be 16+ and currently enrolled at a supported university (starting with CMUL). ID verification is mandatory for platform access."
  },
  {
    title: "Service Integrity",
    content: "Handle every order with absolute care. Tampering with contents or unauthorized delays will result in immediate, permanent account termination."
  },
  {
    title: "Compensation Flow",
    content: "Earnings are credited to your Errandr wallet immediately upon delivery. Withdraw to bank accounts anytime. No commissions are deducted from rider fees."
  },
  {
    title: "Safety & Conduct",
    content: "Adhere to campus regulations and maintain professional conduct with students and vendors. Safety is the highest priority during transit."
  },
  {
    title: "Liability Clause",
    content: "Errandr does not provide insurance. Riders are responsible for their own safety and equipment while fulfilling delivery requests on campus."
  },
  {
    title: "Agreement Termination",
    content: "Either party may terminate at any time. Violations of safety or fraud result in instant suspension. Final earnings are cleared within 7 business days."
  },
  {
    title: "Legal Support",
    content: "For agreement disputes or legal support, reach out to our team at <a href='mailto:legal@errandr.shop' class='text-parentPrimary hover:underline uppercase tracking-widest'>legal@errandr.shop</a>."
  }
]
</script>

