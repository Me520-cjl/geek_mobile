import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
	const history = useNavigate();

	// 倒计时秒数
	const [second, setSecond] = useState(3);

	// 延时器引用
	const timerRef = useRef(-1);

	// 在倒计时秒数变化时执行
	useEffect(() => {
		// 1. 创建延时器
		timerRef.current = setTimeout(() => {
			if (second <= 1) {
				// 倒计时结束：关闭定时器，并跳转到首页
				clearTimeout(timerRef.current);
				history("/home/index");
			} else {
				// 到计时未结束：秒数减一
				setSecond(second - 1);
			}
		}, 1000);

		// 2. 组件销毁时要清理延时器
		return () => {
			clearTimeout(timerRef.current);
		};
	}, [second, history]);

	return (
		<div>
			<h1>对不起，你访问的内容不存在...</h1>
			<p>
				{second} 秒后，返回<Link to="/home/index">首页</Link>
			</p>
		</div>
	);
};

export default NotFound;
