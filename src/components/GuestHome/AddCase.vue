<template>
  <div class="case-management">
    <div class="content">
      <div class="add-case-form">
        <h2>在线反馈</h2> <!-- 添加标题 -->
        <form @submit.prevent="addCase">
          <!-- 表单内容 -->
          <div class="mb-3">
            <label for="reporter">姓名</label>
            <input type="text" class="form-control" v-model="newReport.reporter">
          </div>
          <div class="mb-3">
            <label for="reporterPhone">电话号码</label>
            <input type="text" class="form-control" v-model="newReport.reporterPhone">
          </div>
          <div class="mb-3">
            <label for="needResponse">是否需要回复</label>
            <select class="form-control" v-model="newReport.needResponse">
              <option :value="true">是</option>
              <option :value="false">否</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="photoUrl">现场图片</label>
            <input type="file" @change="handleFileChange" class="form-control" accept="image/*">
            <img :src="newReport.photoUrl" alt="Report Image" class="img-fluid mt-2" v-if="newReport.photoUrl">
          </div>

          <div class="mb-3">
            <label for="caseType">反馈类型</label>
            <input type="text" class="form-control" v-model="newReport.caseType">
          </div>
          <div class="mb-3">
            <label for="description">描述</label>
            <textarea class="form-control" v-model="newReport.description"></textarea>
          </div>
          <div class="mb-3">
            <label for="location">位置(经纬度)</label>
            <input type="text" class="form-control" v-model="newReport.location" readonly>
            <button type="button" class="btn btn-secondary mt-2" style="background: #3193bd" @click="locatePosition">
              定位
            </button>
          </div>
          <div class="mb-3">
            <label for="locationDescribe">位置详细描述</label>
            <input type="text" class="form-control" v-model="newReport.locationDescribe">
          </div>
          <div class="mb-3">
            <label for="infoCategory">信息大类</label>
            <input type="text" class="form-control" v-model="newReport.infoCategory">
          </div>

          <div class="form-buttons">
            <button type="submit" class="btn btn-success">添加</button>
            <button type="button" class="btn btn-danger" @click="goBack">返回</button>
          </div>
        </form>
      </div>
      <div id="mapContainer" class="map-container"></div>
    </div>
  </div>

</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import axios, {AxiosHeaders} from "axios";

export default {
  name: "CaseManagement",
  data() {
    return {
      newReport: {
        caseID: '',
        reporterID:'',
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
        managerID: '',
      },
      map: null,
      geolocation: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    goBack() {
      // 使用 Vue Router 的方式返回上一页
      this.$router.go(-1); // 返回上一级页面

    },
    addCase() {
      this.newReport.status = '未处理';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization':localStorage.getItem('jwtToken')
      };
      axios.post('/city/caseInfom/reportCase', JSON.stringify(this.newReport),{headers})
          .then(response => {
            console.log('后端返回:', response.data);
            // 处理响应，例如显示成功或失败消息
            alert(response.data);
            this.goBack(); // 成功保存后返回上一页
          })
          .catch(error => {
            alert(error);
            console.error('保存反馈信息失败:', error);
            // 处理错误情况
          });

    },

    initMap() {
      AMapLoader.load({
        key: "bd2b09677fcbd6ff91a7988ecc1e88d1", // 申请好的Web端开发者Key，首次调用 load 时必填
      }).then(AMap => {
        this.map = new AMap.Map("mapContainer", {
          resizeEnable: true,
          zoom: 10
        });

        AMap.plugin('AMap.Geolocation', () => {
          this.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
            buttonPosition: 'RB',     // 定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true      // 定位成功后是否自动调整地图视野到定位点
          });
          this.map.addControl(this.geolocation);
        });
      }).catch(e => {
        console.error(e);
      });
    },

    locatePosition() {
      if (this.geolocation) {
        this.geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            this.onComplete(result);
          } else {
            this.onError(result);
          }
        });
      }
    },

    onComplete(data) {
      this.newReport.location = `${data.position.getLng()}, ${data.position.getLat()}`;
      console.log('当前位置：', this.newReport.location);
    },

    onError(data) {
      console.error('定位失败', data);
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newReport.photoUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

  }
};
</script>

<style scoped>
.case-management {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 设置视口高度 */
  background: #f5f5f5; /* 背景颜色 */
  padding: 20px;
  box-sizing: border-box;
}

h2 {
  color: #3193bd; /* 标题颜色 */
  font-size: 1.5rem; /* 标题字体大小 */
  margin-bottom: 20px; /* 标题下方的间距 */
  text-align: center; /* 标题居中 */
}

.content {
  display: flex;
  flex: 1;
  margin-top: 20px;
}

.add-case-form {
  width: 50%; /* 设置添加案件表单宽度 */
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 添加垂直滚动 */
}

button {
  padding: 10px;
  margin: 10px 0; /* 修改按钮间距 */
  border: none;
  width: 100%; /* 修改按钮宽度 */
  color: #fff;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.map-container {
  width: 50%; /* 设置地图容器宽度 */
  height: 100vh; /* 设置地图容器高度 */
  position: fixed;
  right: 0;
  top: 0;
}
</style>
