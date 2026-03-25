<template>
 <span 
 :class="[
 'px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border transition-all duration-300',
 config.bg,
 config.text,
 config.border
 ]"
 >
 {{ label || status }}
 </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
 status: string
 label?: string
}>()

const config = computed(() => {
 const s = String(props.status || '').toLowerCase()
 
 if (['approved', 'active', 'online', 'completed', 'delivered', 'paid', 'success', 'resolved'].includes(s)) {
 return { bg: 'bg-emerald-50/50', text: 'text-emerald-600', border: 'border-emerald-100 hover:bg-emerald-50' }
 }
 
 if (['pending', 'processing', 'ongoing', 'investigating', 'waiting'].includes(s)) {
 return { bg: 'bg-secondary/50', text: 'text-parentPrimary', border: 'border-secondary hover:bg-secondary' }
 }
 
 if (['suspended', 'rejected', 'cancelled', 'failed', 'offline', 'error', 'dismissed'].includes(s)) {
 return { bg: 'bg-rose-50/50', text: 'text-rose-600', border: 'border-rose-100 hover:bg-rose-50' }
 }
 
 if (['draft', 'inactive', 'maintenance'].includes(s)) {
 return { bg: 'bg-gray-50/50', text: 'text-gray-500', border: 'border-gray-100 hover:bg-gray-100' }
 }

 // Default / Info
 return { bg: 'bg-blue-50/50', text: 'text-blue-600', border: 'border-blue-100 hover:bg-blue-50' }
})
</script>
