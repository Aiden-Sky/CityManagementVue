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

// MFA验证状态标记
const MFA_VERIFIED_KEY = 'mfaVerified';

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
  const mfaVerified = sessionStorage.getItem(MFA_VERIFIED_KEY) === 'true';

  if (requiresAdmin || requiresResident || requiresManagement) {
    // 如果token不存在，重定向到登录页面
    if (!token) {
      next('/');
      return;
    }
    
    try {
      // 验证token是否有效
      let response = null;
      if (requiresAdmin) {
        // 系统管理员还需要检查MFA验证状态
        response = await axiosInstance.post('/city/verifyToken', {
          token: token,
          type: "SysAdmin"
        });
        
        // 如果是SysAdmin且未通过MFA验证，则检查是否需要MFA验证
        if (response.status === 200 && !mfaVerified) {
          try {
            // 检查该账号是否需要MFA验证
            const mfaResponse = await axiosInstance.get('/city/admin/mfa/status', {
              headers: {
                Authorization: token
              }
            });
            
            if (mfaResponse.data && mfaResponse.data.enabled) {
              // 如果需要MFA验证但未验证，重定向到登录页面
              localStorage.removeItem('jwtToken'); // 清除token
              next('/login');
              return;
            }
          } catch (mfaError) {
            console.error('MFA状态检查失败:', mfaError);
            // 发生错误时，为安全起见，假设需要MFA验证
            next('/login');
            return;
          }
        }
      } else if (requiresManagement) {
        response = await axiosInstance.post('/city/verifyToken', {
          token: token,
          type: "Management"
        });
      } else {
        response = await axiosInstance.post('/city/verifyToken', {
          token: token,
          type: "Resident"
        });
      }

      if (response.status === 200) {
        next();
      } else {
        next('/login'); // 重定向到登录页面
        localStorage.removeItem('jwtToken'); // 清除失效的token
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
      // 处理token验证失败，例如token过期等情况
      localStorage.removeItem('jwtToken'); // 清除失效的token
      next('/login'); // 重定向到登录页面
    }
  } else {
    next(); // 如果不需要登录验证，直接继续导航
  }
});

export default router;
