<template>
  <div class="login-page w-100">
    <header class="d-flex justify-content-between align-items-center py-4 px-3"
            style="background-color: #c3161c; color: white;">
      <div class="d-flex align-items-center">
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">市政反馈</h1>
      </div>
      <h2 class="mb-0">统一身份认证</h2>
    </header>
    <main class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 172px);">
      <div class="login-container card p-4">
        <div class="login-tabs mb-3">
          <button @click="showLogin" class="btn" :class="{ active: isLogin }">个人登陆</button>
          <button @click="showRegister" class="btn" :class="{ active: isRegister }">注册</button>
          <button @click="showForgotPassword" class="btn" :class="{ active: isForgotPassword }">忘记密码</button>
        </div>
        <div v-if="isLogin">
          <input type="text" class="form-control my-2" placeholder="用户名/手机号/身份证号" v-model="username">
          <input type="password" class="form-control my-2" placeholder="密码" v-model="password">
          <div class="d-flex align-items-center my-2">
            <input type="text" class="form-control" style="width: 150px" placeholder="请输入验证码" v-model="captcha">
            <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img ml-2" alt="验证码">
            <button class="refresh-button btn btn-secondary ml-2" @click="refreshCaptcha">刷新</button>
          </div>
          <button class="login-button btn btn-danger w-100 mt-3" @click="login">登录</button>
        </div>
        <div v-if="isRegister">
          <input type="text" class="form-control my-2" placeholder="用户名" v-model="registerUsername">
          <input type="password" class="form-control my-2" placeholder="密码" v-model="registerPassword">
          <input type="phone" class="form-control my-2" placeholder="手机号" v-model="registphone">
          <input type="email" class="form-control my-2" placeholder="邮箱号" v-model="registerEmail">
          <input type="text" class="form-control my-2" placeholder="身份证号" v-model="registerIDNumber">
          <div class="d-flex align-items-center my-2">
            <input type="text" class="form-control" style="width: 150px" placeholder="请输入验证码" v-model="captcha">
            <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img ml-2" alt="验证码">
            <button class="refresh-button btn btn-secondary ml-2" @click="refreshCaptcha">刷新</button>
          </div>
          <button class="login-button btn btn-danger w-100 mt-3" @click="register">注册</button>

        </div>
        <div v-if="isForgotPassword">
          <input type="text" class="form-control my-2" placeholder="请输入账号" v-model="forgotPasswordaccount">
          <input type="phone" class="form-control my-2" placeholder="请输入注册手机号" v-model="forgotPasswordphone">
          <input type="text" class="form-control my-2" placeholder="请输入身份证号" v-model="forgotPasswordIDNumber">
          <div class="d-flex align-items-center my-2">
            <input type="text" class="form-control" style="width: 150px" placeholder="请输入验证码" v-model="captcha">
            <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img ml-2" alt="验证码">
            <button class="refresh-button btn btn-secondary ml-2" @click="refreshCaptcha">刷新</button>
          </div>
          <button class="login-button btn btn-danger w-100 mt-3" @click="resetPassword">重置密码</button>

        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
        <div class="additional-links mt-3 text-center" v-if="isLogin">
          <a href="#" @click="showRegister">立即注册</a> | <a href="#" @click="showForgotPassword">忘记密码?</a>
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
import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      isLogin: true,
      isRegister: false,
      isForgotPassword: false,
      username: '',
      password: '',
      captcha: '',
      captchaUrl: '/city/captcha',
      registerUsername: '',
      registerPassword: '',
      registerEmail: '',
      forgotPasswordEmail: '',
      errorMessage: ''
    };
  },
  mounted() {
    this.refreshCaptcha(); // 在组件挂载后立即调用
  },
  methods: {
    showLogin() {
      this.isLogin = true;
      this.isRegister = false;
      this.isForgotPassword = false;
    },
    showRegister() {
      this.isLogin = false;
      this.isRegister = true;
      this.isForgotPassword = false;
    },
    showForgotPassword() {
      this.isLogin = false;
      this.isRegister = false;
      this.isForgotPassword = true;
    },
    async login() {
      try {
        // const isCaptchaValid = await this.verifyCaptcha();
        //
        // if (!isCaptchaValid) {
        //   this.errorMessage = '验证码错误，请重新输入';
        //   return false;
        // }
        const url = `city/login?account=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`;
        const response = await axios.post(url);
        const token = response.data;

        const payload = jwtDecode(token);

        if (payload.userType === "Resident") {
          // 用户是管理员

          this.$router.push('/guestHome');
        } else {
          // 用户不是管理员

          this.$router.push('/manageHome');
        }

        // 将 token 存储在 localStorage 中
        localStorage.setItem('jwtToken', token);
      } catch (error) {
        console.error(error);
        if (error.response) {
          this.errorMessage = error.response.data;
        } else {
          this.errorMessage = '发生错误，请稍后再试';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    },
    async register() {
      try {
        const url = `city/resident/register`;
        const payload = {
          account: this.registerUsername,
          password: this.registerPassword,
          phoneNumber: this.registphone,
          email: this.registerEmail,
          idNumber: this.registerIDNumber
        };
        const response = await axios.post(url, payload);
        console.log(response.data);
        this.showLogin();
      } catch (error) {
        console.error(error);
        if (error.response) {
          this.errorMessage = error.response.data;
        } else {
          this.errorMessage = '发生错误，请稍后再试';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    },
    async resetPassword() {
      try {
        const url = `city/resetPassword`;
        const payload = {email: this.forgotPasswordEmail};
        const response = await axios.post(url, payload);
        console.log(response.data);
        this.showLogin();
      } catch (error) {
        console.error(error);
        if (error.response) {
          this.errorMessage = error.response.data;
        } else {
          this.errorMessage = '发生错误，请稍后再试';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    },
    refreshCaptcha() {
      const timestamp = new Date().getTime();
      this.captchaUrl = `/city/getcapchar?${timestamp}`;
    },
    async verifyCaptcha() {
      try {
        const response = await axios.post('/city/verifycapcha', null, {
          params: {
            captcha: this.captcha
          }
        });
        if (response.data === "验证码正确") return true;
      } catch (error) {
        console.error(error);
        this.errorMessage = '验证码验证失败，请稍后再试';
        return false;
      }
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
