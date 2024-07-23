<template>
  <div class="track-case">
    <header class="d-flex justify-content-between align-items-center py-4 px-3">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">反馈进度追踪</h1>
      </div>
      <h2 class="mb-0">用户</h2>
    </header>

    <div class="container my-4">
      <div class="content-wrapper">
        <h3 class="mb-4 text-white">居民反馈列表</h3>
        <div class="list-group">
          <button
            v-for="caseItem in cases"
            :key="caseItem.CaseID"
            class="list-group-item list-group-item-action"
            @click="selectCase(caseItem)"
          >
            事件ID: {{ caseItem.CaseID }} - {{ caseItem.Description }}
          </button>
        </div>

        <div v-if="selectedCase" class="case-details mt-4">
          <h4>事件详细信息</h4>
          <p><strong>事件ID:</strong> {{ selectedCase.CaseID }}</p>
          <p><strong>描述:</strong> {{ selectedCase.Description }}</p>
          <p><strong>状态:</strong> {{ selectedCase.Status }}</p>
          <p><strong>报告时间:</strong> {{ selectedCase.CreatedDate }}</p>
        </div>
      </div>
    </div>

    <footer class="text-center mt-4 colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "TrackCase",
  data() {
    return {
      cases: [], // 案件列表数据
      selectedCase: null, // 当前选择的案件
    };
  },
  methods: {
    fetchCases() {
      // 在实际应用中，这里应该请求服务器获取案件列表
      this.cases = [
        {
          CaseID: 1,
          Description: "道路坑洼",
          Status: "处理中",
          CreatedDate: "2024-07-17",
        },
        {
          CaseID: 2,
          Description: "路灯故障",
          Status: "未处理",
          CreatedDate: "2024-07-16",
        },
        // 添加更多示例案件数据
      ];
    },
    selectCase(caseItem) {
      this.selectedCase = caseItem;
    },
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
  background-color: rgba(195, 22, 28, 0.8);
  color: white;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  width: 50px;
  border-radius: 5px;
}

.colorgold {
  background-color: rgba(218, 187, 133, 0.8);
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: white;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-bottom: 10px;
}

.list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.02);
}

.case-details {
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.container {
  flex-grow: 1;
}
</style>
