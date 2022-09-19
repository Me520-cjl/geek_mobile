import Tabs from "@/components/Tabs";
import styles from "./index.module.scss";
import { getUserChannels, setUserChannels } from "@/store/actions/home";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hasToken, getLocalChannels } from "@/utils/storage";
import Icon from "@/components/Icon";
import { Drawer } from "antd";
import Channels from "./components/Channels";
import ArticleList from "./components/ArticleList";
import FeedbackActionMenu from "./components/Feekback";
import { useNavigate } from "react-router";

const Home = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const loadChannel = async () => {
			// 如果用户未登录，则尝试从本地缓存中获取频道数据
			if (!hasToken()) {
				const localChannels = getLocalChannels();
				if (localChannels.length > 0) {
					return dispatch(setUserChannels(localChannels));
				}
			}

			// 如果用户已登录，或未登录但缓存中也没有，则从后端获取频道数据
			dispatch(getUserChannels());
		};

		loadChannel();
	}, [dispatch]);

	// 频道数据
	const channels = useSelector((state) => state.home.userChannels);

	// 当前选中的 Tab 选项卡按钮索引
	const [tabActiveIndex, setTabActiveIndex] = useState(0);

	// 控制频道管理抽屉的显示和隐藏
	const [drawerVisible, setDrawerVisible] = useState(false);

	const history = useNavigate();

	return (
		<div className={styles.root}>
			{/* 举报反馈弹出菜单 */}
			<FeedbackActionMenu />
			{/* 频道 Tab 栏 */}
			<Tabs
				index={tabActiveIndex}
				tabs={channels}
				onChange={(i) => setTabActiveIndex(i)}
			>
				{channels.map((ch) => (
					<ArticleList key={ch.id} channelId={ch.id} />
				))}
			</Tabs>

			{/* 频道 Tab 栏右侧的两个图标按钮：搜索、频道管理 */}
			<div className="tabs-opration">
				<Icon
					type="iconbtn_search"
					onClick={() => history("/search")}
				/>
				<Icon
					type="iconbtn_channel"
					onClick={() => setDrawerVisible(true)}
				/>
			</div>

			{/* 抽屉结构 */}
			{/* 全屏表单抽屉 */}
			<Drawer
				placement="left"
				className="my-drawer"
				style={{ minHeight: document.documentElement.clientHeight }}
				closable={false}
				open={drawerVisible}
				bodyStyle={{ padding: 0 }}
				onOpenChange={() => setDrawerVisible(false)}
			>
				<Channels
					tabActiveIndex={tabActiveIndex}
					onClose={() => setDrawerVisible(false)}
					onChannelClick={(i) => setTabActiveIndex(i)}
				/>
			</Drawer>
		</div>
	);
};

export default Home;
