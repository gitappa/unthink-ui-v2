import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "../../helper/useNavigate";
import { Typography, Drawer, Spin, Button, Tooltip, Checkbox, Modal } from "antd";
import {
	CloseOutlined,
	PlusOutlined,
	LoadingOutlined,
} from "@ant-design/icons";

import WishListItems from "./WishListItems";
import {
	setIsCreateWishlist,
	setSelectedCollectionData,
	setSelectedWishlistId,
	closeWishlistModal,
	setProductsToAddInWishlist,
} from "./redux/actions";

import { getCreatorCollection, getSingleUserCollection, getUserCollection, getUserCollections } from "../Auth/redux/actions";
import {
	defaultFavoriteColl,
	favorites_collection_name,
	WISHLISTS_TITLE,
	WISHLIST_MODAL_Z_INDEX,
	WISHLIST_TITLE,
	FETCH_COLLECTIONS_PRODUCT_LIMIT,
	PATH_CREATE_COLLECTION,
} from "../../constants/codes";
import CreateWishlist from "./CreateWishlist";
import BlogCollectionGallery from "./blogCollection/BlogCollectionGallery";
import { adminUserId, current_store_name, is_store_instance, super_admin } from "../../constants/config";
import { addToWishlist } from "../wishlistActions/addToWishlist/redux/actions";
import {
	checkIsFavoriteCollection,
	filterAvailableProductList,
	AdminCheck,
} from "../../helper/utils";
import {
	updateWishlist,
	updateWishlistReset,
} from "../wishlistActions/updateWishlist/redux/actions";
import BlogCollectionProducts from "./blogCollection/BlogCollectionProducts";
import { createWishlistReset } from "../wishlistActions/createWishlist/redux/actions";
import sharedPageTracker from "../../helper/webTracker/sharedPageTracker";
import { reorderWishlist } from "../wishlistActions/reorderWishlist/redux/actions";
import appTracker from "../../helper/webTracker/appTracker";
import { deleteWishlist } from "../wishlistActions/deleteWishlist/redux/actions";

const { Text } = Typography;

