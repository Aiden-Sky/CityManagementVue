import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/Login.vue';
import Home from '@/Home.vue';
import guest from "@/Guest.vue";
import AcceptPage from '../components/AcceptPage.vue'; // 导入子组件


const routes = [
  {
    path: '/',
    name: 'main',
    component: guest
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
