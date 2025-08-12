// vite.config.server.js
import { defineConfig } from 'vite';
import { htmlMinifyPlugin } from './vite-html-minify-plugin.js'; // Import plugin

export default defineConfig({
    plugins: [htmlMinifyPlugin()], // THÊM PLUGIN VÀO ĐÂY
    build: {
    // Thư mục đầu ra cho build server
    outDir: 'dist/server',
    // Bật chế độ SSR
    ssr: true,

    // Tùy chọn xóa thư mục đầu ra trước khi build
    emptyOutDir: true,

    // Tùy chọn minify code (minifying và rút gọn biến)
    // Cấu hình này chỉ hoạt động khi bạn không tắt minify
    minify: 'terser', // 'terser' là tùy chọn mặc định, bạn có thể chỉ định rõ ràng hoặc dùng 'esbuild'

    rollupOptions: {
      input: './server.js',
      output: {
        // Tùy chọn format 'esm' hoặc 'cjs'
        format: 'esm', 
      },
    },
  },
});
// bun add -d terser
// bun add -d terser html-minifier-terser
// bunx --bun vite build --config vite.config.server.js
// PORT=3333 bun run ./dist/server/server.js