<template>
  <div class="login-page w-100">
    <header class="d-flex justify-content-between align-items-center py-4 px-3"
            style="background-color: #c3161c; color: white;">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">市政用户举报</h1>
      </div>
      <h2 class="mb-0">统一身份认证平台</h2>
    </header>
    <main class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 172px);">
      <div class="login-container card p-4">
        <div class="login-tabs mb-3">
          个人登陆
        </div>
        <div v-if="isPersonalLogin">
          <input type="text" class="form-control my-2" placeholder="用户名/手机号/身份证号" v-model="username">
          <input type="password" class="form-control my-2" placeholder="密码" v-model="password">
          <div class="d-flex align-items-center my-2">
            <input type="text" class="form-control" style="width: 200px" placeholder="请输入验证码" v-model="captcha">
            <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img ml-2" alt="验证码">
            <button class="refresh-button btn btn-secondary ml-2" @click="refreshCaptcha">刷新</button>
          </div>
          <button class="login-button btn btn-danger w-100 mt-3" @click="login">登录</button>
        </div>

        <div class="additional-links mt-3 text-center">
          <a href="#">立即注册</a> | <a href="#">忘记密码?</a>
        </div>
      </div>
    </main>

    <footer class="text-center mt-4 colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPersonalLogin: true,
      username: '',
      password: '',
      captcha: '',
      captchaUrl: '/api/captcha' // 假设验证码的URL
    };
  },
  methods: {
    login() {
      alert(`登录信息:\n用户名: ${this.username}\n密码: ${this.password}\n验证码: ${this.captcha}`);
    },
    refreshCaptcha() {
      // 更新验证码URL以刷新图片
      this.captchaUrl = `/api/captcha?${new Date().getTime()}`;
    }
  }
};
</script>

<style scoped>
.login-page {
  background-color: #f7f7f7;
}

header {
  background-color: #c3161c;
  color: white;
}

.logo {
  width: 50px;
  border-radius: 5px;
}

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 20px;
}

.login-tabs .btn.active {
  border-bottom: 2px solid #c3161c;
}

.login-button {
  background-color: #c3161c;
}

.additional-links a {
  color: #c3161c;
}

.captcha-img {
  cursor: pointer;
  height: 40px;
  width: 100px;
  margin-left: 10px;
}
.refresh-button {
  height: 40px;
  width: 80px;
  margin-left: 10px;
}


.colorgold {
  background-color: #DABB85;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
</style>
