import { combineReducers } from "redux";
import { login } from "./login";
import { profile } from "./profile";
import { home } from "./home";
import { search } from "./search";
import { article } from "./article";

// 组合各个 reducer 函数，成为一个根 reducer
const rootReducer = combineReducers({
	// 一个测试用的 reducer，避免运行时因没有 reducer 而报错
	test: (state = 0, action) => state,

	// 在这里配置有所的 reducer ...
	login,
	profile,
	home,
	search,
	article,
});

// 导出根 reducer
export default rootReducer;
