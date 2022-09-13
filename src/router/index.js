import Login from "../pages/Login";
import Layout from "../pages/Layout";
import Profile from "@/pages/Profile";
import Home from "@/pages/Home";
import Question from "@/pages/Question";
import Video from "@/pages/Video";
import Edit from "@/pages/Profile/Edit";

const routes = [
	{
		path: "/",
		element: <Layout />,
		children: [
			{ path: "", element: <Home /> },
			//{ path: "home", element: <Home /> },
			{
				path: "profile",
				element: <Profile />,
				//children: [{ path: "edit", element: <Edit /> }],
			},
			{ path: "video", element: <Video /> },
			{ path: "question", element: <Question /> },
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{ path: "/profile/edit", element: <Edit /> },
];

export default routes;
