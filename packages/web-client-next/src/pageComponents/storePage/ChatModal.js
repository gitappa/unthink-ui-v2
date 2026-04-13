import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { Tooltip, Image, Upload, Spin } from "antd";
import {
  CloseOutlined,
  ReloadOutlined,
  CaretRightOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  LoadingOutlined,
  ArrowUpOutlined,
  SlidersOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useNavigate } from "../../helper/useNavigate";

import star_ai_icon from "./Images/Illustration.png";
import searchIcon from "../../images/swiftly-styled/Aura - Search.svg";

import auraCardOne from "./Images/aura.png";
import auraCardTwo from "./Images/aura2.png";
import auraCardThree from "./Images/aura3.png";
import styles from "./ChatModal.module.css";
import {
  setActiveSearchOption,
  setAuraHelperMessage,
  setChatMessage,
  setShowChatModal,
  setChatProducts,
  setChatProductsData,
  setChatShopALook,
  setWidgetHeader,
  setWidgetImage,
  resetSuggestionsList,
  setChatImageUrl,
  resetAuraSearchResponse,
  setShowChatLoader,
  setSuggestionsSelectedTag,
  setOverlayCoordinates,
  setAuraSreverImage,
} from "../../hooks/chat/redux/actions";
import { isEmpty, getRandomArrayElements } from "../../helper/utils";
import { profileAPIs } from "../../helper/serverAPIs";
import { setIsSendSocketMessageWithPrefix } from "../../helper/getTrackerInfo";
import useOnClickOutside from "../../helper/useClickOutside";
import ChatSuggestionsV2 from "./ChatSuggestionsV2";
import {
  enable_recommendations,
  is_kiosk,
  current_store_name,
  // isStagingEnv,
  // is_store_instance,
} from "../../constants/config";
import {
  CHAT_SEARCH_OPTION_ID,
  CHAT_TYPES_KEYS,
  CHAT_TYPE_CHAT,
  COLLECTIONS_ID,
  STORE_USER_NAME_SAMSKARA,
  MAIN_SITE_URL,
} from "../../constants/codes";
import { useChat } from "../../hooks/chat/useChat";
import ChatProducts from "./ChatProducts";
import Recommendations from "../recommendations/Recommendations";
import { KioskSearchOptions } from "../kioskSearchOptions/KioskSearchOptions";
import { socket } from "../../context/socketV2";
import upload_icon from "./Images/upload_icon.png";
import page_info from "./Images/page_info.png";

const { Dragger } = Upload;

