import NavBar from "@/components/NavBar";
import { DatePicker, List, Modal, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Drawer } from "antd";
import EditInput from "./components/EditInput";
import EditList from "./components/EditList";
import { logout } from "@/store/actions/login";
import {
	getUserProfile,
	updateProfile,
	updateAvatar,
} from "@/store/actions/profile";

const ProfileEdit = () => {
	const history = useNavigate();
	const [visible, setVisible] = useState(false);
	const dispatch = useDispatch();
	// 控制全屏表单抽屉的状态
	const [formDrawerStatus, setFormDrawerStatus] = useState({
		visible: false,
		name: "",
	});

	// 控制菜单列表抽屉的状态
	const [listDrawerStatus, setListDrawerStatus] = useState({
		visible: false,
		name: "",
	});

	useEffect(() => {
		dispatch(getUserProfile());
	}, [dispatch]);

	// 获取 Redux Store 中个人详情
	const profile = useSelector((state) => state.profile.userProfile);
	// 昵称、简介配置
	const formConfigMap = {
		name: {
			title: "昵称",
			name: "name",
			value: profile.name,
		},
		intro: {
			title: "简介",
			name: "intro",
			value: profile.intro,
		},
	};
	// 头像、性别配置
	const listConfigMap = {
		photo: {
			name: "photo",
			items: [
				{
					title: "拍照",
					value: 1,
				},
				{
					title: "本地选择",
					value: 2,
				},
			],
		},
		gender: {
			name: "gender",
			items: [
				{
					title: "男",
					value: 0,
				},
				{
					title: "女",
					value: 1,
				},
			],
		},
	};
	/**
	 * 显示和隐藏抽屉的工具函数
	 * @param {Boolean} visible 显示或隐藏
	 * @param {String} type list 表示列表抽屉；form 表示表单抽屉
	 * @param {String} name 用于鉴别抽屉界面上要修改的用户信息字段，比如 photo、name、gender、intro
	 */
	const toggleDrawer = (visible, type, name) => {
		// 如果 visible 为 false，则直接将两个抽屉都隐藏
		if (!visible) {
			setFormDrawerStatus({ visible: false, name: "" });
			setListDrawerStatus({ visible: false, name: "" });
		}
		// 如果 visible 为 true
		else {
			if (type === "list") {
				setListDrawerStatus({ visible: true, name });
				setFormDrawerStatus({ visible: false, name: "" });
			} else if (type === "form") {
				setFormDrawerStatus({ visible: true, name });
				setListDrawerStatus({ visible: false, name: "" });
			}
		}
	};

	// 抽屉表单的数据提交
	const onFormCommit = (name, value) => {
		// 调用 Action 更新数据
		dispatch(updateProfile(name, value));
		// 关闭抽屉
		toggleDrawer(false);
	};
	// 抽屉列表的数据选择
	const onListSelect = (name, item, index) => {
		// 判断要修改的是性别
		if (name === "gender") {
			dispatch(updateProfile(name, item.value));
		}

		// 判断要修改的是头像
		else if (name === "photo") {
			// 纯网页端的限制，目前不管选择“拍照”或“本地选择”，统一是选择本地文件上传
			fileRef.current.click();
		}

		// 关闭抽屉
		toggleDrawer(false);
	};

	// 修改生日
	const onBirthdayChange = (value) => {
		// 将从 DatePicker 组件获取到的 Date 对象，转成字符串的形式
		const year = value.getFullYear();
		const month = value.getMonth() + 1;
		const day = value.getDate();
		const dateStr = `${year}-${month}-${day}`;
		// 调用 Action 更新数据
		dispatch(updateProfile("birthday", dateStr));
	};

	const fileRef = useRef();

	// 修改头像
	const onAvatarChange = (e) => {
		// 获取选中的图片文件
		const file = e.target.files[0];

		// 生成表单数据
		const formData = new FormData();
		formData.append("photo", file);

		// 调用 Action 进行上传和 Redux 数据更新
		dispatch(updateAvatar(formData));

		// 关闭抽屉
		toggleDrawer(false);
	};

	// 退出登录
	const onLogout = async () => {
		const result = await Modal.confirm({
			content: "确认退出？",
		});
		if (result) {
			Toast.show({ content: "退出成功", position: "bottom" });
			// 删除 Token 信息
			dispatch(logout());
			// 跳转到登录页
			history("/login");
		} else {
		}
	};

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
							onClick={() => {
								setListDrawerStatus({
									visible: true,
									name: "photo",
								});
							}}
						>
							头像
						</List.Item>

						<List.Item
							extra={profile.name}
							onClick={() => {
								setFormDrawerStatus({
									visible: true,
									name: "name",
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
								setFormDrawerStatus({
									visible: true,
									name: "intro",
								});
							}}
						>
							简介
						</List.Item>
					</List>

					{/* 列表二：显示性别、生日 */}
					<List className="profile-list">
						<List.Item
							extra={profile.gender === 0 ? "男" : "女"}
							onClick={() => {
								setListDrawerStatus({
									visible: true,
									name: "gender",
								});
							}}
						>
							性别
						</List.Item>
						<List.Item
							extra={profile.birthday}
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
							onConfirm={onBirthdayChange}
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
							open={formDrawerStatus.visible}
							bodyStyle={{ padding: 0 }}
						>
							<EditInput
								config={formConfigMap[formDrawerStatus.name]}
								onClose={() => toggleDrawer(false)}
								onCommit={onFormCommit}
							/>
						</Drawer>
						{/* 菜单列表抽屉 */}
						<Drawer
							placement="bottom"
							height={180}
							style={{
								minHeight:
									document.documentElement.clientHeight,
							}}
							closable={false}
							open={listDrawerStatus.visible}
							bodyStyle={{ padding: 0 }}
						>
							<EditList
								config={listConfigMap[listDrawerStatus.name]}
								onClose={() => toggleDrawer(false)}
								onSelect={onListSelect}
							/>
						</Drawer>
					</List>

					{/* 文件选择框，用于头像图片的上传 */}
					<input
						type="file"
						hidden
						ref={fileRef}
						onChange={onAvatarChange}
					/>
				</div>

				{/* 底部栏：退出登录按钮 */}
				<div className="logout">
					<button
						className="btn"
						onClick={onLogout}
						style={{ color: "#fff" }}
					>
						退出登录
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileEdit;
