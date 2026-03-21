<template>
  <div class="space-y-4 animate-pulse">
    <div v-for="i in count" :key="i" :class="containerClass">
      <div v-if="variant === 'card'" class="glass rounded-[2rem] p-6 space-y-4">
        <div class="h-40 bg-white/10 rounded-2xl w-full"></div>
        <div class="h-4 bg-white/10 rounded-full w-3/4"></div>
        <div class="h-3 bg-white/10 rounded-full w-1/2"></div>
        <div class="flex justify-between items-center pt-4">
          <div class="h-6 bg-white/10 rounded-full w-20"></div>
          <div class="h-8 bg-white/10 rounded-xl w-8"></div>
        </div>
      </div>

      <div v-else-if="variant === 'list'" class="flex items-center gap-4 p-4 glass rounded-2xl">
        <div class="w-12 h-12 bg-white/10 rounded-xl flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-white/10 rounded-full w-1/3"></div>
          <div class="h-2 bg-white/10 rounded-full w-1/4"></div>
        </div>
        <div class="w-16 h-4 bg-white/10 rounded-full"></div>
      </div>

      <div v-else class="h-4 bg-white/10 rounded-full w-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number;
  variant?: 'card' | 'list' | 'text';
  containerClass?: string;
}>(), {
  count: 3
});
</script>
