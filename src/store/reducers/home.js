// 初始状态
const initialState = {
	userChannels: [],
};

export const home = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "home/channel":
			return {
				...state,
				userChannels: payload,
			};

		default:
			return state;
	}
};
