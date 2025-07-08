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
    <form class="login-form" @submit.prevent="handleSubmit" v-if="!showMfaVerify">
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
    
    <!-- MFA验证表单 -->
    <form class="login-form mfa-form" @submit.prevent="verifyMfa" v-if="showMfaVerify">
      <div class="lock-icon-container">
        <div class="lock-icon-circle">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
      </div>
      <h2 class="mfa-title">双因素认证</h2>
      <p class="text-muted mb-4">为了确保您的账户安全，请输入验证器应用中的6位验证码</p>
      
      <div class="form-group position-relative">
        <i class="bi bi-key-fill input-icon"></i>
        <input 
          type="text" 
          class="form-control form-control-lg text-center" 
          placeholder="6位验证码" 
          v-model="mfaCode" 
          required 
          maxlength="6" 
          pattern="[0-9]{6}" 
          autocomplete="off"
          ref="mfaCodeInput"
          @input="formatMfaInput"
        />
      </div>
      
      <button type="submit" class="btn btn-primary btn-lg">
        <i class="bi bi-check-circle me-2"></i>验证
      </button>
      
      <button type="button" class="btn btn-outline-secondary mt-3" @click="cancelMfa">
        <i class="bi bi-arrow-left me-2"></i>返回登录
      </button>
      
      <div class="mt-4 text-muted small">
        <i class="bi bi-info-circle me-1"></i>
        如果您无法访问验证器应用，请联系系统管理员
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import ParticlesContainer from './components/tools/particales/partical.vue';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  watch: {
    // 监听MFA验证表单显示状态
    showMfaVerify(newVal) {
      if (newVal) {
        // 当显示MFA验证表单时，延迟一点聚焦验证码输入框
        this.$nextTick(() => {
          if (this.$refs.mfaCodeInput) {
            this.$refs.mfaCodeInput.focus();
          }
        });
      }
    }
  },
  data() {
    return {
      account: '',
      password: '',
      captchaInput: '',
      captchaUrl: '/city/getcapchar?' + new Date().getTime(), // 初始验证码 URL
      errorMessage: '', // 用于存储错误信息
      showMfaVerify: false, // 是否显示MFA验证
      mfaCode: '', // MFA验证码
      jwtToken: '' // 存储临时Token
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
        const response = await axios.post('/city/admin/login', null, {
          params: {
            account: this.account,
            password: this.password
          }
        });
        const token = response.data;
        
        // 暂存token
        this.jwtToken = token;
        
        // 检查是否是系统管理员账号
        if (this.account.toLowerCase().startsWith('admin') || this.account.toLowerCase().includes('admin')) {
          // 检查该账号是否启用了MFA
          const mfaStatusResponse = await this.checkMfaStatus(token);
          
          if (mfaStatusResponse && mfaStatusResponse.enabled) {
            // 如果启用了MFA，显示MFA验证表单
            this.showMfaVerify = true;
          } else {
            // 如果没有启用MFA，直接完成登录
            this.completeLogin(token);
          }
        } else {
          // 非系统管理员账号，直接完成登录
          this.completeLogin(token);
        }
      } catch (error) {
        console.error(error);

        if (error.response) {
          // 处理后端返回的错误信息
          const errorMessage = error.response.data;
          console.error('Login failed:', errorMessage);

          // 显示适当的错误消息
          if (errorMessage.includes("管理员账号")) {
            this.errorMessage = "该账号不是管理员账号";
          } else if (errorMessage.includes("账号或密码不正确")) {
            this.errorMessage = "账号或密码不正确";
          } else {
            this.errorMessage = errorMessage || '登录失败';
          }
        } else {
          this.errorMessage = '发生错误，请稍后再试';
        }

        // 3秒后清除错误消息
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    },
    
    // 检查MFA状态
    async checkMfaStatus(token) {
      try {
        const response = await axios.get('/city/admin/mfa/status', {
          headers: {
            Authorization: token
          }
        });
        return response.data;
      } catch (error) {
        console.error('获取MFA状态失败:', error);
        // 如果获取失败，假设没有启用MFA，继续登录流程
        return { enabled: false };
      }
    },
    
    // 验证MFA
    async verifyMfa() {
      if (!this.mfaCode || this.mfaCode.length !== 6) {
        this.errorMessage = '请输入6位验证码';
        return;
      }
      
      try {
        // 调用MFA验证接口
        const response = await axios.post('/city/admin/mfa/login-verify', null, {
          params: {
            account: this.account,
            code: this.mfaCode
          }
        });
        
        if (response.status === 200) {
          // MFA验证成功，完成登录
          this.completeLogin(this.jwtToken);
        }
      } catch (error) {
        console.error('MFA验证失败:', error);
        this.errorMessage = '验证码无效或已过期，请重试';
        
        // 3秒后清除错误消息
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    },
    
    // 取消MFA验证，返回登录页面
    cancelMfa() {
      this.showMfaVerify = false;
      this.mfaCode = '';
      this.jwtToken = '';
    },
    
    // 格式化MFA验证码输入，只允许数字
    formatMfaInput() {
      // 替换非数字字符
      this.mfaCode = this.mfaCode.replace(/[^0-9]/g, '');
      
      // 如果输入了6位数字，自动触发验证
      if (this.mfaCode.length === 6) {
        setTimeout(() => {
          this.verifyMfa();
        }, 300);
      }
    },
    
    // 完成登录流程
    completeLogin(token) {
      localStorage.setItem('jwtToken', token);
      
      // 如果是MFA验证后登录，设置MFA验证状态
      if (this.showMfaVerify) {
        sessionStorage.setItem('mfaVerified', 'true');
      }
      
      this.$router.push('/home');
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

.btn-outline-secondary {
  background-color: transparent;
  border: 1px solid #577B8D;
  color: #577B8D;
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

/* MFA表单样式 */
.mfa-form {
  width: 350px;
  padding: 2.5rem;
}

.mfa-title {
  margin-bottom: 0.75rem;
  color: #2c3e50;
}

.lock-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.lock-icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(145deg, #57a6a1, #3d7471);
  box-shadow: 0 4px 10px rgba(87, 166, 161, 0.3);
}

.lock-icon-circle i {
  font-size: 32px;
  color: #ffffff;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #57A6A1;
  font-size: 18px;
}

.form-control-lg {
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  font-size: 1.1rem;
  letter-spacing: 2px;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}

/* 动画效果 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.btn-primary:hover {
  background-color: #3d7471;
  animation: pulse 0.5s infinite;
}
</style>