const WishListModal = ({
	isMyProfilePage,
	createCollectionPreDefinedPayload,
	trackCollectionId,
	trackCollectionName,
	trackCollectionCampCode,
	trackCollectionICode,
}) => {
	const navigate = useNavigate();
	const [
		showWishlistModal,
		authUser,
		allCollectionsList,
		isWishlistFetching,
		selectedCollectionId,
		productsToAddInWishlist,
		isCreateWishlist,
		isEditWishlist,
		showCollectionDetails,
		removeFromFavorites,
		addToWishlistReducer,
		reorderWishlistReducer,
		associate_seller,
		admin_list,
		CreatorCollections,
	] = useSelector((state) => [
		state.appState.wishlist.showWishlistModal,
		state.auth.user.data,
		state.auth.user.collections.data,
		state.auth.user.collections.isFetching,
		state.appState.wishlist.selectedCollectionId,
		state.appState.wishlist.productsToAddInWishlist || [],
		state.appState.wishlist.isCreateWishlist,
		state.appState.wishlist.isEditWishlist,
		state.appState.wishlist.showCollectionDetails,
		state.appState.wishlist.removeFromFavorites,
		state.wishlistActions.addToWishlist,
		state.wishlistActions.reorderWishlist,
		state.store.data.associate_seller,
		state.store.data.admin_list,
		state.creatorCollection
	]);
	const dispatch = useDispatch();
	const wishlistBodyRef = useRef(null);

	const { isFetching: createWishlistInProgress } = addToWishlistReducer;
	const { isFetching: reorderWishlistInProgress } = reorderWishlistReducer;

	const isLoading =
		createWishlistInProgress || reorderWishlistInProgress || isWishlistFetching; // UPDATE // add remove wishlist as well


	const favoriteCollection = useMemo(
		() =>
			allCollectionsList.find(checkIsFavoriteCollection) || defaultFavoriteColl,
		[allCollectionsList]
	);

	const collections = useMemo(
		() => allCollectionsList.filter((data) => !checkIsFavoriteCollection(data)),
		[allCollectionsList]
	);

	const CreatorCollection = CreatorCollections?.CreatorCollections

	const CreatorCollectionData = useMemo(
		() => CreatorCollection?.filter((data) => !checkIsFavoriteCollection(data)),
		[CreatorCollections]
	);

	const isAssociateSeller = useMemo(
		() => associate_seller?.includes(authUser.emailId),
		[associate_seller, authUser.emailId]
	);

	const enabledProductToAddInWishlist = useMemo(
		() => !!productsToAddInWishlist.length,
		[productsToAddInWishlist]
	);


	// this funtion for create collections length 0 also create a new collection
	const enabledProductToAddInWishlist1 = useMemo(
		() => true,
		[productsToAddInWishlist]
	);



	const collectionsList = useMemo(() => {
		return collections;
		// if (!isAssociateSeller || enabledProductToAddInWishlist) {
		// not showing my products collection for add product to collection feature
		// return collections.filter((data) => !checkIsMyProductsCollection(data));
		// } else {
		// 	return collections;
		// }
	}, [collections]);

	const creatorCollectionList = useMemo(() => {
		return CreatorCollectionData;
		// if (!isAssociateSeller || enabledProductToAddInWishlist) {
		// not showing my products collection for add product to collection feature
		// return collections.filter((data) => !checkIsMyProductsCollection(data));
		// } else {
		// 	return collections;
		// }
	}, [CreatorCollectionData]);


	const closeModal = () => {
		dispatch(closeWishlistModal());
	};

	// function to add product in wishlist and remove that product from favorites
	const addProductToWishlist = (data) => {
		// refactoring and handling is pending
		const payload = {
			products: productsToAddInWishlist
				.filter((p) => !p.handpicked)
				.map((p) => ({
					mfr_code: p.mfr_code,
					tagged_by: p.tagged_by || [],
					// starred: true,
				})),

			product_lists: productsToAddInWishlist
				.filter((p) => p.handpicked)
				.map((p) => ({
					...p,
					// starred: true,
				})),
			_id: data._id,
			successMessage: `Product added to the ${WISHLIST_TITLE}`,
			errorMessage: `Failed to add product to ${WISHLIST_TITLE}`,
			// closeModalOnSuccess: true, // closing collections modal after add item to wishlist
			// removeFromFavorites: removeFromFavorites, // remove from favorites if product added first in favorites
			fetchRecommendations: true, // fetch recommendations after success add to collection
			fetchUserCollections: true, // fetch collections after success add to collection
		};

		if (data._id === favoriteCollection._id) {
			// to add favorite collection if collection is not exists
			payload.collection_name = defaultFavoriteColl.collection_name;
			payload.type = defaultFavoriteColl.type;
			payload.user_id = authUser.user_id;
		}

		dispatch(addToWishlist(payload));
		dispatch(setProductsToAddInWishlist([]));

		// START
		// add to collection track event
		if (productsToAddInWishlist.length === 1) {
			const event = {
				mfrCode: productsToAddInWishlist[0].mfr_code,
				product_brand: productsToAddInWishlist[0].product_brand,
				brand: productsToAddInWishlist[0].brand,
				collectionId: trackCollectionId,
				iCode: authUser.influencer_code,
				campCode: trackCollectionCampCode,
				collectionName: trackCollectionName,
				collectionICode: trackCollectionICode,
			};
			appTracker.onAddItemToWishlist(event);
		}
		// END
	};

	const onCreateWishlist = () => {
		dispatch(createWishlistReset()); // resetting create wishlist reducer
		dispatch(updateWishlistReset()); // resetting update wishlist reducer

		if (enabledProductToAddInWishlist1) {
			dispatch(setIsCreateWishlist(true));
		} else {
			navigate(PATH_CREATE_COLLECTION);
			closeModal();
		}
	};

	const onOwnCollectionClick = (collection) => {

		if (activeCollection === "Creator") {
			if (collection.path) {
				console.log(collection);
				navigate(`/${collection.user_name}/collections/${collection.path}`);
				dispatch(closeWishlistModal())
				return;
			}
		}

		dispatch(updateWishlistReset()); // resetting update wishlist reducer to handle the update feature inside wishlist

		if (enabledProductToAddInWishlist) {

			// dispatch(getUserCollection({ _id: collection._id }));

			addProductToWishlist(collection);
		} else {
			// on my profile this is not required
			// if (!isMyProfilePage) {
			// 	sharedPageTracker.onCollectionClick({
			// 		object_id: collection._id,
			// 		iCode: authUser.influencer_code,
			// 		cCode: authUser.company_code,
			// 		collection_id: collection._id,
			// 	});
			// }
			dispatch(getUserCollection({ _id: collection._id, product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT }));
			// dispatch(getSingleUserCollection({ _id: collection._id, product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT }));
			dispatch(setSelectedCollectionData(collection));
		}
	};

	const onStarBlogCollectionsPage = (collection) => {
		const editPayload = {
			_id: collection._id,
			starred: !collection.starred,
			setStarredUserCollections: true, // set current auth user's collection starred value without fetching collections from API
		};

		dispatch(updateWishlist(editPayload));
	};

	const onWishlistSort = (sortedList) => {
		const list = [...sortedList];
		if (favoriteCollection._id) {
			list.unshift(favoriteCollection);
		}

		const collections = list.map((c) => c._id);

		const reorderPayload = {
			collections,
			replaceInUserCollections: true,
			collectionsWithDetails: list,
		};

		dispatch(reorderWishlist(reorderPayload));
	};

	// const refetchAllCollectionsData = () => {
	// 	dispatch(
	// 		getUserCollections({
	// 			product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT,
	// 		})
	// 	);
	// };

	// const onSuccessDelete = () => {
	// 	refetchAllCollectionsData();
	// 	dispatch(setSelectedWishlistId(""));
	// };

	const showCreateOrEditWishlist = isCreateWishlist || isEditWishlist;

	const selectedWishlist = useMemo(
		() =>
			allCollectionsList.find(
				(wishlist) => wishlist._id === selectedCollectionId
			),
		[allCollectionsList, selectedCollectionId]
	);

	// REMOVE
	// const handleScrollToFavorites = () => {
	// 	// scroll the favorites collection products bottom component into view
	// 	if (document) {
	// 		const element = document.getElementById("favorites_collection_container");
	// 		if (element) {
	// 			// 👇 Will scroll smoothly to the top of the next section
	// 			element.scrollIntoView({ behavior: "smooth" });
	// 		}
	// 	}
	// };

	// user admin or not checked

	const isAdminLoggedIn = AdminCheck(authUser, current_store_name, adminUserId, admin_list);

	// feature collection and creator funtion

	const [activeCollection, setActiveCollection] = useState("Feature");

	const handleCollectionClick = (collectionName) => {
		setActiveCollection(collectionName);
	};

	const [enableSelectProduct, setEnableSelectProduct] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);

	// select all products
	const onSelectAllChange = () => {
		setSelectedProducts(
			selectedProducts.length < collectionsList.length
				? collectionsList.map((i) => i._id)
				: []
		);
	};

	// reset select product feature // unselect every products
	const handleResetSelectProduct = useCallback(() => {
		setSelectedProducts([]);
		setEnableSelectProduct(false);
	}, []);

	// select particular product
	const onSelectProductClick = (mfr_code) => {
		if (selectedProducts.includes(mfr_code)) {
			setSelectedProducts(selectedProducts.filter((p) => p !== mfr_code));
		} else {
			setSelectedProducts([...selectedProducts, mfr_code]);
		}
	};

	// remove selected products
	const onDeleteSelectedProducts = useCallback(() => {
		if (selectedProducts.length) {
			Modal.confirm({
				title: "Confirm",
				content: (
					<h1>
						Are you sure? The selected product(s) will be removed permanently.
					</h1>
				),
				okText: "Ok",
				cancelText: "Cancel",
				onOk: () => {
					setSelectedProducts([]);
					removeProductsFromProductsList(selectedProducts);
				},
			});
		}
	}, [selectedProducts]);

	// delete multiple products at a time
	const removeProductsFromProductsList = (_id) => {

		const payload = {
			_id: _id.join(',')
		};
		dispatch(deleteWishlist(payload));
		setEnableSelectProduct(false)
	};

	// call creator collection if admin true
	useEffect(() => {
		if (isAdminLoggedIn && showWishlistModal && activeCollection === "Creator") {
			dispatch(getCreatorCollection());
		}
	}, [isAdminLoggedIn, showWishlistModal, activeCollection]);

	const wishlistData =
		activeCollection === "Feature"
			? collectionsList
			: activeCollection === "Creator"
				? creatorCollectionList
				: collectionsList;

	return (
		<Drawer
			placement='right'
			width={448}
			open={showWishlistModal}
			closable={false}
			onClose={closeModal}
			styles={{ body: { padding: 0, background: "#F1F5F9" } }}
			className={`backdrop-filter backdrop-blur-sm transition-none z-40`}
			classNames={{ wrapper: "wishlistModal" }}
			zIndex={WISHLIST_MODAL_Z_INDEX}>
			<div className='w-full h-auto'>
				<div ref={wishlistBodyRef} className='w-full max-w-md ml-auto h-full py-6'>
					{showCreateOrEditWishlist && (
						<CreateWishlist
							allWishlist={allCollectionsList}
							selectedWishlist={selectedWishlist}
							title={
								isCreateWishlist
									? `Create ${WISHLIST_TITLE}`
									: `Edit ${WISHLIST_TITLE}`
							}
							// addProductToWishlist={addProductToWishlist}
							createCollectionPreDefinedPayload={
								createCollectionPreDefinedPayload
							}
							trackCollectionId={trackCollectionId}
							trackCollectionName={trackCollectionName}
							trackCollectionCampCode={trackCollectionCampCode}
							trackCollectionICode={trackCollectionICode}
						/>
					)}

					{showCollectionDetails &&
						!showCreateOrEditWishlist &&
						selectedWishlist && (
							<BlogCollectionGallery
								authUser={authUser}
								selectedCollection={selectedWishlist}
								// onSuccessDelete={onSuccessDelete}
								isWishlistFetching={isWishlistFetching}
							/>
						)}

					{/* <WishlistGallery /> // REMOVE
						wishlist={wishlistData.find(
							(wishlist) => wishlist.collection_id === selectedWishlistId
						)}
						wishListOwner={authUser}
						closeWishlistModal={closeModal}
					/> */}

					{!showCreateOrEditWishlist && !showCollectionDetails && ( 
						<div>
							<div className='pl-4 pr-2 flex justify-between items-center'>
								<h1 className='text-xl-2 font-semibold m-0'>
									{WISHLISTS_TITLE}
								</h1>
								<div>
									<CloseOutlined
										className='text-xl cursor-pointer flex my-auto p-2'
										onClick={closeModal}
									/>
								</div>
							</div>
							{/* create wishlist section */}
							{enabledProductToAddInWishlist && collections.length ? (
								<h3 className='text-xl-1 font-medium px-4 pt-3'>
									Select a collection below that you want to add to!
								</h3>
							) : null}
							{authUser?.user_id && (
								<button
									className='max-w-max mx-auto flex items-center mt-9 bg-white rounded-2xl py-1 px-5 cursor-pointer'
									onClick={onCreateWishlist}>
									<PlusOutlined className='text-blue-103 text-lg' />
									<Text className='pl-4 text-blue-103 font-semibold text-base'>
										Create New {WISHLIST_TITLE}
									</Text>
								</button>
							)}

							{
								isAdminLoggedIn &&
								<>
									<div className="w-full flex justify-between p-3 mt-4">
										<button onClick={() => handleCollectionClick("Feature")}
											className={`p-2 text-lg font-semibold rounded-l-10 w-full-50 whitespace-nowrap ${activeCollection === "Feature" ? "bg-blue-103 text-white" : "bg-transparent border-2 border-solid border-blue-103 text-blue-103"
												}`}>Featured Collections</button>
										<button onClick={() => handleCollectionClick("Creator")}
											className={`p-2 text-lg font-semibold rounded-r-10 w-full-50  ${activeCollection === "Creator" ? "bg-blue-103 text-white" : "bg-transparent border-2 border-solid border-blue-103 text-blue-103"
												}`}>Creator Collections</button>
									</div>
								</>
							}

							{
								isAdminLoggedIn && activeCollection !== "Creator" && (
									<div className="w-full flex gap-2 items-center p-3">
										{enableSelectProduct ?
											<>
												<div className='flex items-center leading-44'>
													<div className='flex border border-gray-106 rounded py-2 pl-2'>
														<Checkbox
															className='text-base md:text-lg'
															indeterminate={
																selectedProducts.length > 0 &&
																selectedProducts.length < collectionsList.length
															}
															onChange={onSelectAllChange}
															checked={selectedProducts.length === collectionsList.length}>
															{selectedProducts.length} Selected
														</Checkbox>
													</div>
													<p
														onClick={onDeleteSelectedProducts}
														className={`
									${selectedProducts.length
																? "text-blue-103 cursor-pointer"
																: "text-gray-104 cursor-not-allowed"
															}
									 mb-0 ml-2 underline text-base md:text-lg`}
														title='Click to delete selected products'
														role='button'>
														Delete
													</p>
													<p
														onClick={() => handleResetSelectProduct()}
														className='text-blue-103 mb-0 ml-2 underline cursor-pointer text-base md:text-lg'
														role='button'>
														Cancel
													</p>
												</div>
											</>
											:
											(
												<Tooltip title='Click and select multiple products to delete'>
													<p
														className='text-blue-103 cursor-pointer leading-44 text-base md:text-lg'
														role='link'
														onClick={() => setEnableSelectProduct(true)}>
														Select multiple products
													</p>
												</Tooltip>
											)
										}

									</div>
								)
							}


							{/* wishlist items list */}
							{/* {wishlistItems.length ? (
								<div className='pt-9'>
									<>
										<div className='text-center w-full'>
											<Text className='text-xl-1 font-medium'>
												Automated collections
											</Text>
										</div>
										<WishListItems
											wishlistData={wishlistItems}
											onWishlistClick={onWishlistClick}
											isWishlistFetching={
												isWishlistFetching || authUserFetching
											}
											contentClassName='bg-gray-103'
										/>

									</>
								</div>
							) : null} */}
							{/* <h1 className='text-lg w-2/3 text-center mx-auto'>
								You do not have any items in your{" "}
								<span className='lowercase'>{WISHLIST_TITLE}</span> yet.
							</h1> */}

							<div className='mt-5'>
								{/* <div className='text-center w-full'> // REMOVE
										<Text className='text-xl-1 font-medium'>
											Automated collections
										</Text>
									</div> */}
								<div>
									<WishListItems
										activeCollection={activeCollection}
										wishlistData={wishlistData}
										favoriteCollection={favoriteCollection}
										isWishlistFetching={isWishlistFetching}
										onWishlistClick={onOwnCollectionClick}
										onStarClick={onStarBlogCollectionsPage}
										onWishlistSort={onWishlistSort}
										onSelectProductClick={onSelectProductClick}
										selectedProducts={selectedProducts}
										enableSelectProduct={enableSelectProduct}
										contentClassName='bg-blue-104'
										isBlogPages
										showStar={
											is_store_instance && authUser.user_name === super_admin // isStoreAdminLoggedIn
										}
										hideSorting={enabledProductToAddInWishlist}
										showFavoriteCollection={
											enabledProductToAddInWishlist || favoriteCollection._id
										} // now showing the favorite collection always on top
										authUserId={authUser.user_id}
									/>
								</div>
							</div>

							{
								activeCollection === "Feature" &&
								<div className='pt-9' id='favorites_collection_container'>
									<Text className='text-xl font-medium pl-8'>
										{favorites_collection_name}
									</Text>
									<div className='px-8 py-9'>
										<BlogCollectionProducts
											productList={filterAvailableProductList(
												favoriteCollection.product_lists || []
											)}
											selectedCollection={favoriteCollection}
											authUser={authUser}
										/>
										{/* <WishlistProducts wishlist={favoriteCollection} /> // REMOVE */}
									</div>
								</div>
							}
						</div>
					)}
				</div>
			</div>
			{
				isLoading && (
					<div className='absolute z-30 top-0 left-0 flex justify-center items-center w-full h-full backdrop-filter backdrop-contrast-75'>
						<Spin indicator={<LoadingOutlined className='text-3xl-1' spin />} />
					</div>
				)
			}
		</Drawer >
	);
};

export default WishListModal;
