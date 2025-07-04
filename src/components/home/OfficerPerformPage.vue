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
      <div>
        <button class="btn btn-primary align-self-end me-2" @click="showAddModal">添加考核</button>
        <button class="btn btn-primary align-self-end" @click="applyFilters">查询</button>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>姓名</th>
          <th>部门</th>
          <th>职位</th>
          <th>完成案件数</th>
          <th>质量评分</th>
          <th>考核评分</th>
          <th>考核日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="employee in filteredEmployees" :key="employee.ManageID">
          <td>{{ employee.name }}</td>
          <td>{{ employee.department }}</td>
          <td>{{ employee.position }}</td>
        <td>{{ employee.CompletedCases }}</td>
        <td>{{ employee.QualityScore }}</td>
        <td>{{ employee.EvaluationScore }}</td>
        <td>{{ employee.EvaluationDate }}</td>
          <td>
            <button class="btn btn-link" @click="viewPerformance(employee)">查看</button>
            <button class="btn btn-link" @click="editPerformance(employee)">修改</button>
            <button class="btn btn-link text-danger" @click="deletePerformance(employee)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 模态框用于查看和编辑绩效考核记录 -->
    <div v-if="isModalVisible" class="modal fade show d-block" tabindex="-1" aria-labelledby="performanceModalLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="performanceModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="employeeName" class="form-label">姓名</label>
                <input type="text" class="form-control" id="employeeName" v-model="selectedEmployee.name"
                       :disabled="isViewMode">
              </div>
              <div class="mb-3">
                <label for="employeeDepartment" class="form-label">部门</label>
                <input type="text" class="form-control" id="employeeDepartment" v-model="selectedEmployee.department"
                       :disabled="isViewMode">
              </div>
              <div class="mb-3">
                <label for="employeePosition" class="form-label">职位</label>
                <input type="text" class="form-control" id="employeePosition" v-model="selectedEmployee.position"
                       :disabled="isViewMode">
              </div>
              <div class="mb-3">
                <label for="completedCases" class="form-label">完成案件数</label>
                <input type="number" class="form-control" id="completedCases" v-model="selectedEmployee.CompletedCases"
                       :disabled="isViewMode">
              </div>
              <div class="mb-3">
                <label for="qualityScore" class="form-label">质量评分</label>
                <input type="number" step="0.01" class="form-control" id="qualityScore"
                       v-model="selectedEmployee.QualityScore" :disabled="isViewMode">
              </div>
              <div class="mb-3">
                <label for="evaluationScore" class="form-label">考核评分</label>
                <input type="number" class="form-control" id="evaluationScore"
                       v-model="selectedEmployee.EvaluationScore" :disabled="isViewMode">
              </div>
              <div class="mb-3">
                <label for="evaluationDate" class="form-label">考核日期</label>
                <input type="datetime-local" class="form-control" id="evaluationDate"
                       v-model="selectedEmployee.EvaluationDate" :disabled="isViewMode">
              </div>
              <div class="mb-3">
                <label for="comments" class="form-label">评语</label>
                <textarea class="form-control" id="comments" v-model="selectedEmployee.Comments"
                          :disabled="isViewMode"></textarea>
              </div>
              <div class="mb-3">
                <label for="reportDate" class="form-label">报告日期</label>
                <input type="datetime-local" class="form-control" id="reportDate" v-model="selectedEmployee.ReportDate"
                       disabled>
              </div>
            </form>
          </div>
          <div class="modal-footer" v-if="!isViewMode">
            <button type="button" class="btn btn-secondary" @click="closeModal">关闭</button>
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
        {
          ManageID: 2,
          name: '李四',
          department: '执法监察部',
          position: '执法员',
          CompletedCases: 28,
          QualityScore: 85.3,
          EvaluationScore: 87,
          EvaluationDate: '2024-07-15T12:00',
          Comments: '处理案件迅速，但需加强法律知识',
          ReportDate: '2024-07-15T08:00'
        },
        {
          ManageID: 3,
          name: '王五',
          department: '环境保护部',
          position: '执法官',
          CompletedCases: 35,
          QualityScore: 90.2,
          EvaluationScore: 92,
          EvaluationDate: '2024-07-10T12:00',
          Comments: '表现优秀，执行力强',
          ReportDate: '2024-07-10T08:00'
        },
        {
          ManageID: 4,
          name: '赵六',
          department: '市容管理部',
          position: '执法员',
          CompletedCases: 20,
          QualityScore: 83.7,
          EvaluationScore: 81,
          EvaluationDate: '2024-06-20T12:00',
          Comments: '工作尽职，但需提升现场应变能力',
          ReportDate: '2024-06-20T08:00'
        },
        {
          ManageID: 5,
          name: '孙七',
          department: '交通执法部',
          position: '执法监督员',
          CompletedCases: 26,
          QualityScore: 88.4,
          EvaluationScore: 86,
          EvaluationDate: '2024-07-01T12:00',
          Comments: '执法规范，沟通能力较强',
          ReportDate: '2024-07-01T08:00'
        },
        {
          ManageID: 6,
          name: '张伟',
          department: '建筑管理部',
          position: '执法员',
          CompletedCases: 32,
          QualityScore: 87.5,
          EvaluationScore: 89,
          EvaluationDate: '2024-07-20T12:00',
          Comments: '执法工作规范，细节处理到位',
          ReportDate: '2024-07-20T08:00'
        },
        {
          ManageID: 7,
          name: '刘婷',
          department: '公共设施部',
          position: '执法监督员',
          CompletedCases: 24,
          QualityScore: 82.1,
          EvaluationScore: 80,
          EvaluationDate: '2024-07-25T12:00',
          Comments: '工作认真，但需提高执法效率',
          ReportDate: '2024-07-25T08:00'
        }
      ]
      ,
      filteredEmployees: [],
      selectedEmployee: {},
      modalTitle: '',
      isModalVisible: false,
      isViewMode: false
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
      this.isViewMode = true;
      this.isModalVisible = true;
    },
    editPerformance(employee) {
      this.selectedEmployee = { ...employee };
      this.modalTitle = '修改绩效考核';
      this.isViewMode = false;
      this.isModalVisible = true;
    },
    savePerformance() {
      const index = this.employees.findIndex(e => e.ManageID === this.selectedEmployee.ManageID);
      if (index !== -1) {
        this.employees.splice(index, 1, this.selectedEmployee);
      } else {
        this.employees.push(this.selectedEmployee);
      }
      this.applyFilters();
      this.closeModal();
    },
    deletePerformance(employee) {
      const index = this.employees.findIndex(e => e.ManageID === employee.ManageID);
      if (index !== -1) {
        this.employees.splice(index, 1);
      }
      this.applyFilters();
    },
    showAddModal() {
      this.selectedEmployee = {
        ManageID: this.employees.length + 1,
        name: '',
        department: '',
        position: '',
        CompletedCases: 0,
        QualityScore: 0,
        EvaluationScore: 0,
        EvaluationDate: '',
        Comments: '',
        ReportDate: new Date().toISOString().slice(0, 16)
      };
      this.modalTitle = '添加考核';
      this.isViewMode = false;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
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
