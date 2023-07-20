const routes = [
  // Login / Reset password
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    name: 'login',
  },
  {
    path: '/reset-password',
    component: () => import('pages/ResetPassword.vue'),
    name: 'reset-password',
  },

  // Home
  {
    path: '/',
    name: 'main-layout',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/IndexPage.vue'), name: 'index' },
      {
        path: 'customer/:id',
        component: () => import('src/pages/CustomerPage.vue'),
        name: 'customer',
      },
      {
        path: 'settings',
        component: () => import('src/pages/SettingsPage.vue'),
        name: 'settings',
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/customer-request',
    component: () => import('pages/NewClientPage.vue'),
    name: 'customer-request',
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
