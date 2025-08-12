// web-mvc/vite.config.js

import { defineConfig } from 'vite';
export default defineConfig({
    root: '.',
    server: {
        port: 4000,
        host: '0.0.0.0',
        // strictPort: true,
        // hmr: {
        //     port: 4000,
        //     host: 'localhost',
        // },
        // Configure proxy to redirect API calls to the backend server
        proxy: {
            '^/(?!src|node_module|dist|@vite/client|backend)': {
                target: 'http://0.0.0.0:3000',
            }
        }
    },
});