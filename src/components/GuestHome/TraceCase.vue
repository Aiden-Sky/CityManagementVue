<template>
  <div class="track-case">
    <header class="d-flex justify-content-between align-items-center py-4 px-3">
      <div class="d-flex align-items-center">
        <button class="btn btn-light me-2" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">反馈进度追踪</h1>
      </div>
      <h2 class="mb-0">用户</h2>
    </header>

    <div class="container my-4">
      <div class="content-wrapper">
        <div class="filter-section mb-4">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="输入事件ID或关键词搜索..." 
                  v-model="searchQuery"
                  @keyup.enter="searchCases"
                >
                <button class="btn btn-primary" @click="searchCases">
                  <i class="bi bi-search"></i> 搜索
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex justify-content-end">
                <div class="dropdown">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    状态: {{ activeFilter || '全部' }}
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterDropdown">
                    <li><a class="dropdown-item" href="#" @click.prevent="applyFilter('')">全部</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="applyFilter('未处理')">未处理</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="applyFilter('处理中')">处理中</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="applyFilter('已完成')">已完成</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <!-- 左侧列表 -->
          <div class="col-md-4">
            <h3 class="list-title mb-3">居民反馈列表</h3>
            
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
              <p class="mt-2">加载中...</p>
            </div>
            
            <div v-else-if="filteredCases.length === 0" class="no-cases text-center py-5">
              <i class="bi bi-inbox-fill"></i>
              <p>暂无反馈记录</p>
              <button class="btn btn-outline-primary" @click="$router.push('/addcase')">
                创建新反馈
              </button>
            </div>
            
            <div v-else class="list-group case-list">
              <button
                v-for="caseItem in filteredCases"
                :key="caseItem.CaseID"
                class="list-group-item list-group-item-action"
                :class="{ 'active': selectedCase && selectedCase.CaseID === caseItem.CaseID }"
                @click="selectCase(caseItem)"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="case-id">ID: {{ caseItem.CaseID }}</span>
                    <div class="case-title">{{ caseItem.Description }}</div>
                  </div>
                  <span class="status-badge" :class="getStatusClass(caseItem.Status)">
                    {{ caseItem.Status }}
                  </span>
                </div>
                <div class="case-meta">
                  <small>{{ caseItem.CreatedDate }}</small>
                </div>
              </button>
            </div>
          </div>
          
          <!-- 右侧详情 -->
          <div class="col-md-8">
            <div v-if="selectedCase" class="case-details">
              <div class="card">
                <div class="card-header">
                  <h4 class="mb-0">事件详细信息</h4>
                </div>
                <div class="card-body">
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <p><strong>事件ID:</strong> {{ selectedCase.CaseID }}</p>
                      <p><strong>报告时间:</strong> {{ selectedCase.CreatedDate }}</p>
                      <p><strong>反馈类型:</strong> {{ selectedCase.CaseType || '未分类' }}</p>
                      <p><strong>反馈人:</strong> {{ selectedCase.Reporter }}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>当前状态:</strong> 
                        <span class="status-badge" :class="getStatusClass(selectedCase.Status)">
                          {{ selectedCase.Status }}
                        </span>
                      </p>
                      <p><strong>处理时长:</strong> {{ calculateProcessingTime(selectedCase) }}</p>
                      <p><strong>位置:</strong> {{ selectedCase.LocationDescribe || '未知' }}</p>
                      <p><strong>处理方式:</strong> {{ selectedCase.HandlingMethod || '暂无' }}</p>
                    </div>
                  </div>
                  
                  <h5>问题描述</h5>
                  <div class="description-box mb-3">
                    {{ selectedCase.Description }}
                  </div>
                  
                  <!-- 现场图片 -->
                  <div v-if="selectedCase.PhotoUrl" class="mb-4">
                    <h5>现场图片</h5>
                    <div class="image-container">
                      <img :src="selectedCase.PhotoUrl" alt="现场图片" class="case-image img-fluid">
                    </div>
                  </div>
                  
                  <!-- 进度追踪 -->
                  <h5>处理进度</h5>
                  <div class="timeline">
                    <div class="timeline-item">
                      <div class="timeline-badge bg-primary">
                        <i class="bi bi-check"></i>
                      </div>
                      <div class="timeline-content">
                        <h6 class="timeline-title">问题提交</h6>
                        <p class="timeline-date">{{ selectedCase.CreatedDate }}</p>
                        <p>您的反馈已成功提交至系统</p>
                      </div>
                    </div>
                    
                    <div class="timeline-item" :class="{ 'completed': selectedCase.Status !== '未处理' }">
                      <div class="timeline-badge" :class="selectedCase.Status !== '未处理' ? 'bg-primary' : 'bg-secondary'">
                        <i class="bi" :class="selectedCase.Status !== '未处理' ? 'bi-check' : 'bi-clock'"></i>
                      </div>
                      <div class="timeline-content">
                        <h6 class="timeline-title">问题审核</h6>
                        <p class="timeline-date">{{ selectedCase.VerifiedDate || '待处理' }}</p>
                        <p>{{ selectedCase.Status !== '未处理' ? '您的反馈已由管理员审核' : '等待管理员审核' }}</p>
                      </div>
                    </div>
                    
                    <div class="timeline-item" :class="{ 'completed': selectedCase.Status === '处理中' || selectedCase.Status === '已完成' }">
                      <div class="timeline-badge" :class="selectedCase.Status === '处理中' || selectedCase.Status === '已完成' ? 'bg-primary' : 'bg-secondary'">
                        <i class="bi" :class="selectedCase.Status === '处理中' || selectedCase.Status === '已完成' ? 'bi-check' : 'bi-clock'"></i>
                      </div>
                      <div class="timeline-content">
                        <h6 class="timeline-title">问题处理</h6>
                        <p class="timeline-date">{{ selectedCase.ProcessDate || '待处理' }}</p>
                        <p>{{ selectedCase.Status === '处理中' || selectedCase.Status === '已完成' ? '反馈正在处理中' : '等待处理' }}</p>
                      </div>
                    </div>
                    
                    <div class="timeline-item" :class="{ 'completed': selectedCase.Status === '已完成' }">
                      <div class="timeline-badge" :class="selectedCase.Status === '已完成' ? 'bg-primary' : 'bg-secondary'">
                        <i class="bi" :class="selectedCase.Status === '已完成' ? 'bi-check' : 'bi-clock'"></i>
                      </div>
                      <div class="timeline-content">
                        <h6 class="timeline-title">问题解决</h6>
                        <p class="timeline-date">{{ selectedCase.ClosedDate || '待完成' }}</p>
                        <p>{{ selectedCase.Status === '已完成' ? '问题已解决' : '问题处理中' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="no-selection text-center py-5">
              <i class="bi bi-arrow-left-circle"></i>
              <p>请从左侧列表选择一个反馈查看详情</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="text-center mt-4 colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "TraceCase",
  data() {
    return {
      cases: [], // 案件列表数据
      selectedCase: null, // 当前选择的案件
      isLoading: true,
      searchQuery: '',
      activeFilter: '',
    };
  },
  computed: {
    filteredCases() {
      let result = this.cases;
      
      // 应用状态筛选
      if (this.activeFilter) {
        result = result.filter(item => item.Status === this.activeFilter);
      }
      
      // 应用搜索筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(item => {
          return (
            item.CaseID.toString().includes(query) ||
            (item.Description && item.Description.toLowerCase().includes(query)) ||
            (item.LocationDescribe && item.LocationDescribe.toLowerCase().includes(query))
          );
        });
      }
      
      return result;
    }
  },
  methods: {
    fetchCases() {
      this.isLoading = true;
      
      // 在实际应用中，应该请求后端API获取数据
      // axios.get('/city/caseInfom/GetInfom')
      //   .then(response => {
      //     this.cases = response.data;
      //     this.isLoading = false;
      //   })
      //   .catch(error => {
      //     console.error('获取反馈列表失败:', error);
      //     this.isLoading = false;
      //   });
      
      // 模拟API请求延迟
      setTimeout(() => {
        this.cases = [
          {
            CaseID: 1,
            Description: "道路坑洼需要修复",
            Status: "处理中",
            CreatedDate: "2024-07-17",
            CaseType: "道路维修",
            Reporter: "王小明",
            LocationDescribe: "和平路与民族大道交叉口",
            Location: "114.31,30.52",
            HandlingMethod: "已派遣道路修复团队",
            VerifiedDate: "2024-07-18",
            ProcessDate: "2024-07-19",
            PhotoUrl: "https://img.zcool.cn/community/016ba8554b952f000001bf72338727.jpg"
          },
          {
            CaseID: 2,
            Description: "路灯故障，晚上无法照明",
            Status: "未处理",
            CreatedDate: "2024-07-16",
            CaseType: "公共设施",
            Reporter: "李明",
            LocationDescribe: "文化路78号路灯",
            Location: "114.29,30.50",
            HandlingMethod: "",
          },
          {
            CaseID: 3,
            Description: "小区绿化带垃圾堆积",
            Status: "已完成",
            CreatedDate: "2024-07-14",
            CaseType: "环境卫生",
            Reporter: "张华",
            LocationDescribe: "阳光小区东门",
            Location: "114.30,30.51",
            HandlingMethod: "环卫部门已清理完毕",
            VerifiedDate: "2024-07-15",
            ProcessDate: "2024-07-16",
            ClosedDate: "2024-07-17",
          },
          {
            CaseID: 4,
            Description: "公交站牌损坏",
            Status: "处理中",
            CreatedDate: "2024-07-15",
            CaseType: "公共设施",
            Reporter: "刘芳",
            LocationDescribe: "光谷大道公交站",
            Location: "114.32,30.53",
            HandlingMethod: "已安排维修人员",
            VerifiedDate: "2024-07-16",
            ProcessDate: "2024-07-18",
          },
        ];
        this.isLoading = false;
      }, 800);
    },
    selectCase(caseItem) {
      this.selectedCase = caseItem;
    },
    goBack() {
      this.$router.go(-1);
    },
    searchCases() {
      // 已经通过计算属性filteredCases实现
      console.log('搜索:', this.searchQuery);
    },
    applyFilter(status) {
      this.activeFilter = status;
    },
    getStatusClass(status) {
      switch (status) {
        case '未处理':
          return 'status-pending';
        case '处理中':
          return 'status-processing';
        case '已完成':
          return 'status-completed';
        default:
          return 'status-default';
      }
    },
    calculateProcessingTime(caseItem) {
      if (caseItem.Status === '未处理') {
        return '暂未处理';
      }
      
      if (caseItem.ClosedDate) {
        // 如果已关闭，计算从创建到关闭的时间
        const createdDate = new Date(caseItem.CreatedDate);
        const closedDate = new Date(caseItem.ClosedDate);
        const diffDays = Math.round((closedDate - createdDate) / (1000 * 60 * 60 * 24));
        return `${diffDays}天`;
      } else {
        // 如果未关闭，计算从创建到现在的时间
        const createdDate = new Date(caseItem.CreatedDate);
        const today = new Date();
        const diffDays = Math.round((today - createdDate) / (1000 * 60 * 60 * 24));
        return `${diffDays}天（进行中）`;
      }
    }
  },
  mounted() {
    this.fetchCases(); // 在组件挂载时获取案件列表
  },
};
</script>

