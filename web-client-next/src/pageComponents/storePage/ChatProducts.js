import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Tooltip, Upload, Spin } from "antd";
import { ReloadOutlined, ArrowUpOutlined, ArrowLeftOutlined, SearchOutlined, CloudUploadOutlined, HistoryOutlined, PlusOutlined, MessageOutlined, FormOutlined, CloseOutlined } from "@ant-design/icons";

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
import { setSuggestionsSelectedTag } from "../../hooks/chat/redux/actions";
import styles from "./ChatProducts.module.css";
import AuraInputBox from "./AuraInputBox";

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
  uploadImageProps,
  handleGoBack,
  layoutMode,
  setLayoutMode,
  closeChatModal,
  onOpenSearchPopup,
  isMobile,
  mobileTab,
  followUpQuery,

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
    auraOverlayCoordinates,
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
    state.chatV2.auraOverlayCoordinates,
  ]);

  const [enableSelectProduct, setEnableSelectProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [pastChats, setPastChats] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("unthink_aura_past_chats");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [
      { id: "1", text: "Minimalist modular velvet sofa", timestamp: "10 mins ago" },
      { id: "2", text: "Scandinavian oak dining table with chairs", timestamp: "2 hours ago" },
      { id: "3", text: "Abstract ceramic accent vases", timestamp: "1 day ago" },
      { id: "4", text: "Boho woven hanging light fixtures", timestamp: "3 days ago" },
    ];
  });

  const handleSelectPastChat = (chatText) => {
    if (handleInputChange) {
      handleInputChange({ target: { name: "chat_message", value: chatText } });
    }
    setIsHistoryOpen(false);
  };

  useEffect(() => {
    if (showChatLoader && localChatMessage && typeof localChatMessage === "string") {
      const trimmed = localChatMessage.trim();
      if (trimmed) {
        setPastChats((prev) => {
          if (prev.some((c) => c.text.toLowerCase() === trimmed.toLowerCase())) {
            return prev;
          }
          const updated = [
            { id: Date.now().toString(), text: trimmed, timestamp: "Just now" },
            ...prev,
          ].slice(0, 15);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("unthink_aura_past_chats", JSON.stringify(updated));
            } catch (e) {}
          }
          return updated;
        });
      }
    }
  }, [showChatLoader, localChatMessage]);

  const dispatch = useDispatch();

  const handleSuggestionClick = (tag) => {
    if (suggestionsWithProducts?.suggestions?.tags?.includes(tag)) {
      dispatch(setSuggestionsSelectedTag(tag));
    }
    // Scroll to the tag div
    const tagElement = document.getElementById(`tag-${tag}`);
    if (tagElement) {
      tagElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const originalWidth = 1024;
  const originalHeight = 1027;
  const newWidth = 404;
  const newHeight = 400;

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
        isEmpty(suggestionsWithProducts.suggestions) ? chatProductsData : [],
      ),
    [suggestionsWithProducts.suggestions, chatProductsData, authUser.user_name],
  );

  const isTagAvailable = useMemo(
    () => !isEmpty(suggestionsWithProducts?.suggestions.tags),
    [suggestionsWithProducts?.suggestions.tags],
  );

  const isShopByThemeOptionActive = useMemo(
    () => activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.smart_search,
    [activeSearchOption?.id],
  );

  const isCompleteTheLookOptionActive = useMemo(
    () => activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.complete_the_look,
    [activeSearchOption?.id],
  );

  const isProductSearchOptionActive = useMemo(
    () => activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.product_search,
    [activeSearchOption?.id],
  );

  const shouldShowShopLookSplitLayout = useMemo(
    () =>
      (activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.shop_a_look ||
        isShopByThemeOptionActive ||
        isCompleteTheLookOptionActive ||
        isProductSearchOptionActive) &&
      (widgetHeader || !isEmpty(shopALookData) || !isEmpty(chatProductsData)),
    [
      activeSearchOption?.id,
      isShopByThemeOptionActive,
      isCompleteTheLookOptionActive,
      isProductSearchOptionActive,
      widgetHeader,
      shopALookData,
      chatProductsData,
    ],
  );

  const shopLookPreviewImage = useMemo(
    () => widgetImage || chatImageUrl || products?.image_url || "",
    [widgetImage, chatImageUrl, products?.image_url],
  );

  const shopLookKeywords = useMemo(
    () => (suggestionsWithProducts?.suggestions?.tags || []).slice(0, 6),
    [suggestionsWithProducts?.suggestions?.tags],
  );

  const handleResetSelectProduct = useCallback(
    // reset select product feature // unselect every products
    () => {
      setEnableSelectProduct(false);
      setSelectedProducts([]);
    },
    [],
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
        : [],
    );
  };

  const onAddSelectedProductsToCollection = () => {
    const SelectedProductsData = chatProductsDataToShow.filter((p) =>
      selectedProducts.includes(p.mfr_code),
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
      "aura-response-products-with-tags-container",
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
        <div className={styles["chat-products-nav-container"]}>
          <div
            className={`${styles["chat-products-nav-item"]} ${styles["chat-products-nav-item-active"]}`}
            onClick={scrollToProductsContainer}
          >
            Products
          </div>
          <div
            className={styles["chat-products-nav-item"]}
            onClick={scrollToCollectionsContainer}
          >
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
            layoutMode={shouldShowShopLookSplitLayout ? layoutMode : "full"}
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
            <div className={styles["chat-products-selection-controls"]}>
              {enableSelectProduct ? (
                <div className={styles["chat-products-selected-items"]}>
                  <div className={styles["chat-products-checkbox-group"]}>
                    <Checkbox
                      indeterminate={
                        selectedProducts.length > 0 &&
                        selectedProducts.length < chatProductsDataToShow.length
                      }
                      onChange={onSelectAllChange}
                      checked={
                        selectedProducts.length ===
                        chatProductsDataToShow.length
                      }
                    >
                      {selectedProducts.length} Selected
                    </Checkbox>
                  </div>
                  <p
                    onClick={
                      selectedProducts.length
                        ? onAddSelectedProductsToCollection
                        : undefined
                    }
                    className={`${styles["chat-products-action-text"]} ${selectedProducts.length
                      ? styles["chat-products-action-button"]
                      : styles["chat-products-action-button-disabled"]
                      }`}
                    title="Click to add selected products in collection"
                    role="button"
                  >
                    Add to {WISHLIST_TITLE}
                  </p>

                  <p
                    onClick={() => handleResetSelectProduct()}
                    className={`${styles["chat-products-action-text"]} ${styles["chat-products-action-button"]}`}
                    role="button"
                  >
                    Cancel
                  </p>
                </div>
              ) : (
                <p
                  className={styles["chat-products-select-prompt"]}
                  role="link"
                  onClick={() => setEnableSelectProduct(true)}
                  title="Click and select multiple products to add to collection"
                >
                  Select and add multiple products to collection
                </p>
              )}
            </div>
          ) : null}

          <div
            id="chat_products_inner_content"
            className={`${styles["chat-products-grid"]} ${shouldShowShopLookSplitLayout && layoutMode === "both" ? styles["chat-products-grid-split"] : ""}`}
          >
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
                  setSelectValue={() => onSelectProductClick(product.mfr_code)}
                  localChatMessage={localChatMessage}
                  auramodel={true}
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
      id="chat_products_inner_container"
      className={styles["chat-products-container"]}
    >
      <div
        id="chat_products_content"
        className={styles["chat-products-content"]}
      >
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

        {!shouldShowShopLookSplitLayout &&
          (products.widgetHeader ? (
            <div className={styles["chat-products-header"]}>
              {products.text ? (
                <h1
                  id="current_data_text"
                  className={styles["chat-products-title"]}
                >
                  {products.text}
                </h1>
              ) : null}
              <div>
                {products.image_url ? (
                  <img
                    src={products.image_url}
                    className={styles["chat-products-image"]}
                  />
                ) : null}
                <p>
                  <span
                    id="current_data_widgetHeader"
                    className={styles["chat-products-description"]}
                    dangerouslySetInnerHTML={{
                      __html: products.widgetHeader,
                    }}
                  />
                  {products.page_url ? (
                    <a
                      href={products.page_url}
                      target="_blank"
                      className={styles["chat-products-link"]}
                    >
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

              <div className={styles["chat-products-content-wrapper"]}>
                {/* {widgetImage ? (
								<img
									id='current_data_widgetHeader_image_url'
									src={widgetImage}
									width={208}
									className='rounded-2xl h-content m-auto'
								/>
							) : null} */}
                {widgetHeader ? (
                  <div id="current_data_widgetHeader">
                    <span
                      className={styles["chat-products-widget-header"]}
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
          <div className={styles["chat-products-shop-look-wrapper"]}>
            <div className={`${styles["chat-products-shop-look-layout"]} ${styles[`layout-${layoutMode}`]} ${isMobile ? styles["chat-products-mobile-layout"] : ""}`}>
              {(!isMobile || mobileTab === "description") && (
                <div className={styles["chat-products-shop-look-sidebar"]}>
                  <div className={styles["chat-products-sidebar-header"]}>
                    <ArrowLeftOutlined
                      className="cursor-pointer text-2xl pr-2"
                      onClick={handleGoBack}
                    />
                    <h2 className={styles["chatmodal-category-title"]}>
                      {activeSearchOption?.title?.toUpperCase()}
                    </h2>
                  </div>
                  <div className={`${styles["chat-products-sidebar-body"]} flex flex-col gap-3`}>
                    <div>
                      <div className={styles["chat-products-shop-look-sidebar-content"]}>
                        {showChatLoader || !shopLookPreviewImage ? (
                          <div className={styles["chat-products-shop-look-image-wrapper"]}>
                            <div className={styles["chat-products-image-loading-box"]}>
                              <span>Loading image...</span>
                            </div>
                          </div>
                        ) : (
                          <div className={styles["chat-products-shop-look-image-wrapper"]}>
                            <div className={styles["chat-products-shop-look-image-inner"]}>
                              <img
                                src={shopLookPreviewImage}
                                alt="Shop the look"
                                className={styles["chat-products-shop-look-image"]}
                              />
                              {Array.isArray(auraOverlayCoordinates) &&
                                auraOverlayCoordinates.map((item, index) => {
                                  const leftPercent =
                                    (item.point[0] / originalWidth) * 100;
                                  const topPercent =
                                    (item.point[1] / originalHeight) * 100;

                                  return (
                                    <Tooltip
                                      key={index}
                                      title={item.attributes.label}
                                      color="blue"
                                    >
                                      <div
                                        onClick={() =>
                                          handleSuggestionClick(item.attributes.label)
                                        }
                                        className={styles["chat-products-overlay-point"]}
                                        style={{
                                          left: `${leftPercent}%`,
                                          top: `${topPercent}%`,
                                        }}
                                      />
                                    </Tooltip>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                        {(widgetHeader || shopLookKeywords.length > 0) ? (
                          <div>
                            {widgetHeader ? (
                              <div
                                className={
                                  styles["chat-products-shop-look-description-block"]
                                }
                              >
                                <div
                                  className={`${styles["chat-products-shop-look-description-text"]} ${!isDescriptionExpanded ? styles["chat-products-description-collapsed"] : ""}`}
                                  dangerouslySetInnerHTML={{ __html: widgetHeader }}
                                />
                                {widgetHeader?.length > 100 && (
                                  <button 
                                    className={styles["chat-products-read-more-btn"]}
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                  >
                                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                                  </button>
                                )}
                              </div>
                            ) : null}
                            {/* {shopLookKeywords.length ? (
                              <div
                                className={`${styles["chat-products-shop-look-keywords"]} mt-1 mb-2`}
                              >
                                {shopLookKeywords.map((keyword) => (
                                  <span
                                    key={keyword}
                                    className={
                                      styles["chat-products-shop-look-keyword-chip"]
                                    }
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            ) : null} */}
                          </div>
                        ) : null}
                      </div>
                    </div> 
                  </div>
                  {shouldMoveInputBelowResults ? (
                    <AuraInputBox
                      isShowTryAgain={isShowTryAgain}
                      showChatLoader={showChatLoader}
                      handleTryAgainClick={handleTryAgainClick}
                      handleGoBack={handleGoBack}
                      isShopByThemeOptionActive={isShopByThemeOptionActive}
                      isCompleteTheLookOptionActive={isCompleteTheLookOptionActive}
                      uploadImageProps={uploadImageProps}
                      chatImageUrl={chatImageUrl}
                      activeSearchOption={activeSearchOption}
                      chatTypeKey={chatTypeKey}
                      inputRef={inputRef}
                      localChatMessage={localChatMessage}
                      handleInputChange={handleInputChange}
                      handlePromptKeyDown={handlePromptKeyDown}
                      handlePromptUtilityClick={handlePromptUtilityClick}
                      page_info={page_info}
                      isShopALookOptionActive={isShopALookOptionActive}
                      handleSubmitChatInput={handleSubmitChatInput}
                      setIsHistoryOpen={setIsHistoryOpen}
                      followUpQuery={followUpQuery}
                    />
                  ) : null}
                </div>
              )}

              {(!isMobile || mobileTab === "products") && (
                <div className={styles["chat-products-shop-look-main"]}>
                  <div className={`${styles["chat-products-main-navbar"]} ${isMobile ? styles["chatmodal-hidden-mobile"] : ""}`}>
                    <h2 className={styles["chat-products-navbar-title"]}>
                      Products
                    </h2>
                    <div className={styles["chat-products-navbar-controls"]}>
                      {setLayoutMode && (
                        <div className={styles["chat-products-layout-switcher"]}>
                          <button
                            type="button"
                            className={`${styles["chat-products-layout-btn"]} ${layoutMode === "left" ? styles["chat-products-layout-btn-active"] : ""}`}
                            onClick={() => setLayoutMode("left")}
                            title="Sidebar only"
                          >
                            <div className={styles["layout-icon-left"]} />
                          </button>
                          <button
                            type="button"
                            className={`${styles["chat-products-layout-btn"]} ${layoutMode === "both" ? styles["chat-products-layout-btn-active"] : ""}`}
                            onClick={() => setLayoutMode("both")}
                            title="Split view"
                          >
                            <div className={styles["layout-icon-both"]} />
                          </button>
                          <button
                            type="button"
                            className={`${styles["chat-products-layout-btn"]} ${layoutMode === "right" ? styles["chat-products-layout-btn-active"] : ""}`}
                            onClick={() => setLayoutMode("right")}
                            title="Products only"
                          >
                            <div className={styles["layout-icon-right"]} />
                          </button>
                        </div>
                      )}
                      {isProductSearchOptionActive && onOpenSearchPopup && (
                        <SearchOutlined
                          className={styles["chat-products-search-icon"]}
                          onClick={onOpenSearchPopup}
                          title="Open Search"
                        />
                      )}
                      {closeChatModal && (
                        <CloseOutlined
                          onClick={closeChatModal}
                          className={styles["chat-products-close-icon"]}
                          title="Close"
                        />
                      )}
                    </div>
                  </div>
                  {productsResultsContent}
                </div>
              )}
            </div>
          </div>
        ) : (
          productsResultsContent
        )}
      </div>

      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 transition-all"
          onClick={() => setIsHistoryOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-solid border-[#e8e4fb] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-[#fbfafe] border-b border-solid border-[#e8e4fb] flex items-center justify-between">
              <h3 className="text-[#7268ec] font-bold text-base m-0 flex items-center gap-2">
                <HistoryOutlined /> Past Chats
              </h3>
              <CloseOutlined
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-sm p-1 transition-all"
                onClick={() => setIsHistoryOpen(false)}
                title="Close"
              />
            </div>
            <div className="p-4 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto">
              {pastChats.length > 0 ? (
                pastChats.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectPastChat(item.text)}
                    className="flex items-start justify-between p-3 rounded-xl bg-[#fbfafe]/60 border border-solid border-[#e8e4fb] hover:bg-[#7268ec]/5 hover:border-[#7268ec]/30 cursor-pointer transition-all text-left text-sm font-medium text-gray-700 group"
                  >
                    <span className="line-clamp-2 pr-2 group-hover:text-[#7268ec] transition-colors">
                      {item.text}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0 pt-0.5 font-normal">
                      {item.timestamp}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm font-medium">
                  No past chats found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatProducts;
