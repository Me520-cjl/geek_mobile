import Icon from "@/components/Icon";
import classnames from "classnames";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./index.module.scss";
import { hasToken } from "@/utils/storage";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

/**
 * 文章列表项组件
 * @param {String} articleId 文章ID
 * @param {Number} coverType 封面类型：0-无图|1-单图|3-三图
 * @param {Array} coverImages 封面图片
 * @param {String} title 标题
 * @param {String} authorName 作者
 * @param {Number} commentCount 回复数
 * @param {String} publishDate 发布日期
 */
const ArticleItem = ({
	articleId,
	coverType,
	coverImages,
	title,
	authorName,
	commentCount,
	publishDate,
	onClose,
}) => {
	return (
		<div className={styles.root}>
			<div
				className={classnames(
					"article-content",
					coverType === 0 ? "none-mt" : "",
					coverType === 3 ? "t3" : ""
				)}
			>
				{/* 标题 */}
				<h3>{title}</h3>

				{/* 封面图 */}
				{coverType !== 0 && (
					<div className="article-imgs">
						{coverImages.map((image, i) => {
							return (
								<div className="article-img-wrapper" key={i}>
									<img src={image} alt="" />
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* 底部信息栏 */}
			<div
				className={classnames(
					"article-info",
					coverType === 0 ? "none-mt" : ""
				)}
			>
				<span>{authorName}</span>
				<span>{commentCount} 评论</span>
				<span>{dayjs().from(publishDate)}</span>
				{/* 只有登录用户可以举报反馈 */}
				{hasToken() && (
					<span
						className="close"
						onClick={(e) => {
							// 防止事件穿透
							e.stopPropagation();
							// 调用传入的回调函数，并将当前文章ID作为参数传出
							onClose(articleId);
						}}
					>
						<Icon type="iconbtn_essay_close" />
					</span>
				)}
			</div>
		</div>
	);
};

export default ArticleItem;
