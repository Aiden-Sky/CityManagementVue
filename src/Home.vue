<template>
  <div>
    <NavBar/>
          <component :is="currentComponent"></component>
  </div>
</template>

<script>
import NavBar from './components/tools/Navbar.vue';
import {ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import AcceptPage from './components/home/AcceptPage.vue'; // 监督受理页面
import InformationPage from './components/home/InformationPage.vue';
import UserManagement from './components/home/UserManagementPage.vue';
import UserSetting from './components/home/UserSettingPage.vue';
import GeographyPage from './components/home/GeographyPage.vue';
import OfficerPerformPage from './components/home/OfficerPerformPage.vue';
import CommandPage from './components/home/CommandPage.vue'
import DefaultPage from "@/components/home/DefaultPage.vue";

export default {
  name: 'Home',
  components: {
    NavBar,
    AcceptPage,
    InformationPage,
    UserManagement,
    UserSetting,
    GeographyPage,
    OfficerPerformPage,
    CommandPage,
    DefaultPage,
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

            case 'baseinfom':
              currentComponent.value = 'InformationPage';
              break;

            case 'userSetting':
              currentComponent.value = 'UserSetting';
              break;

            case 'userManagement':
              currentComponent.value = 'UserManagement';
              break;

            case 'geographyPage':
              currentComponent.value = 'GeographyPage';
              break;

            case 'officerPerformPage':
              currentComponent.value = 'OfficerPerformPage';
              break;

            case 'commandPage':
              currentComponent.value = 'CommandPage';
              break;

            default:
              currentComponent.value = 'DefaultPage';
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
