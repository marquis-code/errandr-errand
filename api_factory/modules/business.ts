import { GATEWAY_ENDPOINT } from '../axios.config'

export const business_api = {
    getBySubdomain: (subdomain: string) => {
        const url = `/businesses/subdomain/${subdomain}`
        return GATEWAY_ENDPOINT.get(url)
    },
    
    /**
     * Get storefront data by subdomain (includes theme, services, categories, staff)
     */
    getStorefront: (subdomain: string) => {
        const url = `/businesses/storefront/${subdomain}`
        return GATEWAY_ENDPOINT.get(url)
    }
}
