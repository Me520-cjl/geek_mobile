import axios from "axios";
import { Toast } from "antd-mobile";

// 1. 创建新的 axios 实例
const http = axios.create({
	baseURL: "http://geek.itheima.net/v1_0",
	timeout: 5000,
});

// 2. 设置请求拦截器和响应拦截器
http.interceptors.request.use((config) => {
	return config;
});

http.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		if (error.response) {
			console.log(error);
			Toast.show({
				content: error.response.data.message,
			});
		} else {
			Toast.show({
				content: "服务器繁忙，请稍后重试",
			});
		}
		return Promise.reject(error);
	}
);

// 3. 导出该 axios 实例
export default http;
