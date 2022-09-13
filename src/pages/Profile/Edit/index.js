import NavBar from "@/components/NavBar";
import { DatePicker, List, Toast } from "antd-mobile";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useState } from "react";
import { getUserProfile } from "@/store/actions/profile";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Drawer } from "antd";
import EditInput from "./components/EditInput";

const ProfileEdit = () => {
	const history = useNavigate();
	const [visible, setVisible] = useState(false);
	const dispatch = useDispatch();

	// 控制抽屉组件的显示
	const [inputOpen, setInputOpen] = useState({
		// 抽屉显示状态
		visible: false,
		// 显示的类型
		type: "",
	});

	const onClose = () => {
		setInputOpen({
			visible: false,
			type: "",
		});
		console.log("close");
	};

	useEffect(() => {
		dispatch(getUserProfile());
	}, [dispatch]);

	// 获取 Redux Store 中个人详情
	const profile = useSelector((state) => state.profile.userProfile);
	return (
		<div className={styles.root}>
			<Drawer></Drawer>
			<div className="content">
				{/* 顶部导航栏 */}
				<NavBar
					title={"个人信息"}
					onLeftClick={() => history(-1)}
				></NavBar>

				<div className="wrapper">
					{/* 列表一：显示头像、昵称、简介 */}
					<List className="profile-list">
						<List.Item
							extra={
								<span className="avatar-wrapper">
									<img
										src={profile.photo}
										alt=""
										style={{
											height: 22.5,
											width: 22.5,
											borderRadius: 11.25,
										}}
									/>
								</span>
							}
						>
							头像
						</List.Item>

						<List.Item
							extra={profile.name}
							onClick={() => {
								setInputOpen({
									visible: true,
									type: "name",
								});
							}}
						>
							昵称
						</List.Item>

						<List.Item
							extra={
								<span
									className={classnames(
										"intro",
										profile.intro ? "normal" : ""
									)}
								>
									{profile.intro || "未填写"}
								</span>
							}
							onClick={() => {
								setInputOpen({
									visible: true,
									type: "intro",
								});
							}}
						>
							简介
						</List.Item>
					</List>

					{/* 列表二：显示性别、生日 */}
					<List className="profile-list">
						<List.Item extra={"男"}>性别</List.Item>
						<List.Item
							extra={"2020-02-02"}
							onClick={() => {
								setVisible(true);
							}}
						>
							生日
						</List.Item>
						<DatePicker
							title="时间选择"
							visible={visible}
							onClose={() => {
								setVisible(false);
							}}
							max={new Date()}
							min={new Date(1900, 1, 1, 0, 0, 0)}
							onConfirm={(val) => {
								Toast.show(val.toDateString());
							}}
						/>
						{/* 全屏表单抽屉 */}
						<Drawer
							placement="left"
							width={500}
							style={{
								minHeight:
									document.documentElement.clientHeight,
							}}
							closable={false}
							open={inputOpen.visible}
							bodyStyle={{ padding: 0 }}
						>
							<EditInput
								onClose={onClose}
								type={inputOpen.type}
							></EditInput>
						</Drawer>
					</List>

					{/* 文件选择框，用于头像图片的上传 */}
					<input type="file" hidden />
				</div>

				{/* 底部栏：退出登录按钮 */}
				<div className="logout">
					<button className="btn">
						<Link to="/login" style={{ color: "#fff" }}>
							退出登录
						</Link>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileEdit;
