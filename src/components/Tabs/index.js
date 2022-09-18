import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import classnames from "classnames";

/**
 * Tab 容器组件
 * @param {Array} props.tabs 所有 Tab 选项按钮的配置数据
 * @param {Array} props.children 所有 Tab 选项按钮对应的内容数据
 * @param {Number} props.index 当前选中 Tab 的索引
 * @param {Function} props.onChange 切换 Tab 选项按钮时的回调函数
 */
const Tabs = ({ index = 0, tabs = [], children, onChange }) => {
	// 当前选中的选项卡按钮的索引
	const [activeIndex, setActiveIndex] = useState(index);

	// 让组件属性 index 的值变化时，设置 activeIndex 状态
	useEffect(() => {
		setActiveIndex(index);
	}, [index]);

	// 选项容器的 ref 引用
	const navRef = useRef();
	// 短线条的 ref 引用
	const lineRef = useRef();
	//滚动条动态逻辑
	useEffect(() => {
		// Tab 栏容器
		const navEl = navRef.current;

		// Tab 栏容器的宽度
		const navWidth = navEl.offsetWidth || 289;

		// 当前选项卡按钮
		const activeTab = navEl.children[activeIndex];

		// 当前选项卡按钮的宽度
		const activeTabWidth = activeTab.offsetWidth || 60;

		// 当前选项卡按钮的左侧位置
		// 注意：第一次获取 offsetLeft 值为 0，以后每次获取为 8
		// 所以设置默认值为 8，让所有情况下的 offsetLeft 都相同
		const activeTabOffsetLeft = activeTab.offsetLeft || 8;

		// 滚动效果的起始位置：即 Tab 栏容器的左侧位置
		const from = navEl.scrollLeft;

		// 滚动效果的结束位置
		const to = activeTabOffsetLeft - (navWidth - activeTabWidth) / 2;

		// 滚动效果执行帧率
		const frames = Math.round(200 / 24);

		let count = 0;
		function animate() {
			navEl.scrollLeft += (to - from) / frames;
			count++;
			if (count < frames) {
				requestAnimationFrame(animate);
			}
		}
		animate();

		// window.innerWidth / 375：手动处理 JS 移动端适配
		// 15 表示短线条宽度的一半
		const translateX =
			activeTabOffsetLeft +
			activeTabWidth / 2 -
			15 * (window.innerWidth / 375);
		lineRef.current.style.transform = `translateX(${translateX}px)`;
	}, [
		// 注意：由于 tabs 是动态数据，为了能在 tabs 数据加载完后获取到选项卡按钮元素，
		// 因此这里要将 tabs 作为依赖项。否则会导致 navRef.current.children[activeIndex]
		// 拿到的是短线条元素，而不是第一个选项卡按钮元素
		activeIndex,
		tabs,
	]);

	return (
		<div className={styles.root}>
			<div className="tabs">
				{/* tab 选项按钮容器 */}
				{/* tab 选项卡容器 */}
				<div className="tabs-wrap">
					<div className="tabs-nav" ref={navRef}>
						{/* tab 选项卡 */}
						{/* tab 选项卡 */}
						{tabs.map((item, i) => (
							<div
								key={i}
								className={classnames(
									"tab",
									i === activeIndex ? "active" : ""
								)}
								onClick={() => {
									setActiveIndex(i);
									onChange(i);
								}}
							>
								<span>{item.name}</span>
							</div>
						))}

						{/* tab 底下的指示短线条 */}
						<div className="tab-line" ref={lineRef}></div>
					</div>
				</div>

				{/* tab 下面的主内容区域 */}
				<div className="tabs-content">
					{React.Children.map(children, (child, index) => {
						return (
							// 为每个子元素包裹一个 div，用来控制显示或隐藏
							<div
								className="tabs-content-wrap"
								style={{
									display:
										index === activeIndex
											? "block"
											: "none",
								}}
							>
								{
									// 为每个子元素生成副本，并传入选中选项卡的 id 值
									React.cloneElement(child, {
										aid: tabs[activeIndex]?.id || 0,
									})
								}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

Tabs.propTypes = {
	// tabs 属性必传
	tabs: PropTypes.array.isRequired,

	//children 属性值必须是界面元素
	children: PropTypes.arrayOf(PropTypes.element),
};

export default Tabs;
