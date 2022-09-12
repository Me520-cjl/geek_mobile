import React from "react";
import styles from "./index.module.scss";
export default function Input({ extra, onExtraClick, ...rest }) {
	return (
		<div className={styles.root}>
			<input className="input" {...rest} />
			{extra && (
				<div className="extra" onClick={onExtraClick}>
					{extra}
				</div>
			)}
		</div>
	);
}
