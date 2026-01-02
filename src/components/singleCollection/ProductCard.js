import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "antd";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import {
	HeartOutlined,
	CloseCircleOutlined,
	CopyOutlined,
	StarFilled,
	StarOutlined,
	EditFilled,
	CopyTwoTone,
	CopyrightCircleFilled,
	CopyFilled,
} from "@ant-design/icons";
import { LuCopy } from "react-icons/lu";

import sharedPageTracker from "../../helper/webTracker/sharedPageTracker";
import {
	setRemoveFromFavorites,
	openWishlistModal,
	setProductsToAddInWishlist,
	closeWishlistModal,
} from "../../pageComponents/wishlist/redux/actions";
import { fetchSimilarProducts } from "../../pageComponents/similarProducts/redux/actions";
import {
	current_store_id,
	current_store_name,
	enable_view_similar_products,
	payment_url,
	pdp_page_enabled,
} from "../../constants/config";
import { openProductDetailsCopyModal } from "../../pageComponents/productDetailsCopyModal/redux/actions";
// import { addToWishlist } from "../../pageComponents/wishlistActions/addToWishlist/redux/actions";
import { getCurrentUserFavoriteCollection } from "../../pageComponents/Auth/redux/selector";
import { openProductModal } from "../../pageComponents/customProductModal/redux/actions";
import {
	addSidInProductUrl,
	getCurrentTheme,
	getFinalImageUrl,
	getPercentage,
	// URLAddParam,
} from "../../helper/utils";
import appTracker from "../../helper/webTracker/appTracker";
import {
	defaultFavoriteColl,
	PRODUCT_DUMMY_URL,
	WISHLIST_TITLE,
} from "../../constants/codes";

import View_similar_icon from "../../images/view_similar_icon.svg?react";
import openInNewTabIcon from "../../images/open_in_new_tab.svg";
import Image from "next/image";

import styles from './product.module.scss';
import Link from 'next/link';
import { useNavigate } from "../../helper/useNavigate";
import { setShowChatModal } from "../../hooks/chat/redux/actions";
import useTheme from "../../hooks/chat/useTheme";
import {
	gTagAuraProductClick,
	gTagCollectionProductClick,
} from "../../helper/webTracker/gtag";
import { getTTid } from "../../helper/getTrackerInfo";
import { addToCart } from "../../pageComponents/DeliveryDetails/redux/action";
import axios from "axios";

const { Text } = Typography;

export const PRODUCT_CARD_WIDGET_TYPES = {
	DEFAULT: "default",
	ACTION_COVER: "actionCover",
};

