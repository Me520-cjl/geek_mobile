import classnames from "classnames";
import styles from "./index.module.scss";

const Input = ({
	type = "text",
	value,
	onChange,
	name,
	className,
	placeholder,
	extra,
	onExtraClick,
	...rest
}) => {
	return (
		<div className={classnames(styles.root, className)}>
			<input
				value={value}
				name={name}
				className="input"
				placeholder={placeholder}
				type={type}
				onChange={onChange}
				{...rest}
			/>
			{extra && (
				<span className="extra" onClick={onExtraClick}>
					{extra}
				</span>
			)}
		</div>
	);
};

export default Input;
