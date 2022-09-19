import Icon from "@/components/Icon";
import NavBar from "@/components/NavBar";
import classnames from "classnames";
import { useNavigate } from "react-router";
import styles from "./index.module.scss";
import { useRef, useEffect, useState } from "react";
import { getSuggestions, clearSuggestions } from "@/store/actions/search";
import { useDispatch, useSelector } from "react-redux";

const Search = () => {
	const history = useNavigate();
	// 搜索关键字内容
	const [keyword, setKeyword] = useState("");

	// 存储防抖定时器
	const timerRef = useRef(-1);
	const dispatch = useDispatch();

	// 代表是否正处于搜索操作中
	const [isSearching, setIsSearching] = useState(false);

	const onKeywordChange = (e) => {
		const text = e.target.value.trim();
		setKeyword(text);

		// 清除之前的定时器
		clearTimeout(timerRef.current);

		// 新建任务定时器
		timerRef.current = setTimeout(() => {
			console.log(text);
			// 仅当输入的关键字不为空时，执行搜索
			if (text) {
				setIsSearching(true);
				dispatch(getSuggestions(text));
			} else {
				setIsSearching(false);
			}
		}, 500);
	};

	// 销毁组件时记得最好要清理定时器
	useEffect(() => {
		return () => {
			clearTimeout(timerRef.current);
		};
	}, []);

	const suggestions = useSelector((state) => state.search.suggestions);

	// 清空
	const onClear = () => {
		// 清空输入框内容
		setKeyword("");

		// 设置为非搜索状态
		setIsSearching(false);

		// 清空Redux中的搜索建议数据
		dispatch(clearSuggestions());
	};

	const histories = useSelector((state) => state.search.histories);

	// 跳转到搜索详情页
	const gotoSearchDetail = (text) => {
		if (text) {
			history(`/search/result?q=${text}`);
		}
	};

	return (
		<div className={styles.root}>
			{/* 顶部导航栏 */}
			<NavBar
				className="navbar"
				onLeftClick={() => history(-1)}
				rightContent={
					<span
						className="search-text"
						onClick={() => gotoSearchDetail(keyword)}
					>
						搜索
					</span>
				}
			>
				<div className="navbar-search">
					<Icon type="iconbtn_search" className="icon-search" />

					<div className="input-wrapper">
						{/* 输入框 */}
						<input
							type="text"
							placeholder="请输入关键字搜索"
							value={keyword}
							onChange={onKeywordChange}
						/>
						{/* 清空输入框按钮，且在输入内容时才显示 */}
						{keyword && (
							<Icon
								type="iconbtn_tag_close"
								className="icon-close"
								onClick={onClear}
							/>
						)}
					</div>
				</div>
			</NavBar>

			{/* 搜索历史 */}
			<div
				className="history"
				style={{ display: isSearching ? "none" : "block" }}
			>
				<div className="history-header">
					<span>搜索历史</span>
					<span>
						<Icon type="iconbtn_del" />
						清除全部
					</span>
				</div>

				<div className="history-list">
					{histories.map((item, index) => {
						return (
							<span className="history-item" key={index}>
								{item}
								<span className="divider"></span>
							</span>
						);
					})}
				</div>
			</div>

			{/* 搜素建议结果列表 */}
			<div
				className={classnames(
					"search-result",
					isSearching ? "show" : false
				)}
			>
				{suggestions.map((item, index) => {
					return (
						<div
							className="result-item"
							key={index}
							onClick={() =>
								gotoSearchDetail(item.keyword + item.rest)
							}
						>
							<Icon
								className="icon-search"
								type="iconbtn_search"
							/>
							<div className="result-value">
								<span>{item.keyword}</span> {item.rest}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Search;
