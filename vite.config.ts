import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/', // Use absolute paths for GitHub Pages at username.github.io
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper MIME types for JS files
    rollupOptions: {
      output: {
        // Ensure .js files have correct extensions
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})