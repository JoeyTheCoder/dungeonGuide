import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { notionDevApi } from './server/vite-plugin-notion.mjs'

export default defineConfig({
  plugins: [
    tailwindcss(),
    notionDevApi(),
  ],
})