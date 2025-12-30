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
			<div className='mx-auto'>
				{isFetching && !productLists.length ? (
					<div className='grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-5 gap-4'>
						<Skeleton.Input active className='w-40 lg:w-180 h-180' />
						<Skeleton.Input active className='w-40 lg:w-180 h-180' />
						<Skeleton.Input active className='w-40 lg:w-180 h-180' />
						<Skeleton.Input active className='w-40 lg:w-180 h-180' />
						<Skeleton.Input
							active
							className='w-40 lg:w-180 h-180 hidden md:block'
						/>
						<Skeleton.Input
							active
							className='w-40 lg:w-180 h-180 hidden md:block lg:block'
						/>
						<Skeleton.Input
							active
							className='w-40 lg:w-180 h-180 hidden lg:block'
						/>
						<Skeleton.Input
							active
							className='w-40 lg:w-180 h-180 hidden lg:block'
						/>
						<Skeleton.Input
							active
							className='w-40 lg:w-180 h-180 hidden lg:block'
						/>
						<Skeleton.Input
							active
							className='w-40 lg:w-180 h-180 hidden lg:block'
						/>
					</div>
				) : (
					<>
						{isStarredProductsExists ? (
							<div className='mt-4 tablet:mt-8'>
								<div className='flex gap-2'>
									<p className='m-0 text-base font-bold'>Top Picks</p>
									<StarFilled
										height='fit-content'
										role='img'
										className='flex my-auto z-20 text-base text-secondary'
									/>
								</div>
								<div className='grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-5 gap-2.5 tablet:gap-4 mt-1 w-max mx-auto'>
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
							<div className="mt-8 tablet:mt-12">
								{isStarredProductsExists ? (
									<p className="mb-1 text-base">More from this collection</p>
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
												<div key={tag} className="mb-6">
													{/* Display the tag heading */}
													<div className="flex justify-between items-center mb-4">
														<div className="flex items-center gap-2">
															{
																enableSelectProduct && (
																	<input
																		type="checkbox"
																		checked={products.every((p) => selectedProducts.includes(p.mfr_code))}
																		onChange={() => onSelectTagProductsClick(tag)}
																	/>
																)
															}
															<h3 className="text-base font-bold">{tag}</h3>
														</div>
														{/* Show See More button when the number of products exceeds the limit */}
														{products.length > 5 && !isExpanded && (
															<button
																className="flex items-center gap-0.5 text-xs rounded-2xl cursor-pointer bg-violet-100 text-white px-3 py-2"
																onClick={handleSeeMoreClick}
															>
																See More
															</button>
														)}
														{isExpanded && (
															<button
																className="flex items-center gap-0.5 text-xs rounded-2xl cursor-pointer bg-violet-100 text-white px-3 py-2"
																onClick={handleSeeMoreClick}
															>
																See Less
															</button>
														)}
													</div>

													{/* Display the products in a grid */}
													<div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-5 gap-2.5 tablet:gap-4 w-max mx-auto">
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
									<div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-5 gap-2.5 tablet:gap-4 w-max mx-auto">
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
				<div className='w-full text-center py-6'>
					<p className='text-xl mb-2'>
						{isFetchingProducts
							? "Finding products that match your content"
							: isTagsSelected
								? `We did not find any products matching the selected ${TAG_TITLE}.`
								: "We did not find any products."}
					</p>
					{!isFetchingProducts && (
						<p className='text-base'>
							Try using{" "}
							<span
								className='text-indigo-103 cursor-pointer'
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
				<div className='mt-6 flex justify-center'>
					{fetchMoreLoading ? (
						<Spin className='flex h-8' />
					) : (
						<Button
							type='primary'
							className='rounded-lg h-8'
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