const ProductCard = ({
	product,
	isCustomProductsPage,
	enableClickTracking = false,
	selectedSearchOption,
	collection_id,
	onProductClick,
	productClickParam = {},
	hideViewSimilar = false,
	hideAddToWishlist = false,
	enableHoverShowcase = false,
	hideBuyNow = false,
	showRemoveIcon = false,
	enableCopyFeature = true,
	size = "medium", // small, medium
	height = "h-340", // need to send tailwind class for height,
	wishlist,
	onRemoveIconClick,
	buyNowTitle = "Buy Now",
	buyNowSubTitle,
	enableSelect,
	isSelected,
	setSelectValue,
	showEdit = false,
	showStar = false,
	showChinSection = false, // REMOVE
	widgetType = PRODUCT_CARD_WIDGET_TYPES.DEFAULT, // default | actionCover
	onEditClick,
	onStarClick,
	openProductDetails = true,
	allowEdit = false,
	wishlistGeneratedBy,
	collection_name,
	collection_path,
	collection_status,
	localChatMessage,
	blogCollectionPage,
}) => {
	const navigate = useNavigate();
	console.log('hideAddToWishlist', enableSelect);
	// console.log('qzssddsdsds',product);

	const dispatch = useDispatch();
	const { themeCodes } = useTheme();

	const [authUserId, authUserName, showChatModal, showWishlistModal, store_id, authUser] =
		useSelector((state) => [
			state.auth.user.data.user_id,
			state.auth.user.data.user_name,
			state.chatV2.showChatModal,
			state.appState.wishlist.showWishlistModal,
			state.store.data.store_id,
			state.auth.user.data,

		]);
	// console.log('authUser', authUser);
	const [storeData] = useSelector((state) => [state.store.data]);

	// console.log('storeData',storeData.pdp_settings.is_add_to_cart_button);
	// const favoriteColl =
	// 	useSelector(getCurrentUserFavoriteCollection) || defaultFavoriteColl;
	const [count, setCount] = useState(1);
	// console.log("counttttt",count);

	const enableViewSimilar = useMemo(() => {
		return enable_view_similar_products === "false" ? false : !hideViewSimilar;
	}, [enable_view_similar_products, hideViewSimilar]);

	const isProductUrlAvailable =
		product.url && product.url !== PRODUCT_DUMMY_URL;

	const currencySymbol = useMemo(
		() => (product?.currency_symbol ? product.currency_symbol : "&#36;"),
		[product?.currency_symbol]
	);

	const handleOpenProductModal = useCallback(
		(allowEdit) => {
			dispatch(
				openProductModal({
					payload: product,
					collectionId: collection_id,
					allowEdit,
				})
			);
		},
		[product, collection_id, allowEdit]
	);
	console.log(product);

	const handleProductClick = async () => {
		if (enableSelect) {
			setSelectValue && setSelectValue(!isSelected);
		} else {
			// tracking event happens from here by prop enableClickTracking
			if (enableClickTracking) {
				await sharedPageTracker.onCollectionProductClick({
					mfrCode: product.mfr_code,
					redirectionUrl: product.url,
					product_brand: product.product_brand,
					brand: product.brand,
					sponsored: product.sponsored,
					collectionId: collection_id,
					...productClickParam,
				});
			}
			// prop function to fetch recommendation on shared page
			if (onProductClick) onProductClick();

			if (selectedSearchOption?.title) {
				// GTAG CONFIGURATION AURA
				// START
				console.log(selectedSearchOption);

				gTagAuraProductClick({
					mft_code: product?.mfr_code,
					aura_widget: selectedSearchOption?.id,
					user_id: getTTid(),
					user_name: authUserName,
					term: localChatMessage || "",
				});
				// END
			} else {
				// GTAG CONFIGURATION
				// START

				// console.log(blogCollectionPage);

				gTagCollectionProductClick({
					mft_code: product?.mfr_code,
					collection_path: authUserId
						? addSidInProductUrl(
							product.url,
							authUserId,
							blogCollectionPage?.collection_id
						)
						: product.url,
					user_id: getTTid(),
					user_name: authUserName,
					collection_id: blogCollectionPage?.collection_id || "",
					collection_name: blogCollectionPage?.collection_name,
				});
				// END
			}

			if (isProductUrlAvailable) {
				// redirect user with a extra query param sid=userId in the opening url (requirement for tracking user details after redirection)
				const redirectionUrl = authUserId
					? addSidInProductUrl(
						product.url,
						authUserId,
						blogCollectionPage?.collection_id
					)
					: product.url;
				window.open(redirectionUrl, "_blank");
			} else if (storeData?.pdp_settings?.is_buy_popup == false && !isCustomProductsPage || pdp_page_enabled) {
				navigate(`/product/${product.mfr_code}`); // new: redirect on productDetails page on product click
				if (showChatModal) {
					dispatch(setShowChatModal(false));
				}
				if (showWishlistModal) {
					dispatch(closeWishlistModal());
				}
			} else {
				handleOpenProductModal(allowEdit); // old: show update product modal on product click
			}
		}
	};

	const discountPer =
		product?.price &&
		product?.listprice &&
		+product?.listprice > +product?.price &&
		getPercentage(product.listprice, product.price);

	const addToWishlistClick = (event) => {
		event.preventDefault();
		event.stopPropagation();

		// DISABLED this feature of adding item to favorites on click on add to collection
		// NEED TO REMOVE THIS FEATURE CODE FROM REDUX/ACTION/SAGA
		// NEED TO REMOVE remove from favorites handling as well

		// add product in favorites if it is not there
		// const isProductExistsInFavorites = favoriteColl.product_lists.some(
		// 	(p) => p.mfr_code === product.mfr_code
		// );

		// if (!isProductExistsInFavorites) {
		// 	// adding item to favorites (system collection)
		// 	// const user = {};
		// 	// const item = { product_id: product.mfr_code };
		// 	// if (window?.cemantika?.ecommerce)
		// 	// 	window.cemantika.ecommerce.addItemToWishlist(user, item);

		// 	// not calling it for add to favorites for now
		// 	// const event = {
		// 	// 	mfrCode: product.mfr_code,
		// 	// 	product_brand: product.product_brand,
		// 	// 	brand: product.brand,
		// 	// 	collectionId: productClickParam.collectionId,
		// 	// 	iCode: productClickParam.iCode,
		// 	// 	campCode: productClickParam.campCode,
		// 	// 	collectionName: productClickParam.collectionName,
		// 	// };
		// 	// appTracker.onAddItemToWishlist(event);

		// 	const payload = {
		// 		_id: favoriteColl._id,
		// 		user_id: authUserId,
		// 		collection_name: defaultFavoriteColl.collection_name,
		// 		type: defaultFavoriteColl.type,
		// 		products: [
		// 			{
		// 				mfr_code: product.mfr_code,
		// 				tagged_by: product.tagged_by,
		// 			},
		// 		],
		// 		fetchRecommendations: true,
		// 		fetchUserCollections: true,
		// 	};

		// 	dispatch(addToWishlist(payload));
		// 	dispatch(setRemoveFromFavorites(true));
		// } else {
		dispatch(setRemoveFromFavorites(false));
		// }

		let createWishlistData = {};

		if (wishlistGeneratedBy) {
			createWishlistData.generated_by = wishlistGeneratedBy;
		}

		dispatch(setProductsToAddInWishlist([product], createWishlistData));
		dispatch(openWishlistModal());
	};



	const checkoutPayment = async (e) => {

		e.stopPropagation()
		e.preventDefault()


		const location = window.location.origin

		const payload = {
			amount: product?.listprice || product?.price || 0, // MANDATORY
			currency: "USD", // MANDATORY
			thumbnail: product.image,
			user_id: authUserId,
			store_id: store_id,
			service_id: `Product_${product.mfr_code}`,
			emailId: authUser.emailId,
			successUrl: `${location}/successpayment`,
			failureUrl: `${location}/failedpayment`,
			additional_details: {
				// collection_id: collection_id,
				mfr_code: product.mfr_code,
				// order_id: "",
			},
			title: product.name,
			// type: "bank transfer",
			// successMessage: "download image now",
		};

		try {
			const res = await axios.post(
				`${payment_url}/api/payments/checkout`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// console.log("Checkout response:", res.data.redirectUrl);
			// 🔁 If API returns payment URL
			if (res?.data?.redirectUrl) {
				window.location.href = res.data.redirectUrl;
			}
		} catch (error) {
			console.error("Checkout error:", error);
			// alert("Payment initiation failed. Please try again.");
		}
	};




	const handleAddToCart = (e) => {
		e.stopPropagation();

		if (!product?.mfr_code) return;

		const payload = {
			products: [
				{
					mfr_code: product.mfr_code,
					tagged_by: product.tagged_by || [],
					qty: Number(count),
				},
			],
			product_lists: [],
			collection_name: "my cart",
			type: "system",
			user_id: authUserId,
			// collection_id: mycartcollectionid,
			// path: mycartcollectionpath,
		};
		dispatch(addToCart(payload));
	};

	const onSimilarClick = (event) => {
		event.stopPropagation();
		dispatch(
			fetchSimilarProducts({
				mfr_code: product.mfr_code,
				name: product.name,
				errorMessage: "Unable to fetch similar products",
			})
		);
	};

	const removeFromWishlistClick = (event) => {
		event.stopPropagation();
		event.preventDefault();

		if (onRemoveIconClick) {
			onRemoveIconClick(product.mfr_code);
		}
	};

	const handleSelectProduct = (e) => {
		e.stopPropagation();
		setSelectValue && setSelectValue(!isSelected);
	};

	const handleCopyClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		product && dispatch(openProductDetailsCopyModal(product));
	};

	const handleEditClick = useCallback(
		(e) => {
			e.stopPropagation();
			if (onEditClick) {
				onEditClick();
			} else {
				handleOpenProductModal(true);
			}
		},
		[onEditClick, handleOpenProductModal]
	);

	const handleStarClick = useCallback(
		(e) => {
			e.stopPropagation();
			onStarClick && onStarClick();
		},
		[onStarClick]
	);

	return (
		<div
			className={`box-content ${getCurrentTheme()} ${widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER
				? "flex flex-col bg-slate-100 rounded-xl   shadow-m"
				: ""
				} ${size === "small" ? "" : "w-40 sm:w-180 lg:w-80"} h-full`}>
			<div
				className={`overflow-hidden relative cursor-pointer product_card_container mt-3 shadow-3xl ${showChinSection ? "rounded-t-xl" : "rounded-t-xl rounded-b-xl"
					} flex flex-col h-full`}
				onClick={handleProductClick}>
				{/* add div wrapper for show buy now on hover (exclude product header) */}
				<div
					className={`product_image_footer_container flex-shrink-0`}>
					<div>
						<img
							src={getFinalImageUrl(product.image)}
							width='100%'
							className={`h-180 p-2 object-contain ${size === "small" ? "lg:h-180" : "lg:h-60"
								}`}
							loading='lazy'
						/>
					</div>

					<div
						className='absolute flex-col top-0 h-full w-full items-center justify-center z-10 hidden buyNow_addWishlist_container'
						style={{ background: themeCodes.productCard.hover_bg }}>
						<>
							{!enableSelect ? (
								<h1
									className={`m-0 ${size === "small" ? "text-base" : "text-2xl"
										} font-semibold text-white top-1/2 product_buy_now flex items-center`}>
									{isProductUrlAvailable ? buyNowTitle : null}
									{isProductUrlAvailable ? (
										<Image src={openInNewTabIcon} alt="open" width={20} height={20} className="text-white ml-2.5 w-5 h-5" />
									) : null}
								</h1>
							) : null}
							{product.brand && (
								<h1
									className={`box-border text-white opacity-80 ${size === "small" ? "text-sm" : "text-base"
										} text-center px-0.75`}>
									{buyNowSubTitle || `From ${product.brand}`} </h1>
							)}
							{(storeData?.pdp_settings?.is_buy_button ||
								storeData?.pdp_settings?.is_add_to_cart_button) && (
									<>
										{storeData?.pdp_settings?.is_buy_button ? (
											<button
												className="box-border border flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container mt-3"
												onClick={checkoutPayment}
											>
												Buy Now
											</button>
										) : (
											<button
												className="box-border border flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container"
											>
												Add to Cart
											</button>
										)}
									</>
								)}

						</>
						{!enableSelect ? (
							<div className='absolute bottom-2'>
								{enableHoverShowcase && (
									<div className='box-border flex items-center justify-center px-2 py-1 mb-1'>
										<button
											className={`flex items-center text-black-200 ${onStarClick ? "cursor-pointer" : "cursor-default"
												}`}
											role={onStarClick ? "button" : "img"}
											onClick={handleStarClick}>
											{product.starred ? (
												<StarFilled className='flex text-xl text-secondary' />
											) : (
												<StarOutlined className='flex text-xl text-white' />
											)}
											<span className='box-border text-base font-semibold text-white pl-2'>
												Showcase
											</span>
										</button>
									</div>
								)}
								<div className='flex items-center justify-center'>
									{!hideAddToWishlist && (
										<div
											className='box-border border flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container'
											onClick={addToWishlistClick}>
											<HeartOutlined className='text-white text-xl flex add_to_wishlist_icon' />
											<span className='box-border text-base font-semibold text-white pl-2 add_to_wishlist_text'>
												Add to {WISHLIST_TITLE}
											</span>
										</div>
									)}
									{enableCopyFeature && (
										<CopyOutlined
											onClick={handleCopyClick}
											className='text-white text-xl flex ml-2'
										/>
									)}
									{/* <Link to='/cart'> */}
									{storeData?.pdp_settings?.is_add_to_cart_button &&
										<p
											className='box-border border flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container ml-2'
											style={{ zIndex: 10000 }}
											onClick={(e) => handleAddToCart(e)}>
											Add to Cart
										</p>}
									{/* </Link> */}
								</div>
							</div>
						) : null}
					</div>
				</div>

				{/* product card header */}
				<div
					className={`box-border absolute top-0 w-full flex ${enableViewSimilar ||
						(widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
							showRemoveIcon) ||
						enableSelect
						? "flex-row-reverse"
						: ""
						} justify-between ${size === "small"
							? "px-2 lg:px-2.5 h-12"
							: "px-2 lg:p-2.5 h-12 lg:h-20"
						} z-20`}>
					{/* reversed contents for hover css */}

					{enableSelect ? (
						<div
							className={`box-border flex items-center self-baseline product_remove_icon ${size === "small" ? "pl-1 pt-1" : "pl-1 pt-1 lg:pl-0 lg:pt-0"
								}`}>
							<input
								type='checkbox'
								checked={isSelected}
								onClick={handleSelectProduct}
								onChange={() => { }} // fix onchange handler warning
								className={size === "small" ? "lg:h-4 w-4" : "lg:h-6 w-6"}
							/>
						</div>
					) : (
						<>
							{enableViewSimilar && (
								<div
									className='mt-0.75 lg:mt-0.5 flex items-center self-baseline view_similar_container view-similar-icon'
									onClick={onSimilarClick}>
									<View_similar_icon className='w-5 h-5 lg:w-8 lg:h-8 cursor-pointer text-xl lg:text-3xl-1 view_similar_icon' />
									<span className='box-border text-xl font-bold pl-2 hidden transition-all view_similar_text'>
										View Similar
									</span>
								</div>
							)}
							{widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT &&
								showRemoveIcon && (
									<div className={`flex items-center flex-col justify-center gap-${size === "small" ? "2" : "4"}`}>
										<div
											className={`box-border flex items-center self-baseline product_remove_icon ${size === "small"
												? "pl-1 pt-1"
												: "pl-1 pt-1 lg:pl-0 lg:pt-0"
												}`}
											onClick={removeFromWishlistClick}>
											<p
												className={`flex  justify-center items-center rounded-full text-gray-101 bg-gray-100  ${size === "small" ? "lg:text-base h-5 w-5" : "lg:text-2xl h-6 w-6"
													}`}
											>&times;</p>
										</div>
										{enableCopyFeature && (
											<div
												className={`flex text-gray-101 bg-gray-100 rounded-full  ${size === "small" ? "lg:text-base h-4 w-4" : "lg:text-2xl h-6 w-6"
													}`} onClick={handleCopyClick}>
												<LuCopy className='text-base flex h-5 w-5' />
											</div>
										)}
									</div>
								)}
						</>
					)}
					<div
						// ${enableViewSimilar && "w-3/4"} // removed class name
						className={`product-name overflow-hidden product_details_container`}>
						{/* <div className='flex'>
							<Text
								ellipsis={{ tooltip: product.name }}
								className={`m-0 text-sm ${size === "small" ? "lg:text-sm" : "lg:text-xl"
									} overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2`}>
								{product.name}
							</Text>
						</div> */}
						{/* REMOVE */}
						{/* <h1 className='m-0 text-xs lg:text-sm overflow-hidden overflow-ellipsis whitespace-nowrap capitalize product_attribute'>
							{(product.color?.length &&
								(typeof product.color === "string"
									? product.color
									: product.color[0])) ||
								null}
						</h1> */}
					</div>
				</div>


				{/* product footer */}
				<div className={`box-border w-full flex flex-col px-3 py-3 bg-white mt-auto ${size === "small" ? "gap-2" : "gap-3"}`}>
					{/* Product Name */}
					<div className='flex flex-col gap-1 min-h-[44px]'>
						<Text
							ellipsis={{ tooltip: product.name }}
							className='m-0 text-sm font-semibold text-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap product_name'>
							{product.name || '\u00A0'}
						</Text>

						{/* Brand Info */}
						{product?.brand ? (
							<p className='m-0 text-xs text-gray-600'>From <span className='font-medium'>{product.brand}</span></p>
						) : (
							<p className='m-0 text-xs text-gray-600'>&nbsp;</p>
						)}

						{/* SOLD Badge */}
						{product?.avlble === 0 && (
							<div
								className='p-1 leading-none text-red-500 text-xs product_card_footer_item'
								style={{
									backgroundColor: "#fff2f0",
									border: "1px solid #ffccc7",
									width: "fit-content",
								}}>
								SOLD
							</div>
						)}
					</div>

					{/* Price Section */}
					<div className='flex items-center gap-2 min-h-[32px]'>
						<span className={`text-xl text-gray-900 product_price ${size === "small" ? "lg:text-sm" : "lg:text-xl"}`}>
							{product?.price || product?.listprice ? (
								<span
									dangerouslySetInnerHTML={{
										__html: `${currencySymbol}${product.price || product.listprice}`,
									}}
								/>
							) : (
								<span>&nbsp;</span>
							)}
						</span>

						{product?.price > 0 &&
							product?.listprice > product?.price &&
							discountPer > 0 && (
								<>
									<span className='text-sm line-through text-gray-400 product_listprice'>
										<span
											dangerouslySetInnerHTML={{
												__html: `${currencySymbol}${product.listprice}`,
											}}
										/>
									</span>
									<span className='text-xs font-bold text-red-500 product_discount'>
										{(discountPer && `-${discountPer}%`) || null}
									</span>
								</>
							)}
					</div>

					{/* Action Buttons */}
					{!enableSelect && (
						<div className='flex gap-2 items-center justify-between'>
							{(storeData?.pdp_settings?.is_buy_button || storeData?.pdp_settings?.is_add_to_cart_button) && !isCustomProductsPage && (
								<>
									{storeData?.pdp_settings?.is_buy_button ? (
										<button
											className="flex-1 whitespace-nowrap text-white font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center text-sm z-10 transition-colors product_buy_button disabled:opacity-50 disabled:cursor-not-allowed"
											onClick={checkoutPayment}
											style={{ background: '#7c75ec' }}
											disabled={!product?.price && !product?.listprice}
										>
											Buy now
										</button>
									) : (
										<button
											className="flex-1  text-white font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center text-sm z-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
											onClick={handleAddToCart}
											style={{ background: '#7c75ec' }}
											disabled={!product?.price && !product?.listprice}
										>
											Add to cart
										</button>
									)}
								</>
							)}

							<div>
								{widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER && showStar ? (
									<button
										className={`border rounded-lg p-2 flex items-center justify-center z-20 transition border-gray-300 cursor-pointer ${onStarClick ? "cursor-pointer" : "cursor-default"
											}`}
										tabindex='-1'
										role={onStarClick ? "button" : "img"}
										onClick={handleStarClick}>
										{product.starred ? (
											<StarFilled className='flex text-secondary' />
										) : (
											<StarOutlined className='flex text-black-200' />
										)}
										<span className='box-border leading-none font-bold pl-2 hidden transition-all showcase-btn-text'>
											Showcase
										</span>
									</button>
								) : null}
							</div>
							{(!hideAddToWishlist || widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT && showStar) &&
								<div className='flex gap-1'>
									{!hideAddToWishlist && (
										<button
											className='border rounded-lg p-2 flex items-center justify-center transition z-10'
											onClick={addToWishlistClick}>
											<HeartOutlined className='text-lg flex add_to_wishlist_icon text-gray-600' />
										</button>
									)}

									{widgetType === PRODUCT_CARD_WIDGET_TYPES.DEFAULT && showStar && (
										<button
											onClick={handleStarClick}
											role={onStarClick ? "button" : "img"}
											className={`border rounded-lg p-2 flex items-center justify-center z-20 transition ${product.starred ? "" : "border-gray-300"} ${onStarClick ? "cursor-pointer" : "cursor-default"}`}>
											{product.starred ? (
												<StarFilled className='text-lg text-yellow-500' />
											) : (
												<StarOutlined className='text-lg text-gray-600' />
											)}
										</button>
									)}
								</div>
							}
						</div>
					)}
				</div>

			</div>



			{/* // REMOVE // remove chin section integration and flag // not required */}
			{showChinSection && (
				<div className='box-border bg-white rounded-b-xl flex gap-2 p-1 justify-end'>
					<StarOutlined
						height='fit-content'
						onClick={handleStarClick}
						role={onStarClick ? "button" : "img"}
						className={`flex my-auto z-20 ${size === "small" ? "lg:text-sm" : "lg:text-xl"
							} ${product.starred ? "text-secondary" : "text-black-200"} ${onStarClick ? "cursor-pointer" : "cursor-default"
							}`}
					/>
					{enableCopyFeature && (
						<div
							className='flex items-center self-baseline text-black-200 my-auto cursor-pointer'
							onClick={handleCopyClick}>
							<CopyOutlined className='text-base flex' />
						</div>
					)}
					<div
						className='flex items-center self-baseline product_remove_icon   text-black-200 my-auto'
						onClick={removeFromWishlistClick}>
						<CloseCircleOutlined className='text-base flex  ' />
					</div>
				</div>
			)}
			{widgetType === PRODUCT_CARD_WIDGET_TYPES.ACTION_COVER &&
				(showEdit || showStar || showRemoveIcon) && (
					<div
						className={`flex gap-2  justify-between items-center product-card-action-container ${size === "small" ? "lg:text-base" : "lg:text-xl"
							}`}>
						<div>
							{showRemoveIcon ? (
								<button
									className='flex text-black-200 product-remove-btn absolute top-4 right-2 z-50'
									tabindex='-1'
									onClick={(e) => removeFromWishlistClick(e)}>
									<CloseCircleOutlined className='flex z-50' />
									<span className='box-border leading-none font-bold pl-2 hidden transition-all remove-btn-text'>
										Remove
									</span>
								</button>
							) : null}
						</div>
						<div>
							{showEdit ? (
								<button
									className='flex text-black-200 product-showcase-btn cursor-pointer  '
									tabindex='-1'
									role='button'
									onClick={handleEditClick}>
									<EditFilled className='flex text-black-200' />
									<span className='box-border leading-none font-bold pl-2 hidden transition-all showcase-btn-text'>
										Edit
									</span>
								</button>
							) : null}
						</div>
					</div>
				)}
		</div>
	);
};

export default ProductCard;
