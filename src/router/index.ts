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
            path: '/repair',
            name: 'Repair',
            component: () => import('@/views/Repair.vue')
        }
    ],
});

export default router;
