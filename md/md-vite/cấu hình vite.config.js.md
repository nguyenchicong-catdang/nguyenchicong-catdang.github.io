## Để tách biệt quá trình build giữa server (back-end) và frontend,
Để tách biệt quá trình build giữa server (back-end) và frontend, bạn không thể chỉ dựa vào một file `vite.config.js` duy nhất. Thay vào đó, bạn sẽ cần hai file cấu hình Vite riêng biệt, mỗi file được tối ưu hóa cho một mục đích khác nhau.

**Tóm tắt cách tiếp cận:**

1.  Tạo hai file cấu hình Vite riêng biệt: một cho frontend và một cho backend (server).
2.  Sử dụng các script trong `package.json` để gọi các lệnh build tương ứng với từng file cấu hình.

-----

### 1\. Cấu trúc thư mục

Để dễ quản lý, bạn nên sắp xếp các file một cách rõ ràng.

```
/my-project
├── /dist          # Thư mục đầu ra
│   ├── /client    # Kết quả built frontend
│   └── /server    # Kết quả built server
├── /src
│   ├── /server    # Mã nguồn back-end
│   └── /client    # Mã nguồn front-end
├── vite.config.client.js   # Cấu hình built frontend
├── vite.config.server.js   # Cấu hình built server
├── package.json
```

-----

### 2\. Cấu hình Vite cho Frontend (`vite.config.client.js`)

File này sẽ được dùng để build các file tĩnh của frontend (HTML, CSS, JavaScript).

```javascript
// vite.config.client.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Tùy chọn cho frontend
  build: {
    outDir: 'dist/client', // Thư mục đầu ra
    // Thêm các tùy chọn khác như minify, assetsDir...
  },
});
```

-----

### 3\. Cấu hình Vite cho Server (`vite.config.server.js`)

File này sẽ được dùng để build mã nguồn back-end, thường là server Node.js hoặc Bun.

```javascript
// vite.config.server.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Tùy chọn cho server
  build: {
    outDir: 'dist/server', // Thư mục đầu ra
    ssr: true,             // Quan trọng: Bật chế độ SSR
    rollupOptions: {
      input: './src/server/index.js', // File entry point của server
      output: {
        format: 'esm', // Hoặc 'cjs' tùy thuộc vào cách server của bạn hoạt động
      },
    },
  },
});
```

-----

### 4\. Cấu hình Scripts trong `package.json`

Sử dụng các script để tự động hóa quá trình build.

```json
// package.json
{
  "scripts": {
    "build:client": "vite build --config vite.config.client.js",
    "build:server": "vite build --config vite.config.server.js",
    "build": "npm run build:client && npm run build:server"
  }
}
```

Với cấu hình này, bạn có thể chạy:

  * `npm run build:client` để build frontend.
  * `npm run build:server` để build backend.
  * `npm run build` để build cả hai cùng lúc.

Quá trình này đảm bảo mỗi phần của ứng dụng được tối ưu hóa đúng cách và tách biệt, giúp việc quản lý và triển khai trở nên dễ dàng hơn.