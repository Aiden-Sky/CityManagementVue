import QRCode from 'qrcode';

/**
 * TOTP (Time-based One-Time Password) 辅助工具类
 * 用于生成双因素认证的二维码和密钥
 */
export default {
  /**
   * 生成随机密钥
   * @param {number} length 密钥长度
   * @returns {string} 生成的密钥
   */
  generateSecretKey(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 字符集
    let result = '';
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    
    return result;
  },
  
  /**
   * 生成TOTP URI
   * @param {string} secretKey 密钥
   * @param {string} accountName 账户名称
   * @param {string} issuer 发行方名称
   * @returns {string} TOTP URI
   */
  generateTotpUri(secretKey, accountName, issuer = '城市管理系统') {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedAccount = encodeURIComponent(accountName);
    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secretKey}&issuer=${encodedIssuer}`;
  },
  
  /**
   * 生成二维码数据URL
   * @param {string} totpUri TOTP URI
   * @returns {Promise<string>} 二维码数据URL
   */
  async generateQRCode(totpUri) {
    try {
      return await QRCode.toDataURL(totpUri, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (error) {
      console.error('生成二维码失败:', error);
      throw error;
    }
  },
  
  /**
   * 生成完整的TOTP设置数据
   * @param {string} accountName 账户名称
   * @param {string} issuer 发行方名称
   * @returns {Promise<Object>} 包含密钥和二维码URL的对象
   */
  async generateTotpSetup(accountName, issuer = '城市管理系统') {
    const secretKey = this.generateSecretKey();
    const totpUri = this.generateTotpUri(secretKey, accountName, issuer);
    const qrCodeUrl = await this.generateQRCode(totpUri);
    
    return {
      secretKey,
      qrCodeUrl
    };
  }
}; 