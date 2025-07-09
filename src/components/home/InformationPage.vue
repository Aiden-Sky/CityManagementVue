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
          <h3 class="text-primary mb-3"><i class="fas fa-database"></i> 案件基础信息</h3>
          <div class="btn-container">
            <button class="btn btn-success mb-3" @click="createNewCase" style="width: 48%">
              <i class="fas fa-plus"></i> 新增
            </button>
            <button class="btn btn-danger mb-3" @click="deleteSelectedReports" style="width: 48%"
                   :disabled="selectedReports.length === 0">
              <i class="fas fa-trash-alt"></i> 删除
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
            <div class="mb-2">
              <label class="form-label">信息大类</label>
              <select class="form-select" v-model="categoryFilter">
                <option value="">全部类别</option>
                <option value="基础设施">基础设施</option>
                <option value="环境卫生">环境卫生</option>
                <option value="社区安全">社区安全</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div class="mt-3">
              <button class="btn btn-primary" style="width:100px;" @click="applyFilters">
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
              <h5 class="mb-0"><i class="fas fa-list"></i> 案件基础信息列表</h5>
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
                    <th>举报时间</th>
                    <th>信息描述</th>
                    <th>信息大类</th>
                    <th>位置描述</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredReports.length === 0">
                    <td colspan="9" class="text-center py-3">暂无数据</td>
                  </tr>
                  <tr v-for="report in filteredReports" :key="report.caseID" :class="{'table-warning': selectedReports.includes(report.caseID)}">
                    <td><input type="checkbox" :value="report.caseID" v-model="selectedReports" @click.stop/></td>
                    <td>{{ report.caseID }}</td>
                    <td>{{ report.reporter }}</td>
                    <td>{{ formatDateTime(report.createdDate) }}</td>
                    <td :title="report.description">{{ truncateText(report.description, 20) }}</td>
                    <td>{{ report.infoCategory }}</td>
                    <td :title="report.locationDescribe">{{ truncateText(report.locationDescribe, 15) }}</td>
                    <td>
                      <span :class="getStatusClass(report.status)">{{ report.status }}</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" @click="selectReport(report)" title="查看详情">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-success me-1" @click="editReport(report)" title="编辑">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteReport(report)" title="删除">
                        <i class="fas fa-trash"></i>
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
    <div class="details-panel" v-if="selectedReport && !addBlock">
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
        <button class="btn btn-warning" @click="selectedReport = null">
          <i class="fas fa-times"></i> 关闭
        </button>
        <button class="btn btn-primary" @click="editReport(selectedReport)">
          <i class="fas fa-edit"></i> 编辑
        </button>
      </div>
    </div>

    <!-- 编辑/新增模态窗口 -->
    <div v-if="showModal">
      <!-- 模态窗口背景遮罩 -->
      <div class="modal-backdrop fade show" @click="closeModal"></div>
      <!-- 模态窗口 -->
      <div class="modal fade show" style="display: block; z-index: 1050;">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-edit"></i> {{ isNewCase ? '新增案件' : '编辑案件' }}
              </h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveReport">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="reporter" class="form-label">举报人姓名</label>
                    <input type="text" class="form-control" id="reporter" v-model="editingReport.reporter" required>
                  </div>
                  <div class="col-md-6">
                    <label for="reporterPhone" class="form-label">联系电话</label>
                    <input type="text" class="form-control" id="reporterPhone" v-model="editingReport.reporterPhone" required>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">是否核实</label>
                    <div class="d-flex">
                      <div class="form-check me-3">
                        <input class="form-check-input" type="radio" id="verified-yes" :value="true" v-model="editingReport.verified">
                        <label class="form-check-label" for="verified-yes">是</label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="radio" id="verified-no" :value="false" v-model="editingReport.verified">
                        <label class="form-check-label" for="verified-no">否</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="createdDate" class="form-label">举报时间</label>
                    <input type="datetime-local" class="form-control" id="createdDate" v-model="editingReport.createdDate">
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="needResponse" class="form-label">是否需要回复</label>
                    <select class="form-select" id="needResponse" v-model="editingReport.needResponse">
                      <option :value="true">是</option>
                      <option :value="false">否</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="severity" class="form-label">严重程度</label>
                    <select class="form-select" id="severity" v-model="editingReport.severity">
                      <option value="低">低</option>
                      <option value="中">中</option>
                      <option value="高">高</option>
                      <option value="紧急">紧急</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="infoCategory" class="form-label">信息大类</label>
                    <select class="form-select" id="infoCategory" v-model="editingReport.infoCategory">
                      <option value="基础设施">基础设施</option>
                      <option value="环境卫生">环境卫生</option>
                      <option value="社区安全">社区安全</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="caseType" class="form-label">案件类型</label>
                    <input type="text" class="form-control" id="caseType" v-model="editingReport.caseType">
                  </div>
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">信息描述</label>
                  <textarea class="form-control" id="description" rows="3" v-model="editingReport.description" required></textarea>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="location" class="form-label">位置</label>
                    <input type="text" class="form-control" id="location" v-model="editingReport.location">
                  </div>
                  <div class="col-md-6">
                    <label for="locationDescribe" class="form-label">位置描述</label>
                    <input type="text" class="form-control" id="locationDescribe" v-model="editingReport.locationDescribe">
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="status" class="form-label">状态</label>
                    <select class="form-select" id="status" v-model="editingReport.status">
                      <option value="待处理">待处理</option>
                      <option value="处理中">处理中</option>
                      <option value="已完成">已完成</option>
                      <option value="已撤销">已撤销</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="closedDate" class="form-label">关闭日期</label>
                    <input type="datetime-local" class="form-control" id="closedDate" v-model="editingReport.closedDate">
                  </div>
                </div>
                <div class="mb-3">
                  <label for="handlingMethod" class="form-label">处理方式</label>
                  <input type="text" class="form-control" id="handlingMethod" v-model="editingReport.handlingMethod">
                </div>
                <div class="mb-3">
                  <label for="photoUrl" class="form-label">图片</label>
                  <input type="file" class="form-control" id="photoUrl" @change="handleFileUpload" accept="image/*">
                  <div class="mt-2" v-if="previewImage || editingReport.photoUrl">
                    <img :src="previewImage || editingReport.photoUrl" alt="案件图片" class="img-thumbnail" style="max-height: 200px;">
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closeModal">
                    <i class="fas fa-times"></i> 取消
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="saving">
                    <i class="fas fa-save"></i> {{ saving ? '保存中...' : '保存' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import pagination from '@/components/tools/PageInation.vue'; 

const pageSize = 10; // 设置单页显示个数

export default {
  name: 'InformationPage',
  components: {
    pagination
  },
  data() {
    return {
      addBlock: false,
      reports: [],
      selectedReport: null,
      selectedReports: [],  // 用于存储选中的报告ID
      totalPages: 1,
      totalItems: 0,
      currentPage: 1,
      showModal: false,
      isNewCase: false,
      loading: false,
      error: null,
      saving: false,
      searchQuery: '',
      statusFilter: '',
      categoryFilter: '',
      previewImage: null,
      imageFile: null,
      editingReport: {
        caseID: '',
        photoUrl: '',
        caseType: '',
        description: '',
        location: '',
        locationDescribe: '',
        status: '待处理',
        createdDate: '',
        closedDate: '',
        reporter: '',
        reporterPhone: '',
        needResponse: false,
        infoCategory: '其他',
        handlingMethod: '',
        verified: false,
        severity: '中',
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
      
      // 信息大类筛选
      if (this.categoryFilter) {
        result = result.filter(report => report.infoCategory === this.categoryFilter);
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
      this.addBlock = false;
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
      this.categoryFilter = '';
    },
    applyFilters() {
      // 已经通过computed属性实现，这里只需用于按钮点击事件
      console.log("应用筛选条件");
    },
    createNewCase() {
      this.isNewCase = true;
      this.editingReport = {
        caseID: '',
        photoUrl: '',
        caseType: '',
        description: '',
        location: '',
        locationDescribe: '',
        status: '待处理',
        createdDate: new Date().toISOString().slice(0, 16), // 格式化为datetime-local输入格式
        closedDate: '',
        reporter: '',
        reporterPhone: '',
        needResponse: false,
        infoCategory: '其他',
        handlingMethod: '',
        verified: false,
        severity: '中',
      };
      this.previewImage = null;
      this.imageFile = null;
      this.showModal = true;
      this.addBlock = true;
    },
    editReport(report) {
      this.isNewCase = false;
      // 深拷贝报告对象，避免直接修改原对象
      this.editingReport = JSON.parse(JSON.stringify(report));
      
      // 格式化日期为datetime-local输入所需格式
      if (this.editingReport.createdDate) {
        const createdDate = new Date(this.editingReport.createdDate);
        if (!isNaN(createdDate.getTime())) {
          this.editingReport.createdDate = createdDate.toISOString().slice(0, 16);
        }
      }
      
      if (this.editingReport.closedDate) {
        const closedDate = new Date(this.editingReport.closedDate);
        if (!isNaN(closedDate.getTime())) {
          this.editingReport.closedDate = closedDate.toISOString().slice(0, 16);
        }
      }
      
      this.previewImage = null;
      this.showModal = true;
      this.addBlock = true;
    },
    closeModal() {
      this.showModal = false;
      this.addBlock = false;
      this.previewImage = null;
      this.imageFile = null;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.imageFile = file;
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    saveReport() {
      this.saving = true;
      const token = localStorage.getItem('jwtToken');
      
      // 在这里处理图片上传，实际项目中可能需要先上传图片然后保存URL
      // 本例中简化处理
      
      const saveData = { ...this.editingReport };
      
      // 如果是新创建的案件，确保没有caseID字段，让后端自动生成
      if (this.isNewCase) {
        delete saveData.caseID;
      }
      
      axios.post('/city/caseInfom/SetInfom', saveData, {
        headers: {
          'Authorization': token
        }
      })
        .then(() => {
          this.closeModal();
          this.fetchReports(this.currentPage);
          this.saving = false;
          alert(this.isNewCase ? '案件创建成功' : '案件更新成功');
        })
        .catch(error => {
          this.saving = false;
          alert("保存失败: " + (error.response?.data || error.message || "未知错误"));
          console.error("保存案件错误", error);
        });
    },
    deleteReport(report) {
      if (confirm(`确定要删除案件 #${report.caseID} 吗？`)) {
        const token = localStorage.getItem('jwtToken');
        
        axios.post(`/city/caseInfom/deletInfom?caseId=${report.caseID}`, {}, {
          headers: {
            'Authorization': token
          }
        })
          .then(() => {
            if (this.selectedReport && this.selectedReport.caseID === report.caseID) {
              this.selectedReport = null;
            }
            this.fetchReports(this.currentPage);
            alert('案件删除成功');
          })
          .catch(error => {
            alert("删除失败: " + (error.response?.data || error.message || "未知错误"));
            console.error("删除案件错误", error);
          });
      }
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
            alert('批量删除成功');
          })
          .catch(error => {
            this.error = "批量删除失败: " + (error.response?.data || error.message || "未知错误");
            console.error("批量删除失败", error);
          });
      }
    },
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '无';
      
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
        return dateTimeStr;
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
};
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

.modal-content {
  border-radius: 8px;
  border: none;
}

.modal-header {
  border-bottom: none;
  padding-bottom: 10px;
}

.modal-title {
  font-weight: 500;
}

.form-control, .form-select {
  border-radius: 4px;
}

.btn-primary {
  background-color: #4285f4;
  border-color: #4285f4;
}

.btn-secondary {
  background-color: #f1f3f4;
  border-color: #f1f3f4;
  color: #3c4043;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
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

.btn-container {
  display: flex;
  justify-content: space-between;
}
</style>
