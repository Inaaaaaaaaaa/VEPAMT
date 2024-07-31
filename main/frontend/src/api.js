import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API的基础URL
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 获取所有消息
 * @returns 消息数据的数组
 */
export const fetchMessages = async () => {
  try {
    const response = await apiClient.get('/messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};