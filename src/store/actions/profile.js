import http from "@/utils/http";

/**
 * 设置个人基本信息
 * @param {*} user
 * @returns
 */
export const setUser = (user) => {
	return {
		type: "profile/user",
		payload: user,
	};
};

/**
 * 获取用户基本信息
 * @returns thunk
 */
export const getUser = () => {
	return async (dispatch) => {
		const res = await http.get("/user");
		const user = res.data;

		// 保存到 Redux 中
		dispatch(setUser(user));
	};
};

/**
 * 设置个人详情
 * @param {*} profile
 * @returns
 */
export const setUserProfile = (profile) => ({
	type: "profile/profile",
	payload: profile,
});

/**
 * 获取用户详情
 * @returns thunk
 */
export const getUserProfile = () => {
	return async (dispatch) => {
		const res = await http.get("/user/profile");
		const profile = res.data;

		// 保存到 Redux 中
		dispatch(setUserProfile(profile));
	};
};
