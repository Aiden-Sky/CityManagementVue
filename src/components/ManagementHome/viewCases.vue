<template>
  <div class="view-cases">
    <h2 class="mb-4">查看案件</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>案件ID</th>
          <th>举报人</th>
          <th>举报人电话</th>
          <th>案件类型</th>
          <th>信息大类</th>
          <th>描述</th>
          <th>位置</th>
          <th>位置描述</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="caseItem in cases" :key="caseItem.caseID">
        <td>{{ caseItem.caseID }}</td>
        <td>{{ caseItem.reporter }}</td>
        <td>{{ caseItem.reporterPhone }}</td>
        <td>{{ caseItem.caseType }}</td>
        <td>{{ caseItem.infoCategory }}</td>
        <td>{{ caseItem.description }}</td>
        <td>{{ caseItem.location }}</td>
        <td>{{ caseItem.locationDescribe }}</td>
        <td>{{ caseItem.status }}</td>
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
        {
          caseID: '1',
          reporter: '张三',
          reporterPhone: '1234567890',
          caseType: '道路维修',
          infoCategory: '基础设施',
          description: '道路破损严重，需要维修。',
          location: '北京市海淀区',
          locationDescribe: '中关村大街与海淀南路交叉口',
          status: '处理中'
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
          status: '未处理'
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
          status: '处理中'
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
          status: '已解决'
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
          status: '待处理'
        }, {
          caseID: '3',
          reporter: '王五',
          reporterPhone: '1357924680',
          caseType: '排水系统问题',
          infoCategory: '基础设施',
          description: '排水管道堵塞，导致积水严重。',
          location: '广州市天河区',
          locationDescribe: '天汇大街与珠江新城交叉口',
          status: '已解决'
        }

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
