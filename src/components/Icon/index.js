import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// ``
function Icon({ type, className, ...rest }) {
	return (
		<svg
			{...rest}
			className={classNames("icon", className)}
			aria-hidden="true"
		>
			<use xlinkHref={`#${type}`}></use>
		</svg>
	);
}
Icon.propTypes = {
	type: PropTypes.string.isRequired,
};

export default Icon;
