<template>
  <div class="admin-home">
    <header class="d-flex justify-content-between align-items-center py-4 px-3" style="background-color: #c3161c; color: white;">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">城市管理员</h1>
      </div>
      <h2 class="mb-0">管理员</h2>
    </header>
    <div class="background">
      <div class="container my-4 flex-grow-1">
        <div class="row">
          <div class="col-md-6">
            <div class="card text-center" @click="currentModule = 'viewCases'">
              <div class="card-body">
                <h5 class="card-title">查看案件</h5>
                <p class="card-text">浏览并管理所有案件。</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card text-center" @click="currentModule = 'updateCase'">
              <div class="card-body" >
                <h5 class="card-title">修改案件进度</h5>
                <p class="card-text">更新案件的处理状态。</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="currentModule === 'viewCases'">
          <view-cases @select-case="selectCase"></view-cases>
        </div>
        <div v-if="currentModule === 'updateCase' && selectedCase">
          <update-case :case-item="selectedCase"></update-case>
        </div>
      </div>
    </div>
    <footer class="text-center mt-4 colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<script>
import ViewCases from './components/ManagementHome/viewCases.vue';
import UpdateCase from './components/ManagementHome/UpdateCase.vue';

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
    };
  },
  methods: {
    selectCase(caseItem) {
      this.selectedCase = caseItem;
      this.currentModule = 'updateCase';
    },
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
  padding: 20px; /* 添加内边距以避免内容紧贴边缘 */
  box-sizing: border-box;
}

.card {
  margin: 20px 0;
  background-color: white;
  cursor: pointer; /* 鼠标指针变为手型 */
}

.card:hover {
  background-color: #f0f0f0; /* 悬停时改变背景颜色 */
}

.btn-primary {
  background-color: #c3161c;
  border: none;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  display: inline-block;
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
}
</style>
