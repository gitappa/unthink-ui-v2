import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "antd";

import {
	openWishlistModal,
	setProductsToAddInWishlist,
} from "../wishlist/redux/actions";
import { handleRecProductClick } from "../recommendations/redux/actions";
import ProductCard from "../../components/singleCollection/ProductCard";
import AuraResponseProductsWithTags from "../auraResponseProductsWithTags/AuraResponseProductsWithTags";
import { filterAvailableProductList, isEmpty } from "../../helper/utils";
import { isStagingEnv, is_store_instance } from "../../constants/config";
import {
	CHAT_TYPES_KEYS,
	CHAT_TYPE_CHAT,
	WISHLIST_TITLE,
} from "../../constants/codes";
import AuraResponseShopALook from "../auraResponseShopALook/AuraResponseShopALook";
import styles from './chatSuggestionsWithProducts.module.scss';

const ChatProducts = ({
	enableClickFetchRec,
	enableClickTracking,
	trackCollectionData = {},
	// trackCollectionCampCode,
	// trackCollectionId,
	// trackCollectionName,
	// trackCollectionICode,
	chatTypeKey = CHAT_TYPE_CHAT,
	isBTNormalUserLoggedIn,
	isAuraChatPage,
	handleLoadMore,
	localChatMessage
}) => {
	const {
		trackCollectionCampCode,
		trackCollectionId,
		trackCollectionName,
		trackCollectionICode,
	} = trackCollectionData;

	const [
		showChatLoader,
		chatProductsData,
		widgetHeader,
		widgetImage,
		authUser,
		isUserLogin,
		suggestionsWithProducts,
		products,
		shopALookData,
	] = useSelector((state) => [
		state.chatV2.showChatLoader,
		state.chatV2.chatProductsData || [],
		state.chatV2.widgetHeader,
		state.chatV2.widgetImage,
		state.auth.user.data,
		state.auth.user.isUserLogin,
		state.chatV2.suggestions,
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].products],
		state.chatV2.shopALook,
	]);

	const [enableSelectProduct, setEnableSelectProduct] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);

	const dispatch = useDispatch();

	// const { sendMessage } = useChat();

	const onProductClick = () => {
		if (enableClickFetchRec) dispatch(handleRecProductClick());
	};

	//scroll on top when new data searched
	// useEffect(() => {
	// 	if (!showChatLoader) {
	// 		const parentContainer = document.querySelector(
	// 			".chat-product-data-container"
	// 		);
	// 		parentContainer?.scrollTo({ top: 0, behavior: "smooth" });
	// 	}
	// }, [showChatLoader]);

	// const onAuraSuggestionChipClick = (message, metadata) => {
	// 	// dispatch(setChatMessage(message));
	// 	sendMessage(message, metadata);
	// };

	const NEW_AURA_PRODUCTS_UI_ENABLED = useMemo(() => true, []);

	const chatProductsDataToShow = useMemo(
		() =>
			filterAvailableProductList(
				isEmpty(suggestionsWithProducts.suggestions) ? chatProductsData : []
			),
		[suggestionsWithProducts.suggestions, chatProductsData, authUser.user_name]
	);

	const isTagAvailable = useMemo(
		() => !isEmpty(suggestionsWithProducts?.suggestions.tags),
		[suggestionsWithProducts?.suggestions.tags]
	);

	const handleResetSelectProduct = useCallback(
		// reset select product feature // unselect every products
		() => {
			setEnableSelectProduct(false);
			setSelectedProducts([]);
		},
		[]
	);

	useEffect(() => {
		handleResetSelectProduct();
	}, [chatProductsDataToShow]);

	const onSelectProductClick = (mfr_code) => {
		if (selectedProducts.includes(mfr_code)) {
			setSelectedProducts(selectedProducts.filter((p) => p !== mfr_code));
		} else {
			setSelectedProducts([...selectedProducts, mfr_code]);
		}
	};

	const onSelectAllChange = () => {
		setSelectedProducts(
			selectedProducts.length < chatProductsDataToShow.length
				? chatProductsDataToShow.map((i) => i.mfr_code)
				: []
		);
	};

	const onAddSelectedProductsToCollection = () => {
		const SelectedProductsData = chatProductsDataToShow.filter((p) =>
			selectedProducts.includes(p.mfr_code)
		);

		dispatch(setProductsToAddInWishlist(SelectedProductsData));
		dispatch(openWishlistModal());
		handleResetSelectProduct();
	};

	const scrollToCollectionsContainer = () => {
		const collection = document.getElementById("chat_shop_a_look_container");
		if (collection) {
			collection.scrollIntoView({ behavior: "smooth" });
		}
	};

	const scrollToProductsContainer = () => {
		const products = document.getElementById(
			"aura-response-products-with-tags-container"
		);
		if (products) {
			products.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div
			id='chat_products_inner_container'
			className='sm:container px-3 sm:mx-auto pb-5 bg-white'>
			<div
				id='chat_products_content'
				className='py-3 lg:py-4 max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto flex flex-col gap-2 md:gap-5'>
				{/* <div
					id='chat_product_back_icon'
					className='mb-6 max-w-max flex items-center cursor-pointer z-10'
					onClick={() => dispatch(setShowChatModal(false))}>
					<ArrowLeftOutlined className='text-base text-purple-101 pr-3 flex' />
					<span className='text-base text-purple-101'>
						Back
						// {` ${backToText}`}
					</span>
				</div> */}

				{products.widgetHeader ? (
					<div className='flex flex-col'>
						{products.text ? (
							<h1
								id='current_data_text'
								className='pb-1 md:pb-5 text-black-102 text-lg lg:text-xl font-bold'>
								{products.text}
							</h1>
						) : null}
						<div>
							{products.image_url ? (
								<img
									src={products.image_url}
									className='w-96 max-w-full rounded-2xl h-content float-left mr-3'
								/>
							) : null}
							<p>
								<span
									id='current_data_widgetHeader'
									className='pb-1 md:pb-5 text-black-102 text-base lg:text-lg whitespace-pre-line'
									dangerouslySetInnerHTML={{
										__html: products.widgetHeader,
									}}
								/>
								{products.page_url ? (
									<a
										href={products.page_url}
										target='_blank'
										className='bg-primary text-white py-1 px-4 rounded-lg whitespace-nowrap cursor-pointer'>
										View Article
									</a>
								) : null}
							</p>
						</div>
					</div>
				) : (
					<>
						{/* {widgetHeader ? (
							<h1
								id='current_data_widgetHeader'
								className='text-black-102 text-base lg:text-lg'
								dangerouslySetInnerHTML={{ __html: widgetHeader }}
							/>
						) : null} */}

						<div className='flex gap-5 flex-col md:flex-row my-2'>
							{/* {widgetImage ? (
								<img
									id='current_data_widgetHeader_image_url'
									src={widgetImage}
									width={208}
									className='rounded-2xl h-content m-auto'
								/>
							) : null} */}
							{widgetHeader ? (
								<div id='current_data_widgetHeader'>
									<span
										className='text-black-102 text-base lg:text-lg whitespace-pre-line'
										dangerouslySetInnerHTML={{
											__html: widgetHeader,
										}}
									/>
								</div>
							) : null}
						</div>
					</>
				)}

				{!isEmpty(shopALookData) &&
					isTagAvailable &&
					!isBTNormalUserLoggedIn ? (
					<div className='flex flex-row gap-3 text-left text-slate-103 text-sm md:text-base font-bold'>
						<div
							className='cursor-pointer text-indigo-600 border-b-2 border-indigo-600 px-2.5'
							onClick={scrollToProductsContainer}>
							Products
						</div>
						<div
							className='cursor-pointer'
							onClick={scrollToCollectionsContainer}>
							Collections
						</div>
					</div>
				) : null}

				{NEW_AURA_PRODUCTS_UI_ENABLED ? (
					<>
						<AuraResponseProductsWithTags
							handleLoadMore={handleLoadMore}
							enableClickFetchRec={enableClickFetchRec}
							enableClickTracking={enableClickTracking}
							trackCollectionCampCode={trackCollectionCampCode}
							trackCollectionId={trackCollectionId}
							trackCollectionName={trackCollectionName}
							trackCollectionICode={trackCollectionICode}
							chatTypeKey={chatTypeKey}
							widgetHeader={widgetHeader}
							widgetImage={widgetImage}
							isAuraChatPage={isAuraChatPage}
							localChatMessage={localChatMessage}
						/>
					</>
				) : null}

				{!isBTNormalUserLoggedIn ? (
					<>
						<AuraResponseShopALook
							enableClickFetchRec={enableClickFetchRec}
							enableClickTracking={enableClickTracking}
							trackCollectionCampCode={trackCollectionCampCode}
							trackCollectionId={trackCollectionId}
							trackCollectionName={trackCollectionName}
							trackCollectionICode={trackCollectionICode}
						/>
					</>
				) : null}

				{/* old UI : showing only select features and product card */}
				{/* When select search icon and enter a search query in the search input, a server -> current_data_data response was received. */}
				{/* if will got server -> current_data_data, need to update new functionality for select */}
				{chatProductsDataToShow.length ? (
					<div>
						{isUserLogin ? (
							<div className='flex ml-auto text-xs md:text-base mb-2'>
								{enableSelectProduct ? (
									<div className='flex items-center leading-44'>
										<div className='flex border border-gray-106 rounded py-2 pl-2'>
											<Checkbox
												className='text-xs md:text-base'
												indeterminate={
													selectedProducts.length > 0 &&
													selectedProducts.length <
													chatProductsDataToShow.length
												}
												onChange={onSelectAllChange}
												checked={
													selectedProducts.length ===
													chatProductsDataToShow.length
												}>
												{selectedProducts.length} Selected
											</Checkbox>
										</div>
										<p
											onClick={
												selectedProducts.length
													? onAddSelectedProductsToCollection
													: undefined
											}
											className={`${selectedProducts.length
												? "text-blue-103 cursor-pointer"
												: "text-gray-104 cursor-not-allowed"
												} mb-0 ml-2 underline`}
											title='Click to add selected products in collection'
											role='button'>
											Add to {WISHLIST_TITLE}
										</p>

										<p
											onClick={() => handleResetSelectProduct()}
											className='text-blue-103 mb-0 ml-2 underline cursor-pointer'
											role='button'>
											Cancel
										</p>
									</div>
								) : (
									<p
										className='text-blue-103 leading-44 cursor-pointer'
										role='link'
										onClick={() => setEnableSelectProduct(true)}
										title='Click and select multiple products to add to collection'>
										Select and add multiple products to collection
									</p>
								)}
							</div>
						) : null}

						<div
							id='chat_products_inner_content'
							className='grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4'>
							{chatProductsDataToShow.map((product) => (
								<React.Fragment key={product.mfr_code}>
									<ProductCard
										product={product}
										onProductClick={onProductClick}
										enableClickTracking={enableClickTracking}
										productClickParam={{
											iCode: authUser.influencer_code,
											campCode: trackCollectionCampCode,
											collectionId: trackCollectionId,
											collectionName: trackCollectionName,
											collectionICode: trackCollectionICode,
										}}
										hideAddToWishlist={is_store_instance && !isUserLogin}
										enableSelect={enableSelectProduct}
										isSelected={selectedProducts.includes(product.mfr_code)}
										setSelectValue={() =>
											onSelectProductClick(product.mfr_code)
										}
										localChatMessage={localChatMessage}
									/>
								</React.Fragment>
							))}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ChatProducts;
