<template>
  <div>
    <div id="mymap" style="height:1080px;width:1920px;text-align: center"></div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  name: 'GeographyPage',
  components: {},
  data() {
    return {
      map: null,
      locations: [
        {position: [125.14217, 46.992819], description: '东区中心'},
        {position: [125.14417, 46.582819], description: '南区工地'},
        {position: [125.14217, 46.592819], description: '东北石油大学'},
        {position: [125.14217, 46.592819], description: '东北石油大学'},
        {position: [125.14217, 46.592819], description: '东北石油大学'}
      ]
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "bd2b09677fcbd6ff91a7988ecc1e88d1", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [] //插件列表
      })
          .then(AMap => {
            this.map = new AMap.Map("mymap", {
              center: [125.14217, 46.592819], // 中心点为东北石油大学
              zoom: 12 // 缩放级别
            });
            this.addMarkers(AMap);
          })
          .catch(e => {
            console.log(e);
          });
    },
    addMarkers(AMap) {
      this.locations.forEach(location => {
        const marker = new AMap.Marker({
          position: location.position,
          title: location.description,
          label: {
            content: location.description,
            offset: new AMap.Pixel(20, 20)
          }
        });
        marker.setMap(this.map);
      });
    }
  }
};
</script>

<style scoped>
/* 你的样式 */
</style>
