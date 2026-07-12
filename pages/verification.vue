<template>
  <div class="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-fade-in">
    <!-- Header -->
    <div class="px-6 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Verify Your Account</h1>
        <p class="text-xs text-gray-500 mt-1 max-w-sm">A quick identity check to secure your payouts.</p>
      </div>
      <button @click="router.push('/dashboard')" class="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Progress Steps -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
      <div class="max-w-md mx-auto flex items-center gap-2">
        <div class="flex-1 h-1.5 rounded-full transition-all" :class="step >= 1 ? 'bg-[#FF5C1A]' : 'bg-gray-200'"></div>
        <div class="flex-1 h-1.5 rounded-full transition-all" :class="step >= 2 ? 'bg-[#FF5C1A]' : 'bg-gray-200'"></div>
        <div class="flex-1 h-1.5 rounded-full transition-all" :class="step >= 3 ? 'bg-[#FF5C1A]' : 'bg-gray-200'"></div>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center px-6 py-8">
      <div class="w-full max-w-md mx-auto">
        <!-- Step 1: Student ID Capture -->
        <div v-if="step === 1" class="space-y-6">
          <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200">
              <CreditCard class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Step 1: Student ID Card</h3>
              <p class="text-xs text-gray-500 mt-0.5">Take a clear picture of your physical student ID card.</p>
            </div>
          </div>
          
          <div v-if="cameraActiveFor === 'id'" class="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
            <button @click="capturePhoto('idCardImage')" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
              📸 Capture
            </button>
            <button @click="stopCamera" class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <span class="text-xs font-bold">Cancel</span>
            </button>
          </div>
          
          <div v-else class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#FF5C1A] transition-colors cursor-pointer relative" @click="startCamera('id', 'environment')">
            <input 
              type="file" 
              ref="idInput" 
              accept="image/*" 
              capture="environment" 
              class="hidden" 
              @change="handleFileUpload($event, 'idCardImage')"
            >
            <div v-if="!form.idCardImage" class="space-y-2">
              <div class="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Camera class="w-6 h-6" />
              </div>
              <p class="font-bold text-gray-900 text-xs">Tap to open Camera</p>
              <p class="text-[10px] text-gray-400">Must be a live photo of your physical ID card.</p>
              <button @click.stop="$refs.idInput.click()" class="text-[10px] text-[#FF5C1A] font-bold hover:underline mt-1">Or upload a file (Fallback)</button>
            </div>
            <div v-else class="space-y-3">
              <div class="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img :src="form.idCardImage" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gray-900/10 flex items-center justify-center pointer-events-none">
                  <div class="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p class="font-bold text-gray-900 text-sm">Photo Captured</p>
              <div class="flex items-center justify-center gap-4">
                <button @click.stop="startCamera('id', 'environment')" class="text-[10px] text-[#FF5C1A] font-bold hover:underline">Retake with Camera</button>
                <button @click.stop="$refs.idInput.click()" class="text-[10px] text-gray-500 font-bold hover:underline">Upload instead</button>
              </div>
            </div>
          </div>

          <button 
            @click="step = 2" 
            :disabled="!form.idCardImage" 
            class="w-full py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all shadow-md"
          >
            Continue
          </button>
        </div>

        <!-- Step 2: Live Selfie Capture -->
        <div v-if="step === 2" class="space-y-6 animate-slide-in-right">
          <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200">
              <UserSquare class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Step 2: Live Selfie</h3>
              <p class="text-xs text-gray-500 mt-0.5">Take a selfie right now to match with your ID card.</p>
            </div>
          </div>
          
          <div v-if="cameraActiveFor === 'selfie'" class="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover transform scale-x-[-1]"></video>
            <button @click="capturePhoto('selfieImage')" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
              📸 Capture Selfie
            </button>
            <button @click="stopCamera" class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <span class="text-xs font-bold">Cancel</span>
            </button>
          </div>

          <div v-else class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#FF5C1A] transition-colors cursor-pointer relative" @click="startCamera('selfie', 'user')">
            <input 
              type="file" 
              ref="selfieInput" 
              accept="image/*" 
              capture="user" 
              class="hidden" 
              @change="handleFileUpload($event, 'selfieImage')"
            >
            <div v-if="!form.selfieImage" class="space-y-2">
              <div class="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Camera class="w-6 h-6" />
              </div>
              <p class="font-bold text-gray-900 text-xs">Tap to take Selfie</p>
              <p class="text-[10px] text-gray-400">Please ensure good lighting.</p>
              <button @click.stop="$refs.selfieInput.click()" class="text-[10px] text-[#FF5C1A] font-bold hover:underline mt-1">Or upload a file (Fallback)</button>
            </div>
            <div v-else class="space-y-3">
              <div class="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                <img :src="form.selfieImage" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gray-900/10 flex items-center justify-center pointer-events-none">
                  <div class="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 class="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p class="font-bold text-gray-900 text-sm">Selfie Captured</p>
              <div class="flex items-center justify-center gap-4">
                <button @click.stop="startCamera('selfie', 'user')" class="text-[10px] text-[#FF5C1A] font-bold hover:underline">Retake Selfie</button>
                <button @click.stop="$refs.selfieInput.click()" class="text-[10px] text-gray-500 font-bold hover:underline">Upload instead</button>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="step = 1" class="py-3 px-6 text-sm bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Back</button>
            <button 
              @click="step = 3" 
              :disabled="!form.selfieImage" 
              class="flex-1 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all shadow-md"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Step 3: Final Details -->
        <div v-if="step === 3" class="space-y-6 animate-slide-in-right">
          <div class="flex items-center gap-4 text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200">
              <Smartphone class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Step 3: Final Details</h3>
              <p class="text-xs text-gray-500 mt-0.5">Provide your school, matric number, and WhatsApp number.</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2">School</label>
              <select v-model="form.school" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm">
                <option value="" disabled>Select your school</option>
                <option value="UNILAG">UNILAG</option>
                <option value="CMUL">CMUL</option>
                <option value="YABATECH">YABATECH</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2">Matric Number</label>
              <input v-model="form.matricNumber" type="text" placeholder="e.g. 190801021" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-2">WhatsApp Number</label>
              <input v-model="form.whatsappNumber" type="tel" placeholder="e.g. 08012345678" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#FF5C1A] focus:border-[#FF5C1A] outline-none transition-all shadow-sm">
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="step = 2" class="py-3 px-6 text-sm bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Back</button>
            <button 
              @click="submitVerification" 
              :disabled="loading || !form.whatsappNumber || !form.school || !form.matricNumber" 
              class="flex-1 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E54D12] transition-all flex justify-center items-center gap-2 shadow-md"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Submitting...' : 'Submit Verification' }}
            </button>
          </div>
        </div>

        <!-- Success View -->
        <div v-if="step === 4" class="text-center py-12 space-y-4 animate-zoom-in">
          <div class="w-16 h-16 bg-gray-50 text-gray-900 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <PartyPopper class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 tracking-tight">Verification Submitted</h2>
          <p class="text-gray-500 text-xs max-w-xs mx-auto">
            Your identity documents have been submitted securely. Reviews typically take less than 24 hours.
          </p>
          <div class="pt-6">
            <NuxtLink to="/dashboard" class="inline-block px-8 py-3 text-sm bg-[#FF5C1A] text-white font-bold rounded-xl hover:bg-[#E54D12] transition-all shadow-md">
              Return to Dashboard
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast as useToast } from '@/composables/core/useCustomToast'
import { useUser } from '@/composables/modules/auth/user'
import { 
  CreditCard, 
  Camera, 
  CheckCircle2, 
  UserSquare, 
  Smartphone, 
  PartyPopper,
  X
} from 'lucide-vue-next'

