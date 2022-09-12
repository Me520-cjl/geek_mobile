// 导入路由
import { useRoutes } from "react-router-dom";
import routes from "./router";

// 配置路由规则
function App() {
	const element = useRoutes(routes);
	return <div className="App">{element}</div>;
}

export default App;
