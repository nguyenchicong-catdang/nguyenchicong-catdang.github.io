// web-mvc/backend/views/login.js
//import { file } from "bun";

async function login() {
  let scriptContent = '';

  if (import.meta.env.NODE_ENV === 'development') {
    // Trong môi trường phát triển, vẫn sử dụng thẻ script để Vite hoạt động
    scriptContent = `
      <script type="module" src="/@vite/client"></script>
      <script type="module" src="/src/login-frontend.js"></script>
    `;
  } else {
    // Trong môi trường production, đọc nội dung tệp đã build
    const filePath = './dist/client/assets/login-frontend.js'; 
    try {
      const builtFile = Bun.file(filePath);
      // Đọc nội dung tệp dưới dạng văn bản
      scriptContent = /* htnl */`<script type="module">${await builtFile.text()}</script>`;
    } catch (e) {
      console.error('Failed to read built file:', e);
      scriptContent = '';
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
        ${scriptContent}
    </body>
    </html>
  `;
}

export { login };