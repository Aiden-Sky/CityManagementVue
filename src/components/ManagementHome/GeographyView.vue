<template>
  <div class="geography-container">
    <div class="geography-header d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">案件地理分布</h4>
      <button class="btn btn-outline-secondary" @click="$emit('go-back')">
        <i class="bi bi-arrow-left me-1"></i>返回
      </button>
    </div>

    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">状态筛选</span>
          <select class="form-select" v-model="statusFilter" @change="filterMarkers">
            <option value="">全部状态</option>
            <option value="未处理">未处理</option>
            <option value="处理中">处理中</option>
            <option value="已解决">已解决</option>
            <option value="待处理">待处理</option>
            <option value="已撤销">已撤销</option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">类型筛选</span>
          <select class="form-select" v-model="typeFilter" @change="filterMarkers">
            <option value="">全部类型</option>
            <option v-for="type in caseTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="map-container">
          <div v-if="loading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">加载中...</span>
            </div>
            <p class="mt-2">加载地图和案件数据中...</p>
          </div>
          <div id="map-view" style="height: 600px;"></div>
          
          <div class="map-controls">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="showCluster" v-model="useCluster" @change="toggleCluster">
              <label class="form-check-label" for="showCluster">聚合显示</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="case-detail-panel" v-if="selectedCase">
      <div class="detail-header">
        <h5>案件详情 <span :class="getStatusClass(selectedCase.status)">{{ selectedCase.status }}</span></h5>
        <button type="button" class="btn-close" @click="closeDetail"></button>
      </div>
      
      <div class="detail-content">
        <div class="detail-row">
          <div class="detail-label">案件编号:</div>
          <div class="detail-value">{{ selectedCase.caseID }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">案件类型:</div>
          <div class="detail-value">{{ selectedCase.caseType || '未分类' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">报告人:</div>
          <div class="detail-value">{{ selectedCase.reporter }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">联系电话:</div>
          <div class="detail-value">{{ selectedCase.reporterPhone }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">位置描述:</div>
          <div class="detail-value">{{ selectedCase.locationDescribe || '无详细位置' }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">经纬度:</div>
          <div class="detail-value">{{ selectedCase.location }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">创建日期:</div>
          <div class="detail-value">{{ formatDateTime(selectedCase.createdDate) }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">描述:</div>
          <div class="detail-value description-text">{{ selectedCase.description || '无描述' }}</div>
        </div>
        
        <div class="detail-section mt-3">
          <h6>处理信息</h6>
          <div class="detail-row">
            <div class="detail-label">处理方法:</div>
            <div class="detail-value">{{ selectedCase.handlingMethod || '未处理' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">处理日期:</div>
            <div class="detail-value">{{ formatDateTime(selectedCase.processDate) || '未处理' }}</div>
          </div>
          <div class="detail-row" v-if="selectedCase.manageRemark">
            <div class="detail-label">处理备注:</div>
            <div class="detail-value description-text">{{ selectedCase.manageRemark }}</div>
          </div>
        </div>
        
        <div class="detail-section mt-3">
          <h6>现场图片</h6>
          <div class="image-container">
            <div v-if="imageLoading" class="text-center py-3">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
              <p class="mt-2">加载图片中...</p>
            </div>
            <img v-else-if="caseImage" :src="caseImage" alt="案件图片" class="img-fluid rounded" />
            <div v-else class="text-center py-3 no-image">
              <i class="bi bi-image"></i>
              <p>暂无图片</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-footer">
        <button class="btn btn-outline-secondary" @click="closeDetail">关闭</button>
        <button class="btn btn-primary" @click="centerMapOnCase">
          <i class="bi bi-geo-alt me-1"></i>定位
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import axios from 'axios';

export default {
  name: 'GeographyView',
  emits: ['go-back'],
  data() {
    return {
      loading: true,
      map: null,
      AMap: null,
      reports: [],
      markers: [],
      allMarkers: [],
      markerCluster: null,
      useCluster: true,
      statusFilter: '',
      typeFilter: '',
      caseTypes: [],
      selectedCase: null,
      caseImage: null,
      imageLoading: false,
      mapError: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 初始化地图
    initMap() {
      console.log('开始初始化地图...');
      
      AMapLoader.load({
        key: "bd2b09677fcbd6ff91a7988ecc1e88d1", // 请确认此密钥已授权您的网站域名
        version: "2.0",
        plugins: ['AMap.MarkerClusterer', 'AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MapType', 'AMap.Geolocation']
      })
      .then(AMap => {
        console.log('高德地图API加载成功');
        this.AMap = AMap;
        
        try {
          // 初始化地图，使用东北石油大学位置坐标作为中心
          this.map = new AMap.Map("map-view", {
            center: [125.145617, 46.586632], 
            zoom: 15,
            resizeEnable: true,
            viewMode: '3D'
          });
          
          // 添加地图控件
          this.map.addControl(new AMap.ToolBar());
          this.map.addControl(new AMap.Scale());
          this.map.addControl(new AMap.MapType({ defaultType: 0 }));
          
          // 地图加载完成后获取案件数据
          this.map.on('complete', () => {
            this.fetchCaseData();
          });
        } catch (error) {
          console.error('地图初始化失败:', error);
          this.mapError = '地图初始化失败，请刷新页面重试';
          this.loading = false;
        }
      })
      .catch(error => {
        console.error('地图API加载失败:', error);
        this.mapError = '地图API加载失败，请刷新页面重试';
        this.loading = false;
      });
    },
    
    // 获取案件数据
    async fetchCaseData() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        const response = await axios.get('/city/caseInfom/getInfoms', {
          params: {
            page: 1,
            pageSize: 9999
          },
          headers: {
            'Authorization': token
          }
        });
        
        if (response.data && response.data.reports) {
          console.log(`获取到 ${response.data.reports.length} 条案件数据`);
          
          // 处理返回的案例数据
          this.reports = response.data.reports.map(item => {
            // 规范化位置数据
            let locationStr = item.location || '';
            if (locationStr) {
              locationStr = locationStr
                .replace('[', '')
                .replace(']', '')
                .replace('(', '')
                .replace(')', '')
                .replace('，', ',')
                .replace(/\s+/g, '');
            }
            
            return {
              caseID: item.caseID,
              reporter: item.reporter || '未知',
              reporterPhone: item.reporterPhone || '无电话',
              caseType: item.caseType || '未分类',
              infoCategory: item.infoCategory || '其他',
              description: item.description || '无描述',
              location: locationStr,
              locationDescribe: item.locationDescribe || '无详细位置',
              status: item.status || '未处理',
              createdDate: item.createdDate,
              processDate: item.processDate,
              closedDate: item.closedDate,
              managerName: item.managerName || '',
              manageRemark: item.manageRemark || '',
              severity: item.severity || '中',
              verified: item.verified || false,
              handlingMethod: item.handlingMethod || '',
              needResponse: item.needResponse || false
            };
          });
          
          // 过滤掉没有位置信息的案件
          const originalLength = this.reports.length;
          this.reports = this.reports.filter(report => report.location && report.location.includes(','));
          console.log(`过滤后的报告数量: ${this.reports.length}，过滤掉了 ${originalLength - this.reports.length} 个无效位置的报告`);
          
          // 获取所有案件类型
          this.caseTypes = [...new Set(this.reports
            .filter(report => report.caseType)
            .map(report => report.caseType))].sort();
          
          // 添加标记
          this.addMarkersToMap();
        } else {
          console.error('未获取到有效的案件数据');
        }
      } catch (error) {
        console.error('获取案件数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // 将标记添加到地图
    addMarkersToMap() {
      if (!this.map || !this.AMap || !this.reports.length) return;
      
      // 清除现有标记
      this.clearMarkers();
      
      // 创建标记
      this.reports.forEach(report => {
        if (!report.location) return;
        
        try {
          const locationParts = report.location.split(',');
          if (locationParts.length !== 2) return;
          
          const lng = parseFloat(locationParts[0].trim());
          const lat = parseFloat(locationParts[1].trim());
          
          if (isNaN(lng) || isNaN(lat)) return;
          
          // 获取对应状态的图标URL
          let iconUrl;
          switch(report.status) {
            case '未处理':
              iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png';
              break;
            case '处理中':
              iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
              break;
            case '已解决':
              iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_g.png';
              break;
            case '待处理':
              iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_y.png';
              break;
            case '已撤销':
              iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png';
              break;
            default:
              iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png';
          }
          
          // 创建标记
          const marker = new this.AMap.Marker({
            position: new this.AMap.LngLat(lng, lat),
            title: `${report.caseType || '案件'}: ${report.description || '无描述'}`,
            icon: iconUrl,
            anchor: 'bottom-center',
            extData: report
          });
          
          // 设置标签内容
          marker.setLabel({
            direction: 'right',
            offset: new this.AMap.Pixel(10, 0),
            content: `<div class="marker-label">${report.caseType || '案件'}</div>`
          });
          
          // 添加点击事件
          marker.on('click', () => {
            this.showCaseDetail(report);
          });
          
          this.markers.push(marker);
          this.allMarkers.push(marker);
        } catch (error) {
          console.error('创建标记失败:', error, report);
        }
      });
      
      // 添加标记到地图
      if (this.markers.length > 0) {
        // 先直接添加标记到地图
        this.markers.forEach(marker => marker.setMap(this.map));
        
        // 调整地图视野以包含所有标记
        this.map.setFitView(this.markers);
        
        // 如果启用聚合，创建聚合对象
        if (this.useCluster) {
          this.createCluster();
        }
      } else {
        console.warn('没有有效的标记点可添加到地图');
      }
    },
    
    // 创建聚合
    createCluster() {
      if (this.markerCluster) {
        this.markerCluster.setMap(null);
      }
      
      if (this.markers.length > 0) {
        this.markerCluster = new this.AMap.MarkerClusterer(this.map, this.markers, {
          gridSize: 80,
          maxZoom: 18
        });
      }
    },
    
    // 清除标记
    clearMarkers() {
      if (this.markerCluster) {
        this.markerCluster.setMap(null);
        this.markerCluster = null;
      }
      
      if (this.markers.length > 0) {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
      }
    },
    
    // 切换聚合显示
    toggleCluster() {
      if (this.useCluster) {
        // 先移除所有标记
        this.markers.forEach(marker => marker.setMap(null));
        // 创建聚合
        this.createCluster();
      } else {
        // 移除聚合
        if (this.markerCluster) {
          this.markerCluster.setMap(null);
          this.markerCluster = null;
        }
        // 直接添加标记
        this.markers.forEach(marker => marker.setMap(this.map));
      }
    },
    
    // 过滤标记
    filterMarkers() {
      // 清除现有标记
      this.clearMarkers();
      
      // 根据过滤条件筛选标记
      this.markers = this.allMarkers.filter(marker => {
        const report = marker.getExtData();
        const statusMatch = !this.statusFilter || report.status === this.statusFilter;
        const typeMatch = !this.typeFilter || report.caseType === this.typeFilter;
        return statusMatch && typeMatch;
      });
      
      // 添加标记到地图
      if (this.markers.length > 0) {
        if (this.useCluster) {
          this.createCluster();
        } else {
          this.markers.forEach(marker => marker.setMap(this.map));
        }
        
        // 调整地图视野以包含所有标记
        this.map.setFitView(this.markers);
      } else {
        console.warn('筛选后没有符合条件的标记');
      }
    },
    
    // 显示案件详情
    showCaseDetail(caseItem) {
      this.selectedCase = caseItem;
      if (caseItem && caseItem.caseID) {
        this.loadCaseImage(caseItem.caseID);
      }
    },
    
    // 关闭详情面板
    closeDetail() {
      // 释放图片资源
      if (this.caseImage) {
        URL.revokeObjectURL(this.caseImage);
      }
      this.selectedCase = null;
      this.caseImage = null;
    },
    
    // 加载案件图片
    async loadCaseImage(caseId) {
      this.imageLoading = true;
      this.caseImage = null;
      
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;
        
        const response = await axios({
          method: 'get',
          url: `/city/caseInfom/getCaseImage?caseId=${caseId}`,
          headers: {
            'Authorization': token
          },
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        this.caseImage = URL.createObjectURL(blob);
      } catch (error) {
        console.error('获取图片失败:', error);
      } finally {
        this.imageLoading = false;
      }
    },
    
    // 将地图中心定位到选中的案件
    centerMapOnCase() {
      if (!this.selectedCase || !this.selectedCase.location) return;
      
      try {
        const locationParts = this.selectedCase.location.split(',');
        if (locationParts.length !== 2) return;
        
        const lng = parseFloat(locationParts[0].trim());
        const lat = parseFloat(locationParts[1].trim());
        
        if (isNaN(lng) || isNaN(lat)) return;
        
        this.map.setCenter([lng, lat]);
        this.map.setZoom(17); // 放大显示
      } catch (error) {
        console.error('定位案件失败:', error);
      }
    },
    
    // 格式化日期时间
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '';
      
      try {
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) return dateTimeStr;
        
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
    
    // 获取状态样式类
    getStatusClass(status) {
      switch (status) {
        case '未处理': return 'badge bg-danger';
        case '处理中': return 'badge bg-primary';
        case '已解决': return 'badge bg-success';
        case '待处理': return 'badge bg-warning text-dark';
        case '已撤销': return 'badge bg-secondary';
        default: return 'badge bg-secondary';
      }
    }
  },
  beforeUnmount() {
    // 释放资源
    if (this.map) {
      this.map.destroy();
    }
    if (this.caseImage) {
      URL.revokeObjectURL(this.caseImage);
    }
  }
};
</script>

<style scoped>
.geography-container {
  position: relative;
}

.geography-header {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.map-container {
  position: relative;
  background-color: #f8f9fa;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.map-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.case-detail-panel {
  position: absolute;
  top: 80px;
  right: 10px;
  width: 350px;
  max-height: calc(100vh - 100px);
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 500;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
}

.detail-content {
  padding: 15px;
  overflow-y: auto;
  flex: 1;
}

.detail-footer {
  padding: 15px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
}

.detail-row {
  margin-bottom: 10px;
  display: flex;
}

.detail-label {
  width: 80px;
  font-weight: 500;
  color: #6c757d;
}

.detail-value {
  flex: 1;
}

.detail-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #dee2e6;
}

.detail-section h6 {
  font-weight: 600;
  margin-bottom: 15px;
}

.description-text {
  white-space: pre-line;
}

.image-container {
  margin-top: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image {
  color: #adb5bd;
}

.no-image i {
  font-size: 3rem;
  margin-bottom: 10px;
}

/* 标记样式 */
:deep(.amap-marker-label) {
  border: 0;
  background-color: transparent;
}

:deep(.marker-label) {
  padding: 3px 7px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  border: 1px solid #ccc;
  font-size: 12px;
  white-space: nowrap;
  color: #333;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style> 