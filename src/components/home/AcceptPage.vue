<template>
  <div class="container-fluid">
    <div class="alert alert-info text-center mb-3" v-if="loading">
      <i class="fas fa-spinner fa-spin mr-2"></i> 正在加载数据...
    </div>
    <div class="alert alert-danger text-center mb-3" v-if="error">
      {{ error }}
    </div>
    
    <div class="row">
      <div class="col-md-3">
        <div class="sidebar">
          <h3 class="text-primary mb-3"><i class="fas fa-clipboard-list"></i> 居民反馈受理</h3>
          <div class="btn-container">
            <button class="btn btn-danger mb-3" style="width: 50%" @click="deleteSelectedReports" :disabled="selectedReports.length === 0">
              <i class="fas fa-trash-alt"></i> 批量删除
            </button>
          </div>
          <div class="filter-panel">
            <h5><i class="fas fa-filter"></i> 高级筛选</h5>
            <div class="input-group mb-2">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input type="text" class="form-control" placeholder="按信息描述搜索" v-model="searchQuery">
            </div>
            <div class="mb-2">
              <label class="form-label">状态筛选</label>
              <select class="form-select" v-model="statusFilter">
                <option value="">全部状态</option>
                <option value="待处理">待处理</option>
                <option value="处理中">处理中</option>
                <option value="已完成">已完成</option>
                <option value="已撤销">已撤销</option>
              </select>
            </div>
            <div class="list-group">
              <button class="list-group-item list-group-item-action">
                <i class="fas fa-tags"></i> 大类小类查询
              </button>
              <button class="list-group-item list-group-item-action">
                <i class="fas fa-map-marker-alt"></i> 区域查询
              </button>
              <button class="list-group-item list-group-item-action">
                <i class="fas fa-calendar-alt"></i> 时间段
              </button>
            </div>
            <div class="mt-3">
              <button class="btn btn-primary" style="width:100px;">
                <i class="fas fa-search"></i> 查询
              </button>
              <button class="btn btn-secondary" style="width:100px;" @click="resetFilters">
                <i class="fas fa-redo"></i> 重置
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="card mb-3">
          <div class="card-header bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="fas fa-list"></i> 居民反馈列表</h5>
              <span class="badge bg-light text-dark">共 {{ totalItems }} 条记录</span>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th><input type="checkbox" @click="selectAll" :checked="reports.length > 0 && selectedReports.length === reports.length"></th>
                    <th>序号</th>
                    <th>举报人</th>
                    <th>举报人电话</th>
                    <th>举报时间</th>
                    <th>信息描述</th>
                    <th>位置描述</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="reports.length === 0">
                    <td colspan="9" class="text-center py-3">暂无数据</td>
                  </tr>
                  <tr v-for="report in filteredReports" :key="report.caseID" :class="{'table-warning': selectedReports.includes(report.caseID)}">
                    <td><input type="checkbox" :value="report.caseID" v-model="selectedReports" @click.stop/></td>
                    <td>{{ report.caseID }}</td>
                    <td>{{ report.reporter }}</td>
                    <td>{{ report.reporterPhone }}</td>
                    <td>{{ formatDateTime(report.createdDate) }}</td>
                    <td :title="report.description">{{ truncateText(report.description, 20) }}</td>
                    <td :title="report.locationDescribe">{{ truncateText(report.locationDescribe, 15) }}</td>
                    <td>
                      <span :class="getStatusClass(report.status)">{{ report.status }}</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" @click="selectReport(report)" title="查看详情">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-success ms-1" @click="showAssignManagerModal(report)" 
                        title="立案" :disabled="report.status !== '待处理'">
                        <i class="fas fa-check-circle"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-footer">
            <pagination :total="totalPages" :current="currentPage" @change="handlePageChange"
                      style="display: flex; justify-content: center;"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 案件详情面板 -->
    <div class="details-panel" v-if="selectedReport">
      <div class="details-header">
        <h5><i class="fas fa-folder-open"></i> 案件详情 #{{ selectedReport.caseID }}</h5>
        <button type="button" class="close" @click="selectedReport = null">&times;</button>
      </div>
      <div class="details-body">
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-user"></i> 举报人:</span>
          <span class="detail-value">{{ selectedReport.reporter }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-phone"></i> 电话:</span>
          <span class="detail-value">{{ selectedReport.reporterPhone }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-clock"></i> 举报时间:</span>
          <span class="detail-value">{{ formatDateTime(selectedReport.createdDate) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-reply"></i> 是否需要回复:</span>
          <span class="detail-value">{{ selectedReport.needResponse ? '是' : '否' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-info-circle"></i> 信息描述:</span>
          <span class="detail-value">{{ selectedReport.description }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-tag"></i> 信息大类:</span>
          <span class="detail-value">{{ selectedReport.infoCategory }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-file-alt"></i> 案件类型:</span>
          <span class="detail-value">{{ selectedReport.caseType }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-map-marker-alt"></i> 位置:</span>
          <span class="detail-value">{{ selectedReport.location }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-map"></i> 位置描述:</span>
          <span class="detail-value">{{ selectedReport.locationDescribe }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-chart-bar"></i> 状态:</span>
          <span class="detail-value" :class="getStatusClass(selectedReport.status)">{{ selectedReport.status }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-exclamation-triangle"></i> 严重程度:</span>
          <span class="detail-value">{{ selectedReport.severity }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-check-circle"></i> 是否核实:</span>
          <span class="detail-value">{{ selectedReport.verified ? '是' : '否' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label"><i class="fas fa-tools"></i> 处理方式:</span>
          <span class="detail-value">{{ selectedReport.handlingMethod || '暂无' }}</span>
        </div>
        <div class="detail-item" v-if="selectedReport.closedDate">
          <span class="detail-label"><i class="fas fa-calendar-check"></i> 关闭日期:</span>
          <span class="detail-value">{{ formatDateTime(selectedReport.closedDate) }}</span>
        </div>
        <div class="detail-item" v-if="selectedReport.photoUrl">
          <span class="detail-label"><i class="fas fa-image"></i> 图片:</span>
          <div class="detail-value">
            <img :src="selectedReport.photoUrl" alt="报告图片" class="img-thumbnail" />
          </div>
        </div>
      </div>
      <div class="details-actions">
        <button class="btn btn-warning" @click="invalidateReport" :disabled="selectedReport.status !== '待处理'">
          <i class="fas fa-ban"></i> 作废
        </button>
        <button class="btn btn-primary" @click="showAssignManagerModal(selectedReport)" :disabled="selectedReport.status !== '待处理'">
          <i class="fas fa-clipboard-check"></i> 立案
        </button>
      </div>
    </div>

    <!-- 承办人选择弹窗 -->
    <div class="modal fade show" tabindex="-1" role="dialog" v-if="showManagerModal">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fas fa-user-check"></i> 选择承办人</h5>
            <button type="button" class="btn-close" @click="closeManagerModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info" v-if="loadingManagers">
              <i class="fas fa-spinner fa-spin mr-2"></i> 正在加载承办人列表...
            </div>
            <div class="alert alert-danger" v-if="managerError">
              {{ managerError }}
            </div>
            <div class="mb-3" v-if="!loadingManagers && !managerError">
              <label for="managerSelect" class="form-label">承办人列表</label>
              <select v-model="selectedManagerID" class="form-select" id="managerSelect" required>
                <option value="" disabled selected>请选择承办人</option>
                <option v-for="manager in managers" :key="manager.managerID" :value="manager.managerID">
                  {{ manager.name }} (ID: {{ manager.managerID }})
                </option>
              </select>
              <div class="form-text">选择一位负责人来处理该案件</div>
            </div>
            <div class="mb-3">
              <label for="caseNotes" class="form-label">处理备注</label>
              <textarea class="form-control" id="caseNotes" v-model="caseNotes" rows="3" 
                placeholder="请输入案件处理备注信息..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeManagerModal">
              <i class="fas fa-times"></i> 取消
            </button>
            <button type="button" class="btn btn-primary" @click="assignManager" :disabled="!selectedManagerID || assigningManager">
              <i class="fas fa-check"></i> {{ assigningManager ? '提交中...' : '确认' }}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import pagination from "@/components/tools/PageInation.vue";

const pageSize = 10; // 设置单页显示个数

export default {
  name: 'AcceptPage',
  components: { pagination },
  data() {
    return {
      reports: [],
      selectedReport: null,
      selectedReports: [], // 用于存储选中的报告ID
      totalPages: 1,
      totalItems: 0,
      currentPage: 1,
      loading: false,
      error: null,
      showManagerModal: false, // 管理员选择模态窗口可见性
      loadingManagers: false,
      managerError: null,
      selectedManagerID: null, // 选中的管理员ID
      caseNotes: '', // 案件处理备注
      managers: [], // 管理员列表
      assigningManager: false, // 是否正在分配管理员
      searchQuery: '', // 搜索关键词
      statusFilter: '', // 状态筛选
      newReport: {
        caseID: '',
        photoUrl: '',
        caseType: '',
        description: '',
        location: '',
        locationDescribe: '',
        status: '',
        createdDate: '',
        closedDate: '',
        reporter: '',
        reporterPhone: '',
        needResponse: false,
        infoCategory: '',
        handlingMethod: '',
        verified: false,
        severity: '',
        managerID: null // 管理员ID字段
      }
    };
  },
  computed: {
    filteredReports() {
      let result = [...this.reports];
      
      // 状态筛选
      if (this.statusFilter) {
        result = result.filter(report => report.status === this.statusFilter);
      }
      
      // 搜索关键词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(report => 
          (report.description && report.description.toLowerCase().includes(query)) ||
          (report.reporter && report.reporter.toLowerCase().includes(query)) ||
          (report.locationDescribe && report.locationDescribe.toLowerCase().includes(query))
        );
      }
      
      return result;
    }
  },
  methods: {
    fetchReports(page = 1) {
      this.loading = true;
      this.error = null;
      const token = localStorage.getItem('jwtToken');
      
      axios.get(`/city/caseInfom/getInfoms?page=${page}&pageSize=${pageSize}`, {
        headers: {
          'Authorization': token
        }
      })
        .then(response => {
          this.reports = response.data.reports;
          this.totalPages = response.data.totalPages;
          this.totalItems = this.totalPages * pageSize; // 估计总项目数
          this.currentPage = page;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          if (error.response && error.response.status === 401) {
            this.error = "身份验证失败，请重新登录";
          } else {
            this.error = "获取案件列表失败: " + (error.response?.data || error.message || "未知错误");
          }
          console.error("获取案件列表错误", error);
        });
    },
    handlePageChange(page) {
      this.fetchReports(page);
    },
    selectReport(report) {
      this.selectedReport = report;
    },
    selectAll(event) {
      if (event.target.checked) {
        this.selectedReports = this.reports.map(report => report.caseID);
      } else {
        this.selectedReports = [];
      }
    },
    resetFilters() {
      this.searchQuery = '';
      this.statusFilter = '';
    },
    deleteSelectedReports() {
      if (this.selectedReports.length === 0) {
        return;
      }
      
      if (confirm(`确定要删除选中的 ${this.selectedReports.length} 条案件信息吗？`)) {
        const token = localStorage.getItem('jwtToken');
        const requests = this.selectedReports.map(id => 
          axios.post(`/city/caseInfom/deletInfom?caseId=${id}`, {}, {
            headers: {
              'Authorization': token
            }
          })
        );
        
        Promise.all(requests)
          .then(() => {
            this.fetchReports(this.currentPage);
            this.selectedReports = [];
          })
          .catch(error => {
            this.error = "删除案件失败: " + (error.response?.data || error.message || "未知错误");
            console.error("删除案件失败", error);
          });
      }
    },
    showAssignManagerModal(report = null) {
      if (report) {
        this.selectedReport = report;
      }
      
      this.loadingManagers = true;
      this.managerError = null;
      this.selectedManagerID = null;
      this.caseNotes = '';
      
      // 获取承办人列表
      const token = localStorage.getItem('jwtToken');
      axios.get('/city/admin/getManagers', {
        headers: {
          'Authorization': token
        }
      })
        .then(response => {
          this.managers = response.data;
          this.loadingManagers = false;
          this.showManagerModal = true;
        })
        .catch(error => {
          this.loadingManagers = false;
          this.managerError = "获取承办人列表失败: " + (error.response?.data || error.message || "未知错误");
          this.showManagerModal = true;
          console.error("获取承办人列表错误", error);
        });
    },
    closeManagerModal() {
      this.showManagerModal = false;
      this.selectedManagerID = null;
      this.caseNotes = '';
    },
    assignManager() {
      if (!this.selectedReport || !this.selectedManagerID) {
        return;
      }
      
      this.assigningManager = true;
      const token = localStorage.getItem('jwtToken');
      
      // 更新案件状态为"处理中"并分配承办人
      const updatedReport = {
        ...this.selectedReport,
        managerID: this.selectedManagerID,
        status: '处理中',
        handlingMethod: this.caseNotes || this.selectedReport.handlingMethod,
        verified: true
      };
      
      axios.post('/city/caseInfom/SetInfom', updatedReport, {
        headers: {
          'Authorization': token
        }
      })
        .then(() => {
          this.assigningManager = false;
          this.showManagerModal = false;
          this.fetchReports(this.currentPage);
          this.selectedReport = null; // 关闭详情面板
          
          // 显示成功提示
          alert('案件已成功分配给承办人');
        })
        .catch(error => {
          this.assigningManager = false;
          alert("分配承办人失败: " + (error.response?.data || error.message || "未知错误"));
          console.error("分配承办人错误", error);
        });
    },
    invalidateReport() {
      if (!this.selectedReport) return;
      
      if (confirm('确定要将此案件标记为作废吗？')) {
        const token = localStorage.getItem('jwtToken');
        const updatedReport = {
          ...this.selectedReport,
          status: '已撤销',
          closedDate: new Date().toISOString()
        };
        
        axios.post('/city/caseInfom/SetInfom', updatedReport, {
          headers: {
            'Authorization': token
          }
        })
          .then(() => {
            this.fetchReports(this.currentPage);
            this.selectedReport = null;
            alert('案件已标记为作废');
          })
          .catch(error => {
            alert("作废案件失败: " + (error.response?.data || error.message || "未知错误"));
            console.error("作废案件错误", error);
          });
      }
    },
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '无';
      
      // 尝试解析日期时间字符串
      try {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateTimeStr; // 如果解析失败，返回原始字符串
      }
    },
    getStatusClass(status) {
      switch (status) {
        case '待处理': return 'badge bg-warning';
        case '处理中': return 'badge bg-primary';
        case '已完成': return 'badge bg-success';
        case '已撤销': return 'badge bg-danger';
        default: return 'badge bg-secondary';
      }
    },
    truncateText(text, maxLength) {
      if (!text) return '无';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
  },
  created() {
    this.fetchReports();
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.filter-panel {
  margin-top: 15px;
}

.details-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background-color: #fff;
  color: #333;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -2px 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1050;
  border-left: 4px solid #4285f4;
  transition: all 0.3s ease;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.details-header h5 {
  margin: 0;
  font-weight: 600;
  color: #4285f4;
}

.details-header .close {
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
}

.details-body {
  margin-bottom: 20px;
}

.detail-item {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
}

.detail-label {
  width: 100px;
  font-weight: 600;
  color: #555;
  margin-right: 10px;
}

.detail-value {
  flex: 1;
  min-width: 60%;
}

.details-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.details-actions .btn {
  width: 48%;
}

.details-panel img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 4px;
}

.modal {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}

table {
  border-collapse: separate;
  border-spacing: 0;
}

th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

tbody tr {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background-color: rgba(66, 133, 244, 0.1);
}

.badge {
  font-size: 0.85rem;
  padding: 0.35em 0.65em;
}
</style>
