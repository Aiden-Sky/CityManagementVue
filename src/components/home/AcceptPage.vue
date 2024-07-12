<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <div class="sidebar">
          <div class="btn-container">

            <button class="btn btn-danger mb-3" style="width: 50%" @click="deleteReport(selectedReport.caseID)">批量删除</button>
          </div>
          <h5>查询</h5>
          <div class="list-group">
            <button class="list-group-item list-group-item-action">大类小类查询</button>
            <button class="list-group-item list-group-item-action">区域查询</button>
            <button class="list-group-item list-group-item-action">时间段</button>
            <button class="list-group-item list-group-item-action">举报人</button>
            <button class="list-group-item list-group-item-action">举报人电话</button>
            <button class="list-group-item list-group-item-action">信息描述</button>
            <button class="list-group-item list-group-item-action">信息状态</button>
          </div>
          <div class="mt-3">
            <button class="btn btn-primary" style="width:100px;">查询</button>
            <button class="btn btn-secondary" style="width:100px;">重置</button>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>选择</th> <!-- 全选复选框 -->
              <th>序号</th>
              <th>举报人</th>
              <th>举报人电话</th>
              <th>举报时间</th>
              <th>是否需要回复</th>
              <th>信息描述</th>
              <th>信息大类</th>
              <th>位置描述</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="report in reports" :key="report.caseID" @click="selectReport(report)">
            <td><input type="checkbox" :value="report.caseID" v-model="selectedReports" @click.stop/></td>
            <!-- 每行的复选框 -->
            <td>{{ report.caseID }}</td>
            <td>{{ report.reporter }}</td>
            <td>{{ report.reporterPhone }}</td>
            <td>{{ report.createdDate }}</td>
            <td>{{ report.needResponse ? '是' : '否' }}</td>
              <td>{{ report.description }}</td>
            <td>{{ report.infoCategory }}</td>
            <td>{{ report.locationDescribe }}</td>
            <td>{{ report.status }}</td>
            </tr>
          </tbody>
        </table>
        <pagination :total="totalPages" :current="currentPage" @change="handlePageChange"
                    style=" display: flex;justify-content: center;"/>
      </div>
    </div>


    <div class="details-panel" v-if="selectedReport">
      <div class="details-header">
        <h5>案件详情</h5>
        <button type="button" class="close" @click="selectedReport = null">&times;</button>
      </div>
      <p>举报人: {{ selectedReport.reporter }}</p>
      <p>举报人电话: {{ selectedReport.reporterPhone }}</p>
      <p>举报时间: {{ selectedReport.createdDate }}</p>
      <p>是否需要回复: {{ selectedReport.needResponse ? '是' : '否' }}</p>
      <p>信息描述: {{ selectedReport.description }}</p>
      <p>信息大类: {{ selectedReport.infoCategory }}</p>
      <p>案件类型: {{ selectedReport.caseType }}</p>
      <p>位置: {{ selectedReport.location }}</p>
      <p>位置描述: {{ selectedReport.locationDescribe }}</p>
      <p>状态: {{ selectedReport.status }}</p>
      <p>严重程度: {{ selectedReport.severity }}</p>
      <p>是否核实: {{ selectedReport.verified ? '是' : '否' }}</p>
      <p>处理方式: {{ selectedReport.handlingMethod }}</p>
      <p>关闭日期: {{ selectedReport.closedDate }}</p>
      <div>
        <p>图片:</p>
        <img :src="selectedReport.photoUrl" alt="Report Image"/>
      </div>
      <div class="details-actions">
        <button class="btn btn-warning">作废</button>
        <button class="btn btn-primary">立案</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import pagination from "@/components/tools/PageInation.vue";

const pageSize = 10; // 设置单页显示个数

export default {
  name: 'AcceptPage',
  components: {pagination},
  data() {
    return {
      reports: [],
      selectedReport: null,
      selectedReports: [],  // 新增：用于存储选中的报告ID
      totalPages: 1,
      currentPage: 1,
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
        severity: ''
      }
    };
  },
  methods: {
    fetchReports(page = 1) {
      const token = localStorage.getItem('jwtToken');
      axios.get(`/city/caseInfom/getInfoms?page=${page}&pageSize=${pageSize}`, {
        headers: {
          'Authorization': token
        }
      })
          .then(response => {
            this.reports = response.data.reports;
            this.totalPages = response.data.totalPages;
            this.currentPage = page;
          })
          .catch(error => {
            console.error("身份验证错误", error);
          });
    },
    handlePageChange(page) {
      this.fetchReports(page);
    },
    selectReport(report) {
      this.selectedReport = report;
    },
    addReport(report) {
      axios.post('/api/reports', report)
          .then(() => {
            this.fetchReports(this.currentPage);
          })
          .catch(error => {
            console.error("Error adding report:", error);
          });
    },
    deleteReport(reportId) {
      axios.delete(`/api/reports/${reportId}`)
          .then(() => {
            this.fetchReports(this.currentPage);
          })
          .catch(error => {
            console.error("Error deleting report:", error);
          });
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
  border-radius: 5px;
}

.details-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9); /* 透明背景 */
  color: white;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1050; /* 确保悬浮窗在最上层 */
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.details-header h5 {
  margin: 0;
}

.details-header .close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
}

.details-panel p,
.details-panel div {
  margin-bottom: 10px;
  text-align: left;
}

.details-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.details-actions .btn {
  width: 48%;
}

.details-panel img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}


</style>