const ChatModal = ({
  handleMicrophoneClick,
  streaming,
  submitChatInput,
  // submitImageUrl,
  onChatClick,
  onStopRecording,
  disabledOutSideClick = false,
  showSettings,
  openSettingModal,
  chatInputMetadata,
  chatTypeKey,
  config,
  trackCollectionData,
  isBTInstance,
  inputRef,
  isFollowUpQuery,
  setIsFollowUpQuery,
  widgetHeaderRequest,
  showSubmitImageTooltip,
  setShowSubmitImageTooltip,
  isBTNormalUserLoggedIn,
  isAuraChatPage,
}) => {
  const navigate = useNavigate();
  const [
    chatMessage,
    chatImageUrl,
    products,
    showChatLoader,
    activeSearchOption,
    auraHelperMessage,
    shopALookData,
    widgetHeader,
    widgetImage,
    suggestionsWithProducts,
    isFreshSearch,
    searchOptions,
    authUser,
    isGuestPopUpShow,
    auraServerImage,
    auraOverlayCoordinates,
    socketId,
    ButtonClick,
  ] = useSelector((state) => [
    state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].chatMessage],
    state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].chatImageUrl],
    state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].products],
    state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].showChatLoader],
    state.chatV2.activeSearchOption || {},
    state.chatV2.auraHelperMessage,
    state.chatV2.shopALook,
    state.chatV2.widgetHeader,
    state.chatV2.widgetImage,
    state.chatV2.suggestions,
    state.chatV2.isFreshSearch,
    state.store.data.searchOptions || [],
    state.auth.user.data,
    state.GuestPopUpReducer.isGuestPopUpShow,
    state.chatV2.auraServerImage,
    state.chatV2.auraOverlayCoordinates,
    state.chatV2.socketId,
    state.VtoIconReducer.ButtonClick,
  ]);
  //   console.log("auraServerImage", activeSearchOption);

  const {
    suggestions: { tags = [], title = "" },
  } = suggestionsWithProducts;

  const [showUploadImage, setShowUploadImage] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isFigmaUploadPanelOpen, setIsFigmaUploadPanelOpen] = useState(false);
  const [isSearchOptionManuallySelected, setIsSearchOptionManuallySelected] =
    useState(false);
  const [submittedPromptPreview, setSubmittedPromptPreview] = useState({
    message: "",
    imageUrl: "",
  });

  const dispatch = useDispatch();

  const modalRef = useRef(null);
  const figmaUploadPanelRef = useRef(null);

  const { sendMessage } = useChat();

  const closeChatModal = () => {
    if (streaming) {
      onStopRecording();
    }
    sessionStorage.removeItem("widgetHeader");
    setLocalChatMessage("");
    setSubmittedPromptPreview({ message: "", imageUrl: "" });
    dispatch(setShowChatModal(false));
    showSubmitImageTooltip && setShowSubmitImageTooltip(false);
  };

  const {
    text: followUpQuery, //requestedText
    metadata: requestedMetaData,
    image_url: requestedImageUrl,
  } = widgetHeaderRequest;

  // Set default option on first load to Shop by Theme (smart_search).
  useEffect(() => {
    if (is_kiosk || !isEmpty(activeSearchOption) || isEmpty(searchOptions)) {
      return;
    }

    const shopByThemeDefault = searchOptions.find(
      (option) =>
        option?.id === CHAT_SEARCH_OPTION_ID.smart_search && option?.is_display,
    );
    const configuredDefault = searchOptions.find(
      (option) => option?.default && option?.is_display,
    );
    const firstVisibleOption = searchOptions.find(
      (option) => option?.is_display,
    );

    const defaultSelectedOption =
      shopByThemeDefault || configuredDefault || firstVisibleOption;

    if (defaultSelectedOption) {
      dispatch(setActiveSearchOption(defaultSelectedOption));
    }
  }, [searchOptions, is_kiosk, activeSearchOption, dispatch]);

  // useEffect(() => {
  // 	if (activeSearchOption?.description) {
  // 		dispatch(setAuraHelperMessage(activeSearchOption.description || ""));
  // 	}
  // }, [activeSearchOption?.description]);

  // useOnClickOutside(modalRef, () => {
  // 	!disabledOutSideClick && closeChatModal();
  // });

  const handleTryAgainClick = () => {
    const metadata = { ...chatInputMetadata };
    const userMetadata = {
      brand: authUser?.filters?.[current_store_name]?.strict?.brand || [],
    };
    submitChatInput(
      followUpQuery || undefined,
      requestedImageUrl || undefined,
      metadata,
      userMetadata,
    );
  };

  const handleTryThisClick = (
    e,
    chatMessage = activeSearchOption.text_example,
    chatImage = "",
  ) => {
    e.stopPropagation();
    e.preventDefault();
    inputRef?.current?.focus();
    setLocalChatMessage(chatMessage);
    chatMessage && dispatch(setChatMessage(chatMessage, chatTypeKey));
    dispatch(setChatImageUrl(chatImage));
  };

  const handleSetSearchOption = useCallback(
    (option) => {
      setIsSearchOptionManuallySelected(true);
      setLocalChatMessage("");
      setSubmittedPromptPreview({ message: "", imageUrl: "" });
      sessionStorage.removeItem("widgetHeader");
      if (option.id === CHAT_SEARCH_OPTION_ID.trending_collections) {
        dispatch(setShowChatModal(false));
        navigate(`/#${COLLECTIONS_ID}`); // navigate on root page for trending_collections search option, scroll to first collection of root page
      } else {
        dispatch(setActiveSearchOption(option));
        dispatch(resetAuraSearchResponse()); // reset AURA response when change search option
      }
    },
    [searchOptions],
  );

  const handleFollowUpSearch = useCallback(() => {
    setIsFollowUpQuery((value) => !value);
    dispatch(setChatMessage(""));
    inputRef?.current?.focus();
  }, [inputRef.current]);

  const displaySearchOptions = useMemo(
    () => searchOptions.filter((v) => v?.is_display),
    [searchOptions],
  );

  const isSuggestionsWithProductsAvailable = useMemo(
    () =>
      Object.values(suggestionsWithProducts).some((value) => !isEmpty(value)),
    [suggestionsWithProducts],
  );

  const showChatResponse = useMemo(
    () =>
      widgetHeader ||
      widgetImage ||
      !isEmpty(shopALookData) ||
      isSuggestionsWithProductsAvailable,
    [
      widgetHeader,
      widgetImage,
      shopALookData,
      isSuggestionsWithProductsAvailable,
    ],
  );

  const isShowFollowUpQuery = useMemo(
    () => isFollowUpQuery && followUpQuery,
    [isFollowUpQuery, followUpQuery],
  );

  // showing random examples from selected search option
  const selectedSearchOptionExamples = useMemo(
    () => getRandomArrayElements(activeSearchOption.examples, 4),
    [activeSearchOption.examples],
  );

  const isShowFollowUpSearch = useMemo(
    () =>
      activeSearchOption?.follow_up_search_enable &&
      requestedMetaData?.searchOptionId === activeSearchOption?.id,
    [
      activeSearchOption?.follow_up_search_enable,
      requestedMetaData?.searchOptionId,
      activeSearchOption?.id,
    ],
  );

  const isSidExpired = useMemo(
    () => socket.id === socketId,
    [socket.id, socketId],
  );

  const isShowTryAgain = useMemo(
    () => followUpQuery || requestedImageUrl,
    [followUpQuery, requestedImageUrl],
  );

  const isActiveSearchOptionAvailable = useMemo(
    () => !isEmpty(activeSearchOption),
    [activeSearchOption],
  );

  const isShowAuraResponse = useMemo(
    () => showChatResponse && isActiveSearchOptionAvailable,
    [showChatResponse, isActiveSearchOptionAvailable],
  );

  const shouldHighlightActiveSearchOption = useMemo(
    () => isSearchOptionManuallySelected || isShowAuraResponse,
    [isSearchOptionManuallySelected, isShowAuraResponse],
  );

  const isShowKioskSearchOptions = useMemo(
    () => is_kiosk && !isActiveSearchOptionAvailable,
    [is_kiosk, isActiveSearchOptionAvailable],
  );

  const shouldCenterModalContent = useMemo(
    () => ButtonClick && !isShowAuraResponse,
    [ButtonClick, isShowAuraResponse],
  );

  const isShopALookOptionActive = useMemo(
    () => activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.shop_a_look,
    [activeSearchOption?.id],
  );

  const isShopByThemeOptionActive = useMemo(
    () => activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.smart_search,
    [activeSearchOption?.id],
  );

  const shouldUseLegacyImageSearchLayout = useMemo(
    () => activeSearchOption.allow_image_search && !isShopALookOptionActive,
    [activeSearchOption.allow_image_search, isShopALookOptionActive],
  );

  const isShowSubmittedChatPreview = useMemo(
    () =>
      !isFigmaUploadPanelOpen &&
      !shouldUseLegacyImageSearchLayout &&
      !!submittedPromptPreview.imageUrl &&
      showChatLoader,
    [
      isFigmaUploadPanelOpen,
      shouldUseLegacyImageSearchLayout,
      submittedPromptPreview.imageUrl,
      showChatLoader,
    ],
  );

  const shouldMoveInputBelowResults = useMemo(
    () =>
      !isBTNormalUserLoggedIn &&
      activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.shop_a_look &&
      isShowAuraResponse &&
      !shouldUseLegacyImageSearchLayout,
    [
      isBTNormalUserLoggedIn,
      activeSearchOption?.id,
      isShowAuraResponse,
      shouldUseLegacyImageSearchLayout,
    ],
  );

  const searchOptionPreviewImages = useMemo(
    () => ({
      [CHAT_SEARCH_OPTION_ID.shop_a_look]: auraCardThree,
      [CHAT_SEARCH_OPTION_ID.complete_the_look]: auraCardThree,
      [CHAT_SEARCH_OPTION_ID.smart_search]: auraCardThree,
      [CHAT_SEARCH_OPTION_ID.product_search]: auraCardThree,
    }),
    [],
  );

  const cardCollageVariants = useMemo(
    () => ({
      [CHAT_SEARCH_OPTION_ID.shop_a_look]:
        styles["chatmodal-search-option-image-collage-shop_a_look"],
      [CHAT_SEARCH_OPTION_ID.complete_the_look]:
        styles["chatmodal-search-option-image-collage-complete_the_look"],
      [CHAT_SEARCH_OPTION_ID.smart_search]:
        styles["chatmodal-search-option-image-collage-smart_search"],
      [CHAT_SEARCH_OPTION_ID.product_search]:
        styles["chatmodal-search-option-image-collage-product_search"],
    }),
    [],
  );

  const getImageSrc = (image) => image?.src || image;

  const uploadImageProps = {
    accept: "image/*",
    multiple: false,
    customRequest: async (info) => {
      try {
        setIsUploadingImage(true);
        if (info?.file) {
          const response = await profileAPIs.uploadImage({
            file: info.file,
          });
          if (response?.data?.data[0]) {
            dispatch(setChatImageUrl(response?.data?.data[0].url, chatTypeKey));
            // Close panel after upload - the pill will show in the main input
            setIsFigmaUploadPanelOpen(false);
          }
        }
      } catch (error) {
        dispatch(setShowChatLoader(false, chatTypeKey)); // stop loader on aura search is any error
      }
      setIsUploadingImage(false);
    },
  };

  const [localChatMessage, setLocalChatMessage] = useState("");

  const handleInputChange = (e) => {
    const { value } = e.target;
    setLocalChatMessage(value);

    debounceDispatch(value);
  };

  const debounceDispatch = debounce((value) => {
    dispatch(setChatMessage(value, chatTypeKey));
    setIsSendSocketMessageWithPrefix(true);
  }, 300);

  const handleUploadImageModeChange = () => {
    dispatch(setChatImageUrl("", chatTypeKey));
    setShowUploadImage((value) => !value);
  };

  const handleFigmaUploadButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFigmaUploadPanelOpen((value) => !value);
  };

  const handleFigmaImageUrlChange = (e) => {
    dispatch(setChatImageUrl(e.target.value, chatTypeKey));
  };

  const handleTryExampleClick = () => {
    const exampleText = activeSearchOption?.text_example;
    if (exampleText) {
      setLocalChatMessage(exampleText);
      dispatch(setChatMessage(exampleText, chatTypeKey));
      setIsSendSocketMessageWithPrefix(true);
      // Focus input field
      inputRef.current?.focus();
    }
  };

  const [nextPage, setNextPage] = useState(true);
  const [ipp, setIpp] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [regenarateImage, setRegenarateImage] = useState(false);

  const handleSubmitChatInput = () => {
    const metadata = { ...chatInputMetadata };

    const userMetadata = {
      brand: authUser?.filters?.[current_store_name]?.strict?.brand || [],
    };

    if (localChatMessage || chatImageUrl) {
      setSubmittedPromptPreview({
        message: localChatMessage || "",
        imageUrl: chatImageUrl || "",
      });

      // Condition 1 → smart_search follow-up image send
      const sendImageSmartSearch =
        chatImageUrl &&
        isFollowUpQuery &&
        activeSearchOption?.id === "smart_search";

      // Condition 2 → shop_look image send
      const sendImageShopLook =
        chatImageUrl && activeSearchOption?.id === "shop_a_look";

      // Condition 2 → shop_look image send
      const sendImageCompleteLook =
        chatImageUrl && activeSearchOption?.id === "complete_the_look";

      // Final image value to send
      const finalImageToSend =
        sendImageSmartSearch || sendImageShopLook || sendImageCompleteLook
          ? chatImageUrl
          : undefined;

      submitChatInput(
        localChatMessage,
        finalImageToSend, // <--- image sent only in the two valid cases
        metadata,
        userMetadata,
      );

      dispatch(setAuraHelperMessage(activeSearchOption?.search_message));
      dispatch(setAuraSreverImage(""));
      dispatch(setOverlayCoordinates([]));
      setIsFigmaUploadPanelOpen(false);
    }

    if (isFollowUpQuery && isShowFollowUpSearch) {
      setRegenarateImage(true);
    }
  };

  const handlePromptKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitChatInput();
    }
  };

  const handlePromptUtilityClick = (e) => {
    if (
      showSettings &&
      activeSearchOption?.id !== CHAT_SEARCH_OPTION_ID.product_search
    ) {
      openSettingModal(e);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    inputRef?.current?.focus();
  };

  useEffect(() => {
    if (!isFigmaUploadPanelOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        figmaUploadPanelRef.current &&
        !figmaUploadPanelRef.current.contains(event.target)
      ) {
        // setIsFigmaUploadPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFigmaUploadPanelOpen]);

  const handleLoadMore = () => {
    const moreSearch_next_page = false;
    const recommendationSearch_next_page = false;

    const metadata = {
      ...chatInputMetadata,
      next_page: nextPage,
      ipp,
      current_page: currentPage,
      moreSearch_next_page,
      recommendationSearch_next_page,
    };

    const userMetadata = {
      brand: authUser?.filters?.[current_store_name]?.strict?.brand || [],
    };

    if (localChatMessage || chatImageUrl) {
      submitChatInput(
        localChatMessage,
        chatImageUrl && (isFollowUpQuery || chatImageUrl)
          ? chatImageUrl
          : undefined,
        metadata,
        userMetadata,
      );
      dispatch(setAuraHelperMessage(activeSearchOption?.search_message));
    }
  };

  const handleRegenrateImage = () => {
    const keyWord_tagMap = suggestionsWithProducts?.suggestions?.tag_map;

    const imageGenerate = {
      text: localChatMessage,
    };

    const metadata = {
      keyword_tag_map: keyWord_tagMap || [],
      store: current_store_name,
      image_url: chatImageUrl || "",
      search_type: activeSearchOption?.id || "",
      description: widgetHeader || "",
      generate_overlay_enable: true,
    };

    if (localChatMessage || chatImageUrl) {
      submitChatInput(localChatMessage, null, metadata, null, imageGenerate);
      dispatch(setAuraHelperMessage(activeSearchOption?.search_message));
    }
  };

  useEffect(() => {
    dispatch(setChatImageUrl(auraServerImage));
  }, [auraServerImage]);

  // Original image size (1024x1024)
  const originalWidth = 1024;
  const originalHeight = 1027;

  // New image size
  const newWidth = 404;
  const newHeight = 400;

  const imgRef = useRef(null);
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });

  const handleImageLoad = () => {
    if (imgRef.current) {
      setRenderedSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    }
  };

  const handleSuggestionClick = (tag) => {
    if (tags.includes(tag)) {
      dispatch(setSuggestionsSelectedTag(tag));
    }
    // Scroll to the tag div
    const tagElement = document.getElementById(`tag-${tag}`);
    if (tagElement) {
      tagElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // when image changed clear all fields
  const handleChangeImageConfirm = () => {
    dispatch(setChatImageUrl("", chatTypeKey));
    setLocalChatMessage("");
    setSubmittedPromptPreview({ message: "", imageUrl: "" });
    setRegenarateImage(false);
    // Clear any other related state if needed
    dispatch(resetAuraSearchResponse());
    dispatch(setWidgetHeader(""));
    dispatch(setWidgetImage(""));
    dispatch(setChatProducts([]));
    dispatch(setChatProductsData([]));
    dispatch(setChatShopALook([]));
  };

  return (
    <div
      className={` ${styles["chatmodal-modal-container"]} ${shouldCenterModalContent ? "justify-center" : ""} `}
      ref={modalRef}
    >
      {/* hide close icon for AuraChatPage */}
      {!isAuraChatPage ? (
        <div className={styles["chatmodal-close-icon-container"]}>
          <CloseOutlined
            id="chat_modal_close_icon"
            onClick={closeChatModal}
            className={styles["chatmodal-close-icon"]}
          />
        </div>
      ) : null}

      {!is_kiosk || isActiveSearchOptionAvailable ? (
        <>
          <div
            className={`${styles["chatmodal-content-wrapper"]} 
					  `}
          >
            <div className={styles["chatmodal-content-inner"]}>
              {/* {!isShowAuraResponse &&
              !isFigmaUploadPanelOpen &&
              !chatImageUrl ? ( */}
              {!isSearchOptionManuallySelected &&
              <div className={styles["chatmodal-header-section"]}>
                <div className={styles["chatmodal-header-row"]}>
                  <img
                    src={getImageSrc(star_ai_icon)}
                    width={200}
                    height={200}
                    className={styles["chatmodal-header-icon"]}
                    alt="AURA"
                  />
                  <div className={styles["chatmodal-header-text-block"]}>
                    <h1 className={styles["chatmodal-header-title"]}>
                      <span
                        className={styles["chatmodal-header-title-primary"]}
                      >
                        I'm AURA,
                      </span>
                      <br />
                      <span
                        className={styles["chatmodal-header-title-secondary"]}
                      >
                        How can I help you?
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
                }
              {/* ) : null} */}

              <div
                className={
                  styles[
                    // isFigmaUploadPanelOpen ||
                    //   (chatImageUrl &&
                    //     !isShowSubmittedChatPreview &&
                    //     !isShowAuraResponse) ||
                      // isUploadingImage ||

                      "chatmodal-content-max-width"
                  ]
                }
              >
                {!isSearchOptionManuallySelected &&
                                <p className={styles["chatmodal-header-subtext"]}>
                  Choose one to get started
                </p>
                }
                {!isBTNormalUserLoggedIn ? (
                  <>
                    {/* {!isFigmaUploadPanelOpen && !chatImageUrl && ( */}
                    <div
                      className={`grid ${
                        displaySearchOptions?.length === 1
                          ? "grid-cols-1"
                          : displaySearchOptions?.length === 2
                            ? "sm:grid-cols-2 grid-cols-1"
                            : displaySearchOptions?.length === 3
                              ? " md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
                              : displaySearchOptions?.length === 4
                                ? "lg:grid-cols-4 sm:grid-cols-2 grid-cols-1"
                                : "lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
                      }  w-full gap-4.5 lg:gap-4.8 overflow-x-auto scroll-snap-type-x-proximity  -ms-overflow-none scrollbar-none`}
                    >
                      {displaySearchOptions?.map((searchOptions, index) => {
                        const isOptionActive =
                          searchOptions?.id === activeSearchOption?.id &&
                          shouldHighlightActiveSearchOption;
                        const previewImage =
                          searchOptionPreviewImages[searchOptions.id] ||
                          [auraCardOne, auraCardThree, auraCardThree][index % 3];
                        const previewImageSrc = getImageSrc(previewImage);
                        const collageVariantClass =
                          cardCollageVariants[searchOptions.id] ||
                          styles[
                            "chatmodal-search-option-image-collage-default"
                          ];

                        return (
                          <div
                            key={searchOptions.id}
                            className={`${styles["chatmodal-search-option-card"]} ${
                              isOptionActive
                                ? styles["chatmodal-search-option-card-active"]
                                : ""
                            } relative flex items-center gap-2`}
                            onClick={() => handleSetSearchOption(searchOptions)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSetSearchOption(searchOptions);
                              }
                            }}
                          >
                            <div
                              className={`${styles["chatmodal-search-option-image-wrapper"]} flex-shrink-0`}
                            >
                              <img
                                src={previewImageSrc}
                                className={styles["chatmodal-search-option-image"]}
                                alt={searchOptions.title}
                              />
                            </div>
                            <div
                              className={
                                styles["chatmodal-search-option-content"]
                              }
                            >
                              <div
                                className={`${styles["chatmodal-search-option-text-content"]} ${
                                  isOptionActive
                                    ? styles[
                                        "chatmodal-search-option-text-content-active"
                                      ]
                                    : ""
                                }`}
                              >
                                <div
                                  className={`${styles["chatmodal-search-option-title"]} ${
                                    isOptionActive
                                      ? styles[
                                          "chatmodal-search-option-title-active"
                                        ]
                                      : ""
                                  }`}
                                >
                                  {searchOptions.title}
                                </div>
                                <div
                                  className={`${styles["chatmodal-search-option-subtitle"]} ${
                                    isOptionActive
                                      ? styles[
                                          "chatmodal-search-option-subtitle-active"
                                        ]
                                      : ""
                                  } `}
                                >
                                  {searchOptions.subTitle}
                                </div>
                                {isOptionActive &&
                                  searchOptions?.text_example && (
                                    <div className="flex w-full pb-2 justify-start">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTryExampleClick();
                                        }}
                                        className="text-xs z-30 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-2 py-1 rounded transition-all hover:scale-105 font-medium"
                                        title="Fill input with example text"
                                      >
                                        Try an Example
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* // )} */}
                  </>
                ) : null}
                {/* {isFigmaUploadPanelOpen ||
                (chatImageUrl &&
                  !isShowSubmittedChatPreview &&
                  !isShowAuraResponse) ? (
                  <div
                    className={styles["chatmodal-figma-upload-section"]}
                    ref={figmaUploadPanelRef}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-[60px]  font-normal text-center mb-7 ">
                      SHOP THE LOOK
                    </h2>
                  </div>
                ) : null} */}
                {/* {isShowSubmittedChatPreview ? (
                  <div className={styles["chatmodal-figma-sent-preview"]}>
                    <img
                      src={submittedPromptPreview.imageUrl}
                      alt="Submitted look"
                      className={styles["chatmodal-figma-sent-preview-image"]}
                    />
                    {submittedPromptPreview.message ? (
                      <div
                        className={
                          styles["chatmodal-figma-sent-preview-bubble"]
                        }
                      >
                        {submittedPromptPreview.message}
                      </div>
                    ) : null}
                  </div>
                ) : null} */}

                {isShowFollowUpQuery ? (
                  <div className={styles["chatmodal-followup-query-container"]}>
                    <HistoryOutlined
                      className={styles["chatmodal-followup-query-icon"]}
                    />
                    <div className={styles["chatmodal-followup-query-text"]}>
                      {followUpQuery}
                    </div>
                  </div>
                ) : null}

                {(isBTNormalUserLoggedIn ||
                  isActiveSearchOptionAvailable ||
                  !isShowAuraResponse) 
                 ? (
                  <div>
                    {/* {shouldUseLegacyImageSearchLayout ? ( */}
                    {/* <div
                        className={styles["chatmodal-image-search-grid"]}
                        style={{ minHeight: "252px" }}
                      >
                        <div>
                          {showUploadImage ? (
                            <>
                              {isUploadingImage ? (
                                <div
                                  className={
                                    styles["chatmodal-upload-spinner-container"]
                                  }
                                >
                                  <Spin
                                    className={
                                      styles["chatmodal-upload-spinner"]
                                    }
                                    indicator={
                                      <LoadingOutlined
                                        style={{ fontSize: 30 }}
                                        className={
                                          styles[
                                            "chatmodal-upload-spinner-icon"
                                          ]
                                        }
                                        spin
                                      />
                                    }
                                    spinning={isUploadingImage}
                                  />
                                </div>
                              ) : (
                                <div
                                  className={
                                    styles[
                                      chatImageUrl
                                        ? ""
                                        : "chatmodal-figma-upload-popover"
                                    ]
                                  }
                                >
                                  {chatImageUrl ? (
                                    <div
                                      className={
                                        styles[
                                          "chatmodal-figma-image-preview-container"
                                        ]
                                      }
                                    >
                                      <img
                                        src={chatImageUrl}
                                        alt="Uploaded Image"
                                        className={
                                          styles[
                                            "chatmodal-figma-image-preview"
                                          ]
                                        }
                                      />
                                      <div
                                        className={
                                          styles[
                                            "chatmodal-figma-change-image-btn"
                                          ]
                                        }
                                      >
                                        <button
                                          type="button"
                                          onClick={handleChangeImageConfirm}
                                          className={
                                            styles["chatmodal-figma-change-btn"]
                                          }
                                        >
                                          Change Image
                                        </button>
                                      </div>
                                    </div>
                                  ) : isUploadingImage ? (
                                    <div
                                      className={
                                        styles[
                                          "chatmodal-upload-spinner-container"
                                        ]
                                      }
                                    >
                                      <Spin
                                        className={
                                          styles["chatmodal-upload-spinner"]
                                        }
                                        indicator={
                                          <LoadingOutlined
                                            style={{ fontSize: 26 }}
                                            className={
                                              styles[
                                                "chatmodal-upload-spinner-icon"
                                              ]
                                            }
                                            spin
                                          />
                                        }
                                        spinning={isUploadingImage}
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <Dragger
                                        className={
                                          styles[
                                            "chatmodal-figma-upload-dragger"
                                          ]
                                        }
                                        {...uploadImageProps}
                                        name="image_url"
                                        showUploadList={false}
                                      >
                                        <p
                                          className={
                                            styles[
                                              "chatmodal-figma-upload-dragger-icon"
                                            ]
                                          }
                                        >
                                          <PictureOutlined />
                                        </p>
                                        <p
                                          className={
                                            styles[
                                              "chatmodal-figma-upload-dragger-text"
                                            ]
                                          }
                                        >
                                          <span>Click to upload</span> or drag
                                          and drop
                                        </p>
                                        <p
                                          className={
                                            styles[
                                              "chatmodal-figma-upload-dragger-hint"
                                            ]
                                          }
                                        >
                                          JPG, JPEG, PNG less than 1MB
                                        </p>
                                      </Dragger>
                                      <div
                                        className={
                                          styles["chatmodal-figma-upload-or"]
                                        }
                                      >
                                        or
                                      </div>
                                      <div
                                        className={
                                          styles[
                                            "chatmodal-figma-upload-url-section"
                                          ]
                                        }
                                      >
                                        <label
                                          className={
                                            styles[
                                              "chatmodal-figma-upload-url-label"
                                            ]
                                          }
                                        >
                                          Image URL
                                        </label>
                                        <input
                                          className={
                                            styles[
                                              "chatmodal-figma-upload-url-input"
                                            ]
                                          }
                                          placeholder="Or Enter Image URL"
                                          type="text"
                                          value={chatImageUrl}
                                          onChange={handleFigmaImageUrlChange}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                                // <div
                                //   className={
                                //     styles["chatmodal-image-preview-container"]
                                //   }
                                // >
                                //   {chatImageUrl ? (
                                //     <div
                                //       className={
                                //         styles[
                                //           "chatmodal-image-preview-wrapper"
                                //         ]
                                //       }
                                //     >
                                //       <div
                                //         className={
                                //           styles[
                                //             "chatmodal-image-preview-relative"
                                //           ]
                                //         }
                                //       >
                                //         <img
                                //           ref={imgRef}
                                //           onLoad={handleImageLoad}
                                //           className={
                                //             styles["chatmodal-image-preview"]
                                //           }
                                //           src={chatImageUrl}
                                //           alt="Uploaded Image"
                                //         />
 
                                //         {Array.isArray(
                                //           auraOverlayCoordinates,
                                //         ) &&
                                //           auraOverlayCoordinates.map(
                                //             (item, index) => {
                                //               const adjustedX =
                                //                 (item.point[0] /
                                //                   originalWidth) *
                                //                 newWidth;
                                //               const adjustedY =
                                //                 (item.point[1] /
                                //                   originalHeight) *
                                //                 newHeight;

                                //               return (
                                //                 <Tooltip
                                //                   key={index}
                                //                   title={item.attributes.label}
                                //                   color="blue"
                                //                 >
                                //                   <div
                                //                     onClick={() =>
                                //                       handleSuggestionClick(
                                //                         item.attributes.label,
                                //                       )
                                //                     }
                                //                     className={
                                //                       styles[
                                //                         "chatmodal-overlay-point"
                                //                       ]
                                //                     }
                                //                     style={{
                                //                       left: `${adjustedX}px`,
                                //                       top: `${adjustedY}px`,
                                //                       boxShadow:
                                //                         "0 0 10px rgba(0, 123, 255, 0.8)",
                                //                     }}
                                //                   />
                                //                 </Tooltip>
                                //               );
                                //             },
                                //           )}
                                //       </div>

                               
                                //       <div
                                //         className={
                                //           styles["chatmodal-change-image-link"]
                                //         }
                                //       >
                                //         <span
                                //           onClick={handleChangeImageConfirm}
                                //         >
                                //           Change Image
                                //         </span>
                                //       </div>
                                //     </div>
                                //   ) : (
                                //     <div
                                //       className={
                                //         styles["chatmodal-dragger-wrapper"]
                                //       }
                                //     >
                                //       <Dragger
                                //         className={styles["chatmodal-dragger"]}
                                //         {...uploadImageProps}
                                //         name="image_url"
                                //         showUploadList={false}
                                //       >
                                //         <p className="ant-upload-drag-icon">
                                //           <UploadOutlined />
                                //         </p>
                                //         <p
                                //           className={
                                //             styles["chatmodal-dragger-text"]
                                //           }
                                //         >
                                //           Click or drag file to this area to
                                //           upload Image
                                //         </p>
                                //       </Dragger>
                                //     </div>
                                //   )}
                                // </div>
                              )}
                            </>
                          ) : (
                            <input
                              className={styles["chatmodal-image-url-input"]}
                              placeholder="Enter Image URL"
                              name="chat_image_url"
                              type="text"
                              value={chatImageUrl}
                              onChange={handleInputChange}
                            />
                          )}
                          <div className={styles["chatmodal-divider-text"]}>
                            Or
                          </div>
                          <div
                            className={
                              styles["chatmodal-toggle-upload-container"]
                            }
                          >
                            <div
                              className={styles["chatmodal-toggle-upload-link"]}
                              role="button"
                              title={
                                showUploadImage
                                  ? "Click here to enter image URL"
                                  : "Click here to upload image"
                              }
                              onClick={handleUploadImageModeChange}
                            >
                              {showUploadImage ? "Image URL" : "Upload image"}
                            </div>
                          </div>
                        </div>
                        <div className={styles["chatmodal-textarea-container"]}>
                          <div className={styles["chatmodal-textarea-wrapper"]}>
                            <textarea
                              className={styles["chatmodal-textarea"]}
                              placeholder={`Give additional instructions here. ${
                                typeof activeSearchOption?.text_placeholder ===
                                "string"
                                  ? activeSearchOption?.text_placeholder
                                  : activeSearchOption?.text_placeholder?.[0]
                              }`}
                              name="chat_message"
                              value={localChatMessage}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div
                            className={
                              styles["chatmodal-submit-button-container"]
                            }
                          >
                            <button
                              type="submit"
                              className={`${styles["chatmodal-submit-button"]} ${
                                !chatImageUrl || showChatLoader
                                  ? styles["chatmodal-submit-button-disabled"]
                                  : styles["chatmodal-submit-button-enabled"]
                              }`}
                              onClick={handleSubmitChatInput}
                              disabled={!chatImageUrl || showChatLoader}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div> */}

                    {/* // ) : ( */}
                    <div className={styles["chatmodal-figma-input-section"]}>
                      {/* {chatImageUrl ? (
														<div className={styles['chatmodal-figma-inline-preview-wrap']}>
															<img
																src={chatImageUrl}
																alt='Uploaded preview'
																className={styles['chatmodal-figma-inline-preview']}
															/>
														</div>
													) : null} */}

                      {/* {isShowSubmittedChatPreview && (
                          <div className="mb-11 w-full max-w-[900px] ">
                            <p className="text-start">
                              sure! Give me a few moments. Now crafting related
                              products.
                            </p>
                            <h2
                              className={`text-center mt-6 w-full  text-[28px] ${styles["chatmodal-thinking-text"]}`}
                            >
                              Thinking
                              <span
                                className={styles["chatmodal-thinking-dots"]}
                                aria-hidden="true"
                              >
                                <span
                                  className={styles["chatmodal-thinking-dot"]}
                                >
                                  .
                                </span>
                                <span
                                  className={styles["chatmodal-thinking-dot"]}
                                >
                                  .
                                </span>
                                <span
                                  className={styles["chatmodal-thinking-dot"]}
                                >
                                  .
                                </span>
                              </span>
                            </h2>
                          </div>
                        )} */}
                      {activeSearchOption && (
                        <>
                                {auraServerImage &&
                      activeSearchOption.id === "smart_search" && (
                        <>
                          {!showChatLoader ? (
                            <div
                              style={{ width: "fit-content" ,position:'relative'}}
                              className={
                                styles["chatmodal-figma-upload-popover "]
                              }
                            >
                              {/* Image */}
                              <img
                                className={styles["chatmodal-server-image"]}
                                src={auraServerImage}
                                alt="Aura Image"
                              />
                              {/* Overlay Points */}
                              {Array.isArray(auraOverlayCoordinates) &&
                                auraOverlayCoordinates.map((item, index) => {
                                  const adjustedX =
                                    (item.point[0] / originalWidth) * newWidth;
                                  const adjustedY =
                                    (item.point[1] / originalHeight) *
                                    newHeight;

                                  return (
                                    <Tooltip
                                      key={index}
                                      title={item.attributes.label}
                                      color="blue"
                                    >
                                      <div
                                        onClick={() =>
                                          handleSuggestionClick(
                                            item.attributes.label,
                                          )
                                        }
                                        className={
                                          styles["chatmodal-overlay-point"]
                                        }
                                        style={{
                                          left: `${adjustedX}px`,
                                          top: `${adjustedY}px`,
                                          boxShadow:
                                            "0 0 10px rgba(0, 123, 255, 0.8)", // Blue shining glow effect
                                        }}
                                      />
                                    </Tooltip>
                                  );
                                })}
                            </div>
                          ) : (
                            <div
                              className={
                                styles[
                                  "chatmodal-server-image-spinner-container"
                                ]
                              }
                            >
                              <Spin size="large" />
                            </div>
                          )}
                        </>
                      )}

                        <div className=" flex flex-col lg:flex-row justify-between lg:items-end w-full gap-0 lg:gap-5">
                          {activeSearchOption.allow_image_search && (
                            <div
                              className={
                                styles[
                                  chatImageUrl
                                    ? ""
                                    : "chatmodal-figma-upload-popover"
                                ]
                              }
                            >
                          
                              {chatImageUrl ? (
                                <div
                                  className={
                                    styles[
                                      "chatmodal-figma-image-preview-container"
                                    ]
                                  }
                                  style={{ position: "relative" }}
                                >
                                  <img
                                    src={chatImageUrl}
                                    alt="Uploaded Image"
                                    className={
                                      styles["chatmodal-figma-image-preview"]
                                    }
                                  />
                                  {Array.isArray(auraOverlayCoordinates) &&
                                    auraOverlayCoordinates.map(
                                      (item, index) => {
                                        const adjustedX =
                                          (item.point[0] / originalWidth) *
                                          newWidth;
                                        const adjustedY =
                                          (item.point[1] / originalHeight) *
                                          newHeight;

                                        return (
                                          <Tooltip
                                            key={index}
                                            title={item.attributes.label}
                                            color="blue"
                                          >
                                            <div
                                              onClick={() =>
                                                handleSuggestionClick(
                                                  item.attributes.label,
                                                )
                                              }
                                              className={
                                                styles[
                                                  "chatmodal-overlay-point"
                                                ]
                                              }
                                              style={{
                                                left: `${adjustedX}px`,
                                                top: `${adjustedY}px`,
                                                boxShadow:
                                                  "0 0 10px rgba(0, 123, 255, 0.8)",
                                              }}
                                            />
                                          </Tooltip>
                                        );
                                      },
                                    )}
                                  <div
                                    className={
                                      styles["chatmodal-figma-change-image-btn"]
                                    }
                                  >
                                    <button
                                      type="button"
                                      onClick={handleChangeImageConfirm}
                                      className={
                                        styles["chatmodal-figma-change-btn"]
                                      }
                                    >
                                      Change Image
                                    </button>
                                  </div>
                                </div>
                              ) : isUploadingImage ? (
                                <div
                                  className={
                                    styles["chatmodal-upload-spinner-container"]
                                  }
                                >
                                  <Spin
                                    className={
                                      styles["chatmodal-upload-spinner"]
                                    }
                                    indicator={
                                      <LoadingOutlined
                                        style={{ fontSize: 26 }}
                                        className={
                                          styles[
                                            "chatmodal-upload-spinner-icon"
                                          ]
                                        }
                                        spin
                                      />
                                    }
                                    spinning={isUploadingImage}
                                  />
                                </div>
                              ) : (
                                <>
                                  <Dragger
                                    className={
                                      styles["chatmodal-figma-upload-dragger"]
                                    }
                                    {...uploadImageProps}
                                    name="image_url"
                                    showUploadList={false}
                                  >
                                    <p
                                      className={
                                        styles[
                                          "chatmodal-figma-upload-dragger-icon"
                                        ]
                                      }
                                    >
                                      <PictureOutlined />
                                    </p>
                                    <p
                                      className={
                                        styles[
                                          "chatmodal-figma-upload-dragger-text"
                                        ]
                                      }
                                    >
                                      <span>Click to upload</span> or drag and
                                      drop
                                    </p>
                                    <p
                                      className={
                                        styles[
                                          "chatmodal-figma-upload-dragger-hint"
                                        ]
                                      }
                                    >
                                      JPG, JPEG, PNG less than 1MB
                                    </p>
                                  </Dragger>
                                  <div
                                    className={
                                      styles["chatmodal-figma-upload-or"]
                                    }
                                  >
                                    or
                                  </div>
                                  <div
                                    className={
                                      styles[
                                        "chatmodal-figma-upload-url-section"
                                      ]
                                    }
                                  >
                                    <label
                                      className={
                                        styles[
                                          "chatmodal-figma-upload-url-label"
                                        ]
                                      }
                                    >
                                      Image URL
                                    </label>
                                    <input
                                      className={
                                        styles[
                                          "chatmodal-figma-upload-url-input"
                                        ]
                                      }
                                      placeholder="Or Enter Image URL"
                                      type="text"
                                      value={chatImageUrl}
                                      onChange={handleFigmaImageUrlChange}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          <div
                            className={`${styles["chatmodal-figma-input-card"]} ${
                              chatImageUrl
                                ? styles[
                                    "chatmodal-figma-input-card-with-preview"
                                  ]
                                : ""
                            } ${
                              isShopByThemeOptionActive
                                ? styles[
                                    "chatmodal-figma-input-card-shop-theme"
                                  ]
                                : ""
                            }`}
                          >
                            <div className="relative w-full">
                              <input
                                id={`chat_search_input_${chatTypeKey}`}
                                type="text"
                                ref={inputRef}
                                placeholder={
                                  typeof activeSearchOption?.text_placeholder ===
                                  "string"
                                    ? activeSearchOption?.text_placeholder
                                    : activeSearchOption
                                        ?.text_placeholder?.[0] ||
                                      "Describe your product idea"
                                }
                                name="chat_message"
                                value={localChatMessage}
                                onChange={handleInputChange}
                                onKeyDown={handlePromptKeyDown}
                                className={`${styles["chatmodal-figma-input"]} ${
                                  !localChatMessage
                                    ? styles["chatmodal-figma-input-shop-theme"]
                                    : "text-black-200 font-medium"
                                }`}
                              />
                            </div>
                            {activeSearchOption.allow_image_search ? (
                              <div
                                className={
                                  styles["chatmodal-figma-input-divider"]
                                }
                              />
                            ) : null}
                            <div
                              className={`${styles["chatmodal-figma-input-actions"]} ${
                                !activeSearchOption.allow_image_search
                                  ? styles[
                                      "chatmodal-figma-input-actions-shop-theme"
                                    ]
                                  : ""
                              }`}
                            >
                              {activeSearchOption.allow_image_search && (
                                <div
                                  className={
                                    styles["chatmodal-figma-input-actions-left"]
                                  }
                                >
                                  {/* <div
                                      className={
                                        styles[
                                          "chatmodal-upload-action-wrapper"
                                        ]
                                      }
                                    >
                                      <button
                                        type="button"
                                        className={`${styles["chatmodal-figma-action-button"]} ${styles["chatmodal-figma-image-action-button"]} ${
                                          isFigmaUploadPanelOpen || chatImageUrl
                                            ? styles[
                                                "chatmodal-figma-image-action-button-active"
                                              ]
                                            : ""
                                        }`}
                                        title="Upload image"
                                        onClick={handleFigmaUploadButtonClick}
                                      >
                                        <img
                                          src={upload_icon?.src}
                                          alt="Upload image"
                                        />
                                        {(isFigmaUploadPanelOpen ||
                                          chatImageUrl) && <span>Image</span>}
                                      </button>
                                    </div> */}
                                  <button
                                    type="button"
                                    className={
                                      styles["chatmodal-figma-action-button"]
                                    }
                                    title="Open assistant settings"
                                    onClick={handlePromptUtilityClick}
                                  >
                                    <img
                                      src={page_info?.src}
                                      alt="Assistant settings"
                                    />
                                  </button>
                                  {/* {chatImageUrl && !isShowSubmittedChatPreview ? (
																<div className={styles['chatmodal-figma-upload-pill']}>
																	Image attached
																</div>
																) : null} */}
                                </div>
                              )}
                              <button
                                type="button"
                                className={`${styles["chatmodal-figma-submit"]} ${
                                  isShopByThemeOptionActive
                                    ? styles[
                                        "chatmodal-figma-submit-shop-theme"
                                      ]
                                    : ""
                                } ${
                                  (
                                    isShopALookOptionActive
                                      ? !chatImageUrl
                                      : !localChatMessage && !chatImageUrl
                                  )
                                    ? styles["chatmodal-figma-submit-disabled"]
                                    : ""
                                }`}
                                onClick={handleSubmitChatInput}
                                disabled={
                                  isShopALookOptionActive
                                    ? !chatImageUrl
                                    : !localChatMessage && !chatImageUrl
                                }
                              >
                                <ArrowUpOutlined />
                              </button>
                            </div>
                          </div>
                        </div>
                        </>

                      )
                      }
                    </div>
                    {/* // )} */}
                    {isShowFollowUpSearch || isShowTryAgain ? (
                      <div
                        className={`${
                          shouldUseLegacyImageSearchLayout
                            ? styles["chatmodal-followup-controls-mt4"]
                            : styles["chatmodal-followup-controls-mt1"]
                        } ${styles["chatmodal-followup-controls-container"]}`}
                      >
                        {/* CLASS MATCH1 */}

                        {isShowFollowUpSearch && isSidExpired ? (
                          <div
                            className={
                              styles["chatmodal-followup-checkbox-container"]
                            }
                          >
                            <input
                              type="checkbox"
                              id="followUpQuery"
                              className={styles["chatmodal-followup-checkbox"]}
                              checked={isFollowUpQuery}
                              disabled={showChatLoader}
                              onChange={handleFollowUpSearch}
                            />
                            <label
                              htmlFor="followUpQuery"
                              className={`${
                                showChatLoader
                                  ? styles["chatmodal-followup-label-disabled"]
                                  : styles["chatmodal-followup-label"]
                              }`}
                            >
                              Follow-Up search
                            </label>
                          </div>
                        ) : null}
                        {isShowFollowUpSearch &&
                        isShowTryAgain &&
                        isSidExpired ? (
                          <div
                            className={styles["chatmodal-divider-vertical"]}
                          ></div>
                        ) : null}
                        {isShowTryAgain ? (
                          <button
                            className={`${styles["chatmodal-try-again-button"]} ${
                              showChatLoader
                                ? styles["chatmodal-try-again-button-disabled"]
                                : ""
                            }`}
                            title="Regenerate the products with AI."
                            onClick={handleTryAgainClick}
                            disabled={showChatLoader}
                          >
                            <ReloadOutlined
                              className={styles["chatmodal-reload-icon"]}
                            />
                            Try again
                          </button>
                        ) : null}
                        {isFollowUpQuery &&
                        isShowFollowUpSearch &&
                        regenarateImage ? (
                          <>
                            <div
                              className={styles["chatmodal-divider-vertical"]}
                            ></div>
                            <button
                              className={`${styles["chatmodal-try-again-button"]} ${
                                showChatLoader
                                  ? styles[
                                      "chatmodal-try-again-button-disabled"
                                    ]
                                  : ""
                              }`}
                              title="Regenerate the Image."
                              onClick={handleRegenrateImage}
                            >
                              <ReloadOutlined
                                className={styles["chatmodal-reload-icon"]}
                              />
                              Regenerate Image
                            </button>
                          </>
                        ) : null}
                      </div>
                    ) : null}

                

                    {/* // REMOVE */}
                    {/* <div className='my-4 px-8 w-full flex'>
					<input
						name='url'
						type='url'
						placeholder='Search with video/audio URL'
						className='h-10 rounded-lg w-full max-w-448 mx-auto px-2 placeholder-gray-500'
					/>
				</div> */}
                    {/* {!is_store_instance && !isStagingEnv && (
					<ChatSuggestionsV2
						onSuggestionClick={submitChatInput}
						wrapperClassName='pt-4 lg:pt-6 max-w-4xl'
					/>
				)} */}
                  </div>
                ) : null}
                {/* 
								{auraHelperMessage &&
									!isFreshSearch &&
									!isBTNormalUserLoggedIn &&
									!isShowSubmittedChatPreview ? (
									<>
										<div className={styles['chatmodal-helper-message-container']}>
											<div className={styles['chatmodal-helper-message-icon-container']}>
												<Image
													// src={star_ai_icon_logo}
													className={styles['chatmodal-helper-message-icon']}
													preview={false}
													width={30}
												/>
											</div>
											<CaretRightOutlined className={styles['chatmodal-helper-message-caret']} />
											<div className={styles['chatmodal-helper-message-text']}>
												{auraHelperMessage}
											</div>

										</div>

									</>

								) : null} */}
              </div>
            </div>
            {showChatLoader && (localChatMessage || chatImageUrl) && (
              <div className={styles["chatmodal-loading-bar-container"]}>
                <div className={styles["chatmodal-loading-bar"]}></div>
              </div>
            )}
            {!showChatLoader  && (
              // <div className={styles["chatmodal-loading-bar-container"]}>
                <div className={styles["chatmodal-content-wrapper-border"]}></div>
              // </div>
            )}
          </div>
        </>
      ) : null}

      <div
        id="chat_products_container"
        // className={`w-full h-auto bg-white chat-product-data-container flex-auto flex flex-col`}>
        className={`${styles["chatmodal-products-container"]} ${
          isGuestPopUpShow
            ? styles["chatmodal-products-container-overflow"]
            : ""
        }`}
      >
        {showChatLoader && (
          <div style={{ position: "absolute", width: "100%" }}>
            <div className="chat_aura_products_search_skeleton"></div>
          </div>
        )}
        {current_store_name === STORE_USER_NAME_SAMSKARA ? (
          <div className={styles["chatmodal-samskara-container"]}>
            <a
              href={MAIN_SITE_URL[STORE_USER_NAME_SAMSKARA]}
              className={styles["chatmodal-samskara-link"]}
            >
              <span className={styles["chatmodal-samskara-link-content"]}>
                <span className={styles["chatmodal-samskara-icon-wrapper"]}>
                  <ArrowLeftOutlined />
                </span>
                <span className={styles["chatmodal-samskara-text"]}>
                  Back to Samskara Home
                </span>
              </span>
            </a>
          </div>
        ) : null}
        {isShowAuraResponse ? (
          <>
            <ChatProducts
              enableClickTracking
              trackCollectionData={trackCollectionData}
              chatTypeKey={CHAT_TYPE_CHAT}
              isBTNormalUserLoggedIn={isBTNormalUserLoggedIn}
              isAuraChatPage={isAuraChatPage}
              handleLoadMore={handleLoadMore}
              localChatMessage={localChatMessage}
              shouldMoveInputBelowResults={shouldMoveInputBelowResults}
              inputRef={inputRef}
              handleInputChange={handleInputChange}
              handlePromptKeyDown={handlePromptKeyDown}
              chatImageUrl={chatImageUrl}
              isFigmaUploadPanelOpen={isFigmaUploadPanelOpen}
              handleFigmaUploadButtonClick={handleFigmaUploadButtonClick}
              isShowSubmittedChatPreview={isShowSubmittedChatPreview}
              handlePromptUtilityClick={handlePromptUtilityClick}
              isShopALookOptionActive={isShopALookOptionActive}
              handleSubmitChatInput={handleSubmitChatInput}
              isShowFollowUpSearch={isShowFollowUpSearch}
              isSidExpired={isSidExpired}
              isFollowUpQuery={isFollowUpQuery}
              handleFollowUpSearch={handleFollowUpSearch}
              isShowTryAgain={isShowTryAgain}
              showChatLoader={showChatLoader}
              handleTryAgainClick={handleTryAgainClick}
              activeSearchOption={activeSearchOption}
              upload_icon={upload_icon}
              page_info={page_info}
            />
          </>
        ) : isShowKioskSearchOptions ? (
          <KioskSearchOptions
            displaySearchOptions={displaySearchOptions}
            handleSetSearchOption={handleSetSearchOption}
          />
        ) : isBTNormalUserLoggedIn ? (
          <div className={styles["chatmodal-bt-user-container"]}>
            <div className={styles["chatmodal-bt-user-content"]}>
              <div className={styles["chatmodal-header-row"]}>
                <img
                  src={star_ai_icon}
                  width={56}
                  height={56}
                  className={styles["chatmodal-header-icon"]}
                />

                <h1 className={styles["chatmodal-header-title"]}>
                  <span className={styles["chatmodal-header-title-primary"]}>
                    I'm AURA
                  </span>
                  <br />
                  <span className={styles["chatmodal-header-title-secondary"]}>
                    How can I inspire you today?
                  </span>
                </h1>
              </div>
              {!isEmpty(selectedSearchOptionExamples) ? (
                <div className={styles["chatmodal-bt-user-examples-container"]}>
                  {selectedSearchOptionExamples?.map((exa) => (
                    <div
                      className={styles["chatmodal-bt-user-example-card"]}
                      onClick={(event) => {
                        handleTryThisClick(event, exa?.text, exa?.image_url);
                      }}
                    >
                      <div
                        key={exa}
                        className={styles["chatmodal-example-text"]}
                      >
                        {exa?.text}
                      </div>

                      <div
                        className={styles["chatmodal-example-image-container"]}
                      >
                        {exa?.image_url ? (
                          <img
                            src={exa.image_url}
                            className={styles["chatmodal-example-image"]}
                          />
                        ) : null}
                      </div>
                      <div
                        className={styles["chatmodal-example-icon-container"]}
                      >
                        <img
                          src={searchIcon}
                          alt="searchIcon"
                          width={18}
                          height={18}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {enable_recommendations && (
          <Recommendations trackCollectionData={trackCollectionData} />
        )}

        {/* {shouldMoveInputBelowResults ? (
						<div className={styles['chatmodal-bottom-input-wrapper']}>
							<div className={styles['chatmodal-figma-input-section']}>
								<div
									className={`${styles['chatmodal-figma-input-card']} ${styles['chatmodal-figma-input-card-bottom']} ${chatImageUrl
										? styles['chatmodal-figma-input-card-with-preview']
										: ""
										}`}>
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
										className={styles['chatmodal-figma-input']}
									/>
									<div className={styles['chatmodal-figma-input-divider']} />
									<div className={styles['chatmodal-figma-input-actions']}>
										<div className={styles['chatmodal-figma-input-actions-left']}>
											<div
												className={styles['chatmodal-upload-action-wrapper']}>
												<button
													type='button'
													className={`${styles['chatmodal-figma-action-button']} ${styles['chatmodal-figma-image-action-button']} ${isFigmaUploadPanelOpen || chatImageUrl
														? styles['chatmodal-figma-image-action-button-active']
														: ""
														}`}
													title='Upload image'
													onClick={handleFigmaUploadButtonClick}>
													<img src={upload_icon?.src} alt='Upload image' />
													{(isFigmaUploadPanelOpen || chatImageUrl) && <span>Image</span>}
												</button>
											</div>
											<button
												type='button'
												className={styles['chatmodal-figma-action-button']}
												title='Open assistant settings'
												onClick={handlePromptUtilityClick}>
												<img src={page_info?.src} alt='Assistant settings' />
											</button>
											{chatImageUrl && !isShowSubmittedChatPreview ? (
												<div className={styles['chatmodal-figma-upload-pill']}>
													Image attached
												</div>
											) : null}
										</div>
										<button
											type='button'
											className={`${styles['chatmodal-figma-submit']} ${(isShopALookOptionActive ? !chatImageUrl : !localChatMessage && !chatImageUrl)
												? styles['chatmodal-figma-submit-disabled']
												: ""
												}`}
											onClick={handleSubmitChatInput}
											disabled={isShopALookOptionActive ? !chatImageUrl : !localChatMessage && !chatImageUrl}>
											<ArrowUpOutlined />
										</button>
									</div>
								</div>

								{isShowFollowUpSearch || isShowTryAgain ? (
									<div
										className={`${styles['chatmodal-followup-controls-mt1']} ${styles['chatmodal-followup-controls-container']}`}>
										{isShowFollowUpSearch && isSidExpired ? (
											<div className={styles['chatmodal-followup-checkbox-container']}>
												<input
													type='checkbox'
													id='followUpQuery_bottom'
													className={styles['chatmodal-followup-checkbox']}
													checked={isFollowUpQuery}
													disabled={showChatLoader}
													onChange={handleFollowUpSearch}
												/>
												<label
													htmlFor='followUpQuery_bottom'
													className={`${showChatLoader
														? styles['chatmodal-followup-label-disabled']
														: styles['chatmodal-followup-label']
														}`}>
													Follow-Up search
												</label>
											</div>
										) : null}
										{isShowFollowUpSearch &&
											isShowTryAgain &&
											isSidExpired ? (
											<div className={styles['chatmodal-divider-vertical']}></div>
										) : null}
										{isShowTryAgain ? (
											<button
												className={`${styles['chatmodal-try-again-button']} ${showChatLoader
													? styles['chatmodal-try-again-button-disabled']
													: ""
													}`}
												title='Regenerate the products with AI.'
												onClick={handleTryAgainClick}
												disabled={showChatLoader}>
												<ReloadOutlined className={styles['chatmodal-reload-icon']} />
												Try again
											</button>
										) : null}
									</div>
								) : null}
							</div>
						</div>
					) : null} */}
      </div>
    </div>
  );
};

export default ChatModal;
