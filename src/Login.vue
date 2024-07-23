<template>
  <div class="login-container">
    <ParticlesContainer class="particalCss"/>
    <transition name="fade">
      <div class="alert alert-warning d-flex align-items-center alert-dismissible fade show fixed-top m-3" role="alert"
           v-if="errorMessage">
        <i class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" role="img" aria-label="Warning:"
           style="width: 1.5rem; height: 1.5rem;"></i>
        <div>
          {{ errorMessage }}
        </div>
        <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
      </div>
    </transition>
    <form class="login-form" @submit.prevent="handleSubmit">
      <h2>登陆管理系统</h2>
      <div class="form-group">
        <input type="text" placeholder="账户" v-model="account" required/>
      </div>
      <div class="form-group">
        <input type="password" placeholder="密码" v-model="password" required/>
      </div>
      <div class="form-group captcha-container">
        <input type="text" placeholder="验证码" v-model="captchaInput" />
      </div>
      <div class="form-group">
        <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img ml-2" alt="验证码">
      </div>
      <div class="form-group">
        <a href="#" class="forgot-password">忘记密码?</a>
      </div>
      <button type="submit" class="btn btn-primary">登陆</button>

    </form>
  </div>
</template>

<script>
import axios from 'axios';
import ParticlesContainer from './components/tools/particales/partical.vue';

export default {
  data() {
    return {
      account: '',
      password: '',
      captchaInput: '',
      captchaUrl: '/city/getcapchar?' + new Date().getTime(), // 初始验证码 URL
      errorMessage: '' // 用于存储错误信息
    }
  },
  methods: {
    refreshCaptcha() {
      const timestamp = new Date().getTime();
      this.captchaUrl = `/city/getcapchar?${timestamp}`;
    },
    async verifyCaptcha() {
      try {
        const response = await axios.post('/city/verifycapcha', null, {
          params: {
            captcha: this.captchaInput
          }
        });
        return response.data === '验证码正确';
      } catch (error) {
        console.error(error);
        this.errorMessage = '验证码验证失败，请稍后再试';
        return false;
      }
    },
    async handleSubmit() {
      try {
        // const isCaptchaValid = await this.verifyCaptcha();
        // if (!isCaptchaValid) {
        //   this.errorMessage = '验证码错误';
        //   return;
        // }

        const url = `city/login?account=${encodeURIComponent(this.account)}&password=${encodeURIComponent(this.password)}`;
        const response = await axios.post(url);
        // 处理响应
        console.log(response.data);
        const token = response.data;
        localStorage.setItem('jwtToken', token);

        this.$router.push('/home'); // 跳转到/home页面

      } catch (error) {
        console.error(error);
        if (error.response) {
          // 从响应中提取错误信息
          const errorMessage = error.response.data;
          console.error('Login failed:', errorMessage);
          this.errorMessage = '账户或密码错误';
        } else {
          console.error('Error occurred:', error.message);
          this.errorMessage = '发生错误，请稍后再试'; // 提示用户发生其他错误
        }

        // 设置定时器，3秒后隐藏错误消息
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    }
  },
  components: {
    ParticlesContainer
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.login-container {
  background-image: url("/imgs/mainBack.webp");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.login-form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
  z-index: 1;
}

.login-form h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.captcha-container {
  display: flex;
  align-items: center;
}

.captcha-img {
  cursor: pointer;
  height: 40px;
  margin-left: 10px;
}

.forgot-password {
  display: block;
  margin-bottom: 1rem;
  color: #007bff;
  text-decoration: none;
}

.btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  margin-bottom: 1rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #57A6A1;
  color: #fff;
}

.or-separator {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.or-separator span {
  margin: 0 1rem;
}

.signup-link {
  text-align: center;
}

.signup-link p {
  margin: 1rem 0 0.5rem;
}

.btn-secondary {
  background-color: #577B8D;
  color: #fff;
}

.particalCss {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.particles-js-canvas-el {
  display: block;
  width: 100%;
  height: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0;
}
</style>
