import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/front/HomeView.vue'),
      },
      {
        path: 'about', // path裡路由可自定名稱，巢狀路由的子路由path前面不需要加/斜線
        name: 'About',
        component: () => import('../views/front/AboutView.vue'),
      },
      {
        path: 'products',
        component: () => import('../views/front/ProductsView.vue'),
      },
      {
        path: 'product/:id', // 動態路由
        component: () => import('../views/front/ProductView.vue'),
      },
      {
        path: 'cart',
        component: () => import('../views/front/CartView.vue'),
      },
      {
        path: 'login',
        component: () => import('../views/front/LoginView.vue'),
      },
    ],
  },
  {
    path: '/admin', // 不是子路由，前面要加/斜線
    component: () => import('../views/DashboardView.vue'),
    children: [
      {
        path: 'adminProducts',
        component: () => import('../views/admin/AdminProducts.vue'),
      },
      {
        path: 'adminOrders',
        component: () => import('../views/admin/AdminOrders.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

export default router;
