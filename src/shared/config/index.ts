export const APP_CONFIG = {
  brand: {
    name: 'Servimatt',
    description: 'AI Assistant',
    colors: {
      primary: {
        from: '#860100',
        to: '#5c0000',
        hover: {
          from: '#960200',
          to: '#6c0000',
        },
      },
    },
  },
  chat: {
    maxTextAreaHeight: 200,
    autoCloseErrorDelay: 5000,
    truncateTitleLength: 4,
  },
  ui: {
    animation: {
      duration: 200,
    },
    scrollbar: {
      width: 10,
      borderRadius: '9999px',
      track: '#F8FAFC',
      thumb: {
        default: 'rgba(134,1,0,0.6)',
        hover: 'rgba(134,1,0,0.8)',
      },
    },
  },
} as const;