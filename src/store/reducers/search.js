const initialState = {
	suggestions: [],
	histories: [],
	searchResults: [],
};

export const search = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "search/suggestions":
			return {
				...state,
				suggestions: payload,
			};
		case "search/clear":
			return {
				...state,
				suggestions: [],
			};
		case "search/add_history":
			// 将历史数组放入 Set 中，就能自动去除重复的关键字
			// 注意：Set 只对基础类型的值有自动去重功能，对象无效
			const set = new Set([payload, ...state.histories]);

			// 去重后将 Set 转回数组
			const newArr = Array.from(set);
			// 判断是否已满10个，如已满则删除末尾的一个
			if (newArr.length > 10) {
				newArr.pop();
			}
			return {
				...state,
				histories: newArr,
			};
		case "search/clear_histories":
			return {
				...state,
				histories: [],
			};
		case "search/results":
			return {
				...state,
				searchResults: payload,
			};

		default:
			return state;
	}
};
