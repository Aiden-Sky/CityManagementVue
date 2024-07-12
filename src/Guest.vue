<template>
  <div class="login-page w-100">
    <header class="d-flex justify-content-between align-items-center py-4 px-3"
            style="background-color: #c3161c; color: white;">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">市政举报</h1>
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
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
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
import axios from "axios";

export default {
  data() {
    return {
      isPersonalLogin: true,
      username: '',
      password: '',
      captcha: '',
      captchaUrl: '/city/captcha', // 假设验证码的URL
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        const url = `city/login?account=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`;
        const response = await axios.post(url);
        // 处理响应
        console.log(response.data);
        const token = response.data;
        localStorage.setItem('jwtToken', token);

        this.$router.push('/guestHome'); // 跳转到/home页面
      } catch (error) {
        console.error(error);
        if (error.response) {
          // 从响应中提取错误信息
          const errorMessage = error.response.data; // 假设错误信息在字段名为 'message'
          console.error('Login failed:', errorMessage);
          this.errorMessage = errorMessage; // 直接使用服务器返回的错误信息
        } else {
          console.error('Error occurred:', error.message);
          this.errorMessage = '发生错误，请稍后再试'; // 提示用户发生其他错误
        }

        // 设置定时器，3秒后隐藏错误消息
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    },
    refreshCaptcha() {
      // 更新验证码URL以刷新图片
      this.captchaUrl = `/city/captcha?${new Date().getTime()}`;
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

.alert {
  color: red;
}
</style>
