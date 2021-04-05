/*
 * @Author: your name
 * @Date: 2021-03-30 13:39:49
 * @LastEditTime: 2021-04-01 15:42:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-world/src/pages/index/main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';


createApp(App).use(router).use(Vant).mount('#app')
