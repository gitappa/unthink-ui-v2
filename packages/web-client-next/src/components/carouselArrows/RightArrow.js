import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import styles from "./Arrows.module.css";

const RightArrow = (props) => {
	const { className, onClick } = props;
	return (
		<div
			className={`${className} ${styles.arrowContainer} ${styles.arrowContainerRight} slider-custom-arrow`}
			onClick={onClick}>
			<span className={styles.arrowIcon}>
				<ArrowRightOutlined />
			</span>
		</div>
	);
};

export default RightArrow;
