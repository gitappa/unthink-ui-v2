import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "antd";
import { ReloadOutlined, ArrowUpOutlined } from "@ant-design/icons";

import {
	openWishlistModal,
	setProductsToAddInWishlist,
} from "../wishlist/redux/actions";
import { handleRecProductClick } from "../recommendations/redux/actions";
import ProductCard from "../../components/singleCollection/ProductCard";
import AuraResponseProductsWithTags from "../auraResponseProductsWithTags/AuraResponseProductsWithTags";
import { filterAvailableProductList, isEmpty } from "../../helper/utils";
import { is_store_instance } from "../../constants/config";
import {
	CHAT_TYPES_KEYS,
	CHAT_TYPE_CHAT,
	CHAT_SEARCH_OPTION_ID,
	WISHLIST_TITLE,
} from "../../constants/codes";
import AuraResponseShopALook from "../auraResponseShopALook/AuraResponseShopALook";
import styles from './ChatProducts.module.css';

const ChatProducts = ({
	enableClickFetchRec,
	enableClickTracking,
	trackCollectionData = {},
	chatTypeKey = CHAT_TYPE_CHAT,
	isBTNormalUserLoggedIn,
	isAuraChatPage,
	handleLoadMore,
	localChatMessage,
	shouldMoveInputBelowResults,
	inputRef,
	handleInputChange,
	handlePromptKeyDown,
	isFigmaUploadPanelOpen,
	handleFigmaUploadButtonClick,
	isShowSubmittedChatPreview,
	handlePromptUtilityClick,
	isShopALookOptionActive,
	handleSubmitChatInput,
	isShowFollowUpSearch,
	isSidExpired,
	isFollowUpQuery,
	handleFollowUpSearch,
	isShowTryAgain,
	showChatLoader,
	handleTryAgainClick,
	upload_icon,
	page_info,
}) => {
	const {
		trackCollectionCampCode,
		trackCollectionId,
		trackCollectionName,
		trackCollectionICode,
	} = trackCollectionData;

	const [
		chatProductsData,
		widgetHeader,
		widgetImage,
		chatImageUrl,
		authUser,
		isUserLogin,
		suggestionsWithProducts,
		products,
		shopALookData,
		activeSearchOption,
	] = useSelector((state) => [
		state.chatV2.chatProductsData || [],
		state.chatV2.widgetHeader,
		state.chatV2.widgetImage,
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].chatImageUrl],
		state.auth.user.data,
		state.auth.user.isUserLogin,
		state.chatV2.suggestions,
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].products],
		state.chatV2.shopALook,
		state.chatV2.activeSearchOption || {},
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

	const shouldShowShopLookSplitLayout = useMemo(
		() =>
			!isBTNormalUserLoggedIn &&
			activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.shop_a_look &&
			(!!widgetImage ||
				!!chatImageUrl ||
				!!widgetHeader ||
				!isEmpty(suggestionsWithProducts?.suggestions) ||
				!isEmpty(shopALookData)),
		[
			isBTNormalUserLoggedIn,
			activeSearchOption?.id,
			widgetImage,
			chatImageUrl,
			widgetHeader,
			suggestionsWithProducts?.suggestions,
			shopALookData,
		]
	);

	const shopLookPreviewImage = useMemo(
		() => widgetImage || chatImageUrl || products?.image_url || "",
		[widgetImage, chatImageUrl, products?.image_url]
	);

	const shopLookKeywords = useMemo(
		() => (suggestionsWithProducts?.suggestions?.tags || []).slice(0, 6),
		[suggestionsWithProducts?.suggestions?.tags]
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

	const productsResultsContent = (
		<>
			{!isEmpty(shopALookData) &&
				isTagAvailable &&
				!isBTNormalUserLoggedIn &&
				!shouldShowShopLookSplitLayout ? (
				<div className={styles['chat-products-nav-container']}>
					<div
						className={`${styles['chat-products-nav-item']} ${styles['chat-products-nav-item-active']}`}
						onClick={scrollToProductsContainer}>
						Products
					</div>
					<div
						className={styles['chat-products-nav-item']}
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
						showTitle={!shouldShowShopLookSplitLayout}
					/>
				</>
			) : null}

			{!isBTNormalUserLoggedIn && !shouldShowShopLookSplitLayout ? (
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

			{chatProductsDataToShow.length ? (
				<div>
					{isUserLogin ? (
						<div className={styles['chat-products-selection-controls']}>
							{enableSelectProduct ? (
								<div className={styles['chat-products-selected-items']}>
									<div className={styles['chat-products-checkbox-group']}>
										<Checkbox
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
										className={`${styles['chat-products-action-text']} ${selectedProducts.length
											? styles['chat-products-action-button']
											: styles['chat-products-action-button-disabled']
										}`}
										title='Click to add selected products in collection'
										role='button'>
										Add to {WISHLIST_TITLE}
									</p>

									<p
										onClick={() => handleResetSelectProduct()}
											className={`${styles['chat-products-action-text']} ${styles['chat-products-action-button']}`}
										role='button'>
										Cancel
									</p>
								</div>
							) : (
								<p
									className={styles['chat-products-select-prompt']}
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
						className={styles['chat-products-grid']}>
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
		</>
	);

	return (
		<div
			id='chat_products_inner_container'
			className={styles['chat-products-container']}>
			<div
				id='chat_products_content'
				className={styles['chat-products-content']}>
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

				{!shouldShowShopLookSplitLayout && (products.widgetHeader ? (
					<div className={styles['chat-products-header']}>
						{products.text ? (
							<h1
								id='current_data_text'
								className={styles['chat-products-title']}>
								{products.text}
							</h1>
						) : null}
						<div>
							{products.image_url ? (
								<img
									src={products.image_url}
									className={styles['chat-products-image']}
								/>
							) : null}
							<p>
								<span
									id='current_data_widgetHeader'
									className={styles['chat-products-description']}
									dangerouslySetInnerHTML={{
										__html: products.widgetHeader,
									}}
								/>
								{products.page_url ? (
									<a
										href={products.page_url}
										target='_blank'
											className={styles['chat-products-link']}>
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

						<div className={styles['chat-products-content-wrapper']}>
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
										className={styles['chat-products-widget-header']}
										dangerouslySetInnerHTML={{
											__html: widgetHeader,
										}}
									/>
								</div>
							) : null}
						</div>
					</>
				))}

				{shouldShowShopLookSplitLayout ? (
					<div className={styles['chat-products-shop-look-layout']}>
						 
						<div className={styles['chat-products-shop-look-sidebar']}>
							<h2 className={styles['chat-products-shop-look-title']}>SHOP THE LOOK</h2>
							<div className="flex flex-col h-full justify-between min-h-[70vh] ">

							<div>
							<div className="flex justify-between gap-3">
							{shopLookPreviewImage ? (
								<img
								src={shopLookPreviewImage}
								alt='Shop the look'
								className={styles['chat-products-shop-look-image']}
								/>
							) : null}
						<div>

							<div className={styles['chat-products-shop-look-description-block']}>
								<h3 className={styles['chat-products-shop-look-description-title']}>
									Image Description
								</h3>
								{widgetHeader ? (
									<div
										className={styles['chat-products-shop-look-description-text']}
										dangerouslySetInnerHTML={{ __html: widgetHeader }}
									/>
								) : null}
							</div>
							{shopLookKeywords.length ? (
								<div className={styles['chat-products-shop-look-keywords']}>
									{shopLookKeywords.map((keyword) => (
										<span
											key={keyword}
											className={styles['chat-products-shop-look-keyword-chip']}>
											{keyword}
										</span>
									))}
								</div>
							) : null}
							<button
								type='button'
								className={styles['chat-products-shop-look-smart-search']}
								onClick={scrollToProductsContainer}>
								Smart search
							</button>
							</div>

							</div>
		{isShowFollowUpSearch || isShowTryAgain ? (
										<div className={styles['chat-products-bottom-followup-controls']}>
											{isShowFollowUpSearch && isSidExpired ? (
												<div className={styles['chat-products-bottom-followup-checkbox-wrap']}>
													<input
														type='checkbox'
														id='followUpQuery_bottom'
														className={styles['chat-products-bottom-followup-checkbox']}
														checked={isFollowUpQuery}
														disabled={showChatLoader}
														onChange={handleFollowUpSearch}
													/>
													<label
														htmlFor='followUpQuery_bottom'
														className={showChatLoader
															? styles['chat-products-bottom-followup-label-disabled']
															: styles['chat-products-bottom-followup-label']}>
														Follow-Up search
													</label>
												</div>
											) : null}
											{isShowFollowUpSearch &&
												isShowTryAgain &&
												isSidExpired ? (
												<div className={styles['chat-products-bottom-followup-divider']}></div>
											) : null}
											{isShowTryAgain ? (
												<button
													className={`${styles['chat-products-bottom-try-again-button']} ${showChatLoader
														? styles['chat-products-bottom-try-again-button-disabled']
														: ""
														}`}
													title='Regenerate the products with AI.'
													onClick={handleTryAgainClick}
													disabled={showChatLoader}>
													<ReloadOutlined className={styles['chat-products-bottom-reload-icon']} />
													Try again
												</button>
											) : null}
										</div>
									) : null}

									</div>
							{shouldMoveInputBelowResults ? (
								<div className={styles['chat-products-bottom-input-wrapper']}>
									<div className={styles['chat-products-bottom-input-card']}>
										<input
											id={`chat_search_input_bottom_${chatTypeKey}`}
											type='text'
											ref={inputRef}
											placeholder={
												typeof activeSearchOption?.text_placeholder === "string"
													? activeSearchOption?.text_placeholder
													: activeSearchOption?.text_placeholder?.[0] ||
													"Describe your product idea"
											}
											name='chat_message'
											value={localChatMessage}
											onChange={handleInputChange}
											onKeyDown={handlePromptKeyDown}
											className={styles['chat-products-bottom-input']}
										/>
										<div className={styles['chat-products-bottom-input-divider']} />
										<div className={styles['chat-products-bottom-input-actions']}>
											<div className={styles['chat-products-bottom-input-actions-left']}>
												<button
													type='button'
													className={`${styles['chat-products-bottom-icon-button']} ${styles['chat-products-bottom-image-button']} ${isFigmaUploadPanelOpen || chatImageUrl
														? styles['chat-products-bottom-image-button-active']
														: ""
														}`}
													title='Upload image'
													onClick={handleFigmaUploadButtonClick}>
													<img
														src={upload_icon?.src || upload_icon}
														alt='Upload image'
														className={styles['chat-products-bottom-icon']}
													/>
													{(isFigmaUploadPanelOpen || chatImageUrl) && <span>Image</span>}
												</button>
												<button
													type='button'
													className={styles['chat-products-bottom-icon-button']}
													title='Open assistant settings'
													onClick={handlePromptUtilityClick}>
													<img
														src={page_info?.src || page_info}
														alt='Assistant settings'
														className={styles['chat-products-bottom-icon']}
													/>
												</button>
												{chatImageUrl && !isShowSubmittedChatPreview ? (
													<div className={styles['chat-products-bottom-upload-pill']}>
														Image attached
													</div>
												) : null}
											</div>
											<button
												type='button'
												className={`${styles['chat-products-bottom-submit']} ${(isShopALookOptionActive
													? !chatImageUrl
													: !localChatMessage && !chatImageUrl)
													? styles['chat-products-bottom-submit-disabled']
													: ""
													}`}
												onClick={handleSubmitChatInput}
												disabled={isShopALookOptionActive ? !chatImageUrl : !localChatMessage && !chatImageUrl}>
												<ArrowUpOutlined />
											</button>
										</div>
									</div>
							
								</div>
							) : null}
							</div>

						</div>
							

					 

						<div className={styles['chat-products-shop-look-main']}>
							<h2 className={styles['chat-products-shop-look-main-title']}>Products</h2>
							{productsResultsContent}
						</div>

						
					</div>
				) : (
					productsResultsContent
				)}

					
			</div>
		</div>
	);
};

export default ChatProducts;
