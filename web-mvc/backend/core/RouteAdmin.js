// web-mvc/backend/core/RouteAdmin.js

routes = {
    '/admin/': () => {
        return new Response('/admin/index.html');
    },
    'admin/login': () => {
        return Response.json({ message: 'Admin login page' });
    }
};