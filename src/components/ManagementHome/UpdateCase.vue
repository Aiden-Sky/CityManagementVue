<template>
  <div class="update-case">
    <h2 class="mb-4">修改案件进度</h2>
    <div v-if="caseItem">
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
}
</style>
