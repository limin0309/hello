
import { createRouter, createWebHistory } from "vue-router";
import Main from '@/components/app-main'


const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('./a')
      },
      {
        path: '/home/2',
        name: 'home2',
        component: () => import('./b')
      },
      {
        path: '/orderDetail/:id',
        name: 'orderDetail',
        // component: () => import(/* webpackChunkName: "orderDetail" */ './orderDetail.vue'),
        component: () => import('./orderDetail.vue'),
      },
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


// export default router

// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// // createApp(App).mount('#app')

// createApp(App).use(router).mount('#app')


