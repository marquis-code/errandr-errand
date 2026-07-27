export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (error) => {
    // If a chunk fails to load, gracefully reload the page to clear the cache
    if (error && error.message && (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed'))) {
      console.error('Chunk loading failed, reloading page...', error)
      window.location.reload()
    }
  })

  const router = useRouter()
  if (router) {
    router.onError((error) => {
      if (error && error.message && (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed'))) {
        console.error('Router chunk loading failed, reloading page...', error)
        window.location.reload()
      }
    })
  }
})
