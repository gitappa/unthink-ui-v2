import React from "react";
import { Skeleton } from "antd";
import styles from "./ProductCardSkeleton.module.css";

const ProductCardSkeleton = ({ size = "medium" }) => {
	return (
		<Skeleton.Input
			active
			className={size === "small" ? styles.skeletonSmall : styles.skeletonMedium}
		/>
	);
};

export default ProductCardSkeleton;
