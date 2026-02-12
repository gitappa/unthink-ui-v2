import React from "react";
import styles from "./blogCollectionProducts.module.scss";
import { Skeleton, Typography } from "antd";

import ProductCard from "../../../components/singleCollection/ProductCard";
import { IN_PROGRESS } from "../../../constants/codes";
import { useDispatch, useSelector } from "react-redux";

import { getIsInfluencer } from "../../Auth/redux/selector";
import { removeFromWishlist } from "../../wishlistActions/removeFromWishlist/redux/actions";

const { Text } = Typography;

const BlogCollectionProducts = ({
	productList,
	showLoader,
	selectedCollection,
	onSelectProductClick,
	enableSelectProduct,
	selectedProducts = [],
	authUser,
	starProductsFromCollection,
	showStarOnProducts,
}) => {
	const isInfluencer = useSelector(getIsInfluencer);
	const dispatch = useDispatch();

	const removeProductFromCollection = (mfr_code) => {
		const payload = {
			products: [mfr_code],
			_id: selectedCollection._id,
			errorMessage: "Unable to remove product",
			removeFromUserCollections: true,
		};

		dispatch(removeFromWishlist(payload));
	};

	console.log("productList: ", productList);


	return (
		<div>
			<div className={styles.productsGrid}>
				{!showLoader &&
					productList?.map((product) => (
						<ProductCard
							key={product.mfr_code}
							product={product}
							hideViewSimilar
							hideAddToWishlist
							size='small'
							showRemoveIcon={!product.sponsored}
							hideBuyNow={isInfluencer}
							onRemoveIconClick={removeProductFromCollection}
							onStarClick={
								!product.sponsored
									? () =>
										starProductsFromCollection &&
										starProductsFromCollection(
											[product.mfr_code],
											!product.starred
										)
									: undefined
							}
							enableSelect={enableSelectProduct && !product.sponsored}
							isSelected={selectedProducts.includes(product.mfr_code)}
							setSelectValue={() => onSelectProductClick(product.mfr_code)}
							showStar={showStarOnProducts}
							collection_id={selectedCollection._id}
							collection_name={selectedCollection.collection_name}
							collection_path={selectedCollection.path}
							collection_status={selectedCollection.status}
						/>
					))}
				{showLoader && (
					<>
						<Skeleton.Input active className={styles.skeletonItem} />
						<Skeleton.Input active className={styles.skeletonItem} />
						<Skeleton.Input active className={styles.skeletonItem} />
						<Skeleton.Input active className={styles.skeletonItem} />
					</>
				)}
			</div>
			{!productList?.length && !showLoader && (
				<div className={styles.emptyState}>
					<Text className={styles.emptyText}>
						{selectedCollection?.status === IN_PROGRESS
							? "Fetching products..."
							: "No products found"}
					</Text>
				</div>
			)}
		</div>
	);
};

export default BlogCollectionProducts;
