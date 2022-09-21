import NavBar from "@/components/NavBar";
import http from "@/utils/http";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

/**
 * @param {String} props.id 评论ID
 * @param {String} props.name 评论人姓名
 * @param {Function} props.onClose 关闭评论表单时的回调函数
 * @param {Function} props.onComment 发表评论成功时的回调函数
 * @param {String} props.articleId 文章ID
 */
const CommentInput = ({ id, name, onClose, onComment, articleId }) => {
	// 输入框内容
	const [value, setValue] = useState("");

	// 输入框引用
	const txtRef = useRef(null);

	useEffect(() => {
		// 输入框自动聚焦
		setTimeout(() => {
			txtRef.current.focus();
		}, 600);
	}, []);

	// 发表评论
	const onSendComment = async () => {
		if (!value) return;

		// 调用接口，保存评论
		const res = await http.post("/comments", {
			target: id,
			content: value,
			art_id: articleId, // 回复一个评论时需要此参数
		});
		const { new_obj } = res.data;

		onComment(new_obj);
		onClose();
	};

	return (
		<div className={styles.root}>
			{/* 顶部导航栏 */}
			<NavBar
				onLeftClick={onClose}
				rightContent={
					<span className="publish" onClick={onSendComment}>
						发表
					</span>
				}
			>
				{name ? "回复评论" : "评论文章"}
			</NavBar>

			<div className="input-area">
				{/* 回复别人的评论时显示：@某某 */}
				{name && <div className="at">@{name}:</div>}

				{/* 评论内容输入框 */}
				<textarea
					ref={txtRef}
					placeholder="说点什么~"
					rows="10"
					value={value}
					onChange={(e) => setValue(e.target.value.trim())}
				/>
			</div>
		</div>
	);
};

export default CommentInput;
