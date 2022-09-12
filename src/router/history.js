/**
 * 获取react-router实例对象，在js中跳转页面
 */
import { useState, useLayoutEffect } from "react";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

// 1. history
// export const history = createBrowserHistory();
// 2. hash
// == 创建路由实例对象 =》作用：js中使用跳转页面 ==
export const history = createBrowserHistory();
// == 函数组件 => 作用：包裹根组件,注册history
export const HistoryRouter = ({ history, children }) => {
	const [state, setState] = useState({
		action: history.action,
		location: history.location,
	});

	useLayoutEffect(() => {
		history.listen(setState);
	}, [history]);
	return <Router children={children} navigator={history} {...state} />;
};
