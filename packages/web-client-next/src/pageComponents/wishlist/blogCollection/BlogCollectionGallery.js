import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	Typography,
	Spin,
	Button,
	Modal,
	Divider,
	Alert,
	Select,
	Checkbox,
	Tooltip,
} from "antd";
import {
	ArrowLeftOutlined,
	LoadingOutlined,
	InfoCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "../../../helper/useNavigate";
import styles from "./BlogCollectionGallery.module.css";

import {
	setIsEditWishlist,
	setSelectedCollectionData,
	closeWishlistModal,
} from "../redux/actions";
import BlogCollectionProducts from "./BlogCollectionProducts";
import {
	COLLECTION_TYPE_AUTO_PLIST,
	DONE,
	IN_PROGRESS,
	PUBLISHED,
	TAGS_TITLE,
	WISHLIST_TITLE,
} from "../../../constants/codes";
import CopyToClipBoardComponent from "../../../components/CopyToClipBoardComponent";
import { getCurrentUserStore } from "../../Auth/redux/selector";
import {
	filterAvailableProductList,
	getBlogCollectionPagePath,
	getCollectionNameToShow,
	getEditCollectionPagePath,
} from "../../../helper/utils";
import { is_store_instance } from "../../../constants/config";
import { collectionPageAPIs } from "../../../helper/serverAPIs";
import {
	deleteWishlist,
	deleteWishlistReset,
} from "../../wishlistActions/deleteWishlist/redux/actions";
import {
	updateWishlist,
	updateWishlistReset,
} from "../../wishlistActions/updateWishlist/redux/actions";
import {
	removeFromWishlist,
	removeFromWishlistReset,
} from "../../wishlistActions/removeFromWishlist/redux/actions";
import { createWishlistReset } from "../../wishlistActions/createWishlist/redux/actions";
import { addToWishlist } from "../../wishlistActions/addToWishlist/redux/actions";
import { setShowChatModal } from "../../../hooks/chat/redux/actions";
import { getSingleUserCollection, getUserCollection } from "../../Auth/redux/actions";

const { Text, Title } = Typography;
const { Option } = Select;

const BlogCollectionGallery = ({
	selectedCollection,
	// onSuccessDelete,
	isWishlistFetching,
}) => {
	const navigate = useNavigate();
	const { showProcessingLoader, isFetchingProduct } = useSelector(
		(state) => state.appState.wishlist.selectedCollection
	);

	console.log('selectedCollection',selectedCollection);
	

	const [
		authUser,
		isGuestUser,
		deleteWishlistReducer,
		updateWishlistReducer,
		removeFromWishlistReducer,
		showChatModal,
	] = useSelector((state) => [
		state.auth.user.data,
		state.auth.user.userNotFound,
		state.wishlistActions.deleteWishlist,
		state.wishlistActions.updateWishlist,
		state.wishlistActions.removeFromWishlist,
		state.chatV2.showChatModal,
	]);

	const dispatch = useDispatch();

	const {
		isFetching: deleteWishlistInProgress,
		success: deleteWishlistSuccess,
		error: deleteWishlistError,
	} = deleteWishlistReducer;

	// useEffect(() => {
	// 	if (deleteWishlistSuccess) {
	// 		// on delete collection success
	// 		dispatch(deleteWishlistReset());
	// 		onSuccessDelete();
	// 	}
	// }, [deleteWishlistSuccess]);

	// REMOVE
	// useEffect(() => {
	// 	if (deleteWishlistError) {
	// 		// on delete collection failure
	// 		dispatch(deleteWishlistReset());
	// 	}
	// }, [deleteWishlistError]);

	const { isFetching: updateWishlistInProgress } = updateWishlistReducer;

	const {
		isFetching: removeFromWishlistInProgress,
		success: removeFromWishlistSuccess,
	} = removeFromWishlistReducer;

	useEffect(() => {
		return () => dispatch(updateWishlistReset());
	}, []);

	const clearSelectedProducts = () => setSelectedProducts([]);

	useEffect(() => {
		if (removeFromWishlistSuccess) {
			clearSelectedProducts();
			dispatch(removeFromWishlistReset());
		}
	}, [removeFromWishlistSuccess]);

	const sponsorProductList = useMemo(
		() =>
			(selectedCollection.sponsor_details?.product_list || []).map((p) => {
				p.sponsored = true;
				return p;
			}),
		[selectedCollection.sponsor_details]
	);

	const productLists = sponsorProductList.concat(
		filterAvailableProductList(selectedCollection.product_lists || [])
	);

	const [showTagsInput, setShowTagsInput] = useState(false);
	const [blogFilters, setBlogFilters] = useState([]);
	const [blogFiltersError, setBlogFiltersError] = useState("");

	const [enableSelectProduct, setEnableSelectProduct] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);

	const isAutoPlist = selectedCollection.type === COLLECTION_TYPE_AUTO_PLIST;

	const showLoader = useMemo(
		() =>
			showProcessingLoader ||
			removeFromWishlistInProgress ||
			updateWishlistInProgress ||
			isWishlistFetching,
		[
			showProcessingLoader,
			removeFromWishlistInProgress,
			updateWishlistInProgress,
			isWishlistFetching,
		]
	);

	const onBackClick = () => {
		dispatch(setSelectedCollectionData(null));
	};

	const collectionPagePath = useMemo(
		() =>
			getBlogCollectionPagePath(
				authUser.user_name,
				selectedCollection.path,
				selectedCollection._id,
				authUser.user_id,
				selectedCollection.status,
				selectedCollection.hosted_stores,
				selectedCollection?.collection_theme
			),
		[
			authUser.user_name,
			selectedCollection.path,
			selectedCollection._id,
			authUser.user_id,
			selectedCollection.status,
			selectedCollection.hosted_stores,
			selectedCollection?.collection_theme,
		]
	);

	const handleRedirectToCollectionPage = async () => {
		navigate(collectionPagePath);

		await dispatch(closeWishlistModal());
		showChatModal && await dispatch(setShowChatModal(false));

		// await dispatch(getUserCollection({ _id: selectedCollection._id }));
		await dispatch(getSingleUserCollection({ _id: selectedCollection._id }));

	};

	const handleRedirectToNewEditCollectionPage = () => {
		navigate(getEditCollectionPagePath(selectedCollection._id));

		dispatch(closeWishlistModal());
		dispatch(
			getUserCollection({
				_id: selectedCollection._id,
			})
		);
		// dispatch(getSingleUserCollection({ _id: selectedCollection._id }));
	}

	const handleDeletePlistClick = () => {
		dispatch(
			deleteWishlist({
				_id: selectedCollection._id,
				successMessage: `${WISHLIST_TITLE} has been successfully deleted`,
				errorMessage: `Failed to delete ${WISHLIST_TITLE}, try after sometime`,
				removeCollectionFromUserCollections: true,
				clearSelectedCollectionData: true, // clearing selected collection data and id to close collection details sidebar
			})
		);
	};

	const deleteCollectionPageClick = () => {
		Modal.confirm({
			title: "Confirm",
			content: (
				<h1>
					Are you sure you want to delete the collection{" "}
					<span className='font-bold'>
						{getCollectionNameToShow(selectedCollection)}
					</span>
					? This will remove the page associated with it as well.
				</h1>
			),
			okText: "Delete",
			cancelText: "Cancel",
			onOk: () => {
				handleDeletePlistClick();
			},
		});
	};

	const statusInfoText = useMemo(() => {
		switch (selectedCollection.status) {
			case IN_PROGRESS:
				return `Fetching products that match your ${TAGS_TITLE}... We should be done in less than a minute. You can fine tune it again after the products are fetched.`;
			case DONE:
				return `The products have been added to your collection. "You can now publish the collection to make it visible to the public."`;
			case PUBLISHED:
				return (
					<span>
						Your collection is published. Products are publicly visible on{" "}
						<span
							onClick={() => {
								{
									is_store_instance
										? navigate("/")
										: handleRedirectToCollectionPage();
								}
								onBackClick();
								dispatch(closeWishlistModal());
							}}
						style={{ color: "#083dc1", cursor: "pointer", textDecoration: "underline" }}>
							{is_store_instance
								? window.location.origin
								: `${window.location.origin}${collectionPagePath}`}
						</span>
						.
					</span>
				);
		}
	}, [
		selectedCollection.status,
		collectionPagePath,
		handleRedirectToCollectionPage,
	]);

	const handleTagChange = (value) => {
		setBlogFilters(value);
	};

	const closeTagsFieldMode = () => {
		setShowTagsInput(false);
		setBlogFiltersError("");
		setBlogFilters(selectedCollection.tags);
	};

	const editBlogFilters = () => {
		if (blogFilters?.length) {
			if (
				!(
					blogFilters.length === selectedCollection.tags?.length &&
					blogFilters.every((filter) =>
						selectedCollection.tags?.includes(filter)
					)
				)
			) {
				const editBlogPayload = {
					_id: selectedCollection._id,
					tags: blogFilters,
					fetchUserCollections: true, // fetch current auth user's collection from API
				};
				dispatch(updateWishlist(editBlogPayload));
			}
			closeTagsFieldMode();
		} else {
			setBlogFiltersError(
				`Please enter some ${TAGS_TITLE} that indicate the type of products to select`
			);
		}
	};

	useEffect(() => {
		if (selectedCollection.tags) setBlogFilters(selectedCollection.tags);
	}, [selectedCollection.tags]);

	const onSelectAllChange = () => {
		setSelectedProducts(
			selectedProducts.length < productLists.length
				? productLists.map((i) => i.mfr_code)
				: []
		);
	};

	const onSelectProductClick = (mfr_code) => {
		if (selectedProducts.includes(mfr_code)) {
			setSelectedProducts(selectedProducts.filter((p) => p !== mfr_code));
		} else {
			setSelectedProducts([...selectedProducts, mfr_code]);
		}
	};

	// delete multiple products with user collection new API with single API call
	const onDeleteSelectedProducts = () => {
		if (selectedProducts.length) {
			dispatch(
				removeFromWishlist({
					_id: selectedCollection._id,
					products: selectedProducts,
					errorMessage: "Unable to remove products",
					removeFromUserCollections: true,
				})
			);
		}
	};

	// showcase multiple products with add products API
	const showcaseCollectionProducts = (
		products, // products format ['mft_code']
		starred // not need to send this for un starring the products // sent true to star the products
	) => {
		if (products.length) {
			const productsWithDetails =
				selectedCollection.product_lists?.filter((p) =>
					products.includes(p.mfr_code)
				) || [];

			const productsToShowcase = productsWithDetails.map((pr) => ({
				mfr_code: pr.mfr_code,
				tagged_by: pr.tagged_by || [],
				starred,
			}));

			const addToWishlistPayload = {
				_id: selectedCollection._id,
				products: productsToShowcase,
				fetchUserCollection: true, // fetch user's current collection after success add to collection
				showcase: true, // additional flag to send in API
			};

			dispatch(addToWishlist(addToWishlistPayload));
			clearSelectedProducts();
		}
	};

	// quick edit click handler to reset update and create wishlist reducer
	const onQuickEditClick = () => {
		dispatch(createWishlistReset());
		dispatch(updateWishlistReset());
		dispatch(setIsEditWishlist(true));
	};

	const handlePublishCollection = useCallback(() => {
		const payload = {
			_id: selectedCollection._id,
			status: selectedCollection.status === PUBLISHED ? DONE : PUBLISHED,
			fetchUserCollection: true, // fetch current auth user's current collection from API
			checkForNFTReward: true, // flag to check for NFT, if user has published the first collection
			whistListPublish: true, // to show specific message for collection publish action
		};
		dispatch(updateWishlist(payload));
	}, [selectedCollection._id, selectedCollection.status]);

	return (
		<div className={styles.mainContainer}>
			<div className={styles.backButton} onClick={onBackClick}>
				<ArrowLeftOutlined className={styles.backButtonIcon} />
				<Text className={styles.backButtonText}>Back</Text>
			</div>
			<div className={styles.headerSection}>
				{/* <>
					<Skeleton.Input active={true} className='w-full h-4 lg:h-6' />
					<Skeleton.Input active={true} className='w-2/4 h-4 lg:h-6 pt-2' />
					<Skeleton.Input active={true} className='w-full h-12 pt-2' />
					<div className='flex pt-4 w-full'>
						<Skeleton.Input active={true} className='w-full h-5 pr-2' />
						<Skeleton.Input active={true} className='w-full h-5 pr-2' />
						<Skeleton.Input active={true} className='w-full h-5 pr-2' />
					</div>
				</> */}
				<>
					<div className={styles.collectionNameContainer}>
						<div className={styles.capitalFirstLetter}>
							<Text
								onClick={handleRedirectToCollectionPage}
								className={styles.collectionName}>
								{getCollectionNameToShow(selectedCollection)}
							</Text>
						</div>
					</div>
					{selectedCollection?.blog_url || selectedCollection?.video_url ? (
						<Text className={styles.urlText}>
							{selectedCollection?.blog_url || selectedCollection?.display_url || selectedCollection.video_url}
							<CopyToClipBoardComponent
								textToCopy={selectedCollection?.blog_url || selectedCollection?.display_url || selectedCollection?.video_url}
							/>
						</Text>
					) : null}
					<div className={styles.actionsContainer}>
						{selectedCollection.status !== IN_PROGRESS ? (
							<>
								<Text
								className={styles.actionLink}
									onClick={onQuickEditClick}>
									Quick Edit
								</Text>
								<Divider className={styles.divider} type='vertical' />
							</>
						) : null}
						{!isGuestUser && selectedCollection.status !== IN_PROGRESS && (
							<div
							className={styles.inlineFlexButton}
							onClick={handleRedirectToNewEditCollectionPage}
							role='button'>
							<Text className={styles.buttonText}>Edit</Text>
								{/* <div className='inline-block px-1.25 py-0.5 ml-1 bg-green-500 text-white rounded-lg text-xs leading-none'>
									new
								</div> */}
							</div>
						)}
						<Divider className={styles.divider} type='vertical' />
						{selectedCollection.status !== IN_PROGRESS && (
							<>
								<Text
									className={styles.actionLink}
									title={`click to ${selectedCollection.status === PUBLISHED ? "Unpublish" : "publish"
										} the collection`}
									onClick={handlePublishCollection}>
									{selectedCollection.status === PUBLISHED ? "Unpublish" : "publish"}
								</Text>
								<Divider className={styles.divider} type='vertical' />
							</>
						)}

						{deleteWishlistInProgress ? (
							<Spin className={styles.spinContainer} />
						) : (
							<Text
								className={styles.actionLink}
								onClick={deleteCollectionPageClick}>
								Delete
							</Text>
						)}
					</div>
					{isAutoPlist && selectedCollection.status && (
						<Alert
							className={styles.alertContainer}
							message={
								showTagsInput
									? `Please update the ${TAGS_TITLE} and click on save to fetch all the products.`
									: statusInfoText
							}
							type='info'
						/>
					)}
					{(selectedCollection.tags?.length && (
						<>
							<h1 className={styles.tagsLabel}>{TAGS_TITLE}</h1>
							<div className={styles.tagsWrapper}>
								{showTagsInput ? (
								<div className={styles.tagsInput}>
									<Select
										mode='tags'
										className={styles.tagsInputField}
											placeholder={`Enter ${TAGS_TITLE}`}
											value={blogFilters}
											onChange={handleTagChange}
											size='large'
											dropdownStyle={{ display: "none" }}>
											{selectedCollection.tags?.map((tg) => (
												<Option key={tg}>{tg}</Option>
											))}
										</Select>
										{blogFiltersError && (
										<h1 className={styles.tagsErrorText}>
												{blogFiltersError}
											</h1>
										)}
										<Button
											onClick={editBlogFilters}
										className={styles.tagsSaveButton}
										type='primary'>
										Save
									</Button>
									<Button
										onClick={closeTagsFieldMode}
										className={styles.tagsCancelButton}
											type='primary'>
											Cancel
										</Button>
									</div>
								) : (
									<>
										{selectedCollection.tags?.map((tag) => (
											<div
												key={tag}
											className={styles.tagsDisplayContainer}>
											<Title
												level={5}
												className={styles.tagText}>
												{tag}
											</Title>
										</div>
									))}
									{selectedCollection.status !== IN_PROGRESS && (
										<Text
											className={styles.modifyTagsLink}
												onClick={() => setShowTagsInput(true)}
												type='primary'>
												Modify {TAGS_TITLE}
											</Text>
										)}
									</>
								)}
							</div>
						</>
					)) ||
						null}
				</>
			</div>

			{/* show collection products */}
		<h1 className={styles.productsLabel}>Products</h1>

		{!isFetchingProduct && productLists.length ? (
			<div className={styles.selectProductsContainer}>
					{enableSelectProduct ? (
					<div className={styles.selectedProductsInfo}>
						<div className={styles.checkboxContainer}>
							<Checkbox
								className={styles.checkboxText}
									indeterminate={
										selectedProducts.length > 0 &&
										selectedProducts.length < productLists.length
									}
									onChange={onSelectAllChange}
									checked={selectedProducts.length === productLists.length}>
									{selectedProducts.length} Selected
								</Checkbox>
							</div>
							<p
								onClick={onDeleteSelectedProducts}
							className={styles.actionButtonSmall}
								title='Click to delete selected products'
								role='button'>
								Delete
							</p>
							<>
								<p
									onClick={() =>
										showcaseCollectionProducts(selectedProducts, true)
									}
								className={styles.actionButtonSmall}
								title='Click to showcase selected products'
								role='button'>
								Showcase
							</p>
							<Tooltip title='Choose products that should appear on the top of your collection'>
								<InfoCircleOutlined className={styles.infoIcon} />
							</Tooltip>
						</>
						<p
							onClick={() => setEnableSelectProduct(false)}
							className={styles.actionButtonSmall}
								role='button'>
								Cancel
							</p>
						</div>
					) : (
						<p
							onClick={() => setEnableSelectProduct(true)}
							className={styles.selectLink}
							title='Click and select multiple products to showcase on top or delete'
							role='button'>
							Select and delete or showcase on top
						</p>
					)}
				</div>
			) : null}

			<BlogCollectionProducts
				productList={productLists}
				showLoader={isFetchingProduct && !productLists.length}
				selectedCollection={selectedCollection}
				onSelectProductClick={onSelectProductClick}
				enableSelectProduct={enableSelectProduct}
				selectedProducts={selectedProducts}
				authUser={authUser}
				starProductsFromCollection={showcaseCollectionProducts} // sending list of mfr codes to un-star the product with the same API
				showStarOnProducts
			/>

			{/* UPDATE LATER */}
			{/* <div className='mt-6 flex justify-center'> 
				{isFetchingProduct ? (
					<Spin className='flex h-8' />
				) : (
					<Button
						type='primary'
						className='rounded-lg h-8'
						ghost
						onClick={onShowMoreClick}>
						Show more
					</Button>
				)}
			</div> */}

			{showLoader && (
			<div className={styles.loadingOverlay}>
					<Spin indicator={<LoadingOutlined className='text-3xl-1' spin />} />
				</div>
			)}
		</div>
	);
};

export default BlogCollectionGallery;