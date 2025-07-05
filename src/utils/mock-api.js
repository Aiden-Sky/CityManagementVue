import totpHelper from './totp-helper';

/**
 * 模拟API服务
 * 用于在开发环境中模拟后端API响应
 */
class MockApi {
  constructor() {
    // 存储用户MFA设置
    this.userMfaSettings = new Map();
  }

  /**
   * 模拟获取管理员信息
   * @returns {Promise<Object>} 管理员信息
   */
  async getAdminInfo() {
    // 模拟网络延迟
    await this.delay(500);
    
    return {
      adminID: 1,
      account: 'admin',
      name: '系统管理员',
      sex: true,
      position: '系统管理',
      remark: '系统超级管理员账号',
      userType: '系统总管',
      email: 'admin@example.com',
      phoneNumber: '13800138000',
      isActive: 1
    };
  }

  /**
   * 模拟更新管理员信息
   * @param {Object} userData 管理员信息
   * @returns {Promise<Object>} 更新结果
   */
  async updateAdminInfo(userData) {
    // 模拟网络延迟
    await this.delay(800);
    
    console.log('更新管理员信息:', userData);
    
    return {
      success: true,
      message: '管理员信息更新成功'
    };
  }

  /**
   * 模拟修改密码
   * @param {string} currentPassword 当前密码
   * @param {string} newPassword 新密码
   * @returns {Promise<Object>} 修改结果
   */
  async changePassword(currentPassword, newPassword) {
    // 模拟网络延迟
    await this.delay(1000);
    
    // 简单验证当前密码（实际应用中应该在后端验证）
    if (currentPassword !== 'admin123') {
      throw new Error('当前密码错误');
    }
    
    console.log('密码已修改为:', newPassword);
    
    return {
      success: true,
      message: '密码修改成功'
    };
  }

  /**
   * 获取MFA状态
   * @param {string} userId 用户ID
   * @returns {Promise<Object>} MFA状态
   */
  async getMfaStatus(userId = 'admin') {
    await this.delay(300);
    
    const userSettings = this.userMfaSettings.get(userId);
    return {
      enabled: userSettings ? userSettings.enabled : false
    };
  }

  /**
   * 设置MFA
   * @param {string} userId 用户ID
   * @returns {Promise<Object>} MFA设置信息
   */
  async setupMfa(userId = 'admin') {
    await this.delay(1000);
    
    // 生成TOTP设置
    const setup = await totpHelper.generateTotpSetup(userId);
    
    // 存储设置（但尚未启用）
    this.userMfaSettings.set(userId, {
      secretKey: setup.secretKey,
      enabled: false,
      setupTime: new Date().toISOString()
    });
    
    return setup;
  }

  /**
   * 验证MFA代码
   * @param {string} userId 用户ID
   * @param {string} code 验证码
   * @returns {Promise<Object>} 验证结果
   */
  async verifyMfaCode(userId = 'admin', code) {
    await this.delay(800);
    
    const userSettings = this.userMfaSettings.get(userId);
    if (!userSettings) {
      throw new Error('未找到MFA设置');
    }
    
    // 在实际应用中，这里应该验证TOTP代码是否有效
    // 这里我们简单地检查代码长度，并接受任何6位数字
    const isValid = code && code.length === 6 && /^\d+$/.test(code);
    
    if (isValid) {
      // 更新为已启用状态
      userSettings.enabled = true;
      this.userMfaSettings.set(userId, userSettings);
      
      return {
        success: true,
        message: 'MFA验证成功并已启用'
      };
    } else {
      throw new Error('验证码无效');
    }
  }

  /**
   * 禁用MFA
   * @param {string} userId 用户ID
   * @returns {Promise<Object>} 禁用结果
   */
  async disableMfa(userId = 'admin') {
    await this.delay(800);
    
    const userSettings = this.userMfaSettings.get(userId);
    if (!userSettings) {
      throw new Error('未找到MFA设置');
    }
    
    // 禁用MFA
    userSettings.enabled = false;
    this.userMfaSettings.set(userId, userSettings);
    
    return {
      success: true,
      message: 'MFA已禁用'
    };
  }

  /**
   * 获取登录历史
   * @returns {Promise<Array>} 登录历史记录
   */
  async getLoginHistory() {
    await this.delay(600);
    
    return [
      { time: '2023-07-25 14:30:22', ip: '192.168.1.100', device: 'Chrome / Windows', status: '成功' },
      { time: '2023-07-23 09:15:45', ip: '192.168.1.100', device: 'Firefox / Windows', status: '成功' },
      { time: '2023-07-20 18:42:10', ip: '114.88.200.155', device: 'Safari / macOS', status: '失败' },
      { time: '2023-07-18 10:22:33', ip: '192.168.1.100', device: 'Chrome / Windows', status: '成功' }
    ];
  }

  /**
   * 模拟网络延迟
   * @param {number} ms 延迟毫秒数
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MockApi(); 