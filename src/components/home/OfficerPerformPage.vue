<template>
  <div class="container mt-5">
    <h1 class="mb-4">绩效考核</h1>
    
    <!-- 加载提示 -->
    <div v-if="loading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
      <span class="ms-3">加载绩效数据中...</span>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close float-end" @click="errorMessage = ''"></button>
    </div>
    
    <!-- 筛选区域 -->
    <div class="d-flex justify-content-between mb-4" v-if="!loading">
      <div class="d-flex">
        <div class="me-3">
          <label for="filterName" class="form-label">姓名:</label>
          <input type="text" class="form-control" id="filterName" v-model="filters.name" placeholder="请输入姓名">
        </div>
        <div class="me-3">
          <label for="filterDepartment" class="form-label">部门:</label>
          <select class="form-select" id="filterDepartment" v-model="filters.department">
            <option value="">全部</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>
      </div>
      <div>
        <button class="btn btn-primary align-self-end me-2" @click="showAddModal">添加考核</button>
        <button class="btn btn-primary align-self-end" @click="applyFilters">查询</button>
      </div>
    </div>
    
    <!-- 表格区域 -->
    <div v-if="!loading">
      <div v-if="filteredEmployees.length === 0" class="alert alert-info">
        没有找到符合条件的绩效考核记录
      </div>
      <table v-else class="table table-hover">
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
            <td>{{ formatDateForDisplay(employee.EvaluationDate) }}</td>
            <td>
              <button class="btn btn-link" @click="viewPerformance(employee)">查看</button>
              <button class="btn btn-link" @click="editPerformance(employee)">修改</button>
              <button class="btn btn-link text-danger" @click="deletePerformance(employee)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
                       :disabled="isViewMode" required>
              </div>
              <div class="mb-3">
                <label for="employeeDepartment" class="form-label">部门</label>
                <select class="form-select" id="employeeDepartment" v-model="selectedEmployee.department"
                       :disabled="isViewMode" required>
                  <option value="">请选择部门</option>
                  <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="employeePosition" class="form-label">职位</label>
                <input type="text" class="form-control" id="employeePosition" v-model="selectedEmployee.position"
                       :disabled="isViewMode" required>
              </div>
              <div class="mb-3">
                <label for="completedCases" class="form-label">完成案件数</label>
                <input type="number" class="form-control" id="completedCases" v-model="selectedEmployee.CompletedCases"
                       :disabled="isViewMode" min="0" required>
              </div>
              <div class="mb-3">
                <label for="qualityScore" class="form-label">质量评分</label>
                <input type="number" step="0.01" class="form-control" id="qualityScore"
                       v-model="selectedEmployee.QualityScore" :disabled="isViewMode" min="0" max="100" required>
                <div class="form-text">0-100之间的分数</div>
              </div>
              <div class="mb-3">
                <label for="evaluationScore" class="form-label">考核评分</label>
                <input type="number" class="form-control" id="evaluationScore"
                       v-model="selectedEmployee.EvaluationScore" :disabled="isViewMode" min="0" max="100" required>
                <div class="form-text">0-100之间的分数</div>
              </div>
              <div class="mb-3">
                <label for="evaluationDate" class="form-label">考核日期</label>
                <input type="datetime-local" class="form-control" id="evaluationDate"
                       v-model="selectedEmployee.EvaluationDate" :disabled="isViewMode" required>
              </div>
              <div class="mb-3">
                <label for="comments" class="form-label">评语</label>
                <textarea class="form-control" id="comments" v-model="selectedEmployee.Comments"
                          :disabled="isViewMode" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label for="reportDate" class="form-label">报告日期</label>
                <input type="datetime-local" class="form-control" id="reportDate" v-model="selectedEmployee.ReportDate"
                       disabled>
                <div class="form-text">报告生成日期，自动填充</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">关闭</button>
            <button v-if="!isViewMode" type="button" class="btn btn-primary" @click="savePerformance">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OfficerPerformPage',
  data() {
    return {
      filters: {
        name: '',
        department: ''
      },
      employees: [],
      filteredEmployees: [],
      selectedEmployee: {},
      modalTitle: '',
      isModalVisible: false,
      isViewMode: false,
      loading: false,
      errorMessage: '',
      departments: ['执法监察部', '环境保护部', '市容管理部', '交通执法部', '建筑管理部', '公共设施部']
    };
  },
  mounted() {
    this.fetchPerformances();
  },
  methods: {
    // 获取所有绩效考核记录
    async fetchPerformances() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('/city/api/performances', {
          headers: {
            'Authorization': token
          }
        });
        
        if (response.data) {
          // 将后端数据映射到前端模型
          this.employees = response.data.map(item => ({
            ManageID: item.manageID, // 使用正确的后端字段名
            name: item.name,
            department: item.department,
            position: item.position,
            CompletedCases: item.completedCases,
            QualityScore: item.qualityScore,
            EvaluationScore: item.evaluationScore,
            EvaluationDate: this.formatDateForInput(item.evaluationDate),
            Comments: item.comments,
            ReportDate: this.formatDateForInput(item.reportDate)
          }));
          this.applyFilters();
        }
      } catch (error) {
        console.error('获取绩效考核记录失败:', error);
        this.errorMessage = '获取绩效考核记录失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    
    // 格式化日期为input元素可用的格式
    formatDateForInput(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      } catch (e) {
        return dateString;
      }
    },
    
    // 格式化日期为显示格式
    formatDateForDisplay(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    },
    
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
    
    async savePerformance() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // 准备要发送的数据
        const performanceData = {
          manageID: this.selectedEmployee.ManageID || null, // 使用正确的后端字段名
          name: this.selectedEmployee.name,
          department: this.selectedEmployee.department,
          position: this.selectedEmployee.position,
          completedCases: parseInt(this.selectedEmployee.CompletedCases),
          qualityScore: parseFloat(this.selectedEmployee.QualityScore),
          evaluationScore: parseInt(this.selectedEmployee.EvaluationScore),
          evaluationDate: this.selectedEmployee.EvaluationDate,
          comments: this.selectedEmployee.Comments,
          reportDate: this.selectedEmployee.ReportDate || new Date().toISOString().slice(0, 16)
        };
        
        let response;
        
        // 判断是新增还是修改
        if (this.modalTitle === '添加考核') {
          response = await axios.post('/city/api/performances', performanceData, {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          });
        } else {
          response = await axios.put('/city/api/performances', performanceData, {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (response.data) {
          alert(this.modalTitle === '添加考核' ? '添加成功' : '修改成功');
          this.fetchPerformances(); // 重新获取数据
        }
      } catch (error) {
        console.error('保存绩效考核记录失败:', error);
        alert('保存失败，请稍后重试');
      }
      
      this.closeModal();
    },
    
    async deletePerformance(employee) {
      if (!confirm('确定要删除该绩效考核记录吗？')) {
        return;
      }
      
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        const response = await axios.delete(`/city/api/performances/${employee.ManageID}`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (response.data) {
          alert('删除成功');
          this.fetchPerformances(); // 重新获取数据
        }
      } catch (error) {
        console.error('删除绩效考核记录失败:', error);
        alert('删除失败，请稍后重试');
      }
    },
    
    showAddModal() {
      this.selectedEmployee = {
        ManageID: 0, // 后端会自动分配ID
        name: '',
        department: '',
        position: '',
        CompletedCases: 0,
        QualityScore: 0,
        EvaluationScore: 0,
        EvaluationDate: new Date().toISOString().slice(0, 16),
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
