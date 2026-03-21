// composables/core/usePreview.ts
import { ref } from 'vue'

// Deep merge utility
const deepMerge = (target: any, source: any): any => {
    const result = { ...target }
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key])
        } else {
            result[key] = source[key]
        }
    }
    return result
}

export const usePreview = () => {
    const previewTheme = ref<any>(null)
    const isPreviewMode = ref(false)

    const fetchPreview = async (previewId: string) => {
        try {
            const { data } = await useFetch(`/api/preview/theme/${previewId}`)
            previewTheme.value = (data.value as any)?.theme
            isPreviewMode.value = true
            return data.value
        } catch (err) {
            console.error('Preview not found or expired')
            return null
        }
    }

    // Merge preview theme over live theme
    const mergeWithPreview = (liveTheme: any) => {
        if (!previewTheme.value) return liveTheme
        return deepMerge(liveTheme, previewTheme.value)
    }

    return { previewTheme, isPreviewMode, fetchPreview, mergeWithPreview }
}
