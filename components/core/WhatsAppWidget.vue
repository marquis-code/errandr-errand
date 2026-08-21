<template>
  <div class="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[100] flex flex-col items-start">
    <!-- Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-2"
    >
      <div v-if="isOpen" class="mb-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-64 origin-bottom-left">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-gray-900 text-sm">Support Team</h3>
          <button @click="isOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>
        <p class="text-xs text-gray-500 font-medium mb-4">Reply time: Usually within 5 mins.</p>
        
        <div class="space-y-2">
          <a
            v-for="agent in agents"
            :key="agent.name"
            :href="`https://wa.me/${agent.number}?text=Hi%20${agent.name},%20I%20need%20some%20help`"
            target="_blank"
            class="flex items-center gap-3 p-2 hover:bg-green-50 rounded-xl transition-colors group border border-transparent hover:border-green-100"
          >
            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span class="text-green-600 font-bold text-xs">{{ agent.initial }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">{{ agent.name }}</p>
              <p class="text-[10px] text-gray-500 font-medium">Support Agent</p>
            </div>
            <MessageCircle class="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </a>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-green-500/20"
      aria-label="WhatsApp Support"
    >
      <MessageCircle v-if="!isOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessageCircle, X } from 'lucide-vue-next'

const isOpen = ref(false)

const agents = [
  { name: 'Brandy', initial: 'B', number: '2348139908262' },
  { name: 'Kim', initial: 'K', number: '2348052854256' },
  // { name: 'Marquis', initial: 'M', number: '2348147626503' }
]
</script>
