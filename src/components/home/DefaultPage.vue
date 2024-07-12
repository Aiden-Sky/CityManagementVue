<template>
    <div class="container mt-5">
    <header class="d-flex justify-content-between align-items-center mb-5">
      <h1>智慧城管系统</h1>
      <nav>
        <ul class="nav">

          <li class="nav-item">
            <button class="button" >退出</button>
          </li>
        </ul>
      </nav>
    </header>
    <section class="row text-center">
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">案件处理</h5>
            <p class="card-text">管理和处理城市管理案件</p>
            <a href="#" class="btn btn-primary">进入</a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">用户设置</h5>
            <p class="card-text">管理您的用户设置和信息</p>
            <a href="#" class="btn btn-primary">进入</a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">系统监控</h5>
            <p class="card-text">监控和分析系统运行状态</p>
            <a href="#" class="btn btn-primary">进入</a>
          </div>
        </div>
      </div>
    </section>
  </div>


</template>

<script>
export default {
  name: 'DefaultPage'
};
</script>

<style scoped>
/* 你的样式 */
</style>
