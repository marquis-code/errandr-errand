<template>
  <button type="button" class="rdp-trigger" @click="open">
    <CalendarDays class="w-[18px] h-[18px]" />
    <span class="rdp-trigger-text">{{ label }}</span>
    <X v-if="hasValue" class="rdp-clear" @click.stop="clear" />
  </button>

  <Teleport to="body">
    <Transition name="rdp">
      <div v-if="isOpen" class="rdp-wrap" @click.self="close">
        <div class="rdp-sheet" role="dialog" aria-modal="true" aria-label="Choose a date range">
          <div class="rdp-grip" />

          <div class="rdp-head">
            <button type="button" class="rdp-nav" aria-label="Previous month" @click="shiftMonth(-1)">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <p class="rdp-month">{{ monthLabel }}</p>
            <button
              type="button"
              class="rdp-nav"
              aria-label="Next month"
              :disabled="isNextDisabled"
              @click="shiftMonth(1)"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>

          <div class="rdp-week">
            <span v-for="d in weekdays" :key="d">{{ d }}</span>
          </div>

          <div class="rdp-grid">
            <button
              v-for="day in days"
              :key="day.key"
              type="button"
              class="rdp-day"
              :class="{
                muted: !day.inMonth,
                today: day.isToday,
                edge: day.isStart || day.isEnd,
                inside: day.inRange,
                future: day.isFuture,
              }"
              :disabled="day.isFuture"
              @click="pick(day.date)"
            >
              {{ day.date.getDate() }}
            </button>
          </div>

          <div class="rdp-presets">
            <button
              v-for="preset in presets"
              :key="preset.label"
              type="button"
              class="rdp-preset"
              @click="applyPreset(preset)"
            >
              {{ preset.label }}
            </button>
          </div>

          <p class="rdp-hint">{{ hint }}</p>

          <div class="rdp-actions">
            <button type="button" class="rdp-quiet" @click="clear">Clear</button>
            <button type="button" class="rdp-apply" :disabled="!start" @click="apply">Apply</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

/**
 * A date range picker built for this app.
 *
 * The library picker rendered a desktop calendar in a popover: small targets, its own type scale, and a clock icon that
 * opened a time panel nobody asked for. This is a bottom sheet on a phone and a panel on a desktop, built from the same
 * surfaces as the rest of the app.
 */
const props = defineProps<{ modelValue?: Date[] | null }>()
const emit = defineEmits<{ 'update:modelValue': [Date[] | null] }>()

const isOpen = ref(false)
const start = ref<Date | null>(null)
const end = ref<Date | null>(null)
const cursor = ref(new Date())
const hovering = ref<Date | null>(null)

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const today = new Date()
today.setHours(0, 0, 0, 0)

const startOfDay = (d: Date) => {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const monthLabel = computed(() =>
  cursor.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
)

const isNextDisabled = computed(() => {
  const next = new Date(cursor.value)
  next.setMonth(next.getMonth() + 1)
  return next > today
})

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()

/** Six weeks from the Monday on or before the first of the month, so the grid never jumps height. */
const days = computed(() => {
  const first = startOfMonth(cursor.value)
  const offset = (first.getDay() + 6) % 7
  const gridStart = addDays(first, -offset)

  const rangeEnd = end.value ?? (start.value && hovering.value ? hovering.value : null)
  const [lo, hi] =
    start.value && rangeEnd
      ? start.value <= rangeEnd
        ? [start.value, rangeEnd]
        : [rangeEnd, start.value]
      : [start.value, start.value]

  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(gridStart, i)
    const midnight = startOfDay(date)
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      inMonth: sameMonth(date, cursor.value),
      isToday: sameDay(midnight, today),
      isFuture: midnight > today,
      isStart: sameDay(midnight, lo),
      isEnd: sameDay(midnight, hi),
      inRange: !!lo && !!hi && midnight > lo && midnight < hi,
    }
  })
})

const hasValue = computed(() => !!start.value)

const label = computed(() => {
  if (!start.value) return 'Any date'
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  if (!end.value || sameDay(start.value, end.value)) return fmt(start.value)
  return `${fmt(start.value)} – ${fmt(end.value)}`
})

const hint = computed(() =>
  start.value && !end.value ? 'Pick the last day, or apply just the start.' : 'Tap a day to start, another to end.',
)

