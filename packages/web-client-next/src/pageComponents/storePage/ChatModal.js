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
	SettingFilled,
	ReloadOutlined,
	CaretRightOutlined,
	HistoryOutlined,
	ArrowLeftOutlined,
	UploadOutlined,
	LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from 'next/router';
import { useNavigate } from "../../helper/useNavigate";

import header_aura from "../../images/chat/header_aura_image_transparent.png";
import star_ai_icon_logo from "../../images/unthink_star_ai_icon.svg";
import searchIcon from "../../images/swiftly-styled/Aura - Search.svg";
import star_ai_icon from "../../images/unthink_star_ai_icon.svg";
import Chat from "./Chat";
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
	]);

	const {
		suggestions: { tags = [], title = "" },
	} = suggestionsWithProducts;

	const [showUploadImage, setShowUploadImage] = useState(true);
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	const dispatch = useDispatch();

	const modalRef = useRef(null);

	const { sendMessage } = useChat();

	const closeChatModal = () => {
		if (streaming) {
			onStopRecording();
		}
		sessionStorage.removeItem("widgetHeader");
		setLocalChatMessage("");
		dispatch(setShowChatModal(false));
		showSubmitImageTooltip && setShowSubmitImageTooltip(false);
	};

	const {
		text: followUpQuery, //requestedText
		metadata: requestedMetaData,
		image_url: requestedImageUrl,
	} = widgetHeaderRequest;

	// removed set default active search option
	// useEffect(() => {
	// 	const defaultSelectedOption = searchOptions.find(
	// 		(option) => option.default
	// 	);
	// 	if (defaultSelectedOption && !is_kiosk) {
	// 		dispatch(setActiveSearchOption(defaultSelectedOption));
	// 	}
	// }, [searchOptions, is_kiosk]);

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
			userMetadata
		);
	};

	const handleTryThisClick = (
		e,
		chatMessage = activeSearchOption.text_example,
		chatImage = ""
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
			setLocalChatMessage("");
			sessionStorage.removeItem("widgetHeader");
			if (option.id === CHAT_SEARCH_OPTION_ID.trending_collections) {
				dispatch(setShowChatModal(false));
				navigate(`/#${COLLECTIONS_ID}`); // navigate on root page for trending_collections search option, scroll to first collection of root page
			} else {
				dispatch(setActiveSearchOption(option));
				dispatch(resetAuraSearchResponse()); // reset AURA response when change search option
			}
		},
		[searchOptions]
	);

	const handleFollowUpSearch = useCallback(() => {
		setIsFollowUpQuery((value) => !value);
		dispatch(setChatMessage(""));
		inputRef?.current?.focus();
	}, [inputRef.current]);

	const displaySearchOptions = useMemo(
		() => searchOptions.filter((v) => v?.is_display),
		[searchOptions]
	);

	const isSuggestionsWithProductsAvailable = useMemo(
		() =>
			Object.values(suggestionsWithProducts).some((value) => !isEmpty(value)),
		[suggestionsWithProducts]
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
		]
	);

	const isShowFollowUpQuery = useMemo(
		() => isFollowUpQuery && followUpQuery,
		[isFollowUpQuery, followUpQuery]
	);

	// showing random examples from selected search option
	const selectedSearchOptionExamples = useMemo(
		() => getRandomArrayElements(activeSearchOption.examples, 4),
		[activeSearchOption.examples]
	);

	const isShowFollowUpSearch = useMemo(
		() =>
			activeSearchOption?.follow_up_search_enable &&
			requestedMetaData?.searchOptionId === activeSearchOption?.id,
		[
			activeSearchOption?.follow_up_search_enable,
			requestedMetaData?.searchOptionId,
			activeSearchOption?.id,
		]
	);

	const isSidExpired = useMemo(
		() => socket.id === socketId,
		[socket.id, socketId]
	);

	const isShowTryAgain = useMemo(
		() => followUpQuery || requestedImageUrl,
		[followUpQuery, requestedImageUrl]
	);

	const isActiveSearchOptionAvailable = useMemo(
		() => !isEmpty(activeSearchOption),
		[activeSearchOption]
	);

	const isShowAuraResponse = useMemo(
		() => showChatResponse && isActiveSearchOptionAvailable,
		[showChatResponse, isActiveSearchOptionAvailable]
	);

	const isShowKioskSearchOptions = useMemo(
		() => is_kiosk && !isActiveSearchOptionAvailable,
		[is_kiosk, isActiveSearchOptionAvailable]
	);

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

	const [nextPage, setNextPage] = useState(true);
	const [ipp, setIpp] = useState(15);
	const [currentPage, setCurrentPage] = useState(0);
	const [regenarateImage, setRegenarateImage] = useState(false);

	console.log("activeSearchOption", activeSearchOption);


	const handleSubmitChatInput = () => {
		const metadata = { ...chatInputMetadata };

		const userMetadata = {
			brand: authUser?.filters?.[current_store_name]?.strict?.brand || [],
		};

		console.log("isFollowUpQuery", isFollowUpQuery);

		if (localChatMessage || chatImageUrl) {
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
				sendImageSmartSearch || sendImageShopLook || sendImageCompleteLook ? chatImageUrl : undefined;

			submitChatInput(
				localChatMessage,
				finalImageToSend, // <--- image sent only in the two valid cases
				metadata,
				userMetadata
			);

			dispatch(setAuraHelperMessage(activeSearchOption?.search_message));
			dispatch(setAuraSreverImage(""));
			dispatch(setOverlayCoordinates([]));
		}

		if (isFollowUpQuery && isShowFollowUpSearch) {
			setRegenarateImage(true);
		}
	};

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
				userMetadata
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

		console.log("data: " + JSON.stringify(metadata));

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
			className={styles['chatmodal-modal-container']}
			ref={modalRef}>
			{/* hide close icon for AuraChatPage */}
			{!isAuraChatPage ? (
				<div className={styles['chatmodal-close-icon-container']}>
					<CloseOutlined
						id='chat_modal_close_icon'
						onClick={closeChatModal}
						className={styles['chatmodal-close-icon']}
					/>
				</div>
			) : null}

			{!is_kiosk || isActiveSearchOptionAvailable ? (
				<>
					<div
						className={`${styles['chatmodal-content-wrapper']} ${!showChatLoader ? styles['chatmodal-content-wrapper-border'] : ''
							} `}>
						<div className={styles['chatmodal-content-inner']}>
							<div className={styles['chatmodal-content-max-width']}>
								{!isBTNormalUserLoggedIn ? (
									<>
										{!isActiveSearchOptionAvailable ? (
											<div className={styles['chatmodal-header-section']}>
												<div className={styles['chatmodal-header-row']}>
													<img
														src={star_ai_icon}
														width={56}
														height={56}
														className={styles['chatmodal-header-icon']}
													/>

													<h1 className={styles['chatmodal-header-title']}>
														<span className={styles['chatmodal-header-title-primary']}>I'm AURA</span>
														<br />
														<span className={styles['chatmodal-header-title-secondary']}>
															How can I inspire you today?
														</span>
													</h1>
												</div>
											</div>
										) : null}
										<div
											className={styles['chatmodal-search-options-grid']}
											style={{ '--col-count': displaySearchOptions.length }}>
											{displaySearchOptions.map((searchOptions) => (
												<div
													key={searchOptions.id}
													className={`${styles['chatmodal-search-option-card']} ${searchOptions?.id === activeSearchOption?.id
														? styles['chatmodal-search-option-card-active']
														: ""
														}`}
													onClick={() => handleSetSearchOption(searchOptions)}>
													<div className={styles['chatmodal-search-option-header']}>
														<div
															className={`${styles['chatmodal-search-option-title']} ${searchOptions?.id === activeSearchOption?.id
																? styles['chatmodal-search-option-title-active']
																: ""
																}`}>
															{searchOptions.title}
														</div>
														{showSettings &&
															searchOptions.id !==
															CHAT_SEARCH_OPTION_ID.product_search &&
															searchOptions?.id === activeSearchOption?.id ? (
															<span
																className={styles['chatmodal-search-option-setting']}
																onClick={openSettingModal}
																role='button'>
																{/* <SettingFilled
																	id='chat_setting_icon'
																	className='text-white'
																/> */}
															</span>
														) : null}
													</div>
													{/* <Tooltip title={searchOptions.subTitle}> */}
													<div
														className={`${styles['chatmodal-search-option-subtitle']} ${searchOptions?.id === activeSearchOption?.id
															? styles['chatmodal-search-option-subtitle-active']
															: ""
															} `}>
														{searchOptions.subTitle}{" "}
														{searchOptions?.id === activeSearchOption?.id &&
															activeSearchOption.text_example ? (
															<span
																className={styles['chatmodal-search-option-example-link']}
																onClick={handleTryThisClick}>
																Try an Example
															</span>
														) : null}
													</div>
													{/* </Tooltip> */}
												</div>
											))}
										</div>
									</>
								) : null}

								{!isShowAuraResponse && !isShowKioskSearchOptions ? (
									!isEmpty(selectedSearchOptionExamples) &&
										!chatMessage &&
										!chatImageUrl ? (
										<div className={styles['chatmodal-examples-section']}>
											<div className={styles['chatmodal-examples-container']}>
												{selectedSearchOptionExamples?.map((exa) => (
													<div
														className={styles['chatmodal-example-card']}
														onClick={(event) => {
															handleTryThisClick(
																event,
																exa?.text,
																exa?.image_url
															);
														}}>
														<div key={exa} className={styles['chatmodal-example-text']}>
															{exa?.text}
														</div>

														<div className={styles['chatmodal-example-image-container']}>
															{exa?.image_url ? (
																<img
																	src={exa.image_url}
																	className={styles['chatmodal-example-image']}
																/>
															) : null}
														</div>
														<div className={styles['chatmodal-example-icon-container']}>
															<img
																src={searchIcon}
																alt='searchIcon'
																width={18}
																height={18}
															/>
														</div>
													</div>
												))}
											</div>
										</div>
									) : null
								) : null}

								{isShowFollowUpQuery ? (
									<div className={styles['chatmodal-followup-query-container']}>
										<HistoryOutlined className={styles['chatmodal-followup-query-icon']} />
										<div className={styles['chatmodal-followup-query-text']}>
											{followUpQuery}
										</div>
									</div>
								) : null}

								{isBTNormalUserLoggedIn || isActiveSearchOptionAvailable ? (
									<div>
										{activeSearchOption.allow_image_search ? (
											<div
												className={styles['chatmodal-image-search-grid']}
												style={{ minHeight: "252px" }}>
												<div>
													{showUploadImage ? (
														<>
															{isUploadingImage ? (
																<div className={styles['chatmodal-upload-spinner-container']}>
																	<Spin
																		className={styles['chatmodal-upload-spinner']}
																		indicator={
																			<LoadingOutlined
																				style={{ fontSize: 30 }}
																				className={styles['chatmodal-upload-spinner-icon']}
																				spin
																			/>
																		}
																		spinning={isUploadingImage}
																	/>
																</div>
															) : (
																<div className={styles['chatmodal-image-preview-container']}>
																	{chatImageUrl ? (
																		<div className={styles['chatmodal-image-preview-wrapper']}>
																			<div className={styles['chatmodal-image-preview-relative']}>
																				<img
																					ref={imgRef}
																					onLoad={handleImageLoad}
																					className={styles['chatmodal-image-preview']}
																					src={chatImageUrl}
																					alt='Uploaded Image'
																				/>

																				{/* Overlay Points */}
																				{Array.isArray(auraOverlayCoordinates) && auraOverlayCoordinates.map(
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
																								color='blue'>
																								<div
																									onClick={() =>
																										handleSuggestionClick(
																											item.attributes.label
																										)
																									}
																									className={styles['chatmodal-overlay-point']}
																									style={{
																										left: `${adjustedX}px`,
																										top: `${adjustedY}px`,
																										boxShadow:
																											"0 0 10px rgba(0, 123, 255, 0.8)",
																									}}
																								/>
																							</Tooltip>
																						);
																					}
																				)}
																			</div>

																			{/* Change Image Option */}
																			<div className={styles['chatmodal-change-image-link']}>
																				<span
																					onClick={handleChangeImageConfirm}>
																					Change Image
																				</span>
																			</div>
																		</div>
																	) : (
																		<div className={styles['chatmodal-dragger-wrapper']}>
																			<Dragger
																				className={styles['chatmodal-dragger']}
																				{...uploadImageProps}
																				name='image_url'
																				showUploadList={false}>
																				<p className='ant-upload-drag-icon'>
																					<UploadOutlined />
																				</p>
																				<p className={styles['chatmodal-dragger-text']}>
																					Click or drag file to this area to
																					upload Image
																				</p>
																			</Dragger>
																		</div>
																	)}
																</div>
															)}
														</>
													) : (
														<input
															className={styles['chatmodal-image-url-input']}
															placeholder='Enter Image URL'
															name='chat_image_url'
															type='text'
															value={chatImageUrl}
															onChange={handleInputChange}
														/>
													)}
													<div className={styles['chatmodal-divider-text']}>
														Or
													</div>
													<div className={styles['chatmodal-toggle-upload-container']}>
														<div
															className={styles['chatmodal-toggle-upload-link']}
															role='button'
															title={
																showUploadImage
																	? "Click here to enter image URL"
																	: "Click here to upload image"
															}
															onClick={handleUploadImageModeChange}>
															{showUploadImage ? "Image URL" : "Upload image"}
														</div>
													</div>
												</div>
												<div className={styles['chatmodal-textarea-container']}>
													<div className={styles['chatmodal-textarea-wrapper']}>
														<textarea
															className={styles['chatmodal-textarea']}
															placeholder={`Give additional instructions here. ${typeof activeSearchOption?.text_placeholder ===
																"string"
																? activeSearchOption?.text_placeholder
																: activeSearchOption?.text_placeholder?.[0]
																}`}
															name='chat_message'
															value={localChatMessage}
															onChange={handleInputChange}
														/>
													</div>
													<div className={styles['chatmodal-submit-button-container']}>
														<button
															type='submit'
															className={`${styles['chatmodal-submit-button']} ${!chatImageUrl || showChatLoader
																? styles['chatmodal-submit-button-disabled']
																: styles['chatmodal-submit-button-enabled']
																}`}
															onClick={handleSubmitChatInput}
															disabled={!chatImageUrl || showChatLoader}>
															Submit
														</button>
													</div>
												</div>
											</div>
										) : (
											<>
												{/* CLASS MATCH1 */}
												<Chat
													localChatMessage={localChatMessage}
													handleMicrophoneClick={handleMicrophoneClick}
													streaming={streaming}
													submitChatInput={submitChatInput}
													// submitImageUrl={submitImageUrl}
													onChatClick={onChatClick}
													chatInputMetadata={chatInputMetadata}
													config={config}
													isBTInstance={isBTInstance}
													inputRef={inputRef}
													isFollowUpQuery={isFollowUpQuery}
													showSubmitImageTooltip={showSubmitImageTooltip}
													setShowSubmitImageTooltip={setShowSubmitImageTooltip}
													isBTNormalUserLoggedIn={isBTNormalUserLoggedIn}
													handleInputChange={handleInputChange}
													handleSubmitChatInput={handleSubmitChatInput}
												/>
											</>
										)}
										{isShowFollowUpSearch || isShowTryAgain ? (
											<div
												className={`${activeSearchOption.allow_image_search
													? styles['chatmodal-followup-controls-mt4']
													: styles['chatmodal-followup-controls-mt1']
													} ${styles['chatmodal-followup-controls-container']}`}>
												{/* CLASS MATCH1 */}
												{isShowFollowUpSearch && isSidExpired ? (
													<div className={styles['chatmodal-followup-checkbox-container']}>
														<input
															type='checkbox'
															id='followUpQuery'
															className={styles['chatmodal-followup-checkbox']}
															checked={isFollowUpQuery}
															disabled={showChatLoader}
															onChange={handleFollowUpSearch}
														/>
														<label
															htmlFor='followUpQuery'
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
												{isFollowUpQuery &&
													isShowFollowUpSearch &&
													regenarateImage ? (
													<>
														<div className={styles['chatmodal-divider-vertical']}></div>
														<button
															className={`${styles['chatmodal-try-again-button']} ${showChatLoader
																? styles['chatmodal-try-again-button-disabled']
																: ""
																}`}
															title='Regenerate the Image.'
															onClick={handleRegenrateImage}>
															<ReloadOutlined className={styles['chatmodal-reload-icon']} />
															Regenerate Image
														</button>
													</>
												) : null}
											</div>
										) : null}

										{auraServerImage &&
											activeSearchOption.id === "smart_search" && (
												<>
													{!showChatLoader ? (
														<div
															style={{ width: "fit-content" }}
															className={styles['chatmodal-server-image-container']}>
															{/* Image */}
															<img
																className={styles['chatmodal-server-image']}
																src={auraServerImage}
																alt='Aura Image'
															/>
															{/* Overlay Points */}
															{Array.isArray(auraOverlayCoordinates) && auraOverlayCoordinates.map((item, index) => {
																const adjustedX =
																	(item.point[0] / originalWidth) * newWidth;
																const adjustedY =
																	(item.point[1] / originalHeight) * newHeight;

																return (
																	<Tooltip
																		key={index}
																		title={item.attributes.label}
																		color='blue'>
																		<div
																			onClick={() =>
																				handleSuggestionClick(
																					item.attributes.label
																				)
																			}
																			className={styles['chatmodal-overlay-point']}
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
														<div className={styles['chatmodal-server-image-spinner-container']}>
															<Spin size='large' />
														</div>
													)}
												</>
											)}

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

								{auraHelperMessage &&
									!isFreshSearch &&
									!isBTNormalUserLoggedIn ? (
									<>
										<div className={styles['chatmodal-helper-message-container']}>
											<div className={styles['chatmodal-helper-message-icon-container']}>
												<Image
													src={star_ai_icon_logo}
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

								) : null}
							</div>
						</div>
						{showChatLoader && (
							<div className={styles['chatmodal-loading-bar-container']}>
								<div className={styles['chatmodal-loading-bar']}></div>
							</div>
						)}
					</div>
				</>
			) : null}

			<div
				id='chat_products_container'
				// className={`w-full h-auto bg-white chat-product-data-container flex-auto flex flex-col`}>
				className={`${styles['chatmodal-products-container']} ${isGuestPopUpShow ? styles['chatmodal-products-container-overflow'] : ""
					}`}>
				{showChatLoader && (
					<div style={{ position: 'absolute', width: '100%' }}>
						<div className="chat_aura_products_search_skeleton"></div>
					</div>
				)}
				{current_store_name === STORE_USER_NAME_SAMSKARA ? (
					<div className={styles['chatmodal-samskara-container']}>
						<a
							href={MAIN_SITE_URL[STORE_USER_NAME_SAMSKARA]}
							className={styles['chatmodal-samskara-link']}>
							<span className={styles['chatmodal-samskara-link-content']}>
								<span className={styles['chatmodal-samskara-icon-wrapper']}>
									<ArrowLeftOutlined />
								</span>
								<span className={styles['chatmodal-samskara-text']}>
									Back to Samskara Home
								</span>
							</span>
						</a>
					</div>
				) : null}
				{isShowAuraResponse ? (
					<>
						<ChatProducts
							// enableClickFetchRec={isSharedPage || isCollectionPage}
							enableClickTracking
							// enableClickTracking={isSharedPage || isCollectionPage}
							// trackCollectionId={currentSingleCollection._id}
							// trackCollectionName={currentSingleCollection.collection_name}
							// trackCollectionCampCode={currentSingleCollection.campaign_code}
							// trackCollectionICode={pageUser.influencer_code}
							trackCollectionData={trackCollectionData}
							chatTypeKey={CHAT_TYPE_CHAT}
							isBTNormalUserLoggedIn={isBTNormalUserLoggedIn}
							isAuraChatPage={isAuraChatPage}
							handleLoadMore={handleLoadMore}
							localChatMessage={localChatMessage}
						/>
					</>
				) : isShowKioskSearchOptions ? (
					<KioskSearchOptions
						displaySearchOptions={displaySearchOptions}
						handleSetSearchOption={handleSetSearchOption}
					/>
				) : isBTNormalUserLoggedIn ? (
					<div className={styles['chatmodal-bt-user-container']}>
						<div className={styles['chatmodal-bt-user-content']}>
							<div className={styles['chatmodal-header-row']}>
								<img
									src={star_ai_icon}
									width={56}
									height={56}
									className={styles['chatmodal-header-icon']}
								/>

								<h1 className={styles['chatmodal-header-title']}>
									<span className={styles['chatmodal-header-title-primary']}>I'm AURA</span>
									<br />
									<span className={styles['chatmodal-header-title-secondary']}>
										How can I inspire you today?
									</span>
								</h1>
							</div>
							{!isEmpty(selectedSearchOptionExamples) ? (
								<div className={styles['chatmodal-bt-user-examples-container']}>
									{selectedSearchOptionExamples?.map((exa) => (
										<div
											className={styles['chatmodal-bt-user-example-card']}
											onClick={(event) => {
												handleTryThisClick(event, exa?.text, exa?.image_url);
											}}>
											<div key={exa} className={styles['chatmodal-example-text']}>
												{exa?.text}
											</div>

											<div className={styles['chatmodal-example-image-container']}>
												{exa?.image_url ? (
													<img
														src={exa.image_url}
														className={styles['chatmodal-example-image']}
													/>
												) : null}
											</div>
											<div className={styles['chatmodal-example-icon-container']}>
												<img
													src={searchIcon}
													alt='searchIcon'
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
			</div>
		</div>
	);
};

export default ChatModal;