<style scoped>
.track-case {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url('https://portal.bjt.beijing.gov.cn/p/assets/imgs/loginBg.png') no-repeat center center fixed;
  background-size: cover;
}

header {
  background-color: rgba(195, 22, 28, 0.9);
  color: white;
  padding: 15px 20px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.logo {
  width: 50px;
  border-radius: 5px;
}

.colorgold {
  background-color: rgba(218, 187, 133, 0.9);
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: white;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-section {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.list-title {
  color: #c3161c;
  font-size: 1.5rem;
  font-weight: 600;
}

.case-list {
  max-height: 550px;
  overflow-y: auto;
  border-radius: 8px;
}

.list-group-item {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  border-radius: 6px !important;
  border-left: 3px solid transparent;
}

.list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.list-group-item.active {
  background-color: rgba(195, 22, 28, 0.1);
  border-left: 3px solid #c3161c;
  color: #333;
}

.case-id {
  font-size: 0.8rem;
  color: #666;
  display: block;
}

.case-title {
  font-weight: 600;
  margin-top: 4px;
}

.case-meta {
  margin-top: 8px;
  font-size: 0.8rem;
  color: #777;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pending {
  background-color: #ffc107;
  color: #333;
}

.status-processing {
  background-color: #17a2b8;
  color: white;
}

.status-completed {
  background-color: #28a745;
  color: white;
}

.status-default {
  background-color: #6c757d;
  color: white;
}

.case-details {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.card {
  border: none;
  height: 100%;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0,0,0,.125);
}

.description-box {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #e9ecef;
}

.image-container {
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 5px;
  margin-top: 10px;
}

.case-image {
  max-height: 300px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
  border-radius: 4px;
}

.no-selection, .no-cases {
  color: #6c757d;
  padding: 50px 0;
}

.no-selection i, .no-cases i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* 时间轴样式 */
.timeline {
  position: relative;
  padding-left: 40px;
  margin-top: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 19px;
  width: 2px;
  background-color: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
  opacity: 0.7;
}

.timeline-item.completed {
  opacity: 1;
}

.timeline-badge {
  position: absolute;
  left: -40px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  text-align: center;
  color: white;
  z-index: 1;
}

.timeline-content {
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.timeline-title {
  margin: 0;
  color: #333;
}

.timeline-date {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 5px 0;
}

.container {
  flex-grow: 1;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 15px;
  }
  
  .case-list {
    max-height: 300px;
  }
  
  .timeline {
    padding-left: 30px;
  }
  
  .timeline-badge {
    width: 30px;
    height: 30px;
    line-height: 30px;
    left: -30px;
  }
}
</style>
