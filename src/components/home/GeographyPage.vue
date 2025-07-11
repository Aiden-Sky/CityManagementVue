<template>
  <div class="geography-page">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
      <p>加载案件数据中...</p>
    </div>
    
    <div v-if="error || mapError" class="alert alert-danger error-message">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error || mapError }}
    </div>
    
    <div class="map-container">
      <div id="mymap">      </div>
      
      <div class="map-controls">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="showCluster" v-model="useCluster" @change="toggleCluster">
          <label class="form-check-label" for="showCluster">聚合显示</label>
        </div>
        
        <div class="filter-controls">
          <select class="form-select" v-model="statusFilter" @change="filterMarkers">
            <option value="">全部状态</option>
            <option value="未处理">未处理</option>
            <option value="处理中">处理中</option>
            <option value="已解决">已解决</option>
            <option value="待处理">待处理</option>
            <option value="已撤销">已撤销</option>
          </select>
          
          <select class="form-select" v-model="typeFilter" @change="filterMarkers">
            <option value="">全部类型</option>
            <option v-for="type in caseTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="details-panel" v-if="selectedLocation">
      <div class="details-header">
        <h5>案件详情 <span :class="getStatusBadgeClass(selectedLocation.status)">{{ selectedLocation.status }}</span></h5>
        <button type="button" class="close" @click="closeDetails">&times;</button>
      </div>
      
      <div class="details-content">
        <div class="detail-section">
          <h6><i class="bi bi-geo-alt-fill"></i> 位置信息</h6>
          <div class="detail-item">
            <span class="detail-label">位置描述:</span>
            <span class="detail-value">{{ selectedLocation.locationDescribe }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">经纬度:</span>
            <span class="detail-value">{{ selectedLocation.location }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">案件类型:</span>
            <span class="detail-value">{{ selectedLocation.caseType }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">信息大类:</span>
            <span class="detail-value">{{ selectedLocation.infoCategory || '无' }}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h6><i class="bi bi-person-fill"></i> 举报信息</h6>
          <div class="detail-item">
            <span class="detail-label">举报人:</span>
            <span class="detail-value">{{ selectedLocation.reporter }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">联系电话:</span>
            <span class="detail-value">{{ selectedLocation.reporterPhone }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">举报时间:</span>
            <span class="detail-value">{{ selectedLocation.createdDate }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">需要回复:</span>
            <span class="detail-value">{{ selectedLocation.needResponse ? '是' : '否' }}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h6><i class="bi bi-info-circle-fill"></i> 案件详情</h6>
          <div class="detail-item">
            <span class="detail-label">描述:</span>
            <div class="detail-value description-text">{{ selectedLocation.description }}</div>
          </div>
          <div class="detail-item">
            <span class="detail-label">严重程度:</span>
            <span class="detail-value">{{ selectedLocation.severity }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">已核实:</span>
            <span class="detail-value">{{ selectedLocation.verified ? '是' : '否' }}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h6><i class="bi bi-clipboard-check-fill"></i> 处理信息</h6>
          <div class="detail-item">
            <span class="detail-label">处理方式:</span>
            <span class="detail-value">{{ selectedLocation.handlingMethod || '暂无' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">处理时间:</span>
            <span class="detail-value">{{ selectedLocation.processDate || '未处理' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">关闭日期:</span>
            <span class="detail-value">{{ selectedLocation.closedDate || '未关闭' }}</span>
          </div>
          <div class="detail-item" v-if="selectedLocation.manageRemark">
            <span class="detail-label">处理备注:</span>
            <div class="detail-value description-text">{{ selectedLocation.manageRemark }}</div>
          </div>
        </div>
        
        <div class="detail-section">
          <h6><i class="bi bi-camera-fill"></i> 现场图片</h6>
          <div class="image-container">
            <div v-if="imageLoading" class="text-center py-3">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
              <p class="mt-2">加载图片中...</p>
            </div>
            <img v-else-if="caseImage" :src="caseImage" alt="案件图片" class="img-fluid rounded" />
            <div v-else-if="imageError" class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ imageError }}
            </div>
            <div v-else class="text-center py-3 no-image">
              <i class="bi bi-image"></i>
              <p>暂无图片</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="details-actions">
        <button class="btn btn-secondary" @click="closeDetails">
          <i class="bi bi-x-circle"></i> 关闭
        </button>
        <button class="btn btn-primary" @click="centerMapOnCase">
          <i class="bi bi-geo-alt"></i> 定位案件
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// 确保加载高德地图API
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";
// 如果已安装bootstrap-icons，取消下面注释
// import 'bootstrap-icons/font/bootstrap-icons.css';

// 检查AMapLoader是否加载成功
if (!AMapLoader) {
  console.error('警告：AMapLoader未正确导入，请检查依赖安装');
}

export default {
  name: 'GeographyPage',
  data() {
    return {
      map: null,
      AMap: null,
      selectedLocation: null,
      reports: [],
      markers: [],
      markerCluster: null,
      loading: false,
      error: null,
      mapError: null,
      caseImage: null,
      imageLoading: false,
      imageError: null,
      useCluster: true,
      statusFilter: '',
      typeFilter: '',
      caseTypes: [],
      allMarkers: []
    };
  },
  mounted() {
    console.log('组件已挂载，准备初始化地图');
    
    // 确保DOM已经渲染
    this.$nextTick(() => {
      // 检查地图容器是否存在
      const mapContainer = document.getElementById('mymap');
      if (!mapContainer) {
        console.error('找不到地图容器元素 #mymap');
        this.mapError = '地图容器初始化失败，请刷新页面重试';
        return;
      }
      
      console.log('地图容器元素存在，尺寸:', mapContainer.clientWidth, 'x', mapContainer.clientHeight);
    this.initMap();
    });
  },
  methods: {
    initMap() {
      console.log('开始初始化地图...');
      
      // 确保AMapLoader已经加载
      if (!AMapLoader) {
        console.error('AMapLoader未加载');
        this.mapError = '地图API加载失败，请刷新页面重试';
        // 尝试获取案件数据
        this.fetchReports();
        return;
      }
      
      AMapLoader.load({
        key: "bd2b09677fcbd6ff91a7988ecc1e88d1", // 注意：请确认此密钥已授权您的网站域名
        version: "2.0",
        plugins: ['AMap.MarkerClusterer', 'AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MapType', 'AMap.Geolocation']
      })
        .then(AMap => {
          console.log('高德地图API加载成功');
          this.AMap = AMap; // 保存AMap引用以便后续使用
          
          try {
            // 初始化地图 - 使用正确的经纬度（大庆市位置 - 125.1, 46.58）
            console.log('初始化地图容器...');
          this.map = new AMap.Map("mymap", {
              center: [125.145617, 46.586632], // 使用实际案件的中心点位置
              zoom: 15, // 放大级别，使标记更容易看到
              resizeEnable: true,
              viewMode: '3D' // 使用3D视图
            });
            
            // 验证地图是否成功初始化
            if (!this.map) {
              throw new Error('地图初始化失败');
            }
            
            console.log('地图容器初始化成功');
            
            // 添加地图控件
            console.log('添加地图控件...');
            this.map.addControl(new AMap.ToolBar());
            this.map.addControl(new AMap.Scale());
            this.map.addControl(new AMap.HawkEye({isOpen: false}));
            this.map.addControl(new AMap.MapType({
              defaultType: 0
            }));
            console.log('地图控件添加成功');
            
            // 添加定位控件
            console.log('添加定位控件...');
            const geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,
              timeout: 10000,
              buttonPosition: 'RB',
              buttonOffset: new AMap.Pixel(10, 20),
              zoomToAccuracy: true
            });
            this.map.addControl(geolocation);
            
            // 确保地图完全加载后再获取案件数据
            this.map.on('complete', () => {
              console.log('地图加载完成事件触发');
              // 获取案件数据
              this.fetchReports();
            });
            
            // 备用方案：如果地图完成事件未触发，仍获取数据
            setTimeout(() => {
              if (!this.reports || this.reports.length === 0) {
                console.log('地图加载完成事件未触发，通过延时获取案件数据');
                this.fetchReports();
              }
            }, 2000);
          } catch (error) {
            console.error('地图初始化过程中出错:', error);
            this.mapError = '地图初始化失败，请刷新页面重试';
            this.fetchReports();
          }
        })
        .catch(e => {
          console.error('地图加载失败:', e);
          this.mapError = '地图加载失败，请刷新页面重试';
          
          // 即使地图加载失败，也尝试获取案件数据
          this.fetchReports();
        });
    },
    // 过滤并显示标记
    filterMarkers() {
      if (!this.map || !this.AMap || !this.allMarkers || this.allMarkers.length === 0) return;
      
      // 清除现有标记
      if (this.markers && this.markers.length) {
        this.markers.forEach(marker => marker.setMap(null));
      }
      if (this.markerCluster) {
        this.markerCluster.setMap(null);
      }
      
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
          // 创建标记聚合
          this.markerCluster = new this.AMap.MarkerClusterer(this.map, this.markers, {
            gridSize: 80,
            maxZoom: 18
          });
        } else {
          // 直接添加标记到地图
          this.markers.forEach(marker => marker.setMap(this.map));
        }
      }
    },
    
    // 切换聚合显示
    toggleCluster() {
      this.filterMarkers();
    },
    
    // 添加标记到地图
    addMarkers() {
      if (!this.map) {
        console.error('地图对象未初始化'); // 添加调试日志
        return;
      }
      if (!this.AMap) {
        console.error('AMap API未加载'); // 添加调试日志
        return;
      }
      if (this.reports.length === 0) {
        console.warn('没有报告数据可添加到地图'); // 添加调试日志
        return;
      }
      
      // 清除现有标记
      if (this.markers && this.markers.length) {
        this.markers.forEach(marker => marker.setMap(null));
      }
      if (this.markerCluster) {
        this.markerCluster.setMap(null);
      }
      
      this.markers = [];
      this.allMarkers = [];
      const validReports = [];
      
      // 收集所有案件类型
      this.caseTypes = [...new Set(this.reports
        .filter(report => report.caseType)
        .map(report => report.caseType))].sort();
      
      // 创建不同状态的图标样式
      const iconStyles = {
        '未处理': {
          size: [25, 34],
          src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
          anchor: [12, 34]
        },
        '处理中': {
          size: [25, 34],
          src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          anchor: [12, 34]
        },
        '已解决': {
          size: [25, 34],
          src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_g.png',
          anchor: [12, 34]
        },
        '待处理': {
          size: [25, 34],
          src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_y.png',
          anchor: [12, 34]
        },
        '已撤销': {
          size: [25, 34],
          src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
          anchor: [12, 34]
        }
      };
      
      // 默认图标样式
      const defaultIcon = {
        size: [25, 34],
        src: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
        anchor: [12, 34]
      };
      
      // 创建标记点
      this.reports.forEach((report, index) => {
        if (!report.location) {
          console.log(`报告 #${index} 没有位置信息:`, report);
          return; // 跳过没有位置信息的报告
        }
        
        try {
          // 解析位置信息
          const locationParts = report.location.split(',');
          if (locationParts.length !== 2) {
            console.log(`报告 #${index} 位置格式错误:`, report.location);
            return;
          }
          
          const lng = parseFloat(locationParts[0].trim());
          const lat = parseFloat(locationParts[1].trim());
          
          // 验证经纬度有效性
          if (isNaN(lng) || isNaN(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
            console.log(`报告 #${index} 经纬度无效:`, lng, lat);
            return;
          }
          
          console.log(`创建标记点 #${index}: [${lng}, ${lat}], 类型: ${report.caseType}, 状态: ${report.status}`);
          
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

          console.log(`使用图标: ${iconUrl}, 位置: [${lng}, ${lat}]`);

          // 创建标记
          const marker = new this.AMap.Marker({
            position: new this.AMap.LngLat(lng, lat), // 使用LngLat对象
            title: `${report.caseType || '案件'}: ${report.description || '无描述'}`,
            icon: iconUrl,
            anchor: 'bottom-center',
            offset: new this.AMap.Pixel(0, 0),
            extData: report // 存储报告数据，用于过滤功能
          });
          
          // 设置标签内容
          marker.setLabel({
            direction: 'right',
            offset: new this.AMap.Pixel(10, 0),
            content: `<div class="marker-label">${report.caseType || '案件'}</div>`
          });
          
          // 设置点击事件
        marker.on('click', () => {
          this.selectedLocation = report;
            this.loadCaseImage(report.caseID);
          });
          
          this.markers.push(marker);
          this.allMarkers.push(marker);
          validReports.push(report);
        } catch (error) {
          console.error(`标记 #${index} 创建失败:`, error, report);
        }
      });
      
      // 添加标记到地图
      if (this.markers.length > 0) {
        console.log(`成功创建 ${this.markers.length} 个标记点，开始添加到地图`);
        
        try {
          // 先将标记直接添加到地图，不使用聚合
          this.markers.forEach(marker => {
            marker.setMap(this.map);
            console.log(`标记已添加到地图: ${marker.getPosition()}`);
          });
          
          // 设置地图视野以包含所有标记点
          this.map.setFitView(this.markers);
          console.log('地图视野已自动调整以显示所有标记');
          
          // 创建标记聚合（如果启用）
          if (this.useCluster) {
            this.markerCluster = new this.AMap.MarkerClusterer(this.map, this.markers, {
              gridSize: 80,
              maxZoom: 18
            });
            console.log('标记聚合已创建并添加到地图');
          }
        } catch (error) {
          console.error('添加标记到地图失败:', error);
        }
      } else {
        console.warn('没有有效的标记点可添加到地图');
      }
    },
    async fetchReports(page = 1) {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // 获取所有案件数据
        const response = await axios.get('/city/caseInfom/getInfoms', {
          params: {
            page: 1,
            pageSize: 9999 // 请求大量数据，获取所有案件
          },
          headers: {
            'Authorization': token
          }
        });
        
        console.log('API响应数据:', response.data); // 添加调试日志
        
        if (response.data && response.data.reports) {
          // 处理返回的案例数据，确保数据格式一致
          this.reports = response.data.reports.map(item => {
            console.log('原始案件数据:', item); // 查看原始数据格式
            
            // 检查位置数据格式
            let locationStr = item.location || '';
            if (locationStr) {
              console.log(`案件 #${item.caseID} 原始位置数据:`, locationStr);
              
              // 尝试规范化位置数据格式
              // 有些后端可能返回 [经度,纬度] 或 (经度,纬度) 或其他非标准格式
              locationStr = locationStr
                .replace('[', '')
                .replace(']', '')
                .replace('(', '')
                .replace(')', '')
                .replace('，', ',') // 替换中文逗号
                .replace(/\s+/g, ''); // 去除空白字符
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
              createdDate: this.formatDateTime(item.createdDate),
              processDate: this.formatDateTime(item.processDate),
              closedDate: this.formatDateTime(item.closedDate),
              managerName: item.managerName || '',
              manageRemark: item.manageRemark || '',
              severity: item.severity || '中',
              verified: item.verified || false,
              handlingMethod: item.handlingMethod || '',
              needResponse: item.needResponse || false
            };
          });
          
          console.log('处理后的报告数据:', this.reports); // 添加调试日志
          console.log('报告数量:', this.reports.length); // 添加调试日志
          
          // 过滤掉没有位置信息的案件
          const originalLength = this.reports.length;
          this.reports = this.reports.filter(report => report.location && report.location.includes(','));
          console.log(`过滤后的报告数量: ${this.reports.length}，过滤掉了 ${originalLength - this.reports.length} 个无效位置的报告`); // 添加调试日志
          
          if (this.reports.length > 0) {
            console.log('第一个有效位置:', this.reports[0].location); // 添加调试日志
          } else {
            console.warn('没有有效的位置数据!'); // 添加调试日志
          }
          
          // 添加标记到地图
          this.addMarkers();
        } else {
          this.reports = [];
          this.error = '未获取到案件数据';
          console.error('API响应中没有reports字段:', response.data); // 添加调试日志
        }
      } catch (error) {
        console.error('获取案件列表失败:', error);
        this.error = '获取案件列表失败，请重试';
        this.reports = [];
      } finally {
        this.loading = false;
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
    // 加载案件图片
    async loadCaseImage(caseId) {
      if (!caseId) return;
      
      this.imageLoading = true;
      this.imageError = null;
      this.caseImage = null;
      
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        this.imageError = "未登录，无法加载图片";
        this.imageLoading = false;
        return;
      }
      
      try {
        // 使用axios请求图片
        const response = await axios({
          method: 'get',
          url: `/city/caseInfom/getCaseImage?caseId=${caseId}`,
        headers: {
          'Authorization': token
          },
          responseType: 'blob' // 重要：指定响应类型为blob
        });
        
        // 创建Blob URL
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        this.caseImage = URL.createObjectURL(blob);
      } catch (error) {
        console.error('获取图片失败:', error);
        this.imageError = "获取图片失败";
      } finally {
        this.imageLoading = false;
      }
    },
    
    // 关闭详情面板
    closeDetails() {
      // 释放Blob URL，避免内存泄漏
      if (this.caseImage) {
        URL.revokeObjectURL(this.caseImage);
        this.caseImage = null;
      }
      this.selectedLocation = null;
    },
    
    // 将地图中心定位到选中的案件
    centerMapOnCase() {
      if (!this.selectedLocation || !this.selectedLocation.location || !this.map) return;
      
      try {
        const locationParts = this.selectedLocation.location.split(',');
        if (locationParts.length !== 2) return;
        
        const lng = parseFloat(locationParts[0].trim());
        const lat = parseFloat(locationParts[1].trim());
        
        // 验证经纬度有效性
        if (isNaN(lng) || isNaN(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          return;
        }
        
        // 设置地图中心点
        this.map.setCenter([lng, lat]);
        // 设置缩放级别
        this.map.setZoom(15);
      } catch (error) {
        console.error('定位案件失败:', error);
      }
    },
    
    // 获取状态样式类
    getStatusBadgeClass(status) {
      switch (status) {
        case '未处理': return 'status-badge status-pending';
        case '处理中': return 'status-badge status-processing';
        case '已解决': return 'status-badge status-completed';
        case '待处理': return 'status-badge status-waiting';
        case '已撤销': return 'status-badge status-cancelled';
        default: return 'status-badge status-default';
      }
    }
  }
};
</script>

<style scoped>
.geography-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#mymap {
  width: 100%;
  height: 100vh;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.error-message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  width: auto;
  max-width: 80%;
}

.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 250px;
}

.filter-controls {
  margin-top: 15px;
}

.filter-controls .form-select {
  margin-bottom: 10px;
}

.details-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: white;
  color: #333;
  padding: 0;
  overflow-y: auto;
  box-shadow: -2px 0 15px rgba(0, 0, 0, 0.2);
  z-index: 1050;
  display: flex;
  flex-direction: column;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #dee2e6;
}

.details-header h5 {
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.details-header .close {
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
}

.details-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.detail-section h6 {
  font-weight: 600;
  margin-bottom: 15px;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-item {
  margin-bottom: 12px;
  display: flex;
}

.detail-label {
  font-weight: 500;
  width: 100px;
  color: #6c757d;
}

.detail-value {
  flex: 1;
}

.description-text {
  white-space: pre-wrap;
  line-height: 1.5;
}

.image-container {
  margin-top: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  min-height: 200px;
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

.details-actions {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 10px;
  color: white;
}

.status-pending {
  background-color: #dc3545;
}

.status-processing {
  background-color: #007bff;
}

.status-completed {
  background-color: #28a745;
}

.status-waiting {
  background-color: #ffc107;
  color: #212529;
}

.status-cancelled {
  background-color: #6c757d;
}

.status-default {
  background-color: #6c757d;
}

/* 高德地图标记相关样式 */
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

:deep(.info-window) {
  padding: 5px;
  max-width: 300px;
}

:deep(.info-window) h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

:deep(.info-window) p {
  margin-bottom: 5px;
  font-size: 14px;
}

.detail-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
}

.detail-btn:hover {
  background-color: #0069d9;
}
</style>
