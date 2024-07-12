<template>
  <div class="guest-home">
    <header class="d-flex justify-content-between align-items-center py-4 px-3" style="background-color: #c3161c; color: white;">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">市政举报</h1>
      </div>
      <h2 class="mb-0">用户</h2>
    </header>
    <nav class="nav nav-pills nav-fill my-4">
      <router-link to="/add-case" class="nav-item nav-link" :class="{ active: $route.path === '/add-case' }">添加案件</router-link>
      <router-link to="/track-case" class="nav-item nav-link" :class="{ active: $route.path === '/track-case' }">追踪案件</router-link>
    </nav>
    <router-view></router-view>
    <footer class="text-center mt-4 colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<script>
export default  {
  name: "TraceCase",
};
</script>

<style scoped>
header {
  background-color: #c3161c;
  color: white;
}

.logo {
  width: 50px;
  border-radius: 5px;
}

.colorgold {
  background-color: #DABB85;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

.nav-item .active {
  background-color: #c3161c;
  color: white;
}
</style>
