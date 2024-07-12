// axios-instance.js

import axios from 'axios';

// 创建一个带有Authorization头部的Axios实例
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081', // 根据你的实际后端地址修改
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // 添加Bearer token
  }
});

export default axiosInstance;
