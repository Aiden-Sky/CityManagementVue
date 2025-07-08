/**
 * TOTP (Time-based One-Time Password) 辅助工具类
 * 用于生成双因素认证的二维码和密钥
 */

import QRCode from 'qrcode';
import jsSHA from 'jssha';

/**
 * TOTP (Time-based One-time Password) 帮助工具
 * 兼容Google Authenticator等验证器应用
 */

/**
 * 生成当前的TOTP验证码
 * @param {string} secretKey - 经过Base32编码的密钥
 * @param {number} digits - 验证码长度，默认为6位
 * @param {number} period - 有效期，默认为30秒
 * @returns {string} - 生成的验证码
 */
export function generateTOTP(secretKey, digits = 6, period = 30) {
  try {
    // 对Base32编码的密钥进行解码
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < secretKey.length; i++) {
      const val = base32chars.indexOf(secretKey.charAt(i).toUpperCase());
      bits += val.toString(2).padStart(5, '0');
    }

    // 将二进制字符串转换为十六进制字符串
    let hex = '';
    for (let i = 0; i < Math.floor(bits.length / 8); i++) {
      const byteStr = bits.substr(i * 8, 8);
      const byteVal = parseInt(byteStr, 2);
      hex += byteVal.toString(16).padStart(2, '0');
    }

    // 获取当前时间步
    const epoch = Math.floor(Date.now() / 1000);
    const time = Math.floor(epoch / period);
    const timeHex = time.toString(16).padStart(16, '0');

    // 使用SHA-1算法计算HMAC
    const shaObj = new jsSHA('SHA-1', 'HEX', {
      hmacKey: { value: hex, format: 'HEX' }
    });
    shaObj.update(timeHex);
    const hmac = shaObj.getHMAC('HEX');

    // 根据RFC 6238计算动态截断
    const offset = parseInt(hmac.substring(hmac.length - 1), 16);
    let binCode = parseInt(hmac.substr(offset * 2, 8), 16) & 0x7fffffff;

    // 对结果取模，获取指定位数的验证码
    const otp = binCode % Math.pow(10, digits);
    return otp.toString().padStart(digits, '0');
  } catch (error) {
    console.error('生成TOTP验证码失败:', error);
    return '';
  }
}

/**
 * 将十六进制字符串转换为字节数组
 * @param {string} hex - 十六进制字符串
 * @returns {Uint8Array} - 字节数组
 */
function hexToBytes(hex) {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * 生成二维码的URL
 * @param {string} issuer - 发行者名称
 * @param {string} account - 账户名
 * @param {string} secretKey - 密钥
 * @returns {string} - 用于生成二维码的URL
 */
export function generateQRCodeURL(issuer, account, secretKey) {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(account);
  const encodedKey = encodeURIComponent(secretKey);
  
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${encodedKey}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

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
  },
  generateTOTP,
  generateQRCodeURL
}; 