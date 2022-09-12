import Login from "../pages/Login";
import Layout from "../pages/Layout";
import Profile from "@/pages/Profile";
import Home from "@/pages/Home";
import Question from "@/pages/Question";
import Video from "@/pages/Video";

const routes = [
	{
		path: "/",
		element: <Layout />,
		children: [
			{ path: "", element: <Home /> },
			//{ path: "home", element: <Home /> },
			{ path: "home/profile", element: <Profile /> },
			{ path: "home/video", element: <Video /> },
			{ path: "home/question", element: <Question /> },
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
];

export default routes;
