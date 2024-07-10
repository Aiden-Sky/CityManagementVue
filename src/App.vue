<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import LoginForm from './Login.vue';

export default {
  name: 'App',
  components: {
    LoginForm
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@import 'bootstrap/dist/css/bootstrap.css';
/* 你可以在这里添加自定义样式 */

</style>
