// vite.config.client.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/client', // Output cho client code
    emptyOutDir: true,
    //manifest: true, // Bật tính năng tạo manifest.json
    minify: 'terser',
    rollupOptions: {
      input: './src/login-frontend.js', // Input cho frontend
      output: {
        format: 'esm',
        // Đảm bảo tên file đầu ra có thể được tham chiếu dễ dàng
        entryFileNames: 'assets/[name].js', 
        chunkFileNames: 'assets/[name]-chunk.js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
// bunx --bun vite build --config vite.config.client.js