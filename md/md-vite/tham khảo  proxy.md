## dev src

You've correctly identified the problem. When Bun's server returns that HTML, the browser will try to fetch `/src/main.js` from the **same server that provided the HTML**, which is the Bun server running on port `3000`. Since you have a proxy configured in Vite, not Bun, the Bun server doesn't know how to handle this request and will likely return a 404 error.

-----

### How to Solve This: Integrate Vite and Bun

There are two primary ways to fix this, depending on whether you're in a **development** or **production** environment.

#### 1\. Development Environment (Vite + Bun)

In development, you want to use the powerful features of Vite, like HMR. To do this, you need to configure your Bun server to act as a proxy for all static files that belong to the frontend.

**Step 1: Update Bun's `fetch` handler**

Modify your Bun server to check for frontend file requests. If the request is for a frontend asset (like `/src/main.js`), you can proxy it to the running Vite server at `http://localhost:4000`.

```javascript
// server.js
Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // If the request is for a frontend asset, proxy it to Vite's dev server
    if (url.pathname.startsWith('/src/') || url.pathname === '/@vite/client') {
      return fetch(`http://localhost:4000${url.pathname}`);
    }
    
    // Your SSR logic and API routes
    if (url.pathname === '/') {
      // ... your existing SSR logic
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body>
          <h1>Welcome, ${data.user.name}!</h1>
          <div id="root"></div>
          <script type="module" src="/src/main.js"></script>
        </body>
        </html>
      `;
      return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Other routes
    return new Response('Not Found', { status: 404 });
  },
});
```

This way, when the browser receives the HTML and requests `/src/main.js`, Bun's server will intercept that request and transparently pass it to the Vite dev server, which will handle it correctly.

#### 2\. Production Environment (Bun Only)

In production, you'll first build your frontend with Vite. This process generates optimized static files in a `dist` folder. The Bun server will then be responsible for both serving your backend API and serving these static files.

**Step 1: Build the frontend**

Run `bun vite build` (or `bun run build` if you have it in your `package.json`). This will create a `dist` folder with all your optimized assets.

**Step 2: Update Bun's `fetch` handler**

Configure Bun to serve static files from the `dist` directory. This can be done using a static file handler or by manually checking for file paths.

```javascript
// server.js
import { file } from "bun";
import { renderHomePage } from "./backend/views/home";

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Try to serve a static file from the 'dist' folder first
    if (url.pathname.startsWith('/dist/')) {
        const filePath = `./${url.pathname}`;
        try {
            return new Response(file(filePath));
        } catch (e) {
            // File not found, continue to next logic
        }
    }

    // Your SSR logic for the root path
    if (url.pathname === '/') {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body>
          <h1>Welcome, ${data.user.name}!</h1>
          <div id="root"></div>
          <script type="module" src="/dist/assets/main.js"></script>
        </body>
        </html>
      `;
      return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Other API routes
    if (url.pathname.startsWith('/api')) {
      return new Response(JSON.stringify({ message: 'API data' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});
```

In this production setup, the `<script>` tag's `src` is updated to point to the built asset in the `dist` folder, and the Bun server itself handles serving this file.