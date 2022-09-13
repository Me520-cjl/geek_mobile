import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/assets/styles/index.scss";
import { HistoryRouter, history } from "./router/history";
import store from "./store";
import { Provider } from "react-redux";
import "antd/dist/antd.min.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<HistoryRouter history={history}>
		<Provider store={store}>
			<App />
		</Provider>
	</HistoryRouter>
);
