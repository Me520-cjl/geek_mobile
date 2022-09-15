import Icon from "@/components/Icon";
import Input from "@/components/Input";
import NavBar from "@/components/NavBar";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { getTokenInfo } from "@/utils/storage";

const Chat = () => {
	const history = useNavigate();
	// 聊天记录
	const [messageList, setMessageList] = useState([
		// 放两条初始消息
		{ type: "robot", text: "亲爱的用户您好，小智同学为您服务。" },
		{ type: "user", text: "你好" },
	]);

	// 输入框中的内容
	const [message, setMessage] = useState("");

	// 当前用户信息
	const user = useSelector((state) => state.profile.user);

	// 用于缓存 socket.io 客户端实例
	const clientRef = useRef(null);

	useEffect(() => {
		// 创建客户端实例
		const client = io("http://toutiao.itheima.net", {
			transports: ["websocket"],
			// 在查询字符串参数中传递 token
			query: {
				token: getTokenInfo().token,
			},
		});

		// 监听连接成功的事件
		client.on("connect", () => {
			// 向聊天记录中添加一条消息
			setMessageList((messageList) => [
				...messageList,
				{ type: "robot", text: "我现在恭候着您的提问。" },
			]);
		});

		// 监听收到消息的事件
		client.on("message", (data) => {
			// 向聊天记录中添加机器人回复的消息
			setMessageList((messageList) => [
				...messageList,
				{ type: "robot", text: data.msg },
			]);
		});

		// 将客户端实例缓存到 ref 引用中
		clientRef.current = client;

		// 在组件销毁时关闭 socket.io 的连接
		return () => {
			client.close();
		};
	}, []);
	// 监听聊天数据的变化，改变聊天容器元素的 scrollTop 值让页面滚到最底部
	useEffect(() => {
		chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
	}, [messageList]);

	// 按回车发送消息
	const onSendMessage = (e) => {
		if (e.keyCode === 13) {
			// 通过 socket.io 客户端向服务端发送消息
			clientRef.current.emit("message", {
				msg: message,
				timestamp: Date.now(),
			});

			// 向聊天记录中添加当前发送的消息
			setMessageList((messageList) => [
				...messageList,
				{ type: "user", text: message },
			]);

			// 发送后清空输入框
			setMessage("");
		}
	};

	// 用于操作聊天列表元素的引用
	const chatListRef = useRef(null);

	return (
		<div className={styles.root}>
			{/* 顶部导航栏 */}
			<NavBar className="fixed-header" onLeftClick={() => history(-1)}>
				小智同学
			</NavBar>

			{/* 聊天记录列表 */}
			<div className="chat-list" ref={chatListRef}>
				{messageList.map((msg, index) => {
					// 机器人的消息
					if (msg.type === "robot") {
						return (
							<div className="chat-item" key={index}>
								<Icon type="iconbtn_xiaozhitongxue" />
								<div className="message">{msg.text}</div>
							</div>
						);
					}
					// 用户的消息
					else {
						return (
							<div className="chat-item user" key={index}>
								<img
									src={
										user.photo ||
										"http://toutiao.itheima.net/images/user_head.jpg"
									}
									alt=""
								/>
								<div className="message">{msg.text}</div>
							</div>
						);
					}
				})}
			</div>

			{/* 底部消息输入框 */}
			<div className="input-footer">
				<Input
					className="no-border"
					placeholder="请描述您的问题"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyUp={onSendMessage}
				/>
				<Icon type="iconbianji" className="icon" />
			</div>
		</div>
	);
};

export default Chat;
