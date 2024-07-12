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
      map: null
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
            this.map = new AMap.Map("mymap");
          })
          .catch(e => {
            console.log(e);
          });
    }
  }
};

</script>

<style scoped>
/* 你的样式 */
</style>
