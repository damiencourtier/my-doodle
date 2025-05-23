export default defineAppConfig({
    toaster: {
      position: 'bottom-left' as const,
      expand: true,
      duration: 5000
    },
    theme: {
      radius: 0.25,
      blackAsPrimary: false
    },
    ui: {
      colors: {
        primary: 'green',
        neutral: 'slate'
      }
    }
  })