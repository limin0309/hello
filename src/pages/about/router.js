/*
 * @Author: your name
 * @Date: 2021-03-30 13:39:49
 * @LastEditTime: 2021-03-30 14:29:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-world/src/pages/about/router.js
 */
import { createRouter, createWebHistory } from "vue-router";
import Main from '@/components/app-main'


const routes = [
  {
    path: '/',
    redirect: '/about',
    component: Main,
    children: [
      {
        path: '/about',
        name: 'about',
        component: () => import('./c')
      },
      {
        path: '/about/2',
        name: 'about2',
        component: () => import('./d')
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error_404",
    component: () => import('@/components/app-error/404.vue')
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // mode: 'history',
  routes,
});

export default router;

// const router = new VueRouter({
//   mode: 'history',
//   routes
// })

// export default router
