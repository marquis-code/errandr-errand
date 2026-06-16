<template>
  <div class="flex gap-2 sm:gap-4 justify-between items-center w-full max-w-sm mx-auto">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :id="`otp-input-${index}`"
      ref="inputRefs"
      v-model="digits[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-medium text-gray-900 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 transition-all outline-none"
      :class="{ 'border-[#FF5C1A] bg-white': digits[index] }"
      @input="handleInput($event, index)"
      @keydown="handleKeyDown($event, index)"
      @paste="handlePaste($event)"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  digitCount: {
    type: Number,
    default: 6,
  },
});

const emit = defineEmits(['update:modelValue', 'complete']);

const digits = ref(new Array(props.digitCount).fill(''));
const inputRefs = ref<HTMLInputElement[]>([]);

// Sync from parent
watch(() => props.modelValue, (newVal) => {
  if (newVal.length === props.digitCount && newVal !== digits.value.join('')) {
    for (let i = 0; i < props.digitCount; i++) {
      digits.value[i] = newVal[i] || '';
    }
  } else if (newVal === '') {
    digits.value = new Array(props.digitCount).fill('');
  }
});

// Sync to parent
watch(digits, (newDigits) => {
  const code = newDigits.join('');
  emit('update:modelValue', code);
  if (code.length === props.digitCount) {
    emit('complete', code);
  }
}, { deep: true });

const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  const val = input.value;

  // Only allow numbers
  if (val && !/^\d$/.test(val)) {
    digits.value[index] = '';
    return;
  }

  // Move to next input
  if (val && index < props.digitCount - 1) {
    const nextInput = document.getElementById(`otp-input-${index + 1}`);
    nextInput?.focus();
  }
};

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text').slice(0, props.digitCount).replace(/\D/g, '');
  if (pasteData) {
    for (let i = 0; i < pasteData.length; i++) {
      digits.value[i] = pasteData[i];
    }
    // Focus the last filled or next empty input
    const nextIndex = Math.min(pasteData.length, props.digitCount - 1);
    const nextInput = document.getElementById(`otp-input-${nextIndex}`);
    nextInput?.focus();
  }
};

onMounted(() => {
  // Focus first input on mount
  const firstInput = document.getElementById('otp-input-0');
  firstInput?.focus();
});
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type=text] {
  -webkit-appearance: none;
  appearance: none;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
