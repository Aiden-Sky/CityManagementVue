<template>
  <div class="guest-home">
    <header class="d-flex justify-content-between align-items-center py-4 px-3"
            style="background-color: #c3161c; color: white;">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">市政举报</h1>
      </div>
      <h2 class="mb-0">用户</h2>
    </header>
      <div class="background">
    <div class="container my-4 flex-grow-1">

        <div class="row">
          <div class="col-md-6">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">添加案件</h5>
                <p class="card-text">在此添加新的案件信息。</p>
                <router-link to="/addcase" class="btn btn-primary">前往添加案件</router-link>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card text-center">
              <div class="card-body">
                <h5 class="card-title">追踪案件</h5>
                <p class="card-text">查看案件的办理进度。</p>
                <router-link to="/tracecase" class="btn btn-primary">前往追踪案件</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="text-center mt-4 colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<script>
import AddCase from "@/components/GuestHome/AddCase.vue";
import TraceCase from "@/components/GuestHome/TraceCase.vue";

export default {
  name: "GuestHome",
};
</script>

<style scoped>
.guest-home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #c3161c;
  color: white;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  width: 50px;
  border-radius: 5px;
}

.background {
  background: url("https://portal.bjt.beijing.gov.cn/p/assets/imgs/loginBg.png") no-repeat center center fixed;
  background-size: cover;
  width: 100%;
  min-height: 80vh;
  padding: 20px; /* 添加内边距以避免内容紧贴边缘 */
  box-sizing: border-box;
}

.card {
  margin: 20px 0;
  background-color: white;
}

.btn-primary {
  background-color: #c3161c;
  border: none;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  display: inline-block;
}

.colorgold {
  background-color: #DABB85;
  height: 50px;
  text-align: center;
  line-height: 50px;
  width: 100%;
  box-sizing: border-box;
}

footer {
  margin-top: auto;
}

.container {
  flex-grow: 1;
  padding: 0 15px;
  box-sizing: border-box;
}

.row {
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-6 {
  padding-right: 15px;
  padding-left: 15px;
}

@media (max-width: 768px) {
  .background {
    min-height: 40vh;
  }
}
</style>
