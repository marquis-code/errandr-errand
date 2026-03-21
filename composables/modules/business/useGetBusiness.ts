import { business_api } from "@/api_factory/modules/business"
import type { Business } from "@/types/business"
import { useStorage } from "@vueuse/core"

export const useGetBusiness = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    // Global state for business
    const business = useState<Business | null>('active_business', () => null)
    // Persist business to localStorage for chat and other features
    const cachedBusiness = useStorage<Business | null>('cached_business', null, undefined, {
        serializer: {
            read: (v: string) => v ? JSON.parse(v) : null,
            write: (v: Business | null) => JSON.stringify(v),
        },
    })

    // Restore from cache on init if not already loaded
    if (!business.value && cachedBusiness.value) {
        business.value = cachedBusiness.value
    }

    const getBusiness = async (subdomain: string) => {
        loading.value = true
        error.value = null
        try {
            const res = (await business_api.getBySubdomain(subdomain)) as any
            if (res.data?.success) {
                business.value = res.data.data
                // Cache business for use across app (chat, etc.)
                cachedBusiness.value = res.data.data
            } else {
                throw new Error('Business not found')
            }
        } finally {
            loading.value = false
        }
    }

    const clearCachedBusiness = () => {
        cachedBusiness.value = null
        business.value = null
    }

    onMounted(() => {
        const route = useRoute()
        const subdomain = route.query.subdomain as string
        if (subdomain) {
            getBusiness(subdomain)
        }
    })

    return { loading, error, business, getBusiness, clearCachedBusiness, cachedBusiness }
}
