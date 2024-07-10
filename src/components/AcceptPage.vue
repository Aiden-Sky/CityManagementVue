<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <div class="sidebar">
          <button class="btn btn-success mb-3">新增</button>
          <button class="btn btn-danger mb-3">删除</button>
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
            <button class="btn btn-primary">查询</button>
            <button class="btn btn-secondary">重置</button>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>序号</th>
              <th>举报人</th>
              <th>举报人电话</th>
              <th>举报时间</th>
              <th>是否需要回复</th>
              <th>信息描述</th>
              <th>信息大类</th>
              <th>区域</th>
              <th>位置</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id">
              <td>{{ report.id }}</td>
              <td>{{ report.name }}</td>
              <td>{{ report.phone }}</td>
              <td>{{ report.time }}</td>
              <td>{{ report.needReply ? '是' : '否' }}</td>
              <td>{{ report.description }}</td>
              <td>{{ report.category }}</td>
            </tr>
          </tbody>
        </table>
        <pagination :total="totalPages" :current="currentPage" @change="handlePageChange" />
      </div>
    </div>
    <div class="details-panel" v-if="selectedReport">
      <h5>案件详情</h5>
      <p>举报人: {{ selectedReport.name }}</p>
      <p>举报人电话: {{ selectedReport.phone }}</p>
      <p>举报时间: {{ selectedReport.time }}</p>
      <p>是否需要回复: {{ selectedReport.needReply ? '是' : '否' }}</p>
      <p>信息描述: {{ selectedReport.description }}</p>
      <p>信息大类: {{ selectedReport.category }}</p>
      <p>信息小类: {{ selectedReport.subCategory }}</p>
      <p>区域: {{ selectedReport.region }}</p>
      <p>位置: {{ selectedReport.location }}</p>
      <p>处理情况: {{ selectedReport.status }}</p>
      <p>督办级别: {{ selectedReport.supervisionLevel }}</p>
      <p>视频: <video :src="selectedReport.videoUrl" controls></video></p>
      <p>音频: <audio :src="selectedReport.audioUrl" controls></audio></p>
      <p>图片: <img :src="selectedReport.imageUrl" alt="Report Image" /></p>
      <p>文件: <a :href="selectedReport.fileUrl" download>下载</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AcceptPage',
  data() {
    return {
      reports: [
        // 示例数据
        { id: 1, name: '张东健', phone: '130254546213', time: '2019-11-29 10:24:31', needReply: true, description: '垃圾未清', category: '环卫' },
        // ...更多数据
      ],
      selectedReport: null,
      totalPages: 5,
      currentPage: 1
    };
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
      // 这里可以添加分页逻辑
    }
  }
}
</script>

<style scoped>
.container-fluid {
  padding: 20px;
}
.sidebar {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
}
.details-panel {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
