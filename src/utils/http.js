import axios from "axios";
import { Toast } from "antd-mobile";
import { getTokenInfo, removeTokenInfo, setTokenInfo } from "./storage";
import { history } from "@/router/history";
import store from "@/store";
import { clearToken } from "@/store/actions/login";

// 1. 创建新的 axios 实例
const http = axios.create({
	baseURL: "http://geek.itheima.net/v1_0",
	timeout: 5000,
});

// 2. 设置请求拦截器和响应拦截器
http.interceptors.request.use((config) => {
	// 获取缓存中的 Token 信息
	const token = getTokenInfo().token;
	if (token) {
		// 设置请求头的 Authorization 字段
		config.headers["Authorization"] = `Bearer ${token}`;
	}
	return config;
});

http.interceptors.response.use(
	(response) => {
		return response.data;
	},
	async (error) => {
		console.log(error);
		// 获取错误信息中包含的请求配置信息和响应数据
		const { response } = error;

		// 判断 HTTP 状态码是否为 401，即 token 不正确造成的授权问题
		if (response.status === 401) {
			const { token, refresh_token } = getTokenInfo();

			// 如果是没有 Token 或 Refresh Token
			if (!token || !refresh_token) {
				// 跳转到登录页，并携带上当前正在访问的页面，等登录成功后再跳回该页面
				history.replace("/login", {
					from: history.location.pathname || "/",
				});
				return Promise.reject(error);
			}

			try {
				// 自动刷新 token
				const res = await http.put("/authorizations", null, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Bearer ${refresh_token}`,
					},
				});

				setTokenInfo({
					refresh_token,
					token: res.data.data.token,
				});

				// 继续发送刚才错误的请求
				return http(error.config);
			} catch (error) {
				// 失败，说明 refresh_token 失效了
				// 清除 Redux 和 LocalStorage 中 Token 信息
				removeTokenInfo();
				store.dispatch(clearToken());

				// 跳转到登录页，并携带上当前正在访问的页面，等登录成功后再跳回该页面
				history.push("/login", {
					from: history.location.pathname || "/",
				});
				return Promise.reject(error);
			}
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
