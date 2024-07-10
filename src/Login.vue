<template>
  <!DOCTYPE html>
  <div class="login-container">

    <ParticlesContainer class="particalCss"/>
    <form class="login-form">
      <h2>登陆管理系统</h2>
      <div class="form-group">
        <input type="email" placeholder="Email" v-model="email" required/>
      </div>
      <div class="form-group">
        <input type="password" placeholder="Password" v-model="password" required/>
      </div>
      <div class="form-group">
        <a href="#" class="forgot-password">忘记密码?</a>
      </div>
      <button type="submit" class="btn btn-primary">登陆</button>

      <div class="signup-link">
        <button href="#" class="btn btn-secondary">注册</button>

      </div>
    </form>
  </div>

</template>

<script>
import ParticlesContainer from './components/tools/particales/partical.vue';

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      // Add your form submission logic here
    }
  },
  components: {
    ParticlesContainer
  },
}


</script>

<style scoped>


.login-container {
  background-image: url("/imgs/mainBack.webp");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
   position: relative; /* 添加相对定位 */
}

.login-form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
  z-index: 1; /* 表单应该在particles之上 */
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
  position: absolute; /* 绝对定位 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 背景应该位于最底层 */
}

.particles-js-canvas-el {
      display: block;
      width: 100%;
      height: 100%;
    }

</style>
