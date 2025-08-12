// web-mvc/vite.config.js

import { defineConfig } from 'vite';
export default defineConfig({
    server: {
        port: 4000,
        proxy: {
            '^/(?!src|node_module|dist|@vite/client|backend)': {
                target: 'http://localhost:3000',
            }
        },
    },
});