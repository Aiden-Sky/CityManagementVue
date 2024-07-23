<template>
  <div>
    <div id="mymap" style="height: 1080px; width: 1920px; text-align: center"></div>
    <div class="details-panel" v-if="selectedLocation">
      <div class="details-header">
        <h5>案件详情</h5>
        <button type="button" class="close" @click="selectedLocation = null">&times;</button>
      </div>
      <p>位置: {{ selectedLocation.locationDescribe }}</p>
      <p>经度: {{ selectedLocation.location.split(',')[0] }}</p>
      <p>纬度: {{ selectedLocation.location.split(',')[1] }}</p>
      <!-- 添加更多的案件详细信息 -->
      <p>案件状态: {{ selectedLocation.status }}</p>
      <p>举报人: {{ selectedLocation.reporter }}</p>
      <p>举报人电话: {{ selectedLocation.reporterPhone }}</p>
      <p>举报时间: {{ selectedLocation.createdDate }}</p>
      <p>是否需要回复: {{ selectedLocation.needResponse ? '是' : '否' }}</p>
      <p>信息描述: {{ selectedLocation.description }}</p>
      <p>信息大类: {{ selectedLocation.infoCategory || '无' }}</p>
      <p>案件类型: {{ selectedLocation.caseType }}</p>
      <p>位置描述: {{ selectedLocation.locationDescribe }}</p>
      <p>严重程度: {{ selectedLocation.severity }}</p>
      <p>是否核实: {{ selectedLocation.verified ? '是' : '否' }}</p>
      <p>处理方式: {{ selectedLocation.handlingMethod }}</p>
      <p>关闭日期: {{ selectedLocation.closedDate || '未关闭' }}</p>
      <div>
        <p>图片:</p>
        <img :src="selectedLocation.photoUrl || '/imgs/default-image.png'" alt="Report Image" />
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";

export default {
  name: 'GeographyPage',
  data() {
    return {
      map: null,
      selectedLocation: null,
      reports: []
    };
  },
  mounted() {
    this.initMap();
    this.fetchReports();
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "bd2b09677fcbd6ff91a7988ecc1e88d1",
        version: "2.0",
        plugins: []
      })
        .then(AMap => {
          this.map = new AMap.Map("mymap", {
            center: [125.14217, 46.592819],
            zoom: 12
          });
          this.addMarkers(AMap);
        })
        .catch(e => {
          console.log(e);
        });
    },
    addMarkers(AMap) {
      this.reports.forEach(report => {
        const position = report.location.split(',').map(coord => parseFloat(coord.trim()));
        const marker = new AMap.Marker({
          position,
          title: report.locationDescribe,
          label: {
            content: report.locationDescribe,
            offset: new AMap.Pixel(20, 20)
          }
        });
        marker.setMap(this.map);
        marker.on('click', () => {
          this.selectedLocation = report;
        });
      });
    },
    fetchReports(page = 1) {
      const token = localStorage.getItem('jwtToken');
      axios.get(`/city/caseInfom/getInfoms?page=${page}&pageSize=100`, {
        headers: {
          'Authorization': token
        }
      })
          .then(response => {
            this.reports = response.data.reports;
            this.addMarkers(AMap); // 确保地图加载完成后添加标记
          })
          .catch(error => {
            console.error("身份验证错误", error);
          });
    },
    showAssignManagerModal() {
      // Placeholder for showing assign manager modal
      // Implement if necessary
    }
  }
};
</script>

<style scoped>
.details-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1050;
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

.details-panel p {
  margin-bottom: 10px;
  text-align: left;
}

.details-panel img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}
</style>
