// 初始状态
const initialState = {
	// 基本信息
	user: {},
	// 详情信息
	userProfile: {},
};

// 操作用户个人信息状态的 reducer 函数
export const profile = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		// 设置基本信息
		case "profile/user":
			return {
				...state,
				user: { ...payload },
			};
		// 设置详情信息
		case "profile/profile":
			return {
				...state,
				userProfile: { ...payload },
			};

		// 默认
		default:
			return state;
	}
};
