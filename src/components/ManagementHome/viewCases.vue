<template>
  <div class="view-cases">
    <h2 class="mb-4">案件管理</h2>
    
    <!-- 搜索和筛选区域 -->
    <div class="filter-section mb-4">
      <div class="row g-3">
        <div class="col-md-3">
          <div class="input-group">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="搜索案件...">
            <button class="btn theme-btn" type="button" @click="applyFilters">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="statusFilter">
            <option value="">所有状态</option>
            <option value="未处理">未处理</option>
            <option value="处理中">处理中</option>
            <option value="已解决">已解决</option>
            <option value="待处理">待处理</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="categoryFilter">
            <option value="">所有类别</option>
            <option value="基础设施">基础设施</option>
            <option value="环境卫生">环境卫生</option>
            <option value="公共安全">公共安全</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div class="col-md-3">
          <button class="btn theme-btn-outline" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i>重置筛选
          </button>
        </div>
      </div>
    </div>
    
    <!-- 案件统计卡片 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="status-card card-pending">
          <div class="status-number">{{ getStatusCount('未处理') }}</div>
          <div class="status-label">未处理案件</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="status-card card-processing">
          <div class="status-number">{{ getStatusCount('处理中') }}</div>
          <div class="status-label">处理中案件</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="status-card card-waiting">
          <div class="status-number">{{ getStatusCount('待处理') }}</div>
          <div class="status-label">待处理案件</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="status-card card-resolved">
          <div class="status-number">{{ getStatusCount('已解决') }}</div>
          <div class="status-label">已解决案件</div>
        </div>
      </div>
    </div>

    <!-- 案件表格 -->
    <div class="table-responsive">
      <table class="table table-hover case-table">
        <thead class="table-header">
          <tr>
            <th @click="sortBy('caseID')">
              案件ID
              <i v-if="sortKey === 'caseID'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
            </th>
            <th>举报人</th>
            <th>举报人电话</th>
            <th @click="sortBy('caseType')">
              案件类型
              <i v-if="sortKey === 'caseType'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
            </th>
            <th @click="sortBy('infoCategory')">
              信息大类
              <i v-if="sortKey === 'infoCategory'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
            </th>
            <th>描述</th>
            <th>位置</th>
            <th>位置描述</th>
            <th @click="sortBy('status')">
              状态
              <i v-if="sortKey === 'status'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseItem in paginatedCases" :key="caseItem.caseID" :class="getRowClass(caseItem.status)">
            <td><span class="case-id">{{ caseItem.caseID }}</span></td>
            <td>{{ caseItem.reporter }}</td>
            <td>{{ caseItem.reporterPhone }}</td>
            <td>{{ caseItem.caseType }}</td>
            <td>{{ caseItem.infoCategory }}</td>
            <td>
              <span class="description-text">{{ caseItem.description }}</span>
            </td>
            <td>{{ caseItem.location }}</td>
            <td>{{ caseItem.locationDescribe }}</td>
            <td>
              <span :class="getStatusBadgeClass(caseItem.status)">{{ caseItem.status }}</span>
            </td>
            <td>
              <div class="d-flex gap-2">
                <button @click="$emit('select-case', caseItem)" class="btn btn-sm theme-btn">
                  <i class="bi bi-pencil-square me-1"></i>修改进度
                </button>
                <button @click="viewDetails(caseItem)" class="btn btn-sm theme-btn-outline">
                  <i class="bi bi-eye me-1"></i>详情
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredCases.length === 0">
            <td colspan="10" class="text-center py-4">
              <div class="empty-state">
                <i class="bi bi-search fs-1"></i>
                <p>未找到匹配的案件记录</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <div>
        显示 {{ paginatedCases.length }} 条，共 {{ filteredCases.length }} 条记录
      </div>
      <div>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
              </a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <select class="form-select form-select-sm" v-model="pageSize">
          <option :value="5">5条/页</option>
          <option :value="10">10条/页</option>
          <option :value="20">20条/页</option>
        </select>
      </div>
    </div>

    <!-- 案件详情模态框 -->
    <div class="modal fade" id="caseDetailModal" tabindex="-1" aria-labelledby="caseDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header theme-header">
            <h5 class="modal-title" id="caseDetailModalLabel">案件详情</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedCaseDetail">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6>案件基本信息</h6>
                <table class="table table-sm">
                  <tr>
                    <th>案件ID</th>
                    <td>{{ selectedCaseDetail.caseID }}</td>
                  </tr>
                  <tr>
                    <th>案件类型</th>
                    <td>{{ selectedCaseDetail.caseType }}</td>
                  </tr>
                  <tr>
                    <th>信息大类</th>
                    <td>{{ selectedCaseDetail.infoCategory }}</td>
                  </tr>
                  <tr>
                    <th>当前状态</th>
                    <td><span :class="getStatusBadgeClass(selectedCaseDetail.status)">{{ selectedCaseDetail.status }}</span></td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6>举报人信息</h6>
                <table class="table table-sm">
                  <tr>
                    <th>举报人</th>
                    <td>{{ selectedCaseDetail.reporter }}</td>
                  </tr>
                  <tr>
                    <th>联系电话</th>
                    <td>{{ selectedCaseDetail.reporterPhone }}</td>
                  </tr>
                  <tr>
                    <th>举报时间</th>
                    <td>{{ selectedCaseDetail.reportTime || '未记录' }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="mb-3">
              <h6>案件描述</h6>
              <p class="case-description">{{ selectedCaseDetail.description }}</p>
            </div>
            <div class="row">
              <div class="col-md-6">
                <h6>位置信息</h6>
                <p>{{ selectedCaseDetail.location }} - {{ selectedCaseDetail.locationDescribe }}</p>
              </div>
              <div class="col-md-6">
                <h6>处理记录</h6>
                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-badge bg-success"></div>
                    <div class="timeline-content">
                      <h6 class="mb-0">案件创建</h6>
                      <small>{{ selectedCaseDetail.reportTime || '未记录' }}</small>
                    </div>
                  </div>
                  <div class="timeline-item" v-if="selectedCaseDetail.status !== '未处理'">
                    <div class="timeline-badge bg-primary"></div>
                    <div class="timeline-content">
                      <h6 class="mb-0">开始处理</h6>
                      <small>{{ selectedCaseDetail.processTime || '未记录' }}</small>
                    </div>
                  </div>
                  <div class="timeline-item" v-if="selectedCaseDetail.status === '已解决'">
                    <div class="timeline-badge bg-info"></div>
                    <div class="timeline-content">
                      <h6 class="mb-0">案件解决</h6>
                      <small>{{ selectedCaseDetail.resolveTime || '未记录' }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
            <button type="button" class="btn theme-btn" @click="$emit('select-case', selectedCaseDetail)" data-bs-dismiss="modal">
              修改进度
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewCases',
  data() {
    return {
      cases: [
        {
          caseID: '1',
          reporter: '张三',
          reporterPhone: '1234567890',
          caseType: '道路维修',
          infoCategory: '基础设施',
          description: '道路破损严重，需要维修。',
          location: '北京市海淀区',
          locationDescribe: '中关村大街与海淀南路交叉口',
          status: '处理中',
          reportTime: '2023-05-15 09:30',
          processTime: '2023-05-16 14:20'
        },
        {
          caseID: '2',
          reporter: '李四',
          reporterPhone: '0987654321',
          caseType: '垃圾清理',
          infoCategory: '环境卫生',
          description: '小区内垃圾堆积，需要清理。',
          location: '北京市朝阳区',
          locationDescribe: '三里屯街道',
          status: '未处理',
          reportTime: '2023-05-18 16:45'
        },
        {
          caseID: '5',
          reporter: '陈七',
          reporterPhone: '1122334455',
          caseType: '公共厕所损坏',
          infoCategory: '基础设施',
          description: '公共厕所内设施损坏，需要修理。',
          location: '重庆市渝中区',
          locationDescribe: '解放碑步行街旁',
          status: '处理中',
          reportTime: '2023-05-10 11:20',
          processTime: '2023-05-11 09:15'
        },
        {
          caseID: '6',
          reporter: '刘八',
          reporterPhone: '6677889900',
          caseType: '交通标志丢失',
          infoCategory: '基础设施',
          description: '交通标志牌丢失，导致车辆通行不便。',
          location: '南京市建邺区',
          locationDescribe: '河西大街与万达路交叉口',
          status: '已解决',
          reportTime: '2023-05-05 08:30',
          processTime: '2023-05-05 13:45',
          resolveTime: '2023-05-08 17:20'
        },
        {
          caseID: '4',
          reporter: '赵六',
          reporterPhone: '2468135790',
          caseType: '桥梁裂缝',
          infoCategory: '基础设施',
          description: '桥梁出现明显裂缝，需要检查修复。',
          location: '深圳市福田区',
          locationDescribe: '深南大道与福田路交叉口',
          status: '待处理',
          reportTime: '2023-05-12 14:25'
        }, 
        {
          caseID: '3',
          reporter: '王五',
          reporterPhone: '1357924680',
          caseType: '排水系统问题',
          infoCategory: '基础设施',
          description: '排水管道堵塞，导致积水严重。',
          location: '广州市天河区',
          locationDescribe: '天汇大街与珠江新城交叉口',
          status: '已解决',
          reportTime: '2023-05-14 10:15',
          processTime: '2023-05-14 15:30',
          resolveTime: '2023-05-17 09:45'
        },
        {
          caseID: '7',
          reporter: '钱九',
          reporterPhone: '3344556677',
          caseType: '路灯故障',
          infoCategory: '基础设施',
          description: '街道路灯不亮，影响夜间出行安全。',
          location: '武汉市武昌区',
          locationDescribe: '洪山广场附近',
          status: '未处理',
          reportTime: '2023-05-19 18:50'
        },
        {
          caseID: '8',
          reporter: '孙十',
          reporterPhone: '8899001122',
          caseType: '噪音扰民',
          infoCategory: '公共安全',
          description: '附近工地夜间施工，噪音严重影响居民休息。',
          location: '杭州市西湖区',
          locationDescribe: '西湖文化广场附近',
          status: '处理中',
          reportTime: '2023-05-17 22:10',
          processTime: '2023-05-18 09:30'
        }
      ],
      searchQuery: '',
      statusFilter: '',
      categoryFilter: '',
      currentPage: 1,
      pageSize: 5,
      sortKey: '',
      sortOrder: 'asc',
      selectedCaseDetail: null
    };
  },
  computed: {
    filteredCases() {
      let result = [...this.cases];
      
      // 应用搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(item => 
          item.caseID.toLowerCase().includes(query) ||
          item.reporter.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.caseType.toLowerCase().includes(query)
        );
      }
      
      // 应用状态过滤
      if (this.statusFilter) {
        result = result.filter(item => item.status === this.statusFilter);
      }
      
      // 应用类别过滤
      if (this.categoryFilter) {
        result = result.filter(item => item.infoCategory === this.categoryFilter);
      }
      
      // 应用排序
      if (this.sortKey) {
        result.sort((a, b) => {
          let aValue = a[this.sortKey];
          let bValue = b[this.sortKey];
          
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      return result;
    },
    paginatedCases() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredCases.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCases.length / this.pageSize);
    }
  },
  methods: {
    applyFilters() {
      this.currentPage = 1; // 重置为第一页
    },
    resetFilters() {
      this.searchQuery = '';
      this.statusFilter = '';
      this.categoryFilter = '';
      this.currentPage = 1;
      this.sortKey = '';
      this.sortOrder = 'asc';
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    getStatusCount(status) {
      return this.cases.filter(item => item.status === status).length;
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case '未处理': return 'badge bg-danger';
        case '处理中': return 'badge bg-warning text-dark';
        case '待处理': return 'badge bg-info text-dark';
        case '已解决': return 'badge bg-success';
        default: return 'badge bg-secondary';
      }
    },
    getRowClass(status) {
      switch (status) {
        case '未处理': return 'table-danger';
        case '处理中': return 'table-warning';
        case '待处理': return 'table-info';
        case '已解决': return 'table-success';
        default: return '';
      }
    },
    viewDetails(caseItem) {
      this.selectedCaseDetail = { ...caseItem };
      // 使用Bootstrap的Modal API显示模态框
      const modal = new bootstrap.Modal(document.getElementById('caseDetailModal'));
      modal.show();
    }
  }
};
</script>

<style scoped>
.view-cases {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-section {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.status-card {
  padding: 15px;
  border-radius: 8px;
  color: white;
  text-align: center;
  transition: transform 0.3s;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.status-card:hover {
  transform: translateY(-5px);
}

.card-pending {
  background-color: #dc3545;
}

.card-processing {
  background-color: #ffc107;
  color: #212529;
}

.card-waiting {
  background-color: #0dcaf0;
  color: #212529;
}

.card-resolved {
  background-color: #198754;
}

.status-number {
  font-size: 2rem;
  font-weight: bold;
}

.status-label {
  font-size: 0.9rem;
}

.case-table {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  background-color: var(--theme-color);
  color: white;
}

.table-header th {
  cursor: pointer;
  white-space: nowrap;
}

.case-id {
  font-weight: bold;
  color: var(--theme-color);
}

.description-text {
  display: block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6c757d;
}

.pagination .page-link {
  color: var(--theme-color);
}

.pagination .active .page-link {
  background-color: var(--theme-color);
  border-color: var(--theme-color);
  color: white;
}

.case-description {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  white-space: pre-line;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #dee2e6;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-badge {
  position: absolute;
  left: -30px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  z-index: 1;
}

.timeline-content {
  padding-left: 10px;
}
</style>
