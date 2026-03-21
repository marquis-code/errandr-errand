// composables/core/useTheme.ts
export const useTheme = () => {
    const applyTheme = (theme: any) => {
        const root = document.documentElement

        // Colors
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value as string)
            })
        }

        // Typography
        if (theme.typography) {
            root.style.setProperty('--font-family', theme.typography.fontFamily)
            root.style.setProperty('--font-heading', theme.typography.headingFont)
            root.style.setProperty('--font-body', theme.typography.bodyFont)
        }

        // Load Google Fonts if needed
        loadGoogleFonts(theme.typography)
    }

    const applyComponentStyles = (styles: any) => {
        const root = document.documentElement

        if (styles?.buttons) {
            root.style.setProperty('--btn-radius', styles.buttons.borderRadius)
            root.style.setProperty('--btn-font-weight', styles.buttons.fontWeight)
        }

        if (styles?.cards) {
            root.style.setProperty('--card-radius', styles.cards.borderRadius)
            root.style.setProperty('--card-border-color', styles.cards.borderColor)
        }

        root.style.setProperty('--input-radius', styles?.inputBorderRadius || '8px')
        root.style.setProperty('--section-spacing', styles?.sectionSpacing || '24px')
        root.style.setProperty('--max-content-width', styles?.maxContentWidth || '1200px')
    }

    const loadGoogleFonts = (typography: any) => {
        const fonts = new Set<string>()
        if (typography?.fontFamily) fonts.add(typography.fontFamily.split(',')[0].trim())
        if (typography?.headingFont) fonts.add(typography.headingFont.split(',')[0].trim())
        if (typography?.bodyFont) fonts.add(typography.bodyFont.split(',')[0].trim())

        fonts.forEach(font => {
            if (font && !font.includes('sans-serif') && !font.includes('serif')) {
                const link = document.createElement('link')
                link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
                link.rel = 'stylesheet'
                document.head.appendChild(link)
            }
        })
    }

    return { applyTheme, applyComponentStyles }
}
