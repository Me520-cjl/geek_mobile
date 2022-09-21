// 初始状态
const initialState = {
	// 文章加载中的标识
	isLoading: true,

	// 文章详情数据
	info: {},

	// 评论加载中的标识
	isLoadingComment: true,

	// 评论数据
	comment: {
		// 评论列表数组
		results: [],
	},
};

export const article = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		// 文章正在加载中：将加载标识设置为 true
		case "article/pengding":
			return {
				...state,
				isLoading: true,
			};

		// 文章加载完成：将加载标识设置为 false，并设置详情数据
		case "article/success":
			return {
				...state,
				isLoading: false,
				info: payload,
			};

		// 评论正在加载中：将加载标识设置为 true
		case "article/comment_loading":
			return {
				...state,
				isLoadingComment: true,
			};

		// 评论加载完成：将加载标识设置为 false，并设置详情数据
		case "article/comment_success":
			return {
				...state,
				isLoadingComment: false,
				comment: {
					...payload,
					results: payload.results,
				},
			};
		// 加载更多评论后，与之前的评论进行数据合并
		case "article/comment_more":
			return {
				...state,
				isLoadingComment: false,
				comment: {
					...payload,
					results: [...state.comment.results, ...payload.results],
				},
			};

		// 修改文章详情信息
		case "article/set_info":
			return {
				...state,
				info: {
					...state.info,
					...payload,
				},
			};

		// 修改评论数据
		case "article/set_comment":
			return {
				...state,
				comment: {
					...state.comment,
					...payload,
				},
			};

		default:
			return state;
	}
};
