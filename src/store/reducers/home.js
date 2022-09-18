// 初始状态
const initialState = {
	userChannels: [],
	recommendChannels: [],
	feedbackAction: {
		// 控制弹出菜单的显示隐藏
		visible: false,
		// 当前反馈的目标文章ID
		articleId: 0,
	},
};

export const home = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "home/channel":
			return {
				...state,
				userChannels: payload,
			};
		case "home/recommend":
			return {
				...state,
				recommendChannels: payload,
			};
		case "home/feedback_action":
			return {
				...state,
				feedbackAction: payload,
			};

		default:
			return state;
	}
};
