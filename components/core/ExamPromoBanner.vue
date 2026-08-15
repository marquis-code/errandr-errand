<template>
  <div v-if="bannerData && bannerData.enabled" class="bg-indigo-600 text-white overflow-hidden py-2 relative z-50 shadow-sm border-b border-indigo-700">
    <div class="marquee-container flex whitespace-nowrap">
      <div class="marquee-content flex items-center gap-8 animate-marquee text-sm font-bold tracking-wide">
        <span class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-yellow-300" />
          {{ bannerData.text }}
          <Sparkles class="w-4 h-4 text-yellow-300" />
        </span>
        <span class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-yellow-300" />
          {{ bannerData.text }}
          <Sparkles class="w-4 h-4 text-yellow-300" />
        </span>
        <span class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-yellow-300" />
          {{ bannerData.text }}
          <Sparkles class="w-4 h-4 text-yellow-300" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import { useNuxtApp } from '#imports'

const bannerData = ref<{ enabled: boolean, text: string } | null>(null)

onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const baseUrl = (config.public.apiBase as string) || 'https://api.erranders.org'
    const cleanBaseUrl = baseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
    
    const response = await fetch(`${cleanBaseUrl}/api/v1/settings/exam-promo/public`)
    if (response.ok) {
      bannerData.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load exam promo banner settings:', error)
  }
})
</script>

<style scoped>
.marquee-container {
  overflow: hidden;
  position: relative;
  width: 100%;
}
.marquee-content {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 30s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
</style>
