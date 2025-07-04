import {createRouter, createWebHistory} from 'vue-router';
import Login from '@/Login.vue';
import Home from '@/Home.vue';
import Guest from "@/Guest.vue";
import GuestHome from "@/GuestHome.vue";
import axiosInstance from "../utils/axios-instance.js";
import AddCase from "@/components/GuestHome/AddCase.vue"; // 引入创建的axios实例
import TraceCase from "@/components/GuestHome/TraceCase.vue";
import ManageHome from "@/ManageHome.vue";
import ResidentInfom from "@/components/GuestHome/ResidentInfom.vue";

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
    path: '/guestHome',
    name: 'GuestHome',
    component: GuestHome,
    meta: {requiresResident: false}
  },

  {
    path: '/manageHome',
    name: 'ManageHome',
    component: ManageHome,
    meta: {requiresManagement: false}
  },

  {
    path: '/addcase',
    name: 'AddCase',
    component: AddCase,
    meta: {requiresResident: false}
  },
  {
    path: '/traceCase',
    name: 'TrackCase',
    component: TraceCase,
    meta: {requiresResident: false}
  },
  {
    path: '/residentinfo',
    name: 'ResidentInfo',
    component: ResidentInfom,
    meta: {requiresResident: false} // 需要居民身份验证
  },

  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {requiresAdmin: true} // 添加元信息标记需要登录验证的页面
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
  const requiresAdmin = to.meta.requiresAdmin;
  const requiresResident = to.meta.requiresResident;
  const requiresManagement = to.meta.requiresManagement;

  const token = localStorage.getItem('jwtToken');

  if (requiresAdmin || requiresResident || requiresManagement) {
    // 如果token不存在，重定向到登录页面
    if (!token) {
      next(from);
    } else {
      try {
        // 验证token是否有效
        let response = null;
        if (requiresAdmin) {
          response = await axiosInstance.post('/city/verifyToken', {
            token: token,
            type: "SystemAdmin"
          });
        } else if (requiresManagement) {
          response = await axiosInstance.post('/city/verifyToken', {
            token: token,
            type: "Manager"
          });
        } else {
          response = await axiosInstance.post('/city/verifyToken', {
            token: token,
            type: "Resident"
          });
        }

        console.log(response.data);
        if (response.status === 200) {
          next();
        } else {
          next(from); // 重定向到登录页面
          localStorage.removeItem('jwtToken'); // 清除失效的token
        }

        // 继续导航到目标路由
      } catch (error) {
        console.error('Token verification failed:', error.message);
        // 处理token验证失败，例如token过期等情况
        localStorage.removeItem('jwtToken'); // 清除失效的token
        next(from); // 重定向到登录页面
      }
    }
  } else {
    next(); // 如果不需要登录验证，直接继续导航
  }
});

export default router;
