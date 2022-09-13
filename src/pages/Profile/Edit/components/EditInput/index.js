import React from "react";
import NavBar from "@/components/NavBar";
import styles from "./index.module.scss";
import Textarea from "@/components/Textarea";
import Input from "@/components/Input";
export default function EditInput({ onClose, type }) {
	return (
		<div className={styles.root}>
			<NavBar
				title={"编辑" + (type === "name" ? "昵称" : "简介")}
				rightContent={<span className="commit-btn">提交</span>}
				onLeftClick={onClose}
			></NavBar>
			<div className="content-box">
				<h3>{type === "name" ? "昵称" : "简介"}</h3>
				{type === "name" ? (
					<div className="input-wrap">
						<Input />
					</div>
				) : (
					<Textarea placeholder="请输入" value="" />
				)}
			</div>
		</div>
	);
}
