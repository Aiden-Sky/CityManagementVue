<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';

const router = useRouter();
const userInfo = ref({
  account: '',
  name: '',
  sex: null,
  dateOfBirthday: '',
  address: '',
  idNumber: '',
  email: '',
  phoneNumber: '',
  isActive: '',
  passwordHash:''
});

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const isEditing = ref(false);
const isChangingPassword = ref(false);
const loading = ref(false);
const message = ref('');
const messageType = ref('');

// 获取用户信息
const fetchUserInfo = () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = axios.get('/city/resident/info', {
      headers: {
        Authorization: `${token}`
      }
    }).then(res => {
      userInfo.value = res.data;
      // 格式化生日日期
      if (userInfo.value.dateOfBirthday) {
        const date = new Date(userInfo.value.dateOfBirthday);
        userInfo.value.dateOfBirthday = date.toISOString().split('T')[0];
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    showMessage('获取用户信息失败，请重试', 'error');
  } finally {
    loading.value = false;
  }
};

// 更新用户信息
const updateUserInfo = () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = axios.put('/city/resident/update', userInfo.value, {
      headers: {
        Authorization: `${token}`
      }
    }).then(res => {
      showMessage('个人信息更新成功', 'success');
      isEditing.value = false;
    });


  } catch (error) {
    console.error('更新用户信息失败:', error);
    showMessage('更新失败，请重试', 'error');
  } finally {
    loading.value = false;
  }
};

// 修改密码
const changePassword = () => {
  // 验证密码
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showMessage('两次输入的密码不一致', 'error');
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    showMessage('密码长度至少为6位', 'error');
    return;
  }

  loading.value = true;
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }
    userInfo.value.passwordHash = passwordForm.confirmPassword;
    const response = axios.put('/city/resident/update', userInfo.value, {
      headers: {
        Authorization: `${token}`
      }
    }).then(res => {
      showMessage('密码修改成功', 'success');
      isChangingPassword.value = false;
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    });


  } catch (error) {
    console.error('修改密码失败:', error);
    showMessage('修改密码失败，请确认原密码是否正确', 'error');
  } finally {
    loading.value = false;
  }
};

// 显示消息
const showMessage = (msg, type = 'info') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div class="resident-info">
    <header class="d-flex justify-content-between align-items-center py-4 px-3">
      <div class="d-flex align-items-center">
        <button class="btn btn-light me-2" @click="goBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <img src="/imgs/symbo.png" alt="Logo" class="logo">
        <h1 class="mb-0 ml-3" style="padding-left: 10px">个人信息</h1>
      </div>
    </header>

    <div class="container my-4">
      <div class="content-wrapper">
        <!-- 消息提示 -->
        <div v-if="message" :class="`alert alert-${messageType === 'error' ? 'danger' : messageType}`">
          {{ message }}
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
          <p class="mt-2">加载中...</p>
        </div>

        <div v-else>
          <!-- 个人信息卡片 -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">基本信息</h5>
              <button v-if="!isEditing" @click="isEditing = true" class="btn btn-primary btn-sm">
                <i class="bi bi-pencil-square"></i> 编辑信息
              </button>
              <div v-else>
                <button @click="updateUserInfo" class="btn btn-success btn-sm me-2">
                  <i class="bi bi-check-lg"></i> 保存
                </button>
                <button @click="isEditing = false" class="btn btn-secondary btn-sm">
                  <i class="bi bi-x-lg"></i> 取消
                </button>
              </div>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateUserInfo">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">账号</label>
                    <input type="text" class="form-control" v-model="userInfo.account" disabled>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">姓名</label>
                    <input type="text" class="form-control" v-model="userInfo.name" :disabled="!isEditing">
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">性别</label>
                    <div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="userInfo.sex" :value="true" id="male"
                               :disabled="!isEditing">
                        <label class="form-check-label" for="male">男</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" v-model="userInfo.sex" :value="false" id="female"
                               :disabled="!isEditing">
                        <label class="form-check-label" for="female">女</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">出生日期</label>
                    <input type="date" class="form-control" v-model="userInfo.dateOfBirthday" :disabled="!isEditing">
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">身份证号</label>
                    <input type="text" class="form-control" v-model="userInfo.idNumber" :disabled="!isEditing">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">状态</label>
                    <input type="text" class="form-control" :value="userInfo.isActive === '1' ? '正常' : '禁用'"
                           disabled>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">电子邮箱</label>
                    <input type="email" class="form-control" v-model="userInfo.email" :disabled="!isEditing">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">手机号码</label>
                    <input type="tel" class="form-control" v-model="userInfo.phoneNumber" :disabled="!isEditing">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">住址</label>
                  <textarea class="form-control" v-model="userInfo.address" rows="2" :disabled="!isEditing"></textarea>
                </div>
              </form>
            </div>
          </div>

          <!-- 密码修改卡片 -->
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">密码管理</h5>
              <button v-if="!isChangingPassword" @click="isChangingPassword = true" class="btn btn-primary btn-sm">
                <i class="bi bi-key"></i> 修改密码
              </button>
              <div v-else>
                <button @click="changePassword" class="btn btn-success btn-sm me-2">
                  <i class="bi bi-check-lg"></i> 保存
                </button>
                <button @click="isChangingPassword = false" class="btn btn-secondary btn-sm">
                  <i class="bi bi-x-lg"></i> 取消
                </button>
              </div>
            </div>
            <div class="card-body" v-if="isChangingPassword">
              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label class="form-label">当前密码</label>
                  <input type="password" class="form-control" v-model="passwordForm.oldPassword" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">新密码</label>
                  <input type="password" class="form-control" v-model="passwordForm.newPassword" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">确认新密码</label>
                  <input type="password" class="form-control" v-model="passwordForm.confirmPassword" required>
                </div>
              </form>
            </div>
            <div class="card-body" v-else>
              <p class="text-muted mb-0">您可以点击"修改密码"按钮更改您的登录密码</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="text-center colorgold">
      <p>关于我们 | 站点地图 | 建议意见 | 法律声明</p>
    </footer>
  </div>
</template>

<style scoped>
.resident-info {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url('https://portal.bjt.beijing.gov.cn/p/assets/imgs/loginBg.png') no-repeat center center fixed;
  background-size: cover;
}

header {
  background-color: rgba(195, 22, 28, 0.9);
  color: white;
  padding: 15px 20px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.logo {
  width: 50px;
  border-radius: 5px;
}

.colorgold {
  background-color: rgba(218, 187, 133, 0.9);
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: white;
  margin-top: auto;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, .125);
}

.container {
  flex-grow: 1;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 15px;
  }
}
</style>
