<template>
  <div class="view-cases">
    <h2 class="mb-4">查看案件</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>案件ID</th>
          <th>描述</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="caseItem in cases" :key="caseItem.CaseID">
          <td>{{ caseItem.CaseID }}</td>
          <td>{{ caseItem.Description }}</td>
          <td>{{ caseItem.Status }}</td>
          <td>
            <button @click="$emit('select-case', caseItem)" class="btn btn-primary">修改进度</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ViewCases',
  data() {
    return {
      cases: [
        { CaseID: '1', Description: '道路维修', Status: '处理中' },
        { CaseID: '2', Description: '垃圾清理', Status: '未处理' },
        // 添加更多案件数据...
      ]
    };
  }
};
</script>

<style scoped>
.view-cases {
  padding: 20px;
}
</style>
