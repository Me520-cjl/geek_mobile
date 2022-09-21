import Icon from "@/components/Icon";
import classnames from "classnames";
import dayjs from "dayjs";
import styles from "./index.module.scss";

/**
 * 评论项组件
 * @param {String} props.commentId 评论ID
 * @param {String} props.authorPhoto 评论者头像
 * @param {String} props.authorName 评论者名字
 * @param {Number} props.likeCount 喜欢数量
 * @param {Boolean} props.isFollowed 是否已关注该作者
 * @param {Boolean} props.isLiking 是否已点赞该评论
 * @param {String} props.content 评论内容
 * @param {Number} props.replyCount 回复数
 * @param {String} props.publishDate 发布日期
 * @param {Function} props.onThumbsUp 点赞后的回调函数
 * @param {Function} props.onOpenReply 点击“回复”按钮后的回调函数
 * @param {String} props.type normal 普通 | origin 回复评论的原始评论 | reply 回复评论
 */
const CommentItem = ({
	commentId,
	authorPhoto,
	authorName,
	likeCount,
	isFollowed,
	isLiking,
	content,
	replyCount,
	publishDate,
	onThumbsUp,
	onOpenReply = () => {},
	type = "normal",
}) => {
	return (
		<div className={styles.root}>
			{/* 评论者头像 */}
			<div className="avatar">
				<img src={authorPhoto} alt="" />
			</div>

			<div className="comment-info">
				{/* 评论者名字 */}
				<div className="comment-info-header">
					<span className="name">{authorName}</span>

					{/* 关注或点赞按钮 */}
					{type === "normal" ? (
						<span className="thumbs-up" onClick={onThumbsUp}>
							{likeCount}{" "}
							<Icon
								type={
									isLiking
										? "iconbtn_like_sel"
										: "iconbtn_like2"
								}
							/>
						</span>
					) : (
						<span
							className={classnames(
								"follow",
								isFollowed ? "followed" : ""
							)}
						>
							{isFollowed ? "已关注" : "关注"}
						</span>
					)}
				</div>

				{/* 评论内容 */}
				<div className="comment-content">{content}</div>

				<div className="comment-footer">
					{/* 回复按钮 */}
					{type === "normal" && (
						<span
							className="replay"
							onClick={() => onOpenReply(commentId)}
						>
							{replyCount === 0 ? "" : replyCount}回复{" "}
							<Icon type="iconbtn_right" />
						</span>
					)}

					{/* 评论日期 */}
					<span className="comment-time">
						{dayjs().from(publishDate)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default CommentItem;
