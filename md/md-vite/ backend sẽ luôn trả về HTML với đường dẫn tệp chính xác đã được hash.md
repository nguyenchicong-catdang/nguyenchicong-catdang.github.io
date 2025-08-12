##  backend sẽ luôn trả về HTML với đường dẫn tệp chính xác đã được hash

Để sử dụng file **manifest** để tránh cache trình duyệt, bạn cần thực hiện ba bước: cấu hình Vite, chạy build, và sau đó đọc file manifest từ backend để lấy đường dẫn chính xác của các tệp đã build.

-----

### Bước 1: Cấu hình Vite để tạo `manifest.json`

Thêm tùy chọn `manifest: true` vào cấu hình build của Vite. Bạn có thể sử dụng cùng một cấu hình cho cả client và server nếu muốn.

**`vite.config.client.js`:**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    minify: 'terser',
    manifest: true, // Bật tính năng tạo manifest.json
    rollupOptions: {
      input: './src/login-frontend.js',
      output: {
        format: 'esm',
        // Tên file đầu ra sẽ có hash để tránh cache
        entryFileNames: 'assets/[name]-[hash].js', 
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
```

Sau khi chạy lệnh build (`bunx --bun vite build --config vite.config.client.js`), Vite sẽ tạo một file `manifest.json` trong thư mục `dist/client`. File này sẽ chứa một ánh xạ từ tên file gốc (ví dụ: `src/login-frontend.js`) sang tên file đã được hash (ví dụ: `assets/login-frontend-f1a2b3c4.js`).

### Bước 2: Chạy lệnh build

Chạy lệnh build Vite với cấu hình đã cập nhật:
`bunx --bun vite build --config vite.config.client.js`

Kết quả sẽ có một thư mục `dist/client` chứa các tệp đã build và file `manifest.json` tương ứng.

### Bước 3: Đọc Manifest từ Bun Server

Trong backend Bun, bạn sẽ đọc file `manifest.json` để lấy đường dẫn tới tệp JavaScript chính xác.

**`web-mvc/backend/views/login.js` đã được cập nhật:**

```javascript
import { file } from "bun";

// Biến này sẽ lưu trữ manifest
let manifest = null;

async function getManifest() {
  if (manifest) return manifest; // Trả về manifest đã cache

  try {
    const manifestFile = Bun.file('./dist/client/manifest.json');
    manifest = JSON.parse(await manifestFile.text());
    return manifest;
  } catch (e) {
    console.error('Failed to load manifest.json:', e);
    return null;
  }
}

async function login() {
  let scriptTags = '';

  if (import.meta.env.NODE_ENV === 'development') {
    // Trong môi trường phát triển, vẫn sử dụng Vite client và tệp nguồn
    scriptTags = `
      <script type="module" src="/@vite/client"></script>
      <script type="module" src="/src/login-frontend.js"></script>
    `;
  } else {
    // Trong môi trường production, đọc manifest để lấy đường dẫn đã hash
    const manifestData = await getManifest();
    if (manifestData) {
      // Lấy đường dẫn của tệp entry point từ manifest
      const entryPoint = manifestData['src/login-frontend.js'];
      if (entryPoint && entryPoint.file) {
        const scriptPath = `/dist/client/${entryPoint.file}`;
        scriptTags = `<script type="module" src="${scriptPath}"></script>`;
      } else {
        console.error('Entry point not found in manifest:', 'src/login-frontend.js');
      }
    }
  }

  return /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
    </head>
    <body>
        <h1>Login</h1>
        ${scriptTags}
    </body>
    </html>
  `;
}

export { login };
```

Với cách này, backend sẽ luôn trả về HTML với đường dẫn tệp chính xác đã được hash, buộc trình duyệt phải tải phiên bản mới nhất của file mỗi khi nội dung của nó thay đổi.