const pick = (date: Date) => {
  const day = startOfDay(date)
  if (!start.value || (start.value && end.value)) {
    start.value = day
    end.value = null
    return
  }
  if (day < start.value) {
    end.value = start.value
    start.value = day
    return
  }
  end.value = day
}

const apply = () => {
  if (!start.value) {
    emit('update:modelValue', null)
    close()
    return
  }
  emit('update:modelValue', end.value ? [start.value, end.value] : [start.value])
  close()
}

const clear = () => {
  start.value = null
  end.value = null
  emit('update:modelValue', null)
  close()
}

const presets = [
  {
    label: 'Last 7 days',
    range: () => [addDays(today, -6), today],
  },
  {
    label: 'This month',
    range: () => [new Date(today.getFullYear(), today.getMonth(), 1), today],
  },
  {
    label: 'Last 30 days',
    range: () => [addDays(today, -29), today],
  },
]

const applyPreset = (preset: { range: () => Date[] }) => {
  const [from, to] = preset.range()
  start.value = startOfDay(from)
  end.value = startOfDay(to)
  cursor.value = startOfMonth(to)
}

const shiftMonth = (delta: number) => {
  const next = new Date(cursor.value)
  next.setMonth(next.getMonth() + delta)
  cursor.value = next
}

const open = () => {
  start.value = props.modelValue?.[0] ? startOfDay(props.modelValue[0]) : null
  end.value = props.modelValue?.[1] ? startOfDay(props.modelValue[1]) : null
  cursor.value = startOfMonth(end.value || start.value || today)
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  hovering.value = null
}

watch(isOpen, (value) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = value ? 'hidden' : ''
})
</script>

<style scoped>
.rdp-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #eef0f3;
  border-radius: 12px;
  background: #fff;
  color: #14110d;
  font-size: 14px;
  font-weight: 650;
  text-align: left;
}

.rdp-trigger-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rdp-clear {
  width: 16px;
  height: 16px;
  color: #9aa1ac;
  flex: none;
}

.rdp-wrap {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}

@media (min-width: 640px) {
  .rdp-wrap {
    align-items: center;
  }
}

.rdp-sheet {
  width: 100%;
  max-width: 420px;
  padding: 8px 16px calc(16px + env(safe-area-inset-bottom));
  border-radius: 20px 20px 0 0;
  background: #fff;
}

@media (min-width: 640px) {
  .rdp-sheet {
    border-radius: 18px;
    padding-bottom: 16px;
  }
}

.rdp-grip {
  width: 40px;
  height: 4px;
  margin: 4px auto 8px;
  border-radius: 999px;
  background: #e5e7eb;
}

.rdp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.rdp-month {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #14110d;
}

.rdp-nav {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid #eef0f3;
  border-radius: 999px;
  background: #fff;
  color: #14110d;
}

.rdp-nav:disabled {
  opacity: 0.35;
}

.rdp-week,
.rdp-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.rdp-week span {
  padding: 6px 0;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  color: #9aa1ac;
}

.rdp-day {
  aspect-ratio: 1;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #14110d;
  font-size: 14px;
  font-weight: 650;
}

.rdp-day.muted {
  color: #d1d5db;
}

.rdp-day.today {
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.rdp-day.inside {
  background: #fff1e8;
  border-radius: 0;
}

.rdp-day.edge {
  background: #ff5c1a;
  color: #fff;
}

.rdp-day.future {
  color: #e5e7eb;
}

.rdp-presets {
  display: flex;
  gap: 6px;
  margin-top: 12px;
}

.rdp-preset {
  flex: 1;
  padding: 8px 4px;
  border: 1px solid #eef0f3;
  border-radius: 10px;
  background: #fff;
  color: #4b5563;
  font-size: 11.5px;
  font-weight: 750;
}

.rdp-hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: #9aa1ac;
  text-align: center;
}

.rdp-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.rdp-quiet,
.rdp-apply {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14.5px;
  font-weight: 800;
}

.rdp-quiet {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #14110d;
}

.rdp-apply {
  border: 0;
  background: #ff5c1a;
  color: #fff;
}

.rdp-apply:disabled {
  opacity: 0.5;
}

.rdp-enter-active,
.rdp-leave-active {
  transition: opacity 0.16s ease;
}

.rdp-enter-from,
.rdp-leave-to {
  opacity: 0;
}
</style>
