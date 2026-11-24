<template>
  <component :is="icon" :class="sizeClass" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Hourglass,
  BadgeCheck,
  ChefHat,
  PackageCheck,
  PackageOpen,
  Bike,
  CheckCircle2,
  XCircle,
  Undo2,
  Handshake,
} from 'lucide-vue-next'

/**
 * A status as an icon.
 *
 * The rows used emoji: a box, a rocket, a speech bubble. Emoji cannot take a colour, render differently on each platform,
 * and at 16px in a table they read as noise. These are drawn from the same set as the rest of the app.
 */
const props = withDefaults(defineProps<{ status: string; size?: string }>(), { size: 'w-4 h-4' })

const MAP: Record<string, any> = {
  pending: Hourglass,
  awaiting_payment: Hourglass,
  confirmed: BadgeCheck,
  preparing: ChefHat,
  ready_for_pickup: PackageCheck,
  picked_up: PackageOpen,
  in_transit: Bike,
  delivered: CheckCircle2,
  cancelled: XCircle,
  refunded: Undo2,
  negotiating: Handshake,
}

const icon = computed(() => MAP[props.status] || Hourglass)
const sizeClass = computed(() => props.size)
</script>
