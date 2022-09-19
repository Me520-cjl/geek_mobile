import http from "@/utils/http";
import { setLocalHistories, removeLocalHistories } from "@/utils/storage";
import store from "@/store/reducers/index";
const { getState } = store;

/**
 * 设置建议结果到 Redux 中
 * @param {Array} list 建议结果
 */
const setSuggestions = (list) => {
	return {
		type: "search/suggestions",
		payload: list,
	};
};

/**
 * 设置建议结果到 Redux 中
 * @param {Array} list 建议结果
 */
const addSearchHistory = (keyword) => {
	return {
		type: "search/add_history",
		payload: keyword,
	};
};

/**
 * 获取输入联想建议列表
 * @param {string} q 查询内容
 * @returns thunk
 */
export const getSuggestions = (keyword) => {
	return async (dispatch) => {
		// 请求建议结果
		const res = await http.get("/suggestion", {
			params: {
				q: keyword,
			},
		});
		const { options } = res.data;

		// 转换结果：将每一项建议拆分成关键字匹配的高亮部分和非高亮部分
		const list = options.map((item) => {
			const rest = item.substr(keyword.length);
			return { keyword, rest };
		});

		// 保存到 Redux 中
		dispatch(setSuggestions(list));
		console.log("搜索成功");

		// 搜索成功后，保存为历史关键字
		// 1）保存搜索关键字到 Redux 中
		dispatch(addSearchHistory(keyword));
		// 2）保存搜索关键字到 LocalStorage 中
		const { histories } = getState().search;
		setLocalHistories(histories);
	};
};

/**
 * 清空搜索建议
 * @returns thunk
 */
export const clearSuggestions = () => {
	return {
		type: "search/clear",
	};
};

/**
 * 删除 Redux 中的历史记录
 */
export const doClearHistories = () => {
	return {
		type: "search/clear_histories",
	};
};

/**
 * 清空搜索历史
 * @returns
 */
export const clearHistories = () => {
	return (dispatch) => {
		// 删除 Redux 中的历史记录
		dispatch(doClearHistories());

		// 删除 LocalStorage 中的历史记录
		removeLocalHistories();
	};
};

/**
 *  设置搜索详情到 Redux 中
 * @param {Array} results
 * @returns
 */
export const setSearchResults = (results) => {
	return {
		type: "search/results",
		payload: results,
	};
};

/**
 * 获取搜索文章列表
 * @param {string} q 查询内容
 * @returns thunk
 */
export const getSearchResults = (q) => {
	return async (dispatch) => {
		const res = await http.get("/search", {
			params: { q },
		});

		// 保存结果数据到 Redux 中
		dispatch(setSearchResults(res.data));
	};
};
