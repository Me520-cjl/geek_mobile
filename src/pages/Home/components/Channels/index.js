import Icon from "@/components/Icon";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getRecommendChannels,
	addChannel,
	removeChannel,
} from "@/store/actions/home";
import classnames from "classnames";

/**
 * 频道管理组件
 * @param {Number} props.tabActiveIndex 用户选中的频道的索引
 * @param {Function} props.onClose 关闭频道管理抽屉时的回调函数
 * @param {Function} props.onChannelClick 当点击频道列表中的某个频道时的会带哦函数
 */
const Channels = ({ tabActiveIndex, onClose, onChannelClick }) => {
	const dispatch = useDispatch();
	// 频道数据
	const userChannels = useSelector((state) => state.home.userChannels);
	useEffect(() => {
		dispatch(getRecommendChannels());
	}, [dispatch, userChannels]);

	// 推荐频道数据
	const recommendChannels = useSelector(
		(state) => state.home.recommendChannels
	);

	// 控制普通/编辑模式的状态
	const [editable, setEditable] = useState(false);

	const onAddChannel = (channel) => {
		// 调用 Action 来添加频道
		dispatch(addChannel(channel));
	};

	const onDeleteChannel = async (channel) => {
		// 调用 Action 来删除频道
		dispatch(removeChannel(channel));
	};

	// 点击切换频道
	const onChannelItemClick = (index) => {
		// 恢复成非编辑模式
		setEditable(false);

		// 调用关闭抽屉的回调函数
		onClose();

		// 调用点击频道的回调函数
		onChannelClick(index);
	};

	return (
		<div className={styles.root}>
			{/* 顶部栏：带关闭按钮 */}
			<div className="channel-header">
				<Icon type="iconbtn_channel_close" onClick={onClose} />
			</div>

			{/* 频道列表 */}
			<div className="channel-content">
				{/* 当前已选择的频道列表 */}
				<div
					className={classnames(
						"channel-item",
						editable ? "edit" : ""
					)}
				>
					<div className="channel-item-header">
						<span className="channel-item-title">我的频道</span>
						<span className="channel-item-title-extra">
							{editable ? "点击删除频道" : "点击进入频道"}
						</span>
						<span
							className="channel-item-edit"
							onClick={() => setEditable(!editable)}
						>
							{editable ? "保存" : "编辑"}
						</span>
					</div>

					<div className="channel-list">
						{userChannels.map((item, index) => (
							<span
								key={item.id}
								className={classnames(
									"channel-list-item",
									index === tabActiveIndex ? "selected" : ""
								)}
								onClick={() => onChannelItemClick(index)}
							>
								{item.name}
								<Icon
									type="iconbtn_tag_close"
									onClick={() => onDeleteChannel(item)}
								/>
							</span>
						))}
					</div>
				</div>

				{/* 推荐的频道列表 */}
				<div className="channel-item">
					<div className="channel-item-header">
						<span className="channel-item-title">频道推荐</span>
						<span className="channel-item-title-extra">
							点击添加频道
						</span>
					</div>
					<div className="channel-list">
						{recommendChannels.map((item) => (
							<span
								key={item.id}
								className="channel-list-item"
								onClick={() => onAddChannel(item)}
							>
								+ {item.name}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Channels;
