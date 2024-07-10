<template>
  <div>
    <NavBar/>
    <b-container>
      <b-row>
        <b-col>
          <component :is="currentComponent"></component>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavBar from './components/tools/Navbar.vue';
import {ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import AcceptPage from './components/AcceptPage.vue'; // 监督受理页面

export default {
  name: 'Home',
  components: {
    NavBar,
    AcceptPage
  },
  setup() {
    const route = useRoute();
    const currentComponent = ref('AcceptPage');

    watch(
        () => route.query.page,
        (newPage) => {
          switch (newPage) {
            case 'accept':
              currentComponent.value = 'AcceptPage';
              break;
            default:
              currentComponent.value = 'AcceptPage';
              break;
          }
        },
        {immediate: true}
    );

    return {
      currentComponent
    };
  }
};
</script>

<style scoped>
h1 {
  margin-top: 20px;
}
</style>
