import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const confirmText = ref('Proceed')
const variant = ref<'danger'|'warning'|'success'|'info'>('danger')
let resolvePromise: ((value: boolean) => void) | null = null

export const useConfirmModal = () => {
  const confirm = (options: { title?: string, message: string, confirmText?: string, variant?: 'danger'|'warning'|'success'|'info' }) => {
    title.value = options.title || 'Confirm Action'
    message.value = options.message
    confirmText.value = options.confirmText || 'Proceed'
    variant.value = options.variant || 'danger'
    isOpen.value = true

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    isOpen,
    title,
    message,
    confirmText,
    variant,
    confirm,
    handleConfirm,
    handleCancel
  }
}
