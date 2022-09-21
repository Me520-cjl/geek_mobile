import http from "@/utils/http";

/**
 * 设置为正在加载
 */
export const setLoadingPending = () => {
	return {
		type: "article/pengding",
	};
};

/**
 * 设置为非加载状态，并将详情数据保存到 Redux
 * @param {Object} info 文章详情数据
 */
export const setLoadingSuccess = (info) => {
	return {
		type: "article/success",
		payload: info,
	};
};

/**
 * 请求指定 id 的文章详情
 * @param {Number} id 文章id
 * @returns thunk
 */
export const getArticleInfo = (id) => {
	return async (dispatch) => {
		// 准备发送请求
		dispatch(setLoadingPending());

		// 发送请求
		const res = await http.get(`/articles/${id}`);
		const info = res.data;

		// 请求成功，保存数据
		dispatch(setLoadingSuccess(info));
	};
};

/**
 * 设置为正在加载评论
 */
export const setCommentPending = () => {
	return {
		type: "article/comment_loading",
	};
};

/**
 * 设置为非加载评论的状态，并将评论数据保存到 Redux
 * @param {Array} comments 评论
 */
export const setCommentSuccess = (comments) => {
	return {
		type: "article/comment_success",
		payload: comments,
	};
};

/**
 * 获取文章的评论列表
 * @param {String} obj.type 评论类型
 * @param {String} obj.source 评论ID
 * @returns thunk
 */
export const getArticleComments = ({ type, source }) => {
	return async (dispatch) => {
		// 准备发送请求
		dispatch(setCommentPending());

		// 发送请求
		const res = await http.get("/comments", {
			params: { type, source },
		});

		// 请求成功，保存数据
		dispatch(setCommentSuccess(res.data));
	};
};

/**
 * 将加载的更多评论保存到 Redux
 * @param {Array} comments 评论
 */
export const setCommentMore = (comments) => {
	return {
		type: "article/comment_more",
		payload: comments,
	};
};

/**
 * 获取更多评论
 * @param {String} obj.type 评论类型
 * @param {String} obj.source 评论ID
 * @param {String} obj.offset 分页偏移量
 * @returns thunk
 */
export const getMoreArticleComments = ({ type, source, offset }) => {
	return async (dispatch) => {
		dispatch(setCommentPending());

		const res = await http.get("/comments", {
			params: {
				type,
				source,
				offset,
			},
		});

		dispatch(setCommentMore(res.data));
	};
};

/**
 * 修改 Redux 中的文章详情数据
 * @param {Object} partial 文章详情中的一个或多个字段值
 */
export const setArticleInfo = (partial) => {
	return {
		type: "article/set_info",
		payload: partial,
	};
};

/**
 * 修改 Redux 中的评论数据
 * @param {Object} partial 评论中的一个或多个字段值
 */
export const setArticleComments = (partial) => ({
	type: "article/set_comment",
	payload: partial,
});

/**
 * 取消评论点赞
 * @param {String} id 评论id
 * @param {Boolean} isLiking 是否点赞
 * @returns thunk
 */
export const setCommentLiking = (id, isLiking) => {
	return async (dispatch, getState) => {
		// 获取评论数据
		const { comment } = getState().article;
		const { results } = comment;

		// 点赞
		if (isLiking) {
			await http.post("/comment/likings", { target: id });

			// 更新 Redux 中的评论数据
			dispatch(
				setArticleComments({
					results: results.map((item) => {
						if (item.com_id === id) {
							return {
								...item,
								is_liking: true,
								like_count: item.like_count + 1,
							};
						} else {
							return item;
						}
					}),
				})
			);
		}
		// 取消点赞
		else {
			await http.delete(`/comment/likings/${id}`);

			// 更新 Redux 中的评论数据
			dispatch(
				setArticleComments({
					results: results.map((item) => {
						if (item.com_id === id) {
							return {
								...item,
								is_liking: false,
								like_count: item.like_count - 1,
							};
						} else {
							return item;
						}
					}),
				})
			);
		}
	};
};

/**
 * 文章点赞
 * @param {String} id 文章ID
 * @param {Number} attitude 0-取消点赞|1-点赞
 * @returns thunk
 */
export const setArticleLiking = (id, attitude) => {
	return async (dispatch, getState) => {
		// 获取文章详情
		const { info } = getState().article;
		let likeCount = info.like_count;

		// 取消点赞
		if (attitude === 0) {
			await http.delete(`/article/likings/${id}`);
			likeCount--;
		}
		// 点赞
		else {
			await http.post("/article/likings", { target: id });
			likeCount++;
		}

		// 更新 Redux 中的数据
		dispatch(
			setArticleInfo({
				attitude,
				like_count: likeCount,
			})
		);
	};
};

/**
 * 文章收藏
 * @param {String} id 文章id
 * @param {Boolean} isCollect 是否收藏
 * @returns thunk
 */
export const setAritcleCollection = (id, isCollect) => {
	return async (dispatch) => {
		// 收藏
		if (isCollect) {
			await http.post("/article/collections", { target: id });
		}
		// 取消收藏
		else {
			await http.delete(`/article/collections/${id}`);
		}

		// 更新 Redux 中的文章数据
		dispatch(
			setArticleInfo({
				is_collected: isCollect,
			})
		);
	};
};

/**
 * 关注作者
 * @param {String} id 作者id
 * @param {Boolean} id 是否关注
 * @returns thunk
 */
export const setAuthorFollow = (id, isFollow) => {
	return async (dispatch) => {
		// 关注
		if (isFollow) {
			await http.post("/user/followings", { target: id });
		}
		// 取消关注
		else {
			await http.delete(`/user/followings/${id}`);
		}

		dispatch(
			setArticleInfo({
				is_followed: isFollow,
			})
		);
	};
};
