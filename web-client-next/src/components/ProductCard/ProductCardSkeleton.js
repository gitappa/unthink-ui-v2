import React from "react";
import { Skeleton } from "antd";

const ProductCardSkeleton = ({ size = "medium" }) => {
	return (
		<Skeleton.Input
			active
			className={
				size === "small"
					? "!h-[120px] !w-40 rounded-xl [&_.ant-skeleton-input]:!h-[120px] [&_.ant-skeleton-input]:!w-40 [&_.ant-skeleton-input]:!rounded-xl lg:!w-[180px] lg:[&_.ant-skeleton-input]:!w-[180px]"
					: "!h-[120px] !w-40 rounded-xl [&_.ant-skeleton-input]:!h-[120px] [&_.ant-skeleton-input]:!w-40 [&_.ant-skeleton-input]:!rounded-xl sm:!w-[180px] sm:[&_.ant-skeleton-input]:!w-[180px] lg:!w-80 lg:[&_.ant-skeleton-input]:!w-80"
			}
		/>
	);
};

export default ProductCardSkeleton;
