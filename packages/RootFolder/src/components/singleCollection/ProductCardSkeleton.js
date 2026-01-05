import React from "react";
import { Skeleton } from "antd";

const ProductCardSkeleton = ({ size = "medium" }) => {
	return (
		<Skeleton.Input
			active
			className={`rounded-t-xl rounded-b-xl ${
				size === "small"
					? "w-40 lg:w-180 h-180"
					: "w-40 sm:w-180 lg:w-80 h-180 lg:h-340"
			}`}
		/>
	);
};

export default ProductCardSkeleton;
