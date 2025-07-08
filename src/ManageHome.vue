<template>
  <div class="admin-home">
    <header class="d-flex justify-content-between align-items-center py-3 px-3 theme-header">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">城市管理系统</h1>
      </div>
      <div class="d-flex align-items-center">

        <div class="dropdown">
          <button class="btn theme-btn dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-1"></i>管理员
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="#" @click.prevent="currentModule = 'settings'"><i class="bi bi-gear me-2"></i>设置</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="logout"><i class="bi bi-box-arrow-right me-2"></i>退出登录</a></li>
          </ul>
        </div>
      </div>
    </header>
    
    <div class="background">
      <div class="container my-4 flex-grow-1">
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border theme-spinner" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">加载中...</span>
          </div>
          <p class="mt-3">正在加载案件数据...</p>
        </div>
    
        <!-- 统计卡片 -->
        <div class="row mb-4" v-if="!loading">
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ getPendingCaseCount() }}</h3>
                <p class="stat-label">待处理案件</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-gear"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ getProcessingCaseCount() }}</h3>
                <p class="stat-label">处理中案件</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ getResolvedCaseCount() }}</h3>
                <p class="stat-label">已解决案件</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-people"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ getTotalReporters() }}</h3>
                <p class="stat-label">举报人数</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 功能模块导航卡片 -->
        <div class="row mb-4">
          <div class="col-md-6 col-lg-4 mb-3">
            <div class="feature-card" @click="currentModule = 'viewCases'">
              <div class="feature-icon">
                <i class="bi bi-list-ul"></i>
              </div>
              <div class="feature-content">
                <h5 class="feature-title">查看案件</h5>
                <p class="feature-text">浏览并管理所有事件</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4 mb-3">
            <div class="feature-card" @click="currentModule = 'updateCase'" :class="{ 'disabled': !selectedCase }">
              <div class="feature-icon">
                <i class="bi bi-pencil-square"></i>
              </div>
              <div class="feature-content">
                <h5 class="feature-title">事件进度管理</h5>
                <p class="feature-text">更新事件的处理状态</p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4 mb-3">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div class="feature-content">
                <h5 class="feature-title">地理分布</h5>
                <p class="feature-text">查看案件地理位置分布</p>
              </div>
            </div>
          </div>
<!--          <div class="col-md-6 col-lg-4 mb-3">-->
<!--            <div class="feature-card">-->
<!--              <div class="feature-icon">-->
<!--                <i class="bi bi-person-badge"></i>-->
<!--              </div>-->
<!--              <div class="feature-content">-->
<!--                <h5 class="feature-title">人员管理</h5>-->
<!--                <p class="feature-text">管理系统用户和权限</p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-6 col-lg-4 mb-3">-->
<!--            <div class="feature-card">-->
<!--              <div class="feature-icon">-->
<!--                <i class="bi bi-gear-wide-connected"></i>-->
<!--              </div>-->
<!--              <div class="feature-content">-->
<!--                <h5 class="feature-title">系统设置</h5>-->
<!--                <p class="feature-text">配置系统参数和选项</p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
        
        <!-- 模块内容 -->
        <div class="module-content">
          <div v-if="currentModule === 'viewCases'">
            <view-cases @select-case="selectCase"></view-cases>
          </div>
          <div v-if="currentModule === 'updateCase' && selectedCase">
            <update-case :case-item="selectedCase" @go-back="goBackToList"></update-case>
          </div>
        </div>
      </div>
    </div>
    
    <footer class="text-center py-3 colorgold">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h6 class="mb-2">联系我们</h6>
            <p class="mb-0">电话：123-456-7890</p>
            <p class="mb-0">邮箱：contact@citymanagement.com</p>
          </div>
          <div class="col-md-4">
            <p class="mb-0">© 2023 城市管理系统</p>
            <p class="mb-0">关于我们 | 站点地图 | 建议意见 | 法律声明</p>
          </div>
          <div class="col-md-4">
            <h6 class="mb-2">关注我们</h6>
            <div class="social-icons">
              <a href="#" class="me-2"><i class="bi bi-sina-weibo"></i></a>
              <a href="#" class="me-2"><i class="bi bi-wechat"></i></a>
              <a href="#" class="me-2"><i class="bi bi-tencent-qq"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import ViewCases from './components/ManagementHome/viewCases.vue';
import UpdateCase from './components/ManagementHome/UpdateCase.vue';
import axios from 'axios';

