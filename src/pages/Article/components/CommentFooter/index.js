import Icon from "@/components/Icon";
import styles from "./index.module.scss";

/**
 * 评论工具栏组件
 * @param {Number} props.commentCount 评论数
 * @param {Number} props.attitude 点赞状态：1-已点赞 | 其他-未点赞
 * @param {Number} props.isCollected 评论数
 * @param {String} props.placeholder 输入框中的占位提示信息
 * @param {Function} props.onComment 点击输入框的回调函数
 * @param {Function} props.onShowComment 点击”评论”按钮的回调函数
 * @param {Function} props.onLike 点击“点赞”按钮的回调函数
 * @param {Function} props.onCollected 点击”收藏”按钮的回调函数
 * @param {Function} props.onShare 点击”分享”按钮的回调函数
 * @param {String} props.type  评论类型：normal 普通评论 | reply 回复评论
 */
const CommentFooter = ({
	commentCount,
	attitude,
	isCollected,
	placeholder,
	onComment,
	onShowComment,
	onLike,
	onCollected,
	onShare,
	type = "normal",
}) => {
	return (
		<div className={styles.root}>
			{/* 输入框（是个假的输入框，其实就是个按钮） */}
			<div className="input-btn" onClick={onComment}>
				<Icon type="iconbianji" />
				<span>{placeholder}</span>
			</div>

			{type === "normal" && (
				<>
					{/* 评论按钮 */}
					<div className="action-item" onClick={onShowComment}>
						<Icon type="iconbtn_comment" />
						<p>评论</p>
						{commentCount !== 0 && (
							<span className="bage">{commentCount}</span>
						)}
					</div>

					{/* 点赞按钮 */}
					<div className="action-item" onClick={onLike}>
						<Icon
							type={
								attitude === 1
									? "iconbtn_like_sel"
									: "iconbtn_like2"
							}
						/>
						<p>点赞</p>
					</div>
				</>
			)}

			{/* 收藏按钮 */}
			<div className="action-item" onClick={onCollected}>
				<Icon
					type={
						isCollected ? "iconbtn_collect_sel" : "iconbtn_collect"
					}
				/>
				<p>收藏</p>
			</div>

			{/* 分享按钮 */}
			<div className="action-item" onClick={onShare}>
				<Icon type="iconbtn_share" />
				<p>分享</p>
			</div>
		</div>
	);
};

export default CommentFooter;