definePageMeta({ layout: 'errander' })
useHead({ title: 'Account Verification - Errandr' })

const step = ref(1)
const loading = ref(false)
const router = useRouter()
const { showToast } = useToast()
const { getProfile } = useUser()

const form = reactive({
  idCardImage: '',
  selfieImage: '',
  whatsappNumber: '',
  school: '',
  matricNumber: ''
})

onMounted(() => {
  const savedState = localStorage.getItem('verification_state')
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      if (parsed.step && parsed.step < 4) step.value = parsed.step
      if (parsed.form) {
        form.idCardImage = parsed.form.idCardImage || ''
        form.selfieImage = parsed.form.selfieImage || ''
        form.whatsappNumber = parsed.form.whatsappNumber || ''
        form.school = parsed.form.school || ''
        form.matricNumber = parsed.form.matricNumber || ''
      }
    } catch (e) {}
  }
})

watch(
  () => ({ step: step.value, form }),
  (state) => {
    if (state.step < 4) {
      localStorage.setItem('verification_state', JSON.stringify(state))
    }
  },
  { deep: true }
)

const idInput = ref<HTMLInputElement | null>(null)
const selfieInput = ref<HTMLInputElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const cameraActiveFor = ref<'id' | 'selfie' | null>(null)
let stream: MediaStream | null = null

const startCamera = async (stepId: 'id' | 'selfie', facingMode: 'environment' | 'user') => {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      })
      cameraActiveFor.value = stepId
      // Wait for the next tick for the video element to be rendered
      setTimeout(() => {
        if (videoRef.value) {
          videoRef.value.srcObject = stream
        }
      }, 50)
    } else {
      throw new Error('Camera API not supported')
    }
  } catch (err) {
    console.warn('Could not open camera, falling back to file input', err)
    if (stepId === 'id' && idInput.value) idInput.value.click()
    if (stepId === 'selfie' && selfieInput.value) selfieInput.value.click()
  }
}

const capturePhoto = (field: 'idCardImage' | 'selfieImage') => {
  if (!videoRef.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')
  if (ctx) {
    if (field === 'selfieImage') {
      // Flip the canvas horizontally for selfies before drawing to match the mirror view
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
    form[field] = canvas.toDataURL('image/jpeg', 0.8)
    
    showToast({
      title: 'Success',
      message: `${field === 'idCardImage' ? 'ID Card' : 'Selfie'} captured securely.`,
      toastType: 'success'
    })
    stopCamera()
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(t => t.stop())
    stream = null
  }
  cameraActiveFor.value = null
}

// Simulated file upload for now, ideally this would upload to Cloudinary or similar via an endpoint
const handleFileUpload = async (event: any, field: 'idCardImage' | 'selfieImage') => {
  const file = event.target.files[0]
  if (!file) return

  // In a real implementation, you would upload this file to your backend or Cloudinary
  // and get a URL back. For now, we will create an object URL to simulate it.
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    form[field] = reader.result as string
    showToast({
      title: 'Success',
      message: `${field === 'idCardImage' ? 'ID Card' : 'Selfie'} captured securely.`,
      toastType: 'success'
    })
  }
}

const submitVerification = async () => {
  loading.value = true
  try {
    const res = await api.post('/erranders/verify/submit-tier-2', form)
    if (res.status === 200 || res.status === 201) {
      step.value = 4
      localStorage.removeItem('verification_state')
      await getProfile() // refresh user data
    }
  } catch (error: any) {
    showToast({
      title: 'Verification Failed',
      message: error.response?.data?.message || 'Something went wrong while submitting your verification.',
      toastType: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-slide-in-right {
  animation: slideInRight 0.4s ease-out forwards;
}
.animate-zoom-in {
  animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
