<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="/home">
        <img src="/imgs/symbo.png" alt="Logo" class="d-inline-block align-text-top"
             style="padding-right:10px;height: 30px;">
        数字城市系统
      </a>
      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/home?page=commandPage">监督指挥</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/home?page=userManagement">用户管理</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/home?page=accept">监督受理</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/home?page=geographyPage">地理信息</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/home?page=officerPerformPage">绩效考核</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/home?page=baseinfom">基础信息</router-link>
          </li>
        </ul>
        <span class="navbar-text">
          <a href="/home" class="nav-link d-inline-block"><i class="bi bi-house"></i> 平台首页</a>
          <a href="/home?page=userSetting" class="nav-link d-inline-block"><i class="bi bi-gear"></i> 用户设置</a>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  background-color: #0a123a; /* 深蓝色背景 */
  padding: 1rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  color: #fff;
}

.navbar-nav .nav-link {
  color: #fff;
  margin: 0 10px;
  transition: color 0.3s ease; /* 添加平滑过渡效果 */
}

.navbar-nav .nav-link:hover {
  color: #00bfff; /* 悬停时的颜色 */
}

.navbar-text .nav-link {
  color: #fff;
  margin: 0 10px;
  transition: color 0.3s ease; /* 添加平滑过渡效果 */
}

.navbar-text .nav-link:hover {
  color: #00bfff; /* 悬停时的颜色 */
}

.navbar-toggler {
  border: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28255, 255, 255, 0.5%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.bi-house, .bi-gear {
  font-size: 1.2rem;
}
</style>
