// NOT USING
import React, { useEffect, useMemo, useState } from "react";
import { Skeleton, Typography, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "./ProductCard";
import { collectionAPIs } from "../../helper/serverAPIs";
import { handleRecProductClick } from "../../pageComponents/recommendations/redux/actions";
import { getIsRootPage, getIsSharedPage } from "../../helper/utils";
import { useNavigate } from "../../helper/useNavigate";
import { favorites_collection_name } from "../../constants/codes";
import styles from "./SingleCollection.module.css";

const { Text } = Typography;

const SingleCollection = ({
	collection,
	showLoading = false,
	enableClickTracking = false,
	user_name,
	user_id,
	isSingleCollectionSharedPage,
}) => {
	const navigate = useNavigate();
	const [productsData, setProductsData] = useState([]);
	const [showMore, setShowMore] = useState(false);
	const dispatch = useDispatch();
	const [sharedUser, authUser] = useSelector((state) => [
		state?.influencer?.user?.data || {},
		state?.auth?.user?.data || {},
	]);

	const shareCollectionUrl = useMemo(
		() => "",
		// generateShareCollectionPath(
		// 	user_id ||
		// 		(getIsSharedPage() ? sharedUser?.user_id : authUser?.user_id),
		// 	user_name ||
		// 		(getIsSharedPage() ? sharedUser?.user_name : authUser?.user_name),
		// 	collection?.collection_id
		// )
		[user_name, user_id, sharedUser, authUser]
	);

	useEffect(() => {
		const mfrcode_list = collection?.product_list?.map((data) => data.mfr_code);
		try {
			(async () => {
				if (mfrcode_list.length) {
					const response = await collectionAPIs.fetchCollectionProductsAPICall({
						mfrcode_list,
					});
					if (response?.data?.status_code === 200 && response?.data?.data) {
						setProductsData(response?.data?.data);
					}
				}
			})();
		} catch (error) {
			console.log("collection product fetching error:", error);
		}
	}, [collection?.product_list]);

	const onProductClick = () => {
		if (enableClickTracking) dispatch(handleRecProductClick());
	};

	const productsToShow = useMemo(
		() =>
			// showMore
			// 	? productsData
			// 	: collection?.cover_image
			// 	? productsData?.slice(0, 8)
			// 	: productsData?.slice(0, 12),
			showMore ? productsData : productsData?.slice(0, 16),
		[productsData, showMore]
	);

	if (showLoading) {
		return (
			<div className={styles.container}>
				<Skeleton.Input active={true} className={styles.skeletonTitle} />
				<div className={styles.skeletonRow}>
					<div className={styles.skeletonMainImage}>
						<Skeleton.Input
							active={true}
							className={styles.skeletonMainImage}
						/>
					</div>
					<div className={styles.skeletonGrid}>
						<Skeleton.Input
							active={true}
							className={styles.skeletonGridItem}
						/>
						<Skeleton.Input
							active={true}
							className={styles.skeletonGridItem}
						/>
						<Skeleton.Input
							active={true}
							className={styles.skeletonGridItem}
						/>
						<Skeleton.Input
							active={true}
							className={styles.skeletonGridItem}
						/>
					</div>
				</div>
			</div>
		);
	}

	const onTitleClick = () => navigate(shareCollectionUrl);

	return (
		(!(getIsRootPage() && collection?.product_list?.length === 0) && (
			<div className={styles.container}>
				{!isSingleCollectionSharedPage && (
					<div className={styles.headerSection}>
						<div className={styles.headerRow}>
							<h1
								onClick={onTitleClick}
								className={`${styles.collectionTitle} collection_title`}>
								{collection?.name === "favorites" &&
								collection?.type === "system"
									? favorites_collection_name
									: collection?.name}
							</h1>
							{(authUser?.user_name || sharedUser?.user_name) && (
								<Button
									type='primary'
									className={styles.viewAllButton}
									onClick={onTitleClick}>
									View all
								</Button>
							)}
						</div>
						{collection?.description ? (
							<p className={styles.description}>
								{collection.description}
							</p>
						) : null}
					</div>
				)}
				{collection?.product_list?.length ? (
					<div className={styles.productsRow}>
						<div className={styles.productsGrid}>
							{!isSingleCollectionSharedPage && collection?.cover_image && (
								<div className={styles.coverImageWrapper}>
									<img
										onClick={onTitleClick}
										className={styles.coverImage}
										src={collection?.cover_image}
									/>
								</div>
							)}
							{productsToShow.map((product) => (
								<div className={styles.productCardWrapper} key={product.mfr_code}>
									<ProductCard
										product={product}
										onProductClick={onProductClick}
										enableClickTracking={enableClickTracking}
										productClickParam={{
											iCode: sharedUser?.influencer_code,
											cCode: sharedUser?.company_code,
											collectionId: collection?.collection_id,
											product_brand: product.product_brand,
											brand: product.brand,
										}}
									/>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className={styles.noProducts}>
						No products found
					</div>
				)}
				{!showMore &&
					productsData?.length > 16 && (
						<div className={styles.showMoreWrapper}>
							<Button
								type='primary'
								className={styles.showMoreButton}
								ghost
								onClick={() => setShowMore(true)}>
								Show more
							</Button>
						</div>
					)}
			</div>
		)) ||
		null
	);
};

export default SingleCollection;
