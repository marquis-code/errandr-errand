<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex justify-end" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <Transition name="fade">
        <div 
          v-if="isOpen" 
          class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" 
          @click="$emit('close')"
          aria-hidden="true"
        ></div>
      </Transition>

      <!-- Drawer panel -->
      <div class="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-500 ease-in-out">
        
        <!-- Header area for Close Button -->
        <div class="absolute top-0 right-0 pt-6 pr-6 flex items-center z-10">
          <button 
            type="button" 
            class="rounded-full flex items-center justify-center w-10 h-10 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all" 
            @click="$emit('close')"
          >
            <span class="sr-only">Close panel</span>
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Scrollable Content slot -->
        <div class="flex-1 overflow-y-auto hide-scrollbar p-8 pt-12">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.drawer-enter-to,
.drawer-leave-from {
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
