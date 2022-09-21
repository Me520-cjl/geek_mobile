import styles from "./index.module.scss";

const Share = ({ onClose }) => {
	return (
		<div className={styles.root}>
			{/* 标题 */}
			<div className="share-header">立即分享给好友</div>

			{/* 第一排菜单 */}
			<div className="share-list">
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-wechat.png"
						alt=""
					/>
					<span>微信</span>
				</div>
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-wechat-moments.png"
						alt=""
					/>
					<span>朋友圈</span>
				</div>
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-weibo.png"
						alt=""
					/>
					<span>微博</span>
				</div>
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-qq.png"
						alt=""
					/>
					<span>QQ</span>
				</div>
			</div>

			{/* 第二排菜单 */}
			<div className="share-list">
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-link.png"
						alt=""
					/>
					<span>复制链接</span>
				</div>
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-poster.png"
						alt=""
					/>
					<span>分享海报</span>
				</div>
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-qrcode.png"
						alt=""
					/>
					<span>二维码</span>
				</div>
				<div className="share-item">
					<img
						src="https://img01.yzcdn.cn/vant/share-sheet-weapp-qrcode.png"
						alt=""
					/>
					<span>小程序码</span>
				</div>
			</div>

			{/* 取消按钮 */}
			<div className="share-cancel" onClick={onClose}>
				取消
			</div>
		</div>
	);
};

export default Share;
