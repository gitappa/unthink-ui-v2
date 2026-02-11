import React from "react";
import styles from "./chip.module.css";

const Chip = (props) => {
	const chipClassName = props.className;
	const propData = {
		...props,
		className: `${styles.chip} ${chipClassName ?? ""}`,
	};
	return <div {...propData}>{props.children}</div>;
};

export default Chip;
