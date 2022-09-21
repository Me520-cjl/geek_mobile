import styles from "./index.module.scss";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "@/utils/http";
import ArticleItem from "@/components/ArticleItem";
import { useDispatch } from "react-redux";
import { setFeedbackAction } from "@/store/actions/home";

/**
 * 文章列表组件
 * @param {String} props.channelId 当前文章列表所对应的频道ID
 * @param {String} props.aid 当前 Tab 栏选中的频道ID
 */
const ArticleList = ({ channelId, aid }) => {
	// 存放文章列表数据
	const [articles, setArticles] = useState({
		items: [],
		preTimestamp: Date.now(),
	});

	// 请求文章列表的函数（使用 useCallback 进行缓存）
	const loadArticleListData = useCallback(async (channelId, timestamp) => {
		const res = await http.get("/articles", {
			params: {
				channel_id: channelId,
				timestamp: timestamp,
			},
		});
		return res.data;
	}, []);

	useEffect(() => {
		// 加载最初的文章数据
		const loadInitialData = async () => {
			const { results, pre_timestamp } = await loadArticleListData(
				channelId,
				Date.now()
			);
			setArticles({
				items: results,
				preTimestamp: pre_timestamp,
			});
		};
		// 注意：仅当该频道被第一次选中时，才发送请求获取数据
		if (channelId === aid && articles.items.length === 0) {
			loadInitialData();
		}
	}, [channelId, aid, articles.items.length, loadArticleListData]);

	const dispatch = useDispatch();
	const onArticleItemFeedback = (articleId) => {
		dispatch(
			setFeedbackAction({
				articleId,
				visible: true,
			})
		);
	};

	// 跳转到文章详情页面
	const history = useNavigate();
	const gotoAritcleDetail = (articleId) => {
		history(`/article/${articleId}`);
	};

	return (
		<div className={styles.root}>
			<div className="articles">
				{articles.items.map((article) => {
					return (
						<div
							className="article-item"
							key={article.art_id}
							onClick={() => gotoAritcleDetail(article.art_id)}
						>
							<ArticleItem
								articleId={article.art_id}
								coverType={article.cover.type}
								coverImages={article.cover.images}
								title={article.title}
								authorName={article.aut_name}
								commentCount={article.comm_count}
								publishDate={article.pubdate}
								onClose={onArticleItemFeedback}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ArticleList;
