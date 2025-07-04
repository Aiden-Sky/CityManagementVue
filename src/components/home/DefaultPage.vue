<template>
    <div class="container mt-5">
    <header class="d-flex justify-content-between align-items-center mb-5">
      <h1>数字化城管系统</h1>
      <nav>
        <ul class="nav">

          <li class="nav-item">
            <button class="btn btn-warning" >退出</button>
          </li>
        </ul>
      </nav>
    </header>
    <section class="row text-center">
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">反馈受理</h5>
            <p class="card-text">管理和处理城市管理案件</p>
            <a href="/home?page=accept" class="btn btn-primary">进入</a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">监督指挥</h5>
            <p class="card-text">进入监督指挥数字大屏</p>
            <a href="/home?page=commandPage" class="btn btn-primary">进入</a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">地理信息</h5>
            <p class="card-text">查看反馈事件的地理位置</p>
            <a href="/home?page=geographyPage" class="btn btn-primary">进入</a>
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
