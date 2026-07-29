import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { fit: 'contain', background: '#010101' },
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: { fit: 'contain', background: '#010101' },
    },
  },
  images: ['logo.png'],
})
