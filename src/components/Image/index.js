import classnames from "classnames";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import styles from "./index.module.scss";

/**
 * 拥有懒加载特性的图片组件
 * @param {String} props.src 图片地址
 * @param {String} props.className 样式类
 */
const Image = ({ src, className }) => {
	// 记录图片加载是否出错的状态
	const [isError, setIsError] = useState(false);

	// 记录图片是否正在加载的状态
	const [isLoading, setIsLoading] = useState(true);

	// 对图片元素的引用
	const imgRef = useRef(null);

	// 在组件创建时
	useEffect(() => {
		// 新建一个浏览器 IntersectionObserver 对象
		// 用来监听 img 图片元素是否和视口交叉（即出现在可视区域）
		const observer = new IntersectionObserver((entries, imgObserver) => {
			entries.forEach((entry) => {
				// 如果出现在可视区域，则将存放在 img 标签 data-src 属性中的图片地址，
				// 设置到 src 属性上，即开始真正加载图片
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
				}
			});
		});

		// 开始监听
		observer.observe(imgRef.current);
		// 组件销毁时
		return () => {
			// 停止 IntersectionObserver 对象的监听
			observer.disconnect();
		};
	}, []);

	return (
		<div className={classnames(styles.root, className)}>
			{/* 正在加载时显示的内容 */}
			{isLoading && (
				<div className="image-icon">
					<Icon type="iconphoto" />
				</div>
			)}

			{/* 加载出错时显示的内容 */}
			{isError && (
				<div className="image-icon">
					<Icon type="iconphoto-fail" />
				</div>
			)}

			{/* 加载成功时显示的内容 */}
			{!isError && (
				<img
					alt=""
					data-src={src}
					ref={imgRef}
					onLoad={() => setIsLoading(false)}
					onError={() => setIsError(true)}
				/>
			)}
		</div>
	);
};

export default Image;
