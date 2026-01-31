import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Input, Form, Image, Tooltip, Upload } from "antd";
import {
	CameraOutlined,
	ArrowRightOutlined,
	AudioOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
	setChatImageUrl,
	setChatMessage,
	setChatMute,
	setChatSearchType,
	setChatUserAction,
	setShowAuraIntro,
	setShowChatLoader,
	setShowSocketException,
	setActiveSearchOption,
	setAuraHelperMessage,
} from "../../hooks/chat/redux/actions";
// import header_aura from "../../images/chat/header_aura_image.png";
import header_aura from "../../images/chat/header_aura_image_transparent.png";
import star_ai_icon_logo from "../../images/unthink_star_ai_icon.svg";
import iconVolumeMute from "../../images/chat/icon_volume_mute.svg";
import iconVolume from "../../images/chat/icon_volume.svg";
import headerSearchIcon from "../../images/chat/header_search_icon.svg";
import header_mic from "../../images/chat/header_mic.svg";
import header_mic_dark from "../../images/chat/header_mic_dark.svg";
import close_bg_icon from "../../images/close_bg_icon.svg";
import SpeakingLoaderV2 from "../../components/Loader/SpeakingLoaderV2";
import SearchLoaderV2 from "../../components/Loader/SearchLoaderV2";
import AuraCameraSpinLoader from "../../components/Loader/AuraCameraSpinLoader";
import {
	AURA_CLICK,
	CHAT_SEARCH_OPTION_ID,
	CHAT_SEARCH_TYPES,
	CHAT_TYPES_KEYS,
	CHAT_TYPE_CHAT,
	// COLLECTION_COVER_IMG_SIZES,
	STORE_USER_NAME_BUDGETTRAVEL,
} from "../../constants/codes";
import styles from "./Chat.module.css";
import {
	// aura_header_theme,
	availableChatSearchTypes as _availableChatSearchTypes,
	isStagingEnv,
	is_kiosk,
} from "../../constants/config";
import { setIsSendSocketMessageWithPrefix } from "../../helper/getTrackerInfo";
import { profileAPIs } from "../../helper/serverAPIs";
import { isEmpty } from "../../helper/utils";

