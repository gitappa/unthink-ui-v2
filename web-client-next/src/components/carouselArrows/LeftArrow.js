import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./Arrows.module.css";

const LeftArrow = (props) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={`${className} ${styles.arrowContainer} ${styles.arrowContainerLeft} slider-custom-arrow`}
			onClick={onClick}>
			<span className={styles.arrowIcon}>
				<ArrowLeftOutlined />
			</span>
		</div>
	);
};

export default LeftArrow;
