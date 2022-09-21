import Icon from "@/components/Icon";
import NavBar from "@/components/NavBar";
import { ContentLoader } from "react-content-loader";
//import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import classnames from "classnames";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import { throttle } from "throttle-debounce";
import NoComment from "@/components/NoneComment";
import CommentItem from "./components/CommentItem";
import { useReachBottom } from "@/hooks/use-reach-bottom";
import {
	getArticleComments,
	getArticleInfo,
	getMoreArticleComments,
	setArticleComments,
	setArticleInfo,
	setCommentLiking,
	setArticleLiking,
	setAritcleCollection,
	setAuthorFollow,
} from "@/store/actions/article";
import CommentFooter from "./components/CommentFooter";
import { Drawer } from "antd";
import CommentInput from "./components/CommentInput";
import CommentReply from "./components/Reply";
import Share from "./components/Share";
import Sticky from "@/components/Sticky";

const Article = () => {
	const history = useNavigate();
	// 获取动态路由参数
	const params = useParams();
	const articleId = params.id;
	const dispatch = useDispatch();

	// 进入页面时，请求文章详情数据
	useEffect(() => {
		dispatch(getArticleInfo(articleId));
	}, [dispatch, articleId]);

	const { isLoading, info } = useSelector((state) => state.article);

	useEffect(() => {
		if (isLoading) return;

		// 配置 highlight.js
		hljs.configure({
			// 忽略未经转义的 HTML 字符
			ignoreUnescapedHTML: true,
		});

		// 获取到渲染正文的容器元素
		const dgHtml = document.querySelector(".dg-html");

		// 查找容器元素下符合 pre code 选择器规则的子元素，进行高亮
		const codes = dgHtml.querySelectorAll("pre code");
		if (codes.length > 0) {
			return codes.forEach((el) => hljs.highlightElement(el));
		}

		// 查找容器元素下的 pre 元素，进行高亮
		const pre = dgHtml.querySelectorAll("pre");
		if (pre.length > 0) {
			return pre.forEach((el) => hljs.highlightElement(el));
		}
	}, [isLoading]);

	const [isShowNavAuthor, setShowNavAuthor] = useState(false);
	const wrapperRef = useRef();
	const authorRef = useRef();

	// 监听滚动，控制 NavBar 中作者信息的显示或隐藏
	useEffect(() => {
		if (isShowNavAuthor) return;

		const wrapperEl = wrapperRef.current;
		const authorEl = authorRef.current;

		// 滚动监听函数
		const onScroll = throttle(200, () => {
			// 获取 .author 元素的位置信息
			const rect = authorEl.getBoundingClientRect();
			//console.log(rect.top);

			// 如果 .author 元素的顶部移出屏幕外，则显示顶部导航栏上的作者信息
			if (rect.top <= 0) {
				setShowNavAuthor(true);
			}
			// 否则隐藏导航栏上的作者信息
			else {
				setShowNavAuthor(false);
			}
		});

		// 注册 .wrapper 元素的 scroll 事件
		window.addEventListener("scroll", onScroll);
		return () => {
			// 注销 .wrapper 元素的 scroll 事件
			wrapperEl.removeEventListener("scroll", onScroll);
		};
	}, [isShowNavAuthor]);

	// 进入页面时
	useEffect(() => {
		// 请求文章详情数据
		dispatch(getArticleInfo(articleId));

		// 请求评论列表数据
		dispatch(
			getArticleComments({
				type: "a",
				source: articleId,
			})
		);
	}, [dispatch, articleId]);

	const { isLoadingComment, comment } = useSelector((state) => state.article);
	const comments = comment.results;

	const placeholderRef = useRef();
	// 调用自定义 Hook 实现评论列表的触底监听
	const { finished } = useReachBottom(
		() => {
			dispatch(
				getMoreArticleComments({
					type: "a",
					source: articleId,
					offset: comment.last_id,
				})
			);
		},
		{
			container: wrapperRef.current,
			placeholder: placeholderRef.current,
			stop: isLoading || comments.length === 0 || isLoadingComment,
			isFinished: () => comment.end_id === comment.last_id,
		}
	);

	// 评论抽屉状态
	const [commentDrawerStatus, setCommentDrawerStatus] = useState({
		visible: false,
		id: 0,
	});

	// 关闭评论抽屉表单
	const onCloseComment = () => {
		setCommentDrawerStatus({
			visible: false,
			id: 0,
		});
	};

	// 发表评论后，插入到数据中
	const onAddComment = (comment) => {
		// 将新评论添加到列表中
		dispatch(
			setArticleComments({
				results: [comment, ...comments],
			})
		);

		// 将文章详情中的评论数 +1
		dispatch(
			setArticleInfo({
				comm_count: info.comm_count + 1,
			})
		);
	};

	// 点击评论工具栏“输入框”，打开评论抽屉表单
	const onComment = () => {
		setCommentDrawerStatus({
			visible: true,
			id: info.art_id,
		});
	};

	const [replyDrawerStatus, setReplyDrawerStatus] = useState(false);

	// 关闭回复评论抽屉
	const onCloseReply = () => {
		setReplyDrawerStatus({
			visible: false,
			data: {},
		});
	};

	// 点击评论中的 “回复” 按钮，打开回复抽屉
	const onOpenReply = (data) => {
		setReplyDrawerStatus({
			visible: true,
			data,
		});
	};

	//为文章评论容器元素添加ref引用
	const commentRef = useRef();

	// 点击工具栏评论按钮，滚动到评论区位置
	const onShowComment = () => {
		console.log(wrapperRef.current.getBoundingClientRect().bottom);
		console.log(commentRef.current.getBoundingClientRect().top);
		wrapperRef.current.scrollBottom = 500;
	};

	// 对某条评论点赞
	const onThumbsUp = (commentId, isLiking) => {
		// 取反
		const newIsLiking = !isLiking;

		// 调用 Action
		dispatch(setCommentLiking(commentId, newIsLiking));
	};

	// 点击工具栏点赞按钮
	const onLike = () => {
		// 在 “点赞” 和 “不点赞” 之间取反
		const newAttitude = info.attitude === 0 ? 1 : 0;

		// 调用 Action
		dispatch(setArticleLiking(info.art_id, newAttitude));
	};

	// 收藏文章
	const onCollected = () => {
		// 取反
		const newIsCollect = !info.is_collected;

		// 调用 Action
		dispatch(setAritcleCollection(info.art_id, newIsCollect));
	};

	// 关注作者
	const onFollow = async () => {
		// 取反
		const isFollow = !info.is_followed;

		// 调用 Action
		dispatch(setAuthorFollow(info.aut_id, isFollow));
	};

	// 分享抽屉状态
	const [shareDrawerStatus, setShareDrawerStatus] = useState({
		visible: false,
	});

	// 打开分享抽屉
	const onOpenShare = () => {
		setShareDrawerStatus({
			visible: true,
		});
	};

	// 关闭分享抽屉
	const onCloseShare = () => {
		setShareDrawerStatus({
			visible: false,
		});
	};

	return (
		<div className={styles.root}>
			<div className="root-wrapper">
				{/* 顶部导航栏 */}
				<NavBar
					className="navbar"
					onLeftClick={() => history(-1)}
					rightContent={
						<span onClick={onOpenShare}>
							<Icon type="icongengduo" />
						</span>
					}
				>
					{isShowNavAuthor && (
						<div className="nav-author">
							<img src={info.aut_photo} alt="" />
							<span className="name">{info.aut_name}</span>
							<span
								className={classnames(
									"follow",
									info.is_followed ? "followed" : ""
								)}
								onClick={onFollow}
							>
								{info.is_followed ? "已关注" : "关注"}
							</span>
						</div>
					)}
				</NavBar>

				{false ? (
					// 数据正在加载时显示的骨架屏界面
					<ContentLoader
						speed={2}
						width={375}
						height={230}
						viewBox="0 0 375 230"
						backgroundColor="#f3f3f3"
						foregroundColor="#ecebeb"
					>
						{/* https://skeletonreact.com/ */}
						<rect
							x="16"
							y="8"
							rx="3"
							ry="3"
							width="340"
							height="10"
						/>
						<rect
							x="16"
							y="26"
							rx="0"
							ry="0"
							width="70"
							height="6"
						/>
						<rect
							x="96"
							y="26"
							rx="0"
							ry="0"
							width="50"
							height="6"
						/>
						<rect
							x="156"
							y="26"
							rx="0"
							ry="0"
							width="50"
							height="6"
						/>
						<circle cx="33" cy="69" r="17" />
						<rect
							x="60"
							y="65"
							rx="0"
							ry="0"
							width="45"
							height="6"
						/>
						<rect
							x="304"
							y="65"
							rx="0"
							ry="0"
							width="52"
							height="6"
						/>
						<rect
							x="16"
							y="114"
							rx="0"
							ry="0"
							width="340"
							height="15"
						/>
						<rect
							x="263"
							y="208"
							rx="0"
							ry="0"
							width="94"
							height="19"
						/>
						<rect
							x="16"
							y="141"
							rx="0"
							ry="0"
							width="340"
							height="15"
						/>
						<rect
							x="16"
							y="166"
							rx="0"
							ry="0"
							width="340"
							height="15"
						/>
					</ContentLoader>
				) : (
					// 数据加载完成后显示的实际界面
					<>
						<div className="wrapper" ref={wrapperRef}>
							<div className="article-wrapper">
								{/* 文章描述信息栏 */}
								<div className="header">
									<h1 className="title">{info.title}</h1>

									<div className="info">
										<span>
											{dayjs(info.pubdate).format(
												"YYYY-MM-DD"
											)}
										</span>
										<span>{info.read_count} 阅读</span>
										<span>{info.comm_count} 评论</span>
									</div>

									<div className="author" ref={authorRef}>
										<img src={info.aut_photo} alt="" />
										<span className="name">
											{info.aut_name}
										</span>
										<span
											className={classnames(
												"follow",
												info.is_followed
													? "followed"
													: ""
											)}
											onClick={onFollow}
										>
											{info.is_followed
												? "已关注"
												: "关注"}
										</span>
									</div>
								</div>

								{/* 文章正文内容区域 */}
								<div className="content">
									<div
										className="content-html dg-html"
										dangerouslySetInnerHTML={{
											__html: DOMPurify.sanitize(
												info.content || ""
											),
										}}
									></div>
									<div className="date">
										发布文章时间：
										{dayjs(info.pubdate).format(
											"YYYY-MM-DD"
										)}
									</div>
									{/* 文章评论区 */}
									<div className="comment" ref={commentRef}>
										{/* 评论总览信息 */}
										<Sticky
											root={wrapperRef.current}
											height={51}
											offset={46}
										>
											<div className="comment-header">
												<span>
													全部评论（{info.comm_count}
													）
												</span>
												<span>
													{info.like_count} 点赞
												</span>
											</div>
										</Sticky>

										{info.comm_count === 0 ? (
											// 没有评论时显示的界面
											<NoComment />
										) : (
											// 有评论时显示的评论列表
											<div className="comment-list">
												{comments?.map((item) => {
													return (
														<CommentItem
															key={item.com_id}
															commentId={
																item.com_id
															}
															authorPhoto={
																item.aut_photo
															}
															authorName={
																item.aut_name
															}
															likeCount={
																item.like_count
															}
															isFollowed={
																item.is_followed
															}
															isLiking={
																item.is_liking
															}
															content={
																item.content
															}
															replyCount={
																item.reply_count
															}
															publishDate={
																item.pubdate
															}
															onThumbsUp={() =>
																onThumbsUp(
																	item.com_id,
																	item.is_liking
																)
															}
															onOpenReply={() =>
																onOpenReply(
																	item
																)
															}
														/>
													);
												})}

												{/* 评论正在加载时显示的信息 */}
												{isLoadingComment && (
													<div className="list-loading">
														加载中...
													</div>
												)}

												{finished && (
													<div className="no-more">
														没有更多了
													</div>
												)}
												<div
													className="placeholder"
													ref={placeholderRef}
												></div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
						{/* 评论工具栏 */}
						<div className="footer">
							{" "}
							<CommentFooter
								commentCount={info.comm_count}
								attitude={info.attitude}
								isCollected={info.is_collected}
								placeholder={
									info.comm_count === 0 ? "抢沙发" : "去评论"
								}
								onComment={onComment}
								onShowComment={onShowComment}
								onLike={onLike}
								onCollected={onCollected}
								onShare={onOpenShare}
							/>
						</div>
					</>
				)}
			</div>

			{/* 全屏表单抽屉 */}
			{/* 评论抽屉 */}
			<Drawer
				placement="left"
				width="100%"
				style={{
					minHeight: document.documentElement.clientHeight,
				}}
				closable={false}
				open={commentDrawerStatus.visible}
				bodyStyle={{ padding: 0 }}
			>
				<div className="drawer-sidebar-wrapper">
					{commentDrawerStatus.visible && (
						<CommentInput
							id={commentDrawerStatus.id}
							onClose={onCloseComment}
							onComment={onAddComment}
						/>
					)}
				</div>
			</Drawer>

			{/* 回复抽屉 */}
			<Drawer
				className="drawer-right"
				placement="right"
				style={{ minHeight: document.documentElement.clientHeight }}
				children={""}
				open={replyDrawerStatus.visible}
				onOpenChange={onCloseReply}
				closable={false}
			>
				<div className="drawer-sidebar-wrapper">
					{replyDrawerStatus.visible && (
						<CommentReply
							originComment={replyDrawerStatus.data}
							articleId={info.art_id}
							onClose={onCloseReply}
						/>
					)}
				</div>
			</Drawer>

			{/* 分享抽屉 */}
			<Drawer
				className="drawer-share"
				placement="bottom"
				style={{ minHeight: document.documentElement.clientHeight }}
				children={""}
				open={shareDrawerStatus.visible}
				onOpenChange={onCloseShare}
				closable={false}
			>
				{" "}
				<Share onClose={onCloseShare} />
			</Drawer>
		</div>
	);
};

export default Article;
