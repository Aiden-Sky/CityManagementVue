<template>
  <div class="container mt-5">
    <h1 class="mb-4">绩效考核</h1>
    <div class="d-flex justify-content-between mb-4">
      <div class="d-flex">
        <div class="me-3">
          <label for="filterName" class="form-label">姓名:</label>
          <input type="text" class="form-control" id="filterName" v-model="filters.name" placeholder="请输入姓名">
        </div>
        <div class="me-3">
          <label for="filterDepartment" class="form-label">部门:</label>
          <select class="form-select" id="filterDepartment" v-model="filters.department">
            <option value="">全部</option>
            <option value="技术部">技术部</option>
            <option value="市场部">市场部</option>
            <option value="财务部">财务部</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary align-self-end" @click="applyFilters">查询</button>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>姓名</th>
          <th>部门</th>
          <th>职位</th>
          <th>绩效考核分数</th>
          <th>考核日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in filteredEmployees" :key="employee.id">
          <td>{{ employee.name }}</td>
          <td>{{ employee.department }}</td>
          <td>{{ employee.position }}</td>
          <td>{{ employee.performanceScore }}</td>
          <td>{{ employee.reviewDate }}</td>
          <td>
            <button class="btn btn-link" @click="viewPerformance(employee)">查看</button>
            <button class="btn btn-link" @click="editPerformance(employee)">修改</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 模态框用于查看和编辑绩效考核记录 -->
    <div class="modal fade" id="performanceModal" tabindex="-1" aria-labelledby="performanceModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="performanceModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="employeeName" class="form-label">姓名</label>
                <input type="text" class="form-control" id="employeeName" v-model="selectedEmployee.name" disabled>
              </div>
              <div class="mb-3">
                <label for="employeeDepartment" class="form-label">部门</label>
                <input type="text" class="form-control" id="employeeDepartment" v-model="selectedEmployee.department" disabled>
              </div>
              <div class="mb-3">
                <label for="employeePosition" class="form-label">职位</label>
                <input type="text" class="form-control" id="employeePosition" v-model="selectedEmployee.position" disabled>
              </div>
              <div class="mb-3">
                <label for="performanceScore" class="form-label">绩效考核分数</label>
                <input type="number" class="form-control" id="performanceScore" v-model="selectedEmployee.performanceScore">
              </div>
              <div class="mb-3">
                <label for="reviewDate" class="form-label">考核日期</label>
                <input type="date" class="form-control" id="reviewDate" v-model="selectedEmployee.reviewDate">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" @click="savePerformance">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OfficerPerformPage',
  data() {
    return {
      filters: {
        name: '',
        department: ''
      },
      employees: [
        // 示例员工数据
        {
          id: 1,
          name: '张三',
          department: '技术部',
          position: '工程师',
          performanceScore: 90,
          reviewDate: '2024-06-01'
        },
        {
          id: 2,
          name: '李四',
          department: '市场部',
          position: '市场经理',
          performanceScore: 85,
          reviewDate: '2024-06-10'
        }
      ],
      filteredEmployees: [],
      selectedEmployee: {},
      modalTitle: ''
    };
  },
  mounted() {
    this.applyFilters();
  },
  methods: {
    applyFilters() {
      this.filteredEmployees = this.employees.filter(employee => {
        return (
          (!this.filters.name || employee.name.includes(this.filters.name)) &&
          (!this.filters.department || employee.department.includes(this.filters.department))
        );
      });
    },
    viewPerformance(employee) {
      this.selectedEmployee = { ...employee };
      this.modalTitle = '查看绩效考核';
      new bootstrap.Modal(document.getElementById('performanceModal')).show();
    },
    editPerformance(employee) {
      this.selectedEmployee = { ...employee };
      this.modalTitle = '修改绩效考核';
      new bootstrap.Modal(document.getElementById('performanceModal')).show();
    },
    savePerformance() {
      // 保存绩效考核逻辑
      const index = this.employees.findIndex(e => e.id === this.selectedEmployee.id);
      if (index !== -1) {
        this.employees.splice(index, 1, this.selectedEmployee);
      }
      this.applyFilters();
      new bootstrap.Modal(document.getElementById('performanceModal')).hide();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.table-hover tbody tr:hover {
  background-color: #f5f5f5;
}
.btn-link {
  padding: 0;
  font-size: 0.875rem;
}
</style>
