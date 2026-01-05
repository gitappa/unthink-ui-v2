import React from "react";


const Chip = (props) => {
	const chipClassName = props.className;
	const propData = {
		...props,
		className: `bg-gray-400 rounded-full ${chipClassName ?? ""}`,
	};
	return <div {...propData}>{props.children}</div>;
};

export default Chip;
