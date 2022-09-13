import React from "react";
import Icon from "@/components/Icon";
import styles from "./index.module.scss";

// useHistory  useLocation  useParams
function NavBar({ title, rightContent, onLeftClick }) {
	return (
		<div className={styles.root}>
			{/* 后退按钮 */}
			<div className="left">
				<Icon type="iconfanhui" onClick={onLeftClick} />
			</div>
			{/* 居中标题 */}
			<div className="title">{title}</div>

			{/* 右侧内容 */}
			<div className="right">{rightContent}</div>
		</div>
	);
}

export default NavBar;
