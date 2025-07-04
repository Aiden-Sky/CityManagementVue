<template>
  <div class="guest-home">
    <header class="d-flex justify-content-between align-items-center py-4 px-3"
            style="background-color: #c3161c; color: white;">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">市政反馈</h1>
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-outline-light me-2" @click="goToUserInfo">
          <i class="bi bi-person-circle"></i> 个人中心
        </button>
<!--        <button class="btn btn-outline-light me-2" @click="showLoginModal">-->
<!--          <i class="bi bi-box-arrow-in-right"></i> 登录-->
<!--        </button>-->
      </div>
    </header>
    <div class="background">
      <div class="container my-4 flex-grow-1">
        <!-- 添加介绍部分 -->
        <div class="intro-section text-center mb-4">
          <h2 class="intro-title">欢迎使用市政反馈系统</h2>
          <p class="intro-text">我们致力于为市民提供便捷的城市问题反馈渠道，共同建设美好家园。</p>
        </div>
        
        <!-- 服务卡片 -->
        <div class="row">
          <div class="col-md-6">
            <div class="card text-center service-card">
              <div class="card-body">
                <i class="bi bi-plus-circle service-icon"></i>
                <h5 class="card-title">在线反馈</h5>
                <p class="card-text">在此添加新的市政反馈，帮助我们及时发现并解决城市问题。</p>
                <router-link to="/addcase" class="btn btn-primary">前往在线反馈</router-link>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card text-center service-card">
              <div class="card-body">
                <i class="bi bi-search service-icon"></i>
                <h5 class="card-title">追踪反馈</h5>
                <p class="card-text">查看您提交的事件的办理进度，实时了解处理情况。</p>
                <router-link to="/tracecase" class="btn btn-primary">前往追踪反馈</router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 添加统计信息 -->
        <div class="stats-section mt-5">
          <h3 class="text-center mb-4">市政服务数据</h3>
          <div class="row">
            <div class="col-md-3 col-6">
              <div class="stat-card">
                <div class="stat-number">{{ stats.totalCases }}</div>
                <div class="stat-label">总反馈量</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="stat-card">
                <div class="stat-number">{{ stats.resolvedCases }}</div>
                <div class="stat-label">已解决</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="stat-card">
                <div class="stat-number">{{ stats.processingCases }}</div>
                <div class="stat-label">处理中</div>
              </div>
            </div>
            <div class="col-md-3 col-6">
              <div class="stat-card">
                <div class="stat-number">{{ stats.avgResponseTime }}</div>
                <div class="stat-label">平均响应时间(天)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="text-center  colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<script>
import AddCase from "@/components/GuestHome/AddCase.vue";
import TraceCase from "@/components/GuestHome/TraceCase.vue";
import axios from "axios";

export default {
  name: "GuestHome",
  data() {
    return {
      stats: {
        totalCases: 245,
        resolvedCases: 198,
        processingCases: 47,
        avgResponseTime: 2.5
      }
    };
  },
  mounted() {
    this.fetchStatistics();
  },
  methods: {
    fetchStatistics() {
      // 实际应用中应该从后端获取统计数据
      // axios.get('/city/statistics')
      //   .then(response => {
      //     this.stats = response.data;
      //   })
      //   .catch(error => {
      //     console.error('获取统计数据失败:', error);
      //   });
    },
    showLoginModal() {
      this.$router.push('/login');
    },
    goToUserInfo() {
      this.$router.push('/residentinfo');
    }
  }
};
</script>

<style scoped>
.guest-home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #c3161c;
  color: white;
  padding: 20px;
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

.intro-section {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.intro-title {
  color: #c3161c;
  margin-bottom: 15px;
}

.intro-text {
  font-size: 18px;
  color: #333;
}

.service-card {
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-icon {
  font-size: 2.5rem;
  color: #c3161c;
  margin-bottom: 15px;
}

.btn-primary {
  background-color: #c3161c;
  border: none;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #a61218;
}

.colorgold {
  background-color: #DABB85;
  height: 50px;
  text-align: center;
  line-height: 50px;
  width: 100%;
  box-sizing: border-box;
}

footer {
  margin-top: auto;
}

.stats-section {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 20px;
  border-radius: 10px;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #c3161c;
}

.stat-label {
  color: #555;
  font-size: 1rem;
}

.container {
  flex-grow: 1;
  padding: 0 15px;
  box-sizing: border-box;
}

.row {
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-6 {
  padding-right: 15px;
  padding-left: 15px;
}

@media (max-width: 768px) {
  .background {
    min-height: 40vh;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}
</style>
