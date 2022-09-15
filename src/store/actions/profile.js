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

/**
 * 修改个人详情：昵称、简介、生日、性别 （每次修改一个字段）
 * @param {String} name 要修改的字段名称
 * @param {*} value 要修改的字段值
 *
 */
export const updateUserProfile = (name, value) => {
	return {
		type: "profile/update",
		payload: { name, value },
	};
};

/**
 * 修改个人详情：昵称、简介、生日、性别 （每次修改一个字段）
 * @param {String} name 要修改的字段名称
 * @param {*} value 要修改的字段值
 * @returns thunk
 */
export const updateProfile = (name, value) => {
	return async (dispatch) => {
		// 调用接口将数据更新到后端
		const res = await http.patch("/user/profile", { [name]: value });

		// 如果后端更新成功，则再更新 Redux 中的数据
		if (res.message === "OK") {
			dispatch(updateUserProfile(name, value));
		}
	};
};

/**
 * 更新头像
 * @param {FormData} formData 上传头像信息的表单数据
 * @returns thunk
 */
export const updateAvatar = (formData) => {
	return async (dispatch) => {
		// 调用接口进行上传
		const res = await http.patch("/user/photo", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		// 获取后端返回的图片地址，更新到 Redux 中
		const { photo } = res.data;
		dispatch(updateUserProfile("photo", photo));
	};
};
