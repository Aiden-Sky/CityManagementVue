import {createRouter, createWebHistory} from 'vue-router';
import Login from '@/Login.vue';
import Home from '@/Home.vue';
import Guest from "@/Guest.vue";
import axiosInstance from "../utils/axios-instance.js"; // 引入创建的axios实例

const routes = [
  {
    path: '/test',
    name: 'test',
    component: Guest
  },

  {
    path: '/',
    name: 'Main',
    component: Guest
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {requiresAuth: true} // 添加元信息标记需要登录验证的页面
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 添加全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 检查路由元信息中是否需要登录验证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('jwtToken');
    // 如果token不存在，重定向到登录页面
    if (!token) {
      next('/login');
    } else {
      try {
        // 验证token是否有效
        const response = await axiosInstance.post('http://localhost:8081/city/verifyToken', {
          token: token
        });
        console.log(response.data);
        if (response.status === 200) {
          next();
        } else {
          next('/login'); // 重定向到登录页面
        }

        // 继续导航到目标路由
      } catch (error) {
        console.error('Token verification failed:', error.message);
        // 处理token验证失败，例如token过期等情况
        localStorage.removeItem('jwtToken'); // 清除失效的token
        next('/login'); // 重定向到登录页面
      }
    }
  } else {
    next(); // 如果不需要登录验证，直接继续导航
  }
});

export default router;
