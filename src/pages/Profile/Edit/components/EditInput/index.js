import Input from "@/components/Input";
import NavBar from "@/components/NavBar";
import Textarea from "@/components/Textarea";
import styles from "./index.module.scss";
import { useState, useEffect } from "react";
/**
 * 个人信息项修改表单
 * @param {Object} config 配置信息对象
 * @param {Function} onClose 后退按钮的回调函数
 * @param {Function} onCommit 提交按钮的回调函数
 */
const EditInput = ({ config = {}, onClose, onCommit }) => {
	// 输入框内容状态
	const [value, setValue] = useState("");
	// 当组件的 config 属性发生变化时，更新 value 状态值
	useEffect(() => {
		setValue(config.value || "");
	}, [config]);

	// 输入内容变化事件
	const onValueChange = (e) => setValue(e.target.value);
	return (
		<div className={styles.root}>
			{/* 顶部导航栏 */}
			<NavBar
				className="navbar"
				title={"编辑" + config.title}
				onLeftClick={onClose}
				rightContent={
					<span
						className="commit-btn"
						onClick={() => onCommit(config.name, value)}
					>
						提交
					</span>
				}
			></NavBar>

			<div className="content">
				{/* 字段名 */}
				<h3>{config.title}</h3>

				{/* 输入框：如果是用户名，则使用单行输入框，否则使用多行输入框 */}
				{config.name === "name" ? (
					<div className="input-wrap">
						<Input value={value} onChange={onValueChange} />
					</div>
				) : (
					<Textarea
						placeholder="请输入"
						value={value}
						onChange={onValueChange}
					/>
				)}
			</div>
		</div>
	);
};

export default EditInput;
