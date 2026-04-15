import React, { useMemo, useState, useEffect } from "react";
import { Skeleton, Button, Spin } from "antd";
import { StarFilled } from "@ant-design/icons";

import useWindowSize from "../../helper/useWindowSize";
import ProductCard, {
	PRODUCT_CARD_WIDGET_TYPES,
} from "../../components/singleCollection/ProductCard";
import {
	IN_PROGRESS,
	TAGS_TITLE,
	TAG_TITLE,
	UPLOAD_PRODUCT_MODE_CSV,
	UPLOAD_PRODUCT_MODE_IMAGES,
} from "../../constants/codes";
import SponsorProductModal from "../sponsorProductModal";
import { filterAvailableProductList, filterProductListBySelectedTags } from "../../helper/utils";
import styles from "./tryForFree.module.scss";

const ReviewCollectionPlist = ({
	status,
	productLists,
	isFetching,
	enableSelectProduct,
	selectedProducts,
	onSelectProductClick,
	onSelectTagProductsClick,
	removeProductsFromCollection,
	removeSponsorProductsFromCollection,
	starProductsFromCollection,
	authUser,
	isFetchProductsInProgress,
	updateWishlistInProgress,
	addTomWishlistInProgress,
	handleConfirmRefetchProducts,
	showFetchMoreButton,
	fetchMoreLoading,
	sponsor_details,
	isTagsSelected,
	handleEditTagsBtnClick,
	isEditTagsOpen = false,
	currentCollection,
	sellerDetails,
	currentSellerBrandDetails,
	selectedTags,
	productCountToShow
}) => {
	const [viewportWidth, setViewportWidth] = useState(0);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const update = () => setViewportWidth(window.innerWidth || 0);
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	const origin = typeof window !== "undefined" ? window.location?.origin : "";

	const [addProductModalOpen, setAddProductModalOpen] = useState({
		isOpen: false,
		isEdit: false,
		isView: false,
		data: {},
	});

	const { width } = useWindowSize();
	const isMobile = width < 768;

	const starredProducts = useMemo(
		() => productLists.filter((p) => !!p.starred),
		[productLists]
	);
	const isStarredProductsExists = useMemo(
		() => !!starredProducts.length || !!sponsor_details?.product_list?.length,
		[starredProducts, sponsor_details]
	);
	const otherProducts = useMemo(
		() => productLists.filter((p) => !p.starred),
		[productLists]
	);
	const isOtherProductsExists = useMemo(
		() => !!otherProducts.length,
		[otherProducts]
	);

	const productCardWidgetType = useMemo(
		() =>
			isMobile
				? PRODUCT_CARD_WIDGET_TYPES.DEFAULT
				: PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER,
		[isMobile]
	);

	const isFetchingProducts = useMemo(
		() =>
			status === IN_PROGRESS ||
			isFetchProductsInProgress ||
			updateWishlistInProgress ||
			addTomWishlistInProgress,
		[
			status,
			isFetchProductsInProgress,
			updateWishlistInProgress,
			addTomWishlistInProgress,
		]
	);

	const onAddProductModalClose = () => {
		setAddProductModalOpen((data) => ({
			...data,
			isOpen: false,
			data: {},
			isEdit: false,
			isView: false,
		}));
	};

	const onSponsorProductClick = (product) => {
		if (!product.url) {
			setAddProductModalOpen((data) => ({
				...data,
				isOpen: true,
				data: product,
				isView: true,
				isEdit: false,
			}));
		}
	};

	const onSponsorProductEditClick = (product) => {
		setAddProductModalOpen((data) => ({
			...data,
			isOpen: true,
			data: product,
			isEdit: true,
			isView: false,
		}));
	};

	const [expandedTags, setExpandedTags] = useState({});

	const sponsorProductList = useMemo(
		() =>
			(currentCollection.sponsor_details?.product_list || []).map((p) => {
				p.sponsored = true;
				return p;
			}),
		[currentCollection.sponsor_details]
	);

	const productsData = useMemo(() => {
		let list = filterAvailableProductList(
			currentCollection.product_lists || []
		);

		if (selectedTags.length) {
			list = filterProductListBySelectedTags(
				list,
				selectedTags,
				currentCollection.tag_map
			);
		}

		list = sponsorProductList.concat(list);

		return list;
	}, [
		currentCollection.product_lists,
		currentCollection.tag_map,
		selectedTags,
		sponsorProductList,
		productCountToShow,
	]);

	const showcasedProductsData = useMemo(
		() =>
			productsData ? productsData.filter((p) => p.starred) : [],
		[productsData]
	);

	const autoProductsData = useMemo(() => {
		return productsData
			? productsData.filter((p) => !p.starred)
			: [];
	}, [productsData]);


	return (
		<div>
			<div className={styles.centeredContainer}>
				{isFetching && !productLists.length ? (
					<div className={styles.skeletonGrid}>
						<Skeleton.Input active className={styles.skeletonInput} />
						<Skeleton.Input active className={styles.skeletonInput} />
						<Skeleton.Input active className={styles.skeletonInput} />
						<Skeleton.Input active className={styles.skeletonInput} />
						<Skeleton.Input
							active
							className={`${styles.skeletonInput} ${styles.hiddenMdBlock}`}
						/>
						<Skeleton.Input
							active
							className={`${styles.skeletonInput} ${styles.hiddenMdBlockLgBlock}`}
						/>
						<Skeleton.Input
							active
							className={`${styles.skeletonInput} ${styles.hiddenLgBlock}`}
						/>
						<Skeleton.Input
							active
							className={`${styles.skeletonInput} ${styles.hiddenLgBlock}`}
						/>
						<Skeleton.Input
							active
							className={`${styles.skeletonInput} ${styles.hiddenLgBlock}`}
						/>
						<Skeleton.Input
							active
							className={`${styles.skeletonInput} ${styles.hiddenLgBlock}`}
						/>
					</div>
				) : (
					<>
						{isStarredProductsExists ? (
							<div className={styles.topPicksContainer}>
								<div className={styles.flexGap2}>
									<p className={styles.titleBold}>Top Picks</p>
									<StarFilled
										height='fit-content'
										role='img'
										className={styles.starIcon}
									/>
								</div>
								<div className={styles.productsGrid}>
									{sponsor_details?.product_list
										? sponsor_details?.product_list.map((product) => (
											<ProductCard
												key={product.mfr_code}
												product={product}
												hideViewSimilar
												hideAddToWishlist
												showRemoveIcon
												size='small'
												onRemoveIconClick={() =>
													removeSponsorProductsFromCollection([product])
												}
												// onStarClick={() =>
												// 	starProductsFromCollection(
												// 		[product.mfr_code],
												// 		!product.starred
												// 	)
												// }
												buyNowTitle=''
												buyNowSubTitle={`view on ${product.brand}`}
												// enableSelect={enableSelectProduct}
												// isSelected={selectedProducts.includes(
												// 	product.mfr_code
												// )}
												// setSelectValue={() =>
												// 	onSelectProductClick(product.mfr_code)
												// }
												// showStar
												widgetType={productCardWidgetType}
												onProductClick={() => onSponsorProductClick(product)}
												showEdit
												onEditClick={() => onSponsorProductEditClick(product)}
												openProductDetails={false}
												collection_id={currentCollection._id}
												collection_name={currentCollection.collection_name}
												collection_path={currentCollection.path}
												collection_status={currentCollection.status}
											/>
										))
										: null}
									{showcasedProductsData.map((product) => (
										<ProductCard
											key={product.mfr_code}
											product={product}
											hideViewSimilar
											hideAddToWishlist
											showRemoveIcon
											size='small'
											onRemoveIconClick={() =>
												removeProductsFromCollection([product.mfr_code])
											}
											onStarClick={() =>
												starProductsFromCollection(
													[product.mfr_code],
													!product.starred
												)
											}
											buyNowTitle=''
											buyNowSubTitle={`${enableSelectProduct ? "From" : "view on"
												} ${product.brand}`}
											enableSelect={enableSelectProduct}
											isSelected={selectedProducts.includes(product.mfr_code)}
											setSelectValue={() =>
												onSelectProductClick(product.mfr_code)
											}
											showStar
											widgetType={productCardWidgetType}
											collection_id={currentCollection._id}
											collection_name={currentCollection.collection_name}
											collection_path={currentCollection.path}
											collection_status={currentCollection.status}
										/>
									))}
								</div>
							</div>
						) : null}


						{isOtherProductsExists ? (
							<div className={styles.moreFromCollectionContainer}>
								{isStarredProductsExists ? (
									<p className={styles.moreFromCollectionTitle}>More from this collection</p>
								) : null}

								{selectedTags.length === 0 ? (
									// Group products by tags
									(() => {
										const groupedProducts = otherProducts.reduce((acc, product) => {
											const tags = product?.tagged_by?.length ? product.tagged_by : ["assorted products"];

											tags.forEach((tag) => {
												if (!acc[tag]) acc[tag] = [];
												acc[tag].push(product);
											});

											return acc;
										}, {});

										return Object.entries(groupedProducts).map(([tag, products]) => {
											const isSelectedTag = selectedTags.includes(tag);
											const isExpanded = expandedTags[tag]; // Check if the current tag is expanded

											// Logic to handle the number of products to show based on screen width
											const visibleProducts = (() => {
												if (!isSelectedTag && selectedTags.length === 0 && !isExpanded) {
													if (viewportWidth >= 1324) {
														return products.slice(0, 5); // For desktop (min-width: 1324px)
													} else if (viewportWidth >= 768) {
														return products.slice(0, 3); // For tablet (min-width: 768px)
													} else {
														return products.slice(0, 2); // For mobile (default)
													}
												}
												return products; // Show all if expanded or tag selected
											})();

											const handleSeeMoreClick = () => {
												// Toggle the expanded state for the tag
												setExpandedTags((prev) => ({
													...prev,
													[tag]: !prev[tag], // This will toggle between true/false
												}));
											};

											return (
												<div key={tag} className={styles.tagGroup}>
													{/* Display the tag heading */}
													<div className={styles.tagHeader}>
														<div className={styles.tagTitleGroup}>
															{
																enableSelectProduct && (
																	<input
																		type="checkbox"
																		checked={products.every((p) => selectedProducts.includes(p.mfr_code))}
																		onChange={() => onSelectTagProductsClick(tag)}
																	/>
																)
															}
															<h3 className={styles.tagTitle}>{tag}</h3>
														</div>
														{/* Show See More button when the number of products exceeds the limit */}
														{products.length > 5 && !isExpanded && (
															<button
																className={styles.seeMoreButton}
																onClick={handleSeeMoreClick}
															>
																See More
															</button>
														)}
														{isExpanded && (
															<button
																className={styles.seeMoreButton}
																onClick={handleSeeMoreClick}
															>
																See Less
															</button>
														)}
													</div>

													{/* Display the products in a grid */}
													<div className={styles.productsGrid}>
														{visibleProducts.map((product) => (
															<ProductCard
																key={product.mfr_code}
																product={product}
																hideViewSimilar
																hideAddToWishlist
																showRemoveIcon
																size="small"
																onRemoveIconClick={() => removeProductsFromCollection([product.mfr_code])}
																onStarClick={() => starProductsFromCollection([product.mfr_code], !product.starred)}
																buyNowTitle=""
																buyNowSubTitle={`${enableSelectProduct ? "From" : "view on"} ${product.brand}`}
																enableSelect={enableSelectProduct}
																isSelected={selectedProducts.includes(product.mfr_code)}
																setSelectValue={() => onSelectProductClick(product.mfr_code)}
																showStar
																widgetType={productCardWidgetType}
																collection_id={currentCollection._id}
																collection_name={currentCollection.collection_name}
																collection_path={currentCollection.path}
																collection_status={currentCollection.status}
															/>
														))}
													</div>
												</div>
											);
										});
									})()
								) : (
									// Show products without groupings (your current logic)
									<div className={styles.productsGrid}>
										{otherProducts.map((product) => (
											<ProductCard
												key={product.mfr_code}
												product={product}
												hideViewSimilar
												hideAddToWishlist
												showRemoveIcon
												size="small"
												onRemoveIconClick={() => removeProductsFromCollection([product.mfr_code])}
												onStarClick={() => starProductsFromCollection([product.mfr_code], !product.starred)}
												buyNowTitle=""
												buyNowSubTitle={`${enableSelectProduct ? "From" : "view on"} ${product.brand}`}
												enableSelect={enableSelectProduct}
												isSelected={selectedProducts.includes(product.mfr_code)}
												setSelectValue={() => onSelectProductClick(product.mfr_code)}
												showStar
												widgetType={productCardWidgetType}
												collection_id={currentCollection._id}
												collection_name={currentCollection.collection_name}
												collection_path={currentCollection.path}
												collection_status={currentCollection.status}
											/>
										))}
									</div>
								)}
							</div>
						) : null}
					</>
				)}
			</div>
			{/* 
			{isMyProductsCollection && !productLists.length ? (
				<div className='grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-5 gap-4 w-max mx-auto'>
					{currentSellerBrandDetails?.platform === shared_profile_on_root ? (
						<div className='bg-transparent h-56 w-56 rounded-xl bg-slate-100 flex items-center justify-center'>
							<div
								className='underline cursor-pointer text-lg'
								onClick={() =>
									handleUploadMyCollectionsProducts(UPLOAD_PRODUCT_MODE_IMAGES)
								}>
								Upload Images
							</div>
						</div>
					) : null}
					<div className='bg-transparent h-56 w-56 rounded-xl bg-slate-100 flex items-center justify-center'>
						<div
							className='py-14 flex flex-col gap-1 text-lg text-center'
							onClick={() =>
								handleUploadMyCollectionsProducts(UPLOAD_PRODUCT_MODE_CSV)
							}>
							<div className='underline cursor-pointer'>
								Upload CSV <br />
								or product feed
							</div>
						</div>
					</div>
				</div>
			) : null} */}

			{!productLists?.length && !isFetching && !isEditTagsOpen && (
				<div className={styles.emptyStateContainer}>
					<p className={styles.emptyStateMessage}>
						{isFetchingProducts
							? "Finding products that match your content"
							: isTagsSelected
								? `We did not find any products matching the selected ${TAG_TITLE}.`
								: "We did not find any products."}
					</p>
					{!isFetchingProducts && (
						<p className={styles.emptyStateHint}>
							Try using{" "}
							<span
								className={styles.differentTagsLink}
								role='button'
								onClick={handleEditTagsBtnClick}>
								different {TAGS_TITLE}
							</span>
							.
						</p>
					)}
				</div>
			)}

			{(showFetchMoreButton && ( // UPDATE // will be added later
				<div className={styles.fetchMoreContainer}>
					{fetchMoreLoading ? (
						<Spin className={styles.loadingSpinner} />
					) : (
						<Button
							type='primary'
							className={styles.fetchMoreButton}
							ghost
							onClick={() =>
								handleConfirmRefetchProducts({ isFetchMore: true })
							}>
							Fetch more
						</Button>
					)}
				</div>
			)) ||
				null}
			{currentCollection._id ? (
				<SponsorProductModal
					isModalOpen={addProductModalOpen.isOpen}
					onModalClose={onAddProductModalClose}
					collectionData={currentCollection}
					data={addProductModalOpen}
					onProductEdit={onSponsorProductEditClick}
					allowEdit
					sellerDetails={sellerDetails}
				/>
			) : null}
		</div>
	);
};

export default React.memo(ReviewCollectionPlist);
