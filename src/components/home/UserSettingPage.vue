<template>
  <div class="container mt-5 theme-container">
    <h1 class="mb-4">管理员设置</h1>
    
    <!-- 成功/错误消息提示 -->
    <div v-if="message" :class="`alert alert-${messageType} alert-dismissible fade show`" role="alert">
      {{ message }}
      <button type="button" class="btn-close" @click="message = ''" aria-label="Close"></button>
    </div>
    
    <div class="row">
      <!-- 个人信息设置 -->
      <div class="col-md-7">
        <div class="card shadow-sm mb-4">
          <div class="card-header theme-header">
            <h5 class="mb-0">基本信息</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateUserSettings">
              <div class="mb-3 row">
                <label for="account" class="col-sm-3 col-form-label">账号</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control-plaintext" id="account" v-model="user.account" readonly>
                </div>
              </div>

              <div class="mb-3 row">
                <label for="name" class="col-sm-3 col-form-label">姓名</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="name" v-model="user.name" required>
                </div>
              </div>
              
              <div class="mb-3 row">
                <label for="sex" class="col-sm-3 col-form-label">性别</label>
                <div class="col-sm-9">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="sexMale" v-model="user.sex" :value="true">
                    <label class="form-check-label" for="sexMale">男</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="sexFemale" v-model="user.sex" :value="false">
                    <label class="form-check-label" for="sexFemale">女</label>
                  </div>
                </div>
              </div>

              <div class="mb-3 row">
                <label for="position" class="col-sm-3 col-form-label">职位</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="position" v-model="user.position">
                </div>
              </div>

              <div class="mb-3 row">
                <label for="userType" class="col-sm-3 col-form-label">用户类型</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control-plaintext" id="userType" v-model="user.userType" readonly>
                </div>
              </div>

              <div class="mb-3 row">
                <label for="email" class="col-sm-3 col-form-label">电子邮件</label>
                <div class="col-sm-9">
                  <input type="email" class="form-control" id="email" v-model="user.email" required>
                </div>
              </div>

              <div class="mb-3 row">
                <label for="phoneNumber" class="col-sm-3 col-form-label">电话号码</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="phoneNumber" v-model="user.phoneNumber">
                </div>
              </div>

              <div class="mb-3 row">
                <label for="remark" class="col-sm-3 col-form-label">备注</label>
                <div class="col-sm-9">
                  <textarea class="form-control" id="remark" v-model="user.remark" rows="3"></textarea>
                </div>
              </div>

              <div class="mb-3 row">
                <label for="isActive" class="col-sm-3 col-form-label">账号状态</label>
                <div class="col-sm-9 d-flex align-items-center">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="isActive" v-model="user.isActive">
                    <label class="form-check-label" for="isActive">{{ user.isActive ? '启用' : '禁用' }}</label>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <button type="submit" class="btn theme-btn" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  保存设置
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- 密码修改 -->
        <div class="card shadow-sm">
          <div class="card-header theme-header">
            <h5 class="mb-0">修改密码</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">当前密码</label>
                <input type="password" class="form-control" id="currentPassword" v-model="passwordForm.currentPassword" required>
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">新密码</label>
                <input type="password" class="form-control" id="newPassword" v-model="passwordForm.newPassword" required>
                <div class="form-text">密码长度至少为6位，包含字母和数字</div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">确认新密码</label>
                <input type="password" class="form-control" id="confirmPassword" v-model="passwordForm.confirmPassword" required>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn theme-btn" :disabled="passwordLoading">
                  <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  修改密码
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- MFA 设置 -->
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-header theme-header">
            <h5 class="mb-0">双因素认证 (MFA)</h5>
          </div>
          <div class="card-body">
            <div v-if="!mfaEnabled" class="text-center mb-4">
              <p>启用双因素认证可以增强您账号的安全性。</p>
              <button @click="setupMFA" class="btn theme-btn" :disabled="mfaLoading">
                <span v-if="mfaLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                设置双因素认证
              </button>
            </div>
            
            <div v-if="showMFASetup" class="mfa-setup">
              <p>请使用身份验证器应用（如Google Authenticator、Microsoft Authenticator）扫描下方二维码：</p>
              
              <div class="text-center mb-3">
                <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="TOTP QR Code" class="img-fluid qr-code">
                <div v-else class="spinner-border theme-spinner" role="status">
                  <span class="visually-hidden">加载中...</span>
                </div>
              </div>
              
              <div v-if="secretKey" class="mb-3">
                <p class="mb-1">如果无法扫描二维码，请手动输入以下密钥：</p>
                <div class="input-group">
                  <input type="text" class="form-control" v-model="secretKey" readonly>
                  <button class="btn theme-btn-outline" type="button" @click="copySecretKey">
                    <i class="bi bi-clipboard"></i> 复制
                  </button>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="verificationCode" class="form-label">验证码</label>
                <input type="text" class="form-control" id="verificationCode" v-model="verificationCode" placeholder="输入应用生成的6位验证码">
              </div>
              
              <div class="d-flex justify-content-between">
                <button @click="cancelMFASetup" class="btn theme-btn-outline">取消</button>
                <button @click="verifyAndEnableMFA" class="btn theme-btn" :disabled="!verificationCode || verifyingCode">
                  <span v-if="verifyingCode" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  验证并启用
                </button>
              </div>
            </div>
            
            <div v-if="mfaEnabled && !showMFASetup" class="mfa-enabled">
              <div class="alert alert-success">
                <i class="bi bi-shield-check me-2"></i>
                双因素认证已启用
              </div>
              <p>您的账号已启用双因素认证保护。每次登录时，系统将要求您输入身份验证器应用生成的验证码。</p>
              <div class="d-flex justify-content-end">
                <button @click="disableMFA" class="btn btn-danger" :disabled="mfaLoading">
                  <span v-if="mfaLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  禁用双因素认证
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 登录记录 -->
        <div class="card shadow-sm mt-4">
          <div class="card-header theme-header">
            <h5 class="mb-0">最近登录记录</h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loginHistory.length === 0" class="text-center py-4">
              <p class="text-muted mb-0">暂无登录记录</p>
            </div>
            <ul v-else class="list-group list-group-flush">
              <li v-for="(login, index) in loginHistory" :key="index" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div>{{ login.time }}</div>
                    <small class="text-muted">{{ login.ip }} - {{ login.device }}</small>
                  </div>
                  <span :class="`badge ${login.status === '成功' ? 'bg-success' : 'bg-danger'}`">{{ login.status }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import mockApi from '../../utils/mock-api';

// 判断是否使用模拟API
const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  name: 'UserSetting',
  data() {
    return {
      user: {
        account: '',
        name: '',
        sex: true,
        position: '',
        remark: '',
        userType: '',
        email: '',
        phoneNumber: '',
        isActive: true
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      loading: false,
      passwordLoading: false,
      mfaLoading: false,
      verifyingCode: false,
      message: '',
      messageType: 'info',
      mfaEnabled: false,
      showMFASetup: false,
      qrCodeUrl: '',
      secretKey: '',
      verificationCode: '',
      loginHistory: [],
      currentTheme: 'blue', // 默认主题
      themeColors: {
        blue: {
          main: '#0d6efd',
          light: '#cfe2ff',
          dark: '#084298'
        },
        green: {
          main: '#198754',
          light: '#d1e7dd',
          dark: '#0f5132'
        },
        red: {
          main: '#dc3545',
          light: '#f8d7da',
          dark: '#842029'
        },
        purple: {
          main: '#6f42c1',
          light: '#e2d9f3',
          dark: '#4c2889'
        },
        orange: {
          main: '#fd7e14',
          light: '#ffe5d0',
          dark: '#b54e00'
        },
        dark: {
          main: '#212529',
          light: '#d3d3d4',
          dark: '#1a1e21'
        },
        gray: {
          main: '#6c757d',
          light: '#e2e3e5',
          dark: '#495057'
        }
      }
    };
  },
  mounted() {
    this.fetchUserInfo();
    this.fetchMFAStatus();
    this.fetchLoginHistory();
  },
  methods: {
    // 获取用户信息
    async fetchUserInfo() {
      this.loading = true;
      try {
        if (isDevelopment) {
          // 使用模拟API
          const data = await mockApi.getAdminInfo();
          this.user = { ...data };
          // 转换isActive为布尔值
          this.user.isActive = this.user.isActive === 1;
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) {
            this.$router.push('/login');
            return;
          }

          const response = await axios.get('/city/admin/info', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            this.user = { ...response.data };
            // 转换isActive为布尔值
            this.user.isActive = this.user.isActive === 1;
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.showMessage('获取用户信息失败，请重试', 'danger');
      } finally {
        this.loading = false;
      }
    },

    // 更新用户设置
    async updateUserSettings() {
      this.loading = true;
      try {
        // 转换isActive为数字
        const userData = { ...this.user };
        userData.isActive = userData.isActive ? 1 : 0;

        if (isDevelopment) {
          // 使用模拟API
          await mockApi.updateAdminInfo(userData);
          this.showMessage('设置已成功更新', 'success');
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) {
            this.$router.push('/login');
            return;
          }

          const response = await axios.put('/city/admin/update', userData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            this.showMessage('设置已成功更新', 'success');
          }
        }
      } catch (error) {
        console.error('更新设置失败:', error);
        this.showMessage('更新设置失败，请重试', 'danger');
      } finally {
        this.loading = false;
      }
    },

    // 修改密码
    async changePassword() {
      // 验证密码
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.showMessage('两次输入的密码不一致', 'danger');
        return;
      }

      if (this.passwordForm.newPassword.length < 6) {
        this.showMessage('密码长度至少为6位', 'danger');
        return;
      }

      this.passwordLoading = true;
      try {
        if (isDevelopment) {
          // 使用模拟API
          await mockApi.changePassword(
            this.passwordForm.currentPassword, 
            this.passwordForm.newPassword
          );
          this.showMessage('密码修改成功', 'success');
          this.passwordForm.currentPassword = '';
          this.passwordForm.newPassword = '';
          this.passwordForm.confirmPassword = '';
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) {
            this.$router.push('/login');
            return;
          }

          const response = await axios.post('/city/admin/changePassword', {
            currentPassword: this.passwordForm.currentPassword,
            newPassword: this.passwordForm.newPassword
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            this.showMessage('密码修改成功', 'success');
            this.passwordForm.currentPassword = '';
            this.passwordForm.newPassword = '';
            this.passwordForm.confirmPassword = '';
          }
        }
      } catch (error) {
        console.error('修改密码失败:', error);
        this.showMessage('修改密码失败，请确认当前密码是否正确', 'danger');
      } finally {
        this.passwordLoading = false;
      }
    },

    // 获取MFA状态
    async fetchMFAStatus() {
      try {
        if (isDevelopment) {
          // 使用模拟API
          const response = await mockApi.getMfaStatus();
          this.mfaEnabled = response.enabled;
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) return;

          const response = await axios.get('/city/admin/mfa/status', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          this.mfaEnabled = response.data.enabled;
        }
      } catch (error) {
        console.error('获取MFA状态失败:', error);
      }
    },

    // 设置MFA
    async setupMFA() {
      this.mfaLoading = true;
      try {
        if (isDevelopment) {
          // 使用模拟API
          const response = await mockApi.setupMfa();
          this.qrCodeUrl = response.qrCodeUrl;
          this.secretKey = response.secretKey;
          this.showMFASetup = true;
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) return;

          const response = await axios.post('/city/admin/mfa/setup', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          this.qrCodeUrl = response.data.qrCodeUrl;
          this.secretKey = response.data.secretKey;
          this.showMFASetup = true;
        }
      } catch (error) {
        console.error('设置MFA失败:', error);
        this.showMessage('设置双因素认证失败，请重试', 'danger');
      } finally {
        this.mfaLoading = false;
      }
    },

    // 验证并启用MFA
    async verifyAndEnableMFA() {
      if (!this.verificationCode || this.verificationCode.length !== 6) {
        this.showMessage('请输入6位验证码', 'danger');
        return;
      }

      this.verifyingCode = true;
      try {
        if (isDevelopment) {
          // 使用模拟API
          await mockApi.verifyMfaCode('admin', this.verificationCode);
          this.mfaEnabled = true;
          this.showMFASetup = false;
          this.showMessage('双因素认证已成功启用', 'success');
          this.verificationCode = '';
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) return;

          const response = await axios.post('/city/admin/mfa/verify', {
            code: this.verificationCode
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            this.mfaEnabled = true;
            this.showMFASetup = false;
            this.showMessage('双因素认证已成功启用', 'success');
            this.verificationCode = '';
          }
        }
      } catch (error) {
        console.error('验证失败:', error);
        this.showMessage('验证码无效，请重试', 'danger');
      } finally {
        this.verifyingCode = false;
      }
    },

    // 取消MFA设置
    cancelMFASetup() {
      this.showMFASetup = false;
      this.qrCodeUrl = '';
      this.secretKey = '';
      this.verificationCode = '';
    },

    // 禁用MFA
    async disableMFA() {
      this.mfaLoading = true;
      try {
        if (isDevelopment) {
          // 使用模拟API
          await mockApi.disableMfa();
          this.mfaEnabled = false;
          this.showMessage('双因素认证已禁用', 'success');
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) return;

          const response = await axios.post('/city/admin/mfa/disable', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            this.mfaEnabled = false;
            this.showMessage('双因素认证已禁用', 'success');
          }
        }
      } catch (error) {
        console.error('禁用MFA失败:', error);
        this.showMessage('禁用双因素认证失败，请重试', 'danger');
      } finally {
        this.mfaLoading = false;
      }
    },

    // 复制密钥
    copySecretKey() {
      navigator.clipboard.writeText(this.secretKey)
        .then(() => {
          this.showMessage('密钥已复制到剪贴板', 'info');
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    },

    // 获取登录历史
    async fetchLoginHistory() {
      try {
        if (isDevelopment) {
          // 使用模拟API
          this.loginHistory = await mockApi.getLoginHistory();
        } else {
          // 使用实际API
          const token = localStorage.getItem('jwtToken');
          if (!token) return;

          const response = await axios.get('/city/admin/loginHistory', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          this.loginHistory = response.data || [];
        }
      } catch (error) {
        console.error('获取登录历史失败:', error);
      }
    },

    // 显示消息
    showMessage(msg, type = 'info') {
      this.message = msg;
      this.messageType = type;
      // 5秒后自动关闭
      setTimeout(() => {
        if (this.message === msg) {
          this.message = '';
        }
      }, 5000);
    }
  }
};
</script>

<style>
/* 删除重复的CSS变量定义，已移至全局CSS */
</style>

<style scoped>
.container {
  max-width: 1200px;
}

.card {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
  border-bottom: 0;
}

.form-control-plaintext {
  background-color: #f8f9fa;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
}

.qr-code {
  max-width: 200px;
  border: 1px solid #ddd;
  padding: 10px;
  background: white;
}

.mfa-setup, .mfa-enabled {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
