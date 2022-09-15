import http from "@/utils/http";
import { setTokenInfo, removeTokenInfo } from "@/utils/storage";

/**
 * 发送短信验证码
 * @param {string} mobile 手机号码
 * @returns thunk
 */
export const sendValidationCode = (mobile) => {
	return async (dispatch) => {
		await http.get(`/sms/codes/${mobile}`);
	};
};

export const saveToken = (payload) => {
	return {
		type: "login/token",
		payload,
	};
};

/**
 * 登录
 * @param {{ mobile, code }} values 登录信息
 * @returns thunk
 */
export const login = (params) => {
	return async (dispatch) => {
		const res = await http.post("/authorizations", params);
		dispatch(saveToken(res.data));
		// 保存 Token 到 LocalStorage 中
		setTokenInfo(res.data);
	};
};

/**
 * 将 Token 信息从 Redux 中删除
 */
export const clearToken = () => {
	return {
		type: "login/clear",
	};
};

/**
 * 登出
 * @returns thunk
 */
export const logout = () => {
	return (dispatch) => {
		// 删除 LocalStorage 中的 Token 信息
		removeTokenInfo();

		// 删除 Redux 中的 Token 信息
		dispatch(clearToken());
	};
};
