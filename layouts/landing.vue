<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <LandingNavbar />
    
    <main>
      <slot />
    </main>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import LandingNavbar from '@/components/LandingNavbar.vue'
import LandingFooter from '@/components/LandingFooter.vue'
</script>
