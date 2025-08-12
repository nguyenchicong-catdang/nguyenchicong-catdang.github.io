// web-mvc/server.js
import { login } from "./backend/views/login";
Bun.serve({
    port: 3000,
    host: '0.0.0.0',
    static: {
        root: 'public',
        index: 'index.html'
    },
    routes: {
        '/': () => {
            return new Response('/index.html');
        },
        '/api/hello': () => {
            return Response.json({ message: 'Hello, world!' });
        },
        '/admin/login': async () => { 
            return new Response( await login(), {
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        },
        '/src/*': (req) => {
            const url = new URL(req.url);
            req.url.replace(url.origin, "http://0.0.0.0:3000/");
            return fetch(req.url);
        },
        '/@vite/client': (req) => {
            const url = new URL(req.url);
            req.url.replace(url.origin, "http://0.0.0.0:3000/@vite/client");
            return fetch(req.url);
        },
        
    },
});