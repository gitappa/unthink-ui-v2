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

	console.log("activeSearchOption",activeSearchOption);
	

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
			className='z-10 w-full bg-white shadow-md h-full flex flex-col'
			ref={modalRef}>
			{/* hide close icon for AuraChatPage */}
			{!isAuraChatPage ? (
				<div className='text-xl lg:text-2xl flex justify-end absolute top-1 md:top-2 right-1 md:right-2'>
					<CloseOutlined
						id='chat_modal_close_icon'
						onClick={closeChatModal}
						className='cursor-pointer text-black-100'
					/>
				</div>
			) : null}

			{!is_kiosk || isActiveSearchOptionAvailable ? (
				<>
					<div
						className={`py-4 flex flex-col gap-4 bg-white ${!showChatLoader && "border-b-2 border-gray-106"
							} `}>
						<div className='flex flex-col items-center'>
							<div className='max-w-4xl lg:max-w-3xl-2 2xl:max-w-6xl-2 w-full px-10 lg:px-0 flex flex-col gap-4'>
								{!isBTNormalUserLoggedIn ? (
									<>
										{!isActiveSearchOptionAvailable ? (
											<div className='py-4'>
												<div className='flex flex-row gap-2'>
													<img
														src={star_ai_icon}
														width={56}
														height={56}
														className='mb-auto'
													/>

													<h1 className='text-5xl md:text-6xl font-medium leading-44 md:leading-64 tracking-tighter-0.2'>
														<span className='text-indigo-500'>I'm AURA</span>
														<br />
														<span style={{ color: "#c4c7c5" }}>
															How can I inspire you today?
														</span>
													</h1>
												</div>
											</div>
										) : null}
										<div
											className={`grid grid-cols-1 md:grid-cols-${displaySearchOptions.length} tablet:grid-cols-${displaySearchOptions.length} gap-1 md:gap-4`}>
											{displaySearchOptions.map((searchOptions) => (
												<div
													key={searchOptions.id}
													className={`flex flex-col border md:border-2 shadow-md w-full rounded-xl px-2 md:px-2 md:py-1 text-left font-medium cursor-pointer border-gray-106 ${searchOptions?.id === activeSearchOption?.id
														? "border-slat-103 bg-slat-103"
														: "bg-lightgray-101"
														}`}
													onClick={() => handleSetSearchOption(searchOptions)}>
													<div className='flex justify-between'>
														<div
															className={`truncate text-sm md:text-lg ${searchOptions?.id === activeSearchOption?.id
																? "text-white"
																: "text-black-100"
																}`}>
															{searchOptions.title}
														</div>
														{showSettings &&
															searchOptions.id !==
															CHAT_SEARCH_OPTION_ID.product_search &&
															searchOptions?.id === activeSearchOption?.id ? (
															<span
																className='cursor-pointer flex justify-center items-center'
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
														className={`ellipsis_2 text-xs md:text-base ${searchOptions?.id === activeSearchOption?.id
															? "text-white block"
															: "text-gray-106 hidden md:block"
															} flex justify-between md:block`}>
														{searchOptions.subTitle}{" "}
														{searchOptions?.id === activeSearchOption?.id &&
															activeSearchOption.text_example ? (
															<span
																className='cursor-pointer text-white underline whitespace-nowrap mt-auto'
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
										<div className='py-4'>
											<div className='flex gap-5 overflow-auto -m-3 p-3'>
												{selectedSearchOptionExamples?.map((exa) => (
													<div
														className='relative flex flex-col w-full min-w-52 h-228 2xl:h-64 shadow-md rounded-xl p-4 gap-4 cursor-pointer bg-lightgray-101'
														onClick={(event) => {
															handleTryThisClick(
																event,
																exa?.text,
																exa?.image_url
															);
														}}>
														<div key={exa} className='text-lg'>
															{exa?.text}
														</div>

														<div className='overflow-auto h-full'>
															{exa?.image_url ? (
																<img
																	src={exa.image_url}
																	className='h-full m-auto rounded-xl'
																/>
															) : null}
														</div>
														<div className='absolute bottom-0 right-0 m-4 flex items-center justify-center bg-white rounded-full w-10 h-10 ml-auto'>
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
									<div className='flex items-center justify-center rounded-2xl md:rounded-full p-t-2 p-b-2 w-full pr-5.5 lg:pr-6.5'>
										<HistoryOutlined className='text-sm lg:text-base text-black-200 flex justify-center items-center' />
										<div className='text-sm lg:text-base text-black-200 w-full flex items-center pl-2 leading-none'>
											{followUpQuery}
										</div>
									</div>
								) : null}

								{isBTNormalUserLoggedIn || isActiveSearchOptionAvailable ? (
									<div>
										{activeSearchOption.allow_image_search ? (
											<div
												className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8`}
												style={{ minHeight: "252px" }}>
												<div>
													{showUploadImage ? (
														<>
															{isUploadingImage ? (
																<div className='flex items-center justify-center h-129 md:h-188'>
																	<Spin
																		className='w-full mx-auto'
																		indicator={
																			<LoadingOutlined
																				style={{ fontSize: 30 }}
																				className='text-blue-700'
																				spin
																			/>
																		}
																		spinning={isUploadingImage}
																	/>
																</div>
															) : (
																<div className='flex justify-center items-center'>
																	{chatImageUrl ? (
																		<div className='flex justify-center items-center mb-6 flex-col rounded-10'>
																			<div className='relative md:w-404 w-full mb-3'>
																				<img
																					ref={imgRef}
																					onLoad={handleImageLoad}
																					className='md:w-404 w-full rounded-10'
																					src={chatImageUrl}
																					alt='Uploaded Image'
																				/>

																				{/* Overlay Points */}
																				{auraOverlayCoordinates.map(
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
																									className='absolute w-5 h-5 border-2 bg-blue-500 border-blue-500 rounded-full cursor-pointer animate-pulse'
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
																			<div className='text-base block underline cursor-pointer pt-2'>
																				<span
																					onClick={handleChangeImageConfirm}>
																					Change Image
																				</span>
																			</div>
																		</div>
																	) : (
																		<div className='w-full chat_image_dragger'>
																			<Dragger
																				className='bg-transparent h-129 md:h-188 w-full rounded-2xl'
																				{...uploadImageProps}
																				name='image_url'
																				showUploadList={false}>
																				<p className='ant-upload-drag-icon'>
																					<UploadOutlined />
																				</p>
																				<p className='w-4/6 mx-auto'>
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
															className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full border border-solid border-gray-107 lg:text-lg avoid_autofill_bg'
															placeholder='Enter Image URL'
															name='chat_image_url'
															type='text'
															value={chatImageUrl}
															onChange={handleInputChange}
														/>
													)}
													<div className='text-center font-medium my-2 text-base'>
														Or
													</div>
													<div className='flex justify-center items-center text-base'>
														<div
															className='underline cursor-pointer'
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
												<div className='h-content'>
													<div className='rounded-2xl h-full border border-solid border-gray-107 md:h-188'>
														<textarea
															className='text-left placeholder-gray-101 outline-none px-3 pt-3 rounded-2xl w-full min-h-165 h-full resize-none overflow-y-auto lg:text-lg'
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
													<div className='flex justify-end pt-4'>
														<button
															type='submit'
															className={`text-xs md:text-sm text-white py-2.5 px-3.5 h-full md:w-full max-w-102 font-bold p-3 rounded-xl ${!chatImageUrl || showChatLoader
																? "bg-indigo-400"
																: "bg-indigo-600"
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
													? "mt-4"
													: "mt-1"
													} flex h-5 gap-2`}>
												{/* CLASS MATCH1 */}
												{isShowFollowUpSearch && isSidExpired ? (
													<div className='flex items-center ml-5'>
														<input
															type='checkbox'
															id='followUpQuery'
															className='cursor-pointer mr-1 h-3.5 w-3.5'
															checked={isFollowUpQuery}
															disabled={showChatLoader}
															onChange={handleFollowUpSearch}
														/>
														<label
															htmlFor='followUpQuery'
															className={`${showChatLoader
																? "cursor-not-allowed text-gray-106"
																: "cursor-pointer text-black-100"
																}`}>
															Follow-Up search
														</label>
													</div>
												) : null}
												{isShowFollowUpSearch &&
													isShowTryAgain &&
													isSidExpired ? (
													<div className='border-l-1.5 h-5'></div>
												) : null}
												{isShowTryAgain ? (
													<button
														className={`flex items-center ${showChatLoader
															? "cursor-not-allowed text-gray-106"
															: "cursor-pointer text-black-100"
															}`}
														title='Regenerate the products with AI.'
														onClick={handleTryAgainClick}
														disabled={showChatLoader}>
														<ReloadOutlined className='flex mr-0.75 stroke-current stroke-2' />
														Try again
													</button>
												) : null}
												{isFollowUpQuery &&
													isShowFollowUpSearch &&
													regenarateImage ? (
													<>
														<div className='border-l-1.5 h-5'></div>
														<button
															className={`flex items-center ${showChatLoader
																? "cursor-not-allowed text-gray-106"
																: "cursor-pointer text-black-100"
																}`}
															title='Regenerate the Image.'
															onClick={handleRegenrateImage}>
															<ReloadOutlined className='flex mr-0.75 stroke-current stroke-2' />
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
															className='relative  my-3 flex justify-center md:justify-start items-center md:items-start w-full flex-col'>
															{/* Image */}
															<img
																className='md:w-404 md:h-400 w-full h-300 rounded-10'
																src={auraServerImage}
																alt='Aura Image'
															/>
															{/* Overlay Points */}
															{auraOverlayCoordinates.map((item, index) => {
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
																			className='absolute w-5 h-5 border-2 bg-blue-500 border-blue-500 rounded-full cursor-pointer animate-pulse'
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
														<div className='flex justify-center items-center md:w-404 md:h-400 w-full h-300'>
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
									<div className='flex gap-1 items-center'>
										<div className='flex justify-center items-center'>
											<Image
												src={star_ai_icon_logo}
												className='rounded-full'
												preview={false}
												width={30}
											/>
										</div>
										<CaretRightOutlined className='text-black-200' />
										<div className='text-sm md:text-base text-black-200 font-medium'>
											{auraHelperMessage}
										</div>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</>
			) : null}

			<div
				id='chat_products_container'
				// className={`w-full h-auto bg-white chat-product-data-container flex-auto flex flex-col`}>
				className={`w-full h-auto bg-white chat-product-data-container flex-auto flex flex-col ${isGuestPopUpShow ? "overflow-hidden" : ""
					}`}>
				{showChatLoader && (
					<div className='w-full absolute'>
						<div className='aura_products_search_skeleton'></div>
					</div>
				)}
				{current_store_name === STORE_USER_NAME_SAMSKARA ? (
					<div className='pt-3 lg:pt-4 w-full max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto flex flex-col gap-2 md:gap-5'>
						<a
							href={MAIN_SITE_URL[STORE_USER_NAME_SAMSKARA]}
							className='text-black-200 mr-auto'>
							<span className='flex items-center cursor-pointer'>
								<span className='text-lg leading-none flex mr-2'>
									<ArrowLeftOutlined />
								</span>
								<span className='text-lg font-medium'>
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
					<div className='flex h-full max-h-590'>
						<div className='max-w-4xl lg:max-w-3xl-2 2xl:max-w-6xl-2 w-full px-10 lg:px-0 flex flex-col gap-10 md:gap-20 py-10 m-auto'>
							<div className='flex flex-row gap-2'>
								<img
									src={star_ai_icon}
									width={56}
									height={56}
									className='mb-auto'
								/>

								<h1 className='text-5xl md:text-6xl font-medium leading-44 md:leading-64 tracking-tighter-0.2'>
									<span className='text-indigo-500'>I'm AURA</span>
									<br />
									<span style={{ color: "#c4c7c5" }}>
										How can I inspire you today?
									</span>
								</h1>
							</div>
							{!isEmpty(selectedSearchOptionExamples) ? (
								<div className='flex gap-5 overflow-auto -m-10 p-10'>
									{selectedSearchOptionExamples?.map((exa) => (
										<div
											className='relative flex flex-col w-full max-w-228 2xl:max-w-xs min-w-52 h-228 2xl:h-64 shadow-md rounded-xl p-4 gap-4 cursor-pointer bg-lightgray-101'
											onClick={(event) => {
												handleTryThisClick(event, exa?.text, exa?.image_url);
											}}>
											<div key={exa} className='text-lg'>
												{exa?.text}
											</div>

											<div className='overflow-auto h-full'>
												{exa?.image_url ? (
													<img
														src={exa.image_url}
														className='h-full m-auto rounded-xl'
													/>
												) : null}
											</div>
											<div className='absolute bottom-0 right-0 m-4 flex items-center justify-center bg-white rounded-full w-10 h-10 ml-auto'>
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
