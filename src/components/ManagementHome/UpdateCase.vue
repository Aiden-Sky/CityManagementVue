<template>
  <div class="update-case">
    <h2 class="mb-4">修改案件进度</h2>
    <div v-if="caseItem" class="case-details">
      <h3>案件ID: {{ caseItem.CaseID }}</h3>
      <p>描述: {{ caseItem.Description }}</p>
      <div class="form-group">
        <label for="status">状态</label>
        <select id="status" class="form-control" v-model="caseItem.Status">
          <option>未处理</option>
          <option>处理中</option>
          <option>已处理</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="updateCase">更新</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateCase',
  props: {
    caseItem: {
      type: Object,
      required: true,
    }
  },
  methods: {
    updateCase() {
      alert(`案件 ${this.caseItem.CaseID} 的状态已更新为 ${this.caseItem.Status}`);
      // 在实际应用中，这里应发送请求到服务器更新案件状态
    }
  }
};
</script>

<style scoped>
.update-case {
  padding: 20px;
  max-width: 800px; /* 增大框体宽度 */
  margin: 0 auto; /* 居中布局 */
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 阴影 */
  backdrop-filter: blur(10px); /* 背景模糊效果 */
}

.case-details {
  padding: 30px; /* 增加内边距 */
  border-radius: 12px;
  background-color: rgba(189, 162, 140, 0.27); /* 深色半透明背景 */
}

h2, h3 {
  color: #373535; /* 使用白色文字以在深色背景上清晰显示 */
}

p {
  font-size: 1rem;
  color: #373535; /* 调整文字颜色 */
  line-height: 1.5;
}

.form-group {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #373535;
}

.form-control {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
  background-color: rgba(255, 255, 255, 0.7); /* 半透明背景色 */
}

.btn-primary {
  background-color: #c3161c;
  border: none;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #a50f17;
}
</style>
