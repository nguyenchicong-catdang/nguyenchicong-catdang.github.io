// web-mvc/server.js
Bun.serve({
    port: 3000,
    static: {
        root: 'public',
        index: 'index.html'
    },
    routes: {
        '/api/hello': () => {
            return Response.json({ message: 'Hello, world!' });
        }
    },
});