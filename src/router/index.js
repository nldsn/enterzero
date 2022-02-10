import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' },
      },
    ],
  },

  {
    path: '/product',
    component: Layout,
    // redirect: '/trademark',
    meta: { title: '基础数据管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'trademark',
        name: 'Trademark',
        component: () => import('@/views/product/trademark'),
        meta: { title: '品牌列表'},
      },
      {
        path: 'categorytrademark',
        name: 'CategoryTrademark',
        component: () => import('@/views/product/categoryTrademark'),
        meta: { title: '品牌分类'},
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/sku'),
        meta: { title: 'SKU管理'},
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/spu'),
        meta: { title: 'SPU管理'},
      },
    ],
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
