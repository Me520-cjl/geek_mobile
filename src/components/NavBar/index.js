import classnames from "classnames";
import styles from "./index.module.scss";

const NavBar = ({ children, className, rightContent, onLeftClick }) => {
	return (
		<div className={classnames(styles.root, className)}>
			<div className="left" onClick={onLeftClick}>
				<svg className="icon" aria-hidden="true">
					<use xlinkHref="#iconfanhui"></use>
				</svg>
			</div>
			<div className="title">{children}</div>
			<div className="right">{rightContent}</div>
		</div>
	);
};

export default NavBar;
