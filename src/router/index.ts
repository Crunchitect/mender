import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'models',
            component: () => import('@/views/Models.vue'),
        },
        {
            path: '/models',
            redirect: '/',
        },
        {
            path: '/repair',
            name: 'Repair',
            component: () => import('@/views/Repair.vue'),
        },
        {
            path: '/print',
            name: '3D Print',
            component: () => import('@/views/Print.vue'),
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/Dashboard.vue'),
        },
    ],
});

export default router;
