import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/', // Use absolute paths for GitHub Pages at username.github.io
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps to prevent MIME type issues
    // Ensure proper MIME types for JS files
    rollupOptions: {
      output: {
        // Ensure .js files have correct extensions and proper naming
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Ensure JS files always have .js extension
          if (assetInfo.name && assetInfo.name.endsWith('.js')) {
            return 'assets/[name]-[hash].js'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      },
      // Ensure proper module format
      format: 'es'
    },
    // Ensure proper chunk splitting
    chunkSizeWarningLimit: 1000
  }
})