export default {
  name: 'ManageHome',
  components: {
    ViewCases,
    UpdateCase,
  },
  data() {
    return {
      currentModule: 'viewCases', // 初始模块为查看案件
      selectedCase: null, // 当前选择的案件
      loading: false,
      caseStats: {
        pending: 0,
        processing: 0,
        resolved: 0,
        totalReporters: 0
      },
      currentTheme: 'red', // 默认主题
      themeColors: {
        blue: {
          main: '#0d6efd',
          light: '#cfe2ff',
          dark: '#084298'
        },
        green: {
          main: '#198754',
          light: '#d1e7dd',
          dark: '#0f5132'
        },
        red: {
          main: '#c3161c',
          light: '#f8d7da',
          dark: '#a50f17'
        },
        purple: {
          main: '#6f42c1',
          light: '#e2d9f3',
          dark: '#4c2889'
        },
        orange: {
          main: '#fd7e14',
          light: '#ffe5d0',
          dark: '#b54e00'
        },
        dark: {
          main: '#212529',
          light: '#d3d3d4',
          dark: '#1a1e21'
        },
        gray: {
          main: '#6c757d',
          light: '#e2e3e5',
          dark: '#495057'
        }
      },

    };
  },
  mounted() {
    // 从localStorage获取保存的主题
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme && this.themeColors[savedTheme]) {
      this.changeTheme(savedTheme);
    } else {
      this.changeTheme(this.currentTheme);
    }
    
    // 获取案件统计信息
    this.fetchCaseStats();
    
    // 验证登录状态
    this.checkLoginStatus();
  },
  methods: {
    // 更改主题
    changeTheme(themeName) {
      if (!this.themeColors[themeName]) return;
      
      this.currentTheme = themeName;
      const theme = this.themeColors[themeName];
      
      // 设置CSS变量
      document.documentElement.style.setProperty('--theme-color', theme.main);
      document.documentElement.style.setProperty('--theme-color-light', theme.light);
      document.documentElement.style.setProperty('--theme-color-dark', theme.dark);
      
      // 保存到localStorage
      localStorage.setItem('adminTheme', themeName);
    },
    
    // 获取主题名称
    getThemeName(name) {
      const themeNames = {
        blue: '蓝色',
        green: '绿色',
        red: '红色',
        purple: '紫色',
        orange: '橙色',
        dark: '深色',
        gray: '灰色'
      };
      return themeNames[name] || name;
    },
    
    // 验证登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      
      // 验证token是否有效，且具有管理权限
      axios.post('/city/verifyToken', {
        token: token,
        type: "Management"
      })
      .catch(error => {
        console.error('验证失败:', error);
        localStorage.removeItem('jwtToken');
        this.$router.push('/login');
      });
    },
    
    // 获取案件统计信息
    async fetchCaseStats() {
      this.loading = true;
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;
        
        // 获取案件统计数据
        // 由于后端可能没有直接提供统计API，我们获取所有案件后在前端计算
        const response = await axios.get('/city/caseInfom/getInfoms', {
          params: { page: 1, pageSize: 100 }, // 获取足够多的案件来进行统计
          headers: { Authorization: token }
        });
        
        if (response.data && response.data.reports) {
          const cases = response.data.reports;
          
          // 统计不同状态的案件数量
          this.caseStats.pending = cases.filter(c => c.status === '未处理').length;
          this.caseStats.processing = cases.filter(c => c.status === '处理中').length;
          this.caseStats.resolved = cases.filter(c => c.status === '已解决').length;
          
          // 计算总的举报人数（去重）
          const reporters = new Set();
          cases.forEach(c => {
            if (c.reporter) reporters.add(c.reporter);
          });
          this.caseStats.totalReporters = reporters.size;
        }
      } catch (error) {
        console.error('获取案件统计失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // 选择案件
    selectCase(caseItem) {
      this.selectedCase = caseItem;
      this.currentModule = 'updateCase';
    },
    
    // 返回案件列表
    goBackToList(updated = false) {
      this.currentModule = 'viewCases';
      
      // 如果案件已更新，刷新案件统计
      if (updated) {
        this.fetchCaseStats();
      }
    },
    
    // 获取待处理案件数量
    getPendingCaseCount() {
      return this.caseStats.pending;
    },
    
    // 获取处理中案件数量
    getProcessingCaseCount() {
      return this.caseStats.processing;
    },
    
    // 获取已解决案件数量
    getResolvedCaseCount() {
      return this.caseStats.resolved;
    },
    
    // 获取举报人总数
    getTotalReporters() {
      return this.caseStats.totalReporters;
    },
    
    // 退出登录
    logout() {
      localStorage.removeItem('jwtToken');
      sessionStorage.removeItem('mfaVerified');
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
.admin-home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.logo {
  width: 50px;
  border-radius: 5px;
}

.background {
  background: url("https://portal.bjt.beijing.gov.cn/p/assets/imgs/loginBg.png") no-repeat center center fixed;
  background-size: cover;
  width: 100%;
  min-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
}

.color-swatch {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

/* 统计卡片样式 */
.stat-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--theme-color, #c3161c);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-icon i {
  font-size: 1.8rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0;
  color: #333;
}

.stat-label {
  margin-bottom: 0;
  color: #666;
}

/* 功能卡片样式 */
.feature-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  background-color: var(--theme-color-light, #f8d7da);
}

.feature-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: var(--theme-color, #c3161c);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.feature-icon i {
  font-size: 1.5rem;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.feature-text {
  margin-bottom: 0;
  color: #666;
  font-size: 0.9rem;
}

.module-content {
  margin-top: 20px;
}

.colorgold {
  background-color: #DABB85;
  color: #333;
  width: 100%;
  box-sizing: border-box;
}

footer {
  margin-top: auto;
}

.social-icons a {
  color: #333;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: var(--theme-color, #c3161c);
}

.theme-spinner {
  color: var(--theme-color, #c3161c);
}

.spinner-border.theme-spinner {
  border-right-color: transparent;
}

@media (max-width: 768px) {
  .background {
    min-height: 40vh;
  }
  
  .stat-card, .feature-card {
    margin-bottom: 15px;
  }
}
</style>
