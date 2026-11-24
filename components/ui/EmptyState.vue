<template>
  <div class="empty-state">
    <div class="empty-mark">
      <component :is="icon" class="w-6 h-6" />
    </div>
    <p class="empty-title">{{ title }}</p>
    <p v-if="body" class="empty-body">{{ body }}</p>
    <NuxtLink v-if="to && action" :to="to" class="empty-action">{{ action }}</NuxtLink>
    <button v-else-if="action" type="button" class="empty-action" @click="$emit('action')">{{ action }}</button>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

/**
 * One empty state for the whole app.
 *
 * Each screen had grown its own: an emoji at 4xl, a 20px circle of grey, three different title sizes, and sometimes a call
 * to action that went nowhere. An emoji cannot be themed, reads differently on every OS, and is a picture of nothing
 * rather than a signpost to the thing that is missing.
 */
withDefaults(
  defineProps<{
    icon: Component
    title: string
    body?: string
    action?: string
    to?: string
  }>(),
  { body: '', action: '', to: '' },
)

defineEmits<{ action: [] }>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 44px 24px;
  text-align: center;
}

.empty-mark {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: #fff1e8;
  color: #ff5c1a;
}

.empty-title {
  margin: 0;
  font-size: 15px;
  font-weight: 750;
  color: #14110d;
}

.empty-body {
  margin: 0;
  max-width: 34ch;
  font-size: 13px;
  line-height: 1.5;
  color: #9aa1ac;
}

.empty-action {
  margin-top: 14px;
  padding: 11px 18px;
  border: 0;
  border-radius: 11px;
  background: #14110d;
  color: #fff;
  font-size: 14px;
  font-weight: 750;
  text-decoration: none;
}
</style>
