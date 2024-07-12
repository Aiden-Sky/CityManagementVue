<template>
  <div class="container mt-5">
    <h1 class="mb-4">用户设置</h1>
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="updateUserSettings">
          <div class="mb-3 row">
            <label for="account" class="col-sm-3 col-form-label">用户账户</label>
            <div class="col-sm-9">
              <input type="text" class="form-control-plaintext" id="account" v-model="user.Account" readonly>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="username" class="col-sm-3 col-form-label">用户名</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="username" v-model="user.Username" required>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="userType" class="col-sm-3 col-form-label">用户类型</label>
            <div class="col-sm-9">
              <select class="form-select" id="userType" v-model="user.UserType" required>
                <option value="居民">居民</option>
                <option value="城市管理员">城市管理员</option>
                <option value="系统总管">系统总管</option>
              </select>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="email" class="col-sm-3 col-form-label">电子邮件</label>
            <div class="col-sm-9">
              <input type="email" class="form-control" id="email" v-model="user.Email" required>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="phoneNumber" class="col-sm-3 col-form-label">电话号码</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="phoneNumber" v-model="user.PhoneNumber">
            </div>
          </div>

          <div class="mb-3 row">
            <label for="address" class="col-sm-3 col-form-label">地址</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="address" v-model="user.Address">
            </div>
          </div>

          <div class="mb-3 row">
            <label for="isActive" class="col-sm-3 col-form-label">是否激活</label>
            <div class="col-sm-9 d-flex align-items-center">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="isActive" v-model="user.IsActive">
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">保存设置</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSetting',
  data() {
    return {
      user: {
        Account: 'exampleAccount',
        Username: '',
        UserType: '居民',
        Email: '',
        PhoneNumber: '',
        Address: '',
        IsActive: true
      }
    };
  },
  methods: {
    updateUserSettings() {
      // 在这里处理表单提交，如通过API调用更新用户信息
      console.log('User settings updated:', this.user);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.card {
  border-radius: 10px;
}

.form-control-plaintext {
  background-color: #f8f9fa;
}
</style>
