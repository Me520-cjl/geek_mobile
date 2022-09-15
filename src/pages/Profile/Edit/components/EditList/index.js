import styles from "./index.module.scss";

/**
 * 个人信息项修改列表
 * @param {Object} config 配置信息对象
 * @param {Function} onSelect 选择列表项的回调函数
 * @param {Function} onClose 取消按钮的回调函数
 */
const EditList = ({ config = {}, onSelect, onClose }) => {
	return (
		<div className={styles.root}>
			{/* 列表项 */}
			{config.items?.map((item, index) => (
				<div
					className="list-item"
					key={index}
					onClick={() => onSelect(config.name, item, index)}
				>
					{item.title}
				</div>
			))}

			{/* 取消按钮 */}
			<div className="list-item" onClick={onClose}>
				取消
			</div>
		</div>
	);
};

export default EditList;
