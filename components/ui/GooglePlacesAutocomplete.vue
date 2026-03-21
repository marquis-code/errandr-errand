<template>
  <div>
    <input
      ref="inputRef"
      :value="inputValue"
      @input="onInput"
      @focus="showDropdown = true"
      @blur="onBlur"
      class="w-full border rounded custom-input p-2"
      type="text"
      :placeholder="placeholder"
    />
    <ul v-if="showDropdown && suggestions.length" class="absolute bg-white border w-full z-50 max-h-60 overflow-y-auto mt-1 rounded shadow">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.place_id"
        @mousedown.prevent="selectSuggestion(suggestion)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ suggestion.description }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  modelValue: any,
  apiKey: string,
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')
const suggestions = ref<any[]>([])
const showDropdown = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
let autocompleteService: any = null
let geocoder: any = null

onMounted(() => {
  if (!window.google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => {
      autocompleteService = new window.google.maps.places.AutocompleteService()
      geocoder = new window.google.maps.Geocoder()
    }
    document.head.appendChild(script)
  } else {
    autocompleteService = new window.google.maps.places.AutocompleteService()
    geocoder = new window.google.maps.Geocoder()
  }
})

watch(() => props.modelValue, (val) => {
  if (val && val.address) {
    inputValue.value = val.address
  }
})

function onInput(e: Event) {
  inputValue.value = (e.target as HTMLInputElement).value
  if (inputValue.value.length > 2 && autocompleteService) {
    autocompleteService.getPlacePredictions({ input: inputValue.value }, (predictions: any[]) => {
      suggestions.value = predictions || []
    })
  } else {
    suggestions.value = []
  }
}

function selectSuggestion(suggestion: any) {
  inputValue.value = suggestion.description
  showDropdown.value = false
  // Get place details (lat/lng)
  if (geocoder) {
    geocoder.geocode({ address: suggestion.description }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location
        emit('update:modelValue', {
          address: suggestion.description,
          lat: loc.lat(),
          lng: loc.lng(),
          placeId: suggestion.place_id
        })
      } else {
        emit('update:modelValue', {
          address: suggestion.description,
          placeId: suggestion.place_id
        })
      }
    })
  } else {
    emit('update:modelValue', {
      address: suggestion.description,
      placeId: suggestion.place_id
    })
  }
}

function onBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>

<style scoped>
.absolute { position: absolute; }
</style>
