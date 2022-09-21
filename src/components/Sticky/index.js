import throttle from "lodash/fp/throttle";
import { useEffect, useRef } from "react";
import styles from "./index.module.scss";

/**
 * 吸顶组件
 * @param {HTMLElement} props.root 滚动容器元素
 * @param {Number} props.height 吸顶元素的高度
 * @param {HTMLElement} props.offset 吸顶位置的 top 值
 * @param {HTMLElement} props.children 本组件的子元素
 */
const Sticky = ({ root, height, offset = 0, children }) => {
	const placeholderRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		if (!root) return;

		const placeholderDOM = placeholderRef.current;
		const containerDOM = containerRef.current;

		// 滚动事件监听函数
		const onScroll = throttle(60, () => {
			// 获取占位元素的 top 位置
			const { top } = placeholderDOM.getBoundingClientRect();

			// 占位元素的 top 值已达到吸顶位置
			if (top <= offset) {
				// 将要吸顶的容器元素设置成 fixed 固定定位
				containerDOM.style.position = "fixed";
				containerDOM.style.top = `${offset}px`;
				placeholderDOM.style.height = `${height}px`;
			} else {
				// 取消固定定位
				containerDOM.style.position = "static";
				placeholderDOM.style.height = "0px";
			}
		});

		// 添加事件监听
		root.addEventListener("scroll", onScroll);

		return () => {
			// 注销事件监听
			root.removeEventListener("scroll", onScroll);
		};
	}, [root, offset, height]);

	return (
		<div className={styles.root}>
			{/* 占位元素 */}
			<div ref={placeholderRef} className="sticky-placeholder" />

			{/* 吸顶显示的元素 */}
			<div className="sticky-container" ref={containerRef}>
				{children}
			</div>
		</div>
	);
};

export default Sticky;
