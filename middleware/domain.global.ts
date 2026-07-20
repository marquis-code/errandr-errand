export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const host = window.location.hostname
    
    // Aggressive redirect for missing WWW to fix Firebase Auth Authorized Domains issue
    if (host === 'dispatch.erranders.org') {
      window.location.href = `https://www.dispatch.erranders.org${to.fullPath}`
      return
    }
  }
})