const Chat = ({
	localChatMessage,
	handleMicrophoneClick,
	streaming,
	submitChatInput,
	// submitImageUrl,
	onChatClick,
	chatInputMetadata,
	chatTypeKey = CHAT_TYPE_CHAT,
	availableChatSearchTypes = _availableChatSearchTypes,
	activeChatSearchType: __activeChatSearchType,
	showSpeaker = true,
	defaultActiveChatSearchType = _availableChatSearchTypes[0],
	typeSearchUIKey,
	config,
	isBTInstance,
	inputRef,
	isFollowUpQuery,
	showSubmitImageTooltip,
	setShowSubmitImageTooltip,
	isBTNormalUserLoggedIn,
	handleInputChange,
	handleSubmitChatInput,
}) => {
	const dispatch = useDispatch();

	const [
		chatMessage,
		chatImageUrl,
		isMute,
		showChatLoader,
		serverChatMessage,
		showChatModal,
		showException,
		exception,
		showAuraIntro,
		auraChatSetting,
		_activeChatSearchType,
		selectedSearchOption,
		searchOptions,
		authUser,
	] = useSelector((state) => [
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].chatMessage],
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].chatImageUrl],
		state.chatV2.isMute,
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].showChatLoader],
		state.chatV2.serverChatMessage,
		state.chatV2.showChatModal,
		state.chatV2.showException,
		state.chatV2.exception,
		state.chatV2.showAuraIntro,
		state.chatV2.auraChatSetting,
		state.chatV2.activeChatSearchType,
		state.chatV2.activeSearchOption,
		state.store.data.searchOptions || [],
		state.auth.user.data,
	]);


	const [auraCameraSpinLoader, setAuraCameraSpinLoader] = useState(false);

	const activeChatSearchType = __activeChatSearchType || _activeChatSearchType;

	const aura_header_theme = config.aura_header_theme;

	const mic_icon = aura_header_theme === "dark" ? header_mic_dark : header_mic;

	// const [showInput, setShowInput] = useState(true);

	const handleChangeChatMessage = (message) => {
		dispatch(setChatMessage(message, chatTypeKey));
	};

	const handleSpeakerClick = () => {
		dispatch(setChatMute(!isMute));
	};


	const getSuffix = () => {
		if (streaming) {
			return <SpeakingLoaderV2 className='mr-2' />;
		} else if (showChatLoader) {
			return <SearchLoaderV2 className='mr-2' />;
		} else {
			return handleMicrophoneClick ? (
				<img
					id={`chat_microphone_icon_${chatTypeKey}`}
					onClick={() => {
						// setShowInput(true);
						handleMicrophoneClick();
					}}
					className='cursor-pointer h-8.5 lg:h-11 min-w-7.5 lg:min-w-11 max-w-7.5 lg:max-w-11'
					src={mic_icon}
				/>
			) : null;
		}
	};

	// useEffect(() => {
	// 	if (serverChatMessage && !showChatLoader) {
	// 		setShowInput(true);
	// 	} else {
	// 		setShowInput(true);
	// 	}
	// }, [
	// 	serverChatMessage,
	// 	// showChatLoader, // not opening the input when loader starts // it was opening even on click of suggestion chip
	// 	showChatModal,
	// ]);

	useEffect(() => {
		if (
			!activeChatSearchType ||
			!availableChatSearchTypes.includes(activeChatSearchType)
		) {
			dispatch(
				setChatSearchType(
					defaultActiveChatSearchType || availableChatSearchTypes[0]
				)
			);
		}
	}, []);

	// useEffect(() => {
	// 	if (showChatModal || chatImageUrl) {
	// 		// setShowInput(true);
	// 		inputRef?.current?.focus();
	// 	}
	// }, [showChatModal, chatImageUrl]);

	// useEffect(() => {
	// 	if (inputRef.current) {
	// 		if (showInput) {
	// 			inputRef.current.focus();
	// 		} else {
	// 			inputRef.current.blur();
	// 		}
	// 	}
	// }, [showInput, inputRef]);

	const activeSearchOption = useMemo(
		() =>
			!isEmpty(selectedSearchOption)
				? selectedSearchOption
				: searchOptions.find((option) => option.default) || {},
		[searchOptions, selectedSearchOption]
	);

	// const checkAndSetActiveSearchOption = useCallback(() => {
	// 	const defaultOption = searchOptions.find((option) => option.default);

	// 	if (isEmpty(selectedSearchOption)) {
	// 		dispatch(setActiveSearchOption(defaultOption));
	// 	}
	// }, [searchOptions, selectedSearchOption]);

	// const handleSubmitChatInput = () => {
	// 	const metadata = { ...chatInputMetadata };

	// 	const userMetadata = {
	// 		brand: authUser?.filters?.strict?.brand || [],
	// 	};

	// 	if (chatMessage || chatImageUrl) {
	// 		submitChatInput(
	// 			chatMessage,
	// 			chatImageUrl && (isFollowUpQuery || chatImageUrl)
	// 				? chatImageUrl
	// 				: undefined,
	// 			metadata,
	// 			userMetadata
	// 		);
	// 		// dispatch(setChatImageUrl("", chatTypeKey));
	// 		checkAndSetActiveSearchOption();
	// 		dispatch(setAuraHelperMessage(activeSearchOption?.search_message));
	// 		chatImageUrl && dispatch(setChatImageUrl("")); // for removed image selected UI
	// 		showSubmitImageTooltip && setShowSubmitImageTooltip(false); // close tooltip
	// 	}
	// };

	// const showActiveChatSearchType = useMemo(
	// 	() => !!availableChatSearchTypes.length,
	// 	// () => availableChatSearchTypes.length > 1,
	// 	[availableChatSearchTypes]
	// );

	const smartSearchData = useMemo(
		() =>
			searchOptions.find((v) => v.id === CHAT_SEARCH_OPTION_ID.smart_search),
		[searchOptions]
	);

	const productSearchData = useMemo(
		() =>
			searchOptions.find((v) => v.id === CHAT_SEARCH_OPTION_ID.product_search),
		[searchOptions]
	);

	const TypeAuraUIRender = () => (
		<Tooltip title='Ask for an idea' placement='bottomLeft'>
			<div
				className={`${styles.aura_button} ${
					activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.smart_search ? styles.aura_button_active
						: styles.aura_button_inactive
					}`}
				role='button'
				onClick={() => {
					handleChangeChatMessage("");
					// dispatch(setChatSearchType(typeKey));
					dispatch(setActiveSearchOption(smartSearchData));
				}}>
				<img
					id={`header_chat_aura_${chatTypeKey}`}
					src={star_ai_icon_logo}
					className={styles.aura_icon}
				// wrapperClassName='pl-0.5'
				// onClick={() => {
				// 	setShowInput(true);
				// 	dispatch(setChatUserAction(AURA_CLICK));
				// }}
				/>
			</div>
		</Tooltip>
	);

	const TypeSearchUIRender = () => (
		<Tooltip title='Ask for a product' placement='bottomLeft'>
			<div
				className={`${styles.search_button} ${
					activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.product_search
						? styles.search_button_active
						: styles.search_button_inactive
					}`}
				role='button'
				onClick={() => {
					// dispatch(setChatSearchType(typeKey));
					dispatch(setActiveSearchOption(productSearchData));
				}}>
				<Image src={headerSearchIcon} alt="Search" className={`${styles.search_icon} ${
					activeSearchOption?.id === CHAT_SEARCH_OPTION_ID.product_search
						? styles.search_icon_active
						: styles.search_icon_inactive
					}`} />
			</div>
		</Tooltip>
	);

	const uploadProps = {
		accept: "image/*",
		multiple: false,
		customRequest: async (info) => {
			try {
				// dispatch(setShowChatLoader(true, chatTypeKey)); // start loader on aura search
				// checkAndSetActiveSearchOption();
				// dispatch(setAuraHelperMessage(activeSearchOption?.search_message));
				setAuraCameraSpinLoader(true);
				// activeSearchOption?.query &&
				// 	dispatch(setChatMessage(activeSearchOption?.query, chatTypeKey));
				if (info?.file) {
					const response = await profileAPIs.uploadImage({
						file: info.file,
						// custom_size: COLLECTION_COVER_IMG_SIZES, // no need to crop image when we generate content from this
					});

					if (response?.data?.data[0]) {
						// const metadata = { ...chatInputMetadata };
						dispatch(setChatImageUrl(response?.data?.data[0].url, chatTypeKey));
						setAuraCameraSpinLoader(false);
						setShowSubmitImageTooltip(true);
						!chatMessage && // if user entered value present than no need to auto apply search query
							dispatch(setChatMessage(activeSearchOption?.image_search_input));
						// submitImageUrl(response?.data?.data[0].url, metadata);
					}
				}
			} catch (error) {
				dispatch(setShowChatLoader(false, chatTypeKey)); // stop loader on aura search is any error
			}
		},
	};

	// microphone, speaking loader icons
	const micIcon = isStagingEnv ? (
		<div className={styles.mic_icon_container}>
			{streaming ? (
				<SpeakingLoaderV2 />
			) : handleMicrophoneClick ? (
				<AudioOutlined
					id={`chat_microphone_icon_${chatTypeKey}`}
					onClick={() => {
						// setShowInput(true);
						handleMicrophoneClick();
					}}
					className={`${styles.mic_icon} ${styles.dark_text_white}`}
				/>
			) : null}
		</div>
	) : null;

	// camera icon with/without selected image UI
	const cameraIcon =
		activeSearchOption.allow_image_search &&
			showChatModal &&
			!isFollowUpQuery ? (
			<div
				className={`${styles.relative} ${styles.flex} ${styles.justify_center} ${styles.items_center} ${styles.rounded_full} ${
					chatImageUrl ? styles.camera_container_with_image : ""
					} ${
					(chatImageUrl || auraCameraSpinLoader) ? "w-9 h-9" : ""
					}`}>
				<Upload
					{...uploadProps}
					showUploadList={false}
					className={`${styles.cursor_pointer} ${styles.flex}`}
					onClick={() => {
						onChatClick && onChatClick();
						dispatch(setChatSearchType(CHAT_SEARCH_TYPES.CAMERA));
					}}>
					<CameraOutlined
						className={`${styles.camera_icon} ${
							chatImageUrl
								? styles.camera_icon_active
								: styles.camera_icon_inactive
							}`}
					/>
				</Upload>
				{/* showing loader when image is uploading */}
				{auraCameraSpinLoader ? (
					<div className={styles.absolute}>
						<AuraCameraSpinLoader />
					</div>
				) : null}
			</div>
		) : null;

	// submit arrow, search icons
	const searchIcon =
		chatImageUrl || chatMessage ? (
			<div className={`${styles.flex} ${styles.justify_center} ${styles.items_center} ${styles.w_4} ${styles.h_4}`}>
				<ArrowRightOutlined
					className={`${styles.arrow_icon} ${styles.dark_text_black_200}`}
					onClick={!auraCameraSpinLoader ? handleSubmitChatInput : undefined}
				/>
			</div>
		) : !isBTNormalUserLoggedIn ? (
			<div className={`${styles.flex} ${styles.justify_center} ${styles.items_center} ${styles.w_4} ${styles.h_4}`}>
				<Image src={headerSearchIcon} alt="Search" className={`${styles.search_icon_sm} ${styles.dark_text_white} ${styles.cursor_pointer}`} preview={false} onClick={() => inputRef.current.focus()} />
			</div>
		) : null;

	// Array of JSX elements representing icons for input box actions, filtering null items of array
	const inputControls = useMemo(() => {
		return [micIcon, cameraIcon, searchIcon].filter((icon) => icon !== null).map((icon, index) => (
			<div key={`input-control-${index}`}>{icon}</div>
		));
	}, [micIcon, cameraIcon, searchIcon]);

	return (
		<>
			<div
				id={`header_chat_container_${chatTypeKey}`}
				className={`${styles.header_chat_container} ${styles.gap_2} ${styles.w_full}`}>
				<div
					id={`chat_search_input_container_${chatTypeKey}`}
					className={`${styles.chat_search_input_container} ${
						aura_header_theme === "dark" ? styles.chat_search_input_container_dark : ""
						} ${
						!isBTInstance ? styles.chat_search_input_container_with_border : ""
						}`}
					onClick={() => {
						showAuraIntro && dispatch(setShowAuraIntro(false));
						onChatClick && onChatClick();
					}}>
					{/* {!isBTNormalUserLoggedIn ? (
						<div
							className={`h-full flex rounded-full gap-1 justify-center items-center ${
								activeSearchOption.allow_image_search &&
								showChatModal &&
								!isFollowUpQuery
									? "p-1.25"
									: "p-3"
							}`}>
							{activeSearchOption.allow_image_search &&
							showChatModal &&
							!isFollowUpQuery ? (
								<Upload
									{...uploadProps}
									showUploadList={false}
									className='cursor-pointer flex'
									onClick={() => {
										onChatClick && onChatClick();
										dispatch(setChatSearchType(CHAT_SEARCH_TYPES.CAMERA));
									}}>
									<CameraOutlined
										className={`h-8 lg:h-11 w-8 lg:w-auto min-w-7.5 lg:min-w-11 max-w-11 text-base lg:text-xl flex justify-center items-center rounded-full ${
											!auraCameraSpinLoader && isImageSelected
												? "bg-indigo-600 text-white dark:bg-lightgray-101 dark:text-black-200"
												: "text-black-200 dark:text-white"
										}`}
									/>
								</Upload>
							) : null}
						</div>
					) : null} */}

					{/* showing loader when image is uploading */}
					{/* {auraCameraSpinLoader ? (
						<div className='absolute lg:left-1.25' style={{ left: "6px" }}>
							<AuraCameraSpinLoader />
						</div>
					) : null} */}

					{isBTNormalUserLoggedIn ? (
						<div className={`${styles.button_container}`}>
							<div className={`${styles.button_group} ${
								aura_header_theme === "dark" ? styles.button_group_dark : ""
								}`}>
								<TypeAuraUIRender />
								<TypeSearchUIRender />
								{/* {availableChatSearchTypes.includes(CHAT_SEARCH_TYPES.AURA) ? (
									<TypeAuraUIRender />
								) : null}
								{availableChatSearchTypes.includes(CHAT_SEARCH_TYPES.SEARCH) ? (
									<>
										{typeSearchUIKey === CHAT_SEARCH_TYPES.AURA ? (
											<TypeAuraUIRender typeKey={CHAT_SEARCH_TYPES.SEARCH} />
										) : (
											<TypeSearchUIRender />
										)}
									</>
								) : null} */}
							</div>
						</div>
					) : null}

					<div
						className={styles.input_wrapper}
					>
						<Form
							id={`chat_search_input_content_${chatTypeKey}`}
							onFinish={
								!auraCameraSpinLoader ? handleSubmitChatInput : undefined
							}
							className={`${styles.input_form} ${
								!isBTNormalUserLoggedIn ? styles.input_form_with_buttons : ""
								}`}
						>
							<Input
								id={`chat_search_input_${chatTypeKey}`}
								type='text'
								ref={inputRef}
								placeholder={
									isBTNormalUserLoggedIn
										? activeSearchOption.description
										: (typeof activeSearchOption?.text_placeholder === "string"
											? activeSearchOption?.text_placeholder
											: activeSearchOption?.text_placeholder?.[0]) ||
										"Type or speak to AURA"
								}
								name='chat_message'
								value={localChatMessage}
								onChange={handleInputChange}
								className={`${styles.chat_input} ${
									aura_header_theme === "dark"
										? styles.chat_input_dark
										: ""
										}`}
								allowClear
							/>
						</Form>
						{/* <div
							id='chat_text_container'
							className={`server-text w-full overflow-hidden transition-opacity py-0.75 ${
								showInput
									? "opacity-0 hide_chat_text_container"
									: "opacity-100 show_chat_text_container"
							} absolute top-0 ${
								chatMessage ? "" : "flex items-center self-center h-full"
							}`}
							onClick={() => setShowInput(true)}>
							<h1
								id='chat_input_text'
								className={`m-0 text-lightgray-104 text-xs lg:text-sm truncate transition-transform transform ${
									showInput ? "translate-y-1/2" : "translate-y-0"
								}`}>
								{chatMessage}
							</h1>
							<h1
								id='chat_server_text'
								className={`m-0 text-black-102 dark:text-white text-sm lg:text-lg truncate transition-transform transform ${
									showInput ? "-translate-y-1/2" : "translate-y-0"
								}`}
								title={serverChatMessage}>
								{serverChatMessage}
							</h1>
						</div> */}
					</div>
					{/* <div
						id={`chat_mobile_search_icon_${chatTypeKey}`}
						className='flex items-center'
						onClick={!auraCameraSpinLoader ? handleSubmitChatInput : undefined}>
						<ArrowRightOutlined
							className={`flex text-purple-102 dark:text-white text-lg md:text-xl-1 md:pl-1 cursor-pointer`}
						/>
					</div>
					<div className='flex items-center h-10 lg:h-13.5 p-1.25'>
						{getSuffix()}
					</div> */}

					{inputControls?.length ? (
						<div className={`${styles.input_controls_container}`}>
							<div className={`${styles.controls_divider} ${aura_header_theme === "dark" ? styles.controls_divider_dark : ""}`}></div>
							{inputControls}
						</div>
					) : null}

					{showSubmitImageTooltip ? (
						<div
							className={`${styles.submit_image_tooltip} ${styles.opacity_80}`}
							onClick={(e) => e.stopPropagation()}>
							<div className={`${styles.rounded_full} ${styles.float_right}`}>
								<Image
									className={styles.cursor_pointer}
									src={close_bg_icon}
									preview={false}
									onClick={(e) => {
										e.stopPropagation();
										setShowSubmitImageTooltip(false);
									}}
								/>
							</div>
							<p className={`${styles.text_sm} ${styles.leading_5} ${styles.text_white}`}>
								Please enter relevant text related to the selected image and
								click here or press enter to initiate the search.
							</p>
						</div>
					) : null}

					{showAuraIntro && !showChatModal && (
						<div
							className={`${styles.aura_tooltip} ${styles.opacity_80}`}
							onClick={(e) => e.stopPropagation()}>
							<div className={`${styles.rounded_full} ${styles.float_right}`}>
								<Image
									className={styles.cursor_pointer}
									src={close_bg_icon}
									preview={false}
									onClick={(e) => {
										e.stopPropagation();
										dispatch(setShowAuraIntro(false));
									}}
								/>
							</div>
							{/* <h1 className='text-xl-2 font-bold text-white m-0'>Meet Aura</h1>
							<h2 className='text-xl font-medium text-white'>
								Your voice shopping assistant
							</h2> */}
						</div>
					)}
					{/* will need to change placement */}
					{showException && exception?.message && (
						<div
							className={`${styles.aura_tooltip} ${styles.opacity_80}`}
							onClick={(e) => e.stopPropagation()}>
							<div className={`${styles.rounded_full} ${styles.float_right}`}>
								<Image
									className={styles.cursor_pointer}
									src={close_bg_icon}
									preview={false}
									onClick={(e) => {
										e.stopPropagation();
										dispatch(setShowSocketException(false));
									}}
								/>
							</div>
							<h2 className={`${styles.text_base} ${styles.text_white} ${styles.m_0}`}>
								{exception?.message}
							</h2>
						</div>
					)}
				</div>
				{showSpeaker ? (
					<div
						id={`chat_volume_control_container_${chatTypeKey}`}
						onClick={handleSpeakerClick}
						className={`${styles.cursor_pointer} ${styles.volume_control_container}`}>
						{isMute ? (
							<Image 
							src={iconVolumeMute} 
							alt="Volume Mute" 
							id={`chat_mute_icon_${chatTypeKey}`}
							className={`${styles.volume_icon} ${showChatModal ? styles.volume_icon_dark_modal : styles.volume_icon_dark_no_modal}`}
							width={16}
							height={14}
						/>
						) : (
							<Image
							src={iconVolume}
							alt="Volume"
							id={`chat_volume_icon_${chatTypeKey}`}
							className={`${styles.volume_icon} ${showChatModal ? styles.volume_icon_dark_modal : styles.volume_icon_dark_no_modal}`}
							width={16}
							height={14}
						/>
						)}
					</div>
				) : null}
			</div>
			{/* for testing */}
			{/* <div className='flex justify-end text-xs pr-4 h-2'>
				<span>
					{streaming && "[listening]"}
					{showChatLoader && "[loading]"}
				</span>
			</div> */}
		</>
	);
};

export default Chat;
