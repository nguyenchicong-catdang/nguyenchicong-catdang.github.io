// web-mvc/backend/core/RouteAdmin.js
import { login } from '../views/login.js';
routes = {
    '/admin/': () => {
        return new Response('/admin/index.html');
    },
    'admin/login': login
};