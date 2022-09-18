import http from "@/utils/http";
import { setLocalChannels, hasToken } from "@/utils/storage";
import differenceBy from "lodash/differenceBy";
/**
 * 将用户频道保存到 Redux
 * @param {Array} channels
 * @returns
 */
export const setUserChannels = (channels) => {
	return {
		type: "home/channel",
		payload: channels,
	};
};

/**
 * 获取频道
 * @returns thunk
 */
export const getUserChannels = () => {
	return async (dispatch) => {
		// 请求数据
		const res = await http.get("/user/channels");
		const { channels } = res.data;

		// 将频道数据保存到 Redux
		dispatch(setUserChannels(channels));

		// 将频道数据保存到 LocalStorage
		setLocalChannels(channels);
	};
};

/**
 * 将推荐频道保存到 Redux
 * @param {Array} channels
 * @returns
 */
export const setRecommendChannels = (channels) => {
	return {
		type: "home/recommend",
		payload: channels,
	};
};

/**
 * 获取所有频道中排除用户自己的频道数据
 * @returns thunk
 */
export const getRecommendChannels = () => {
	return async (dispatch, getState) => {
		// 请求所有的推荐频道
		const res = await http.get("/channels");
		const { channels } = res.data;

		// 去掉已被用户选中的频道
		const { userChannels } = getState().home;
		const recommendChannels = differenceBy(channels, userChannels, "id");

		// 保存到 Redux
		dispatch(setRecommendChannels(recommendChannels));
	};
};

/**
 * 添加频道
 * @param {Object} channel 要添加的频道数据
 * @returns thunk
 */
export const addChannel = (channel) => {
	return async (dispatch, getState) => {
		// 只有登录用户可以将添加的推荐频道保存到服务器
		if (hasToken()) {
			await http.patch("/user/channels", {
				channels: [channel],
			});
		}

		// 获取 Redux 中的状态
		const { userChannels, recommendChannels } = getState().home;

		// 将最新的”我的频道“保存到 Redux 及 LocalStorage 中
		const newUserChannels = [...userChannels, channel];
		dispatch(setUserChannels(newUserChannels));
		setLocalChannels(newUserChannels);

		// 从推荐频道中剔除当前添加的频道，再保存到 Redux 中
		const newRecommendChannels = recommendChannels.filter(
			(item) => item.id !== channel.id
		);
		dispatch(setRecommendChannels(newRecommendChannels));
	};
};

/**
 * 删除频道
 * @param {Object} channel 要删除的频道数据
 * @returns thunk
 */
export const removeChannel = (channel) => {
	return async (dispatch, getState) => {
		if (hasToken()) {
			await http.delete(`/user/channels/${channel.id}`);
		}

		// 获取 Redux 中的状态
		const { userChannels, recommendChannels } = getState().home;

		// 从 Redux 及 LocalStorage 中移除频道
		const newUserChannels = userChannels.filter(
			(item) => item.id !== channel.id
		);
		dispatch(setUserChannels(newUserChannels));
		setLocalChannels(newUserChannels);

		// 将被移除的频道放回到推荐频道中，并保存到 Redux
		const newRecommendChannels = [...recommendChannels, channel].sort(
			(a, b) => {
				return a.id - b.id;
			}
		);
		dispatch(setRecommendChannels(newRecommendChannels));
	};
};

/**
 * 设置举报反馈菜单信息
 */
export const setFeedbackAction = ({ visible, feedbackId }) => ({
	type: "home/feedback_action",
	payload: {
		visible,
		feedbackId,
	},
});
