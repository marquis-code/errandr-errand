<template>
  <button type="button" class="page-back" :aria-label="label" @click="goBack">
    <ChevronLeft class="w-[18px] h-[18px]" />
    <span v-if="showLabel">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

/**
 * A way back from any screen that is not a tab.
 *
 * The app has no top bar, so a deep screen without this is a dead end: the browser's back gesture is the only exit and
 * it is not obvious on a phone. It falls back to Home when the rider arrived by link rather than by tapping through.
 */
const props = withDefaults(
  defineProps<{ label?: string; to?: string; showLabel?: boolean }>(),
  { label: 'Back', to: '/dashboard', showLabel: false },
)

const router = useRouter()

const goBack = () => {
  // history.state.back is set when there is somewhere to return to inside the app.
  if (typeof window !== 'undefined' && window.history.state?.back) {
    router.back()
    return
  }
  router.push(props.to)
}
</script>

<style scoped>
.page-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px 8px 6px;
  border-radius: 999px;
  border: 1px solid #eef0f3;
  background: #fff;
  color: #14110d;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
}

.page-back:active {
  background: #fafafa;
}
</style>
