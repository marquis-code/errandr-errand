// composables/useLoader.ts
export const useLoader = () => {
  /**
   * Start the global loading state
   * @param text - Optional custom loading text (default: "Loading")
   */
  const startLoading = (text: string = 'Loading') => {
    if (process.client) {
      window.dispatchEvent(
        new CustomEvent('loading-start', { 
          detail: { text } 
        })
      )
    }
  }

  /**
   * Stop the global loading state
   */
  const stopLoading = () => {
    if (process.client) {
      window.dispatchEvent(new Event('loading-stop'))
    }
  }

  /**
   * Show loading for an async operation
   * @param asyncFn - Async function to execute
   * @param text - Optional loading text
   * @returns Promise with the result of the async function
   */
  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    text: string = 'Loading'
  ): Promise<T> => {
    try {
      startLoading(text)
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }

  return {
    startLoading,
    stopLoading,
    withLoading
  }
}