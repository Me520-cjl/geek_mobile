import throttle from "lodash/fp/throttle";
import { useEffect, useMemo, useState } from "react";

/**
 * 自定义 Hook：
 *   能监听带有滚动条的容器是否已滚到底部，
 *   并在触底后执行一个回调函数。
 *
 * 通过该自定义 Hook，可以实现上拉加载功能
 */
export const useReachBottom = (
	// 页面触底时执行的回调函数
	onReachBottom = () => {},

	{
		// 滚动容器
		container,

		// 放在滚动容器最底部的占位元素
		placeholder,

		// 用来判断是否已到不能再作上拉加载
		isFinished = () => false,

		// 触底距离
		offset = 300,

		// 节流阀开关：值为 true 时停止监听滚动事件；为 false 则开始监听滚动事件
		stop = false,
	}
) => {
	// 代表是否正在执行加载的状态
	const [loading, setLoading] = useState(false);

	// 代表是否已完成全部加载的状态
	const [finished, setFinished] = useState(false);

	// 滚动事件监听函数
	// - 使用了 lodash 的限流函数 throttle 来控制 200ms 执行一次滚动逻辑
	// - 使用 useMemo 将该事件监听函数进行缓存，提升性能
	const onScroll = useMemo(
		() =>
			throttle(200, async () => {
				// 如果已经完成全部加载，则忽略后续的执行
				if (finished) return;

				// 获取滚动容器和底部占位元素的 bottom 位置
				const { bottom: containerScrollBottom } =
					container.getBoundingClientRect();
				const { bottom: placehoderBottom } =
					placeholder.getBoundingClientRect();

				// 判断还未达到触底位置
				if (placehoderBottom - containerScrollBottom <= offset) {
					// 执行 onReachBottom 回调函数
					setLoading(true);
					await onReachBottom();
					setLoading(false);

					// 记录当前是否已完成全部加载
					setFinished(isFinished());
				}
			}),
		[onReachBottom, placeholder, container, offset, finished, isFinished]
	);

	// 组件挂载时，为滚动容器和底部占位元素添加 scroll 事件监听
	useEffect(() => {
		if (!container || !placeholder || stop) return;

		container.addEventListener("scroll", onScroll);

		return () => {
			// 组件销毁时，注销 scroll 事件监听
			container.removeEventListener("scroll", onScroll);
		};
	}, [container, placeholder, onScroll, stop]);

	// 返回本自定义 Hook 对外暴露的内容
	return {
		loading,
		finished,
	};
};
