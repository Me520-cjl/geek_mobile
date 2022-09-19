import ArticleItem from "@/components/ArticleItem";
import NavBar from "@/components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { getSearchResults } from "@/store/actions/search";
import { useEffect } from "react";

const SearchResult = () => {
	const history = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	// 获取通过 URL 地址传入的查询字符串参数
	const params = new URLSearchParams(location.search);
	const q = params.get("q");

	useEffect(() => {
		dispatch(getSearchResults(q));
	}, [q, dispatch]);

	const articles = useSelector((state) => state.search.searchResults);

	// 跳转到文章详情页面
	const gotoAritcleDetail = (articleId) => {
		history(`/article/${articleId}`);
	};

	return (
		<div className={styles.root}>
			{/* 顶部导航栏 */}
			<NavBar onLeftClick={() => history(-1)}>搜索结果</NavBar>

			<div className="article-list">
				{articles?.results?.map((article) => {
					return (
						<div
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
								onClose={() => {}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SearchResult;
