import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Tooltip } from "antd";

import {
	AURA_CLICK,
	CHAT_SEARCH_OPTION_ID,
	CHAT_SEARCH_TYPES,
	CHAT_TYPE_CHAT,
	PARAM_SEARCH_TEXT,
	STORE_USER_NAME_BUDGETTRAVEL,
	STORE_USER_NAME_DOTHELOOK,
	STORE_USER_NAME_SWIFTLYSTYLED,
} from "../../constants/codes";
import { AdminCheck, getParams, isEmpty, searchTextOnStoreV2 } from "../../helper/utils";
import {
	setChatMessage,
	setChatUserAction,
	setServerChatMessage,
	setChatProductsData,
	setShowChatModal,
	setChatSearchType,
} from "../../hooks/chat/redux/actions";
import header_aura from "../../images/chat/header_aura_image_transparent.png";
import star_ai_icon from "../../images/unthink_star_ai_icon.svg";
import { useChat } from "../../hooks/chat/useChat";
import { useChatMicrophone } from "../../hooks/chat/useChatMicrophone";
import Chat from "./Chat";
import ChatModal from "./ChatModal";
import AuraChatSettingModal from "../auraChatSettingModal";
import { AuraChatSettingModalModes } from "../auraChatSettingModal/AuraChatSettingModal";
import {
	adminUserId,
	current_store_name,
	is_store_instance,
	super_admin,
} from "../../constants/config";

const defaultHiMessage = "Hi";

const ChatContainer = ({
	disabledOutSideClick,
	config,
	trackCollectionData,
	isBTInstance,
	isAuraChatPage = false,
}) => {
	const [
		user,
		userDataSent,
		showChatModal,
		chatMessage,
		userAction,
		auraChatSetting,
		// activeChatSearchType,
		widgetHeaderRequest,
		selectedSearchOption,
		searchOptions,
		admin_list,
		storeData
	] = useSelector((state) => [
		state.auth.user,
		state.chatV2.userDataSent,
		state.chatV2.showChatModal,
		state.chatV2.chatMessage,
		state.chatV2.userAction,
		state.chatV2.auraChatSetting,
		// state.chatV2.activeChatSearchType,
		state.chatV2.widgetHeaderRequest,
		state.chatV2.activeSearchOption || {},
		state.store.data.searchOptions || [],
		state.store.data.admin_list,
		state.store.data,
	]);
	const dispatch = useDispatch();
	const inputRef = useRef(null);

	const auraSearchText = getParams(PARAM_SEARCH_TEXT);

	const [settingModalOpen, setSettingModalOpen] = useState(false);
	const [isFollowUpQuery, setIsFollowUpQuery] = useState(false);
	const [showSubmitImageTooltip, setShowSubmitImageTooltip] = useState(false);

	const closeChatModal = () => {
		dispatch(setShowChatModal(false));
	};

	const openChatModal = () => {
		dispatch(setShowChatModal(true));
	};

	const openSettingModal = (e) => {
		e.stopPropagation();
		e.preventDefault();
		setSettingModalOpen(true);
		// closeChatModal();
	};

	const closeSettingModal = () => {
		setSettingModalOpen(false);
		// openChatModal();
	};

	const { sendMessage, sendShopALookImageUrl } = useChat();

	const setMessage = (message) => {
		dispatch(setChatMessage(message));
	};

	const isAdminLoggedIn = AdminCheck(user?.data, current_store_name, adminUserId, admin_list);

	const isStoreAdminLoggedIn = useMemo(
		() =>
			is_store_instance &&
			user.data?.user_name &&
			user.data?.user_name === super_admin,
		[user.data?.user_name]
	);

	const showSettings = useMemo(
		() => (is_store_instance && isStoreAdminLoggedIn) || isAdminLoggedIn,
		[(isStoreAdminLoggedIn, isAdminLoggedIn)]
	);

	// flag for show old chat modal UI only for normal user of BT
	// const isBTNormalUserLoggedIn = useMemo(
	// 	() => isBTInstance && user.data.user_id !== adminUserId,
	// 	[isBTInstance, user.data.user_id]
	// );
	// for bt any users
	const isBTNormalUserLoggedIn = useMemo(
		() => isBTInstance === STORE_USER_NAME_BUDGETTRAVEL,
		[isBTInstance]
	);

	const activeSearchOption = useMemo(
		() =>
			!isEmpty(selectedSearchOption)
				? selectedSearchOption
				: searchOptions.find((option) => option.default) || {},
		[searchOptions, selectedSearchOption]
	);

	const isSendSTLTemplates = useMemo(
		() =>
			showSettings &&
			activeSearchOption.id === CHAT_SEARCH_OPTION_ID.shop_a_look,
		[showSettings, activeSearchOption.id]
	);

	const isSendCTLTemplates = useMemo(
		() =>
			showSettings &&
			activeSearchOption.id === CHAT_SEARCH_OPTION_ID.complete_the_look,
		[showSettings, activeSearchOption.id]
	);

	const isSendSSTemplates = useMemo(
		() =>
			showSettings &&
			activeSearchOption.id === CHAT_SEARCH_OPTION_ID.smart_search,
		[showSettings, activeSearchOption.id]
	);

	// const isShowImageTemplate = useMemo(
	// 	() =>
	// 		activeSearchOption.id === CHAT_SEARCH_OPTION_ID.complete_the_look ||
	// 		activeSearchOption.id === CHAT_SEARCH_OPTION_ID.shop_a_look,
	// 	[activeSearchOption.id]
	// );

	// if ref=aura is present in query param. opening aura chat modal on page load
	// implemented for samskara store : on AI icon click from samskarahome.com header opening chat modal
	useEffect(() => {
		const refParam = getParams("ref");
		if (refParam === "aura") {
			dispatch(setShowChatModal(true));
		}
	}, []);

	useEffect(() => {
		if (
			widgetHeaderRequest?.metadata?.searchOptionId !== activeSearchOption?.id
		) {
			setIsFollowUpQuery(false);
		}
	}, [widgetHeaderRequest?.metadata?.searchOptionId, activeSearchOption?.id]);

	const { handleMicrophoneClick, streaming, onStopRecording } =
		useChatMicrophone({
			setResultText: setMessage,
		});

	const submitChatInput = (
		message = chatMessage,
		chatImageUrl,
		metadata,
		userMetadata,
		imageGenerate,
		nextPage,
		ipp,
		currentPage,
		moreSearch_next_page,
		recommendationSearch_next_page
	) => {
		// if (showChatModal && message) {
		// dispatch(setShowChatModal(false));
		// }


		if (message || chatImageUrl) {
			if (message === auraSearchText) {
				sendFinalMessage(message, metadata);
			} else {
				// searchTextOnStoreV2(message, metadata);
				setMessage(message);
				sendMessage(
					chatMessage !== selectedSearchOption.image_search_input
						? message
						: undefined,
					chatImageUrl && isFollowUpQuery ? '': chatImageUrl,
					metadata,
					userMetadata,
					imageGenerate,
					nextPage,
					ipp,
					currentPage,
					moreSearch_next_page,
					recommendationSearch_next_page
				);
			}
		}
	};

	// const submitImageUrl = (image_url, metadata) => {
	// 	if (image_url) {
	// 		sendMessage(undefined, image_url, metadata);
	// 	}
	// };

	// try to send message every time
	const sendFinalMessage = (message = chatMessage, metadata) => {
		if (streaming) {
			onStopRecording();
		} else {
			setMessage(message);
			sendMessage(message, metadata);
		}
		// dispatch(setChatProductsData([]));
	};

	useEffect(() => {
		if (user?.data?.user_id && userDataSent) {
			if (auraSearchText) {
				// if (auraSearchText !== chatMessage) {
				// 	dispatch(setChatMessage(auraSearchText));
				// }
				// sendFinalMessage(auraSearchText);
			} else {
				sendFinalMessage(defaultHiMessage);
				// Reset chat and server message and response data back to my-profile page after searching
				dispatch(setChatMessage(chatMessage));
				dispatch(setServerChatMessage(""));
				dispatch(setChatProductsData([]));
			}
		}
	}, [auraSearchText, user?.data?.user_id, userDataSent]);

	// const brandList = useMemo(
	// 	() => user.data?.filters?.strict?.brand || [],
	// 	[user.data?.filters]
	// );

	const chatInputMetadata = useMemo(
		() => ({
			searchOptionId: activeSearchOption?.id,
			follow_qn: isFollowUpQuery || undefined,

			// aura_stl_desc:
			// 	isSendSTLTemplates && !isEmpty(auraChatSetting.aura_stl_desc)
			// 		? auraChatSetting.aura_stl_desc
			// 		: undefined,

			// aura_stl_tags:
			// 	isSendSTLTemplates && !isEmpty(auraChatSetting.aura_stl_tags)
			// 		? auraChatSetting.aura_stl_tags
			// 		: undefined,

			// image_stl_aura:
			// 	isSendSTLTemplates && !isEmpty(auraChatSetting.image_stl_aura)
			// 		? auraChatSetting.image_stl_aura
			// 		: undefined,

			// aura_ctl_desc:
			// 	isSendCTLTemplates && !isEmpty(auraChatSetting.aura_ctl_desc)
			// 		? auraChatSetting.aura_ctl_desc
			// 		: undefined,

			// aura_ctl_tags:
			// 	isSendCTLTemplates && !isEmpty(auraChatSetting.aura_ctl_tags)
			// 		? auraChatSetting.aura_ctl_tags
			// 		: undefined,

			// image_ctl_aura:
			// 	isSendCTLTemplates && !isEmpty(auraChatSetting.image_ctl_aura)
			// 		? auraChatSetting.image_ctl_aura
			// 		: undefined,

			// aura_ss_desc:
			// 	isSendSSTemplates && !isEmpty(auraChatSetting.aura_ss_desc)
			// 		? auraChatSetting.aura_ss_desc
			// 		: undefined,

			// aura_ss_tags:
			// 	isSendSSTemplates && !isEmpty(auraChatSetting.aura_ss_tags)
			// 		? auraChatSetting.aura_ss_tags
			// 		: undefined,

			aura_text_ss:
				isSendSSTemplates && !isEmpty(auraChatSetting.aura_text_ss)
					? auraChatSetting.aura_text_ss
					: undefined,
			aura_text_stl:
				isSendSTLTemplates && !isEmpty(auraChatSetting.aura_text_stl)
					? auraChatSetting.aura_text_stl
					: undefined,
			aura_text_ctl:
				isSendCTLTemplates && !isEmpty(auraChatSetting.aura_text_ctl)
					? auraChatSetting.aura_text_ctl
					: undefined,
			aura_image_stl:
				isSendSTLTemplates && !isEmpty(auraChatSetting.aura_image_stl)
					? auraChatSetting.aura_image_stl
					: undefined,
			aura_image_ctl:
				isSendCTLTemplates && !isEmpty(auraChatSetting.aura_image_ctl)
					? auraChatSetting.aura_image_ctl
					: undefined,
		}),
		[
			showSettings,
			activeSearchOption?.id,
			JSON.stringify(auraChatSetting),
			isSendSTLTemplates,
			isSendCTLTemplates,
			auraChatSetting,
			isFollowUpQuery,
		]
		// activeChatSearchType === CHAT_SEARCH_TYPES.SEARCH
		// 	? {
		// 			search: true,
		// 			filters: {
		// 				brand: !isEmpty(brandList) ? brandList : undefined,
		// 			},
		// 	  }
		// 	: {
		// 			getAttribute: true,
		// 			gender: auraChatSetting.gender,
		// 			age_group: auraChatSetting.age_group,
		// 			color: auraChatSetting.color,
		// 			tag_template: auraChatSetting.aura_template_tags || "",
		// 			description_template: auraChatSetting.aura_template_desc || "",
		// 			filters: {
		// 				brand: !isEmpty(brandList) ? brandList : undefined,
		// 			},
		// 	  },
		// [JSON.stringify(auraChatSetting), activeChatSearchType, user.data.user_name]
	);

	useEffect(() => {
		if (!streaming) {
			const metadata = { ...chatInputMetadata };
			submitChatInput(undefined, undefined, metadata);
		} else {
			dispatch(setChatMessage(""));
		}
	}, [streaming]);

	useEffect(() => {
		if (userAction) {
			switch (userAction) {
				case AURA_CLICK:
					dispatch(setShowChatModal(true));
					if (streaming) {
						onStopRecording();
					} else {
						handleMicrophoneClick();
					}
				default:
					break;
			}
			dispatch(setChatUserAction(""));
		}
	}, [userAction]);

	const onChatClick = () => {
		if (!showChatModal) {
			dispatch(setShowChatModal(true));
		}
	};

	const auraChatSettingMode = useMemo(() => {
		if (activeSearchOption.id === CHAT_SEARCH_OPTION_ID.shop_a_look) {
			return AuraChatSettingModalModes.SHOP_A_LOOK;
		} else if (
			activeSearchOption.id === CHAT_SEARCH_OPTION_ID.complete_the_look
		) {
			return AuraChatSettingModalModes.COMPLETE_THE_LOOK;
		} else if (activeSearchOption.id === CHAT_SEARCH_OPTION_ID.smart_search) {
			return AuraChatSettingModalModes.SMART_SEARCH;
		}
	}, [activeSearchOption.id]);

	const isSwiftlyStyledInstance =
		is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED;

	const isDoTheLookInstance =
		is_store_instance && current_store_name === STORE_USER_NAME_DOTHELOOK;

	return (
		<>
			{ storeData?.is_searchOptions_enabled ?
			<div className='hidden lg:flex justify-center items-center gap-2 lg:gap-3 xl:w-1/2 mx-1'>
				{/* {!isBTNormalUserLoggedIn ? ( */}
				<div className='flex justify-center items-center'>
					<Tooltip
						title='Meet AURA - your AI shopping assistant'
						placement='bottomLeft'>
						<span> 
							<Image
								src={star_ai_icon}
								className={`cursor-pointer  ${isSwiftlyStyledInstance || isDoTheLookInstance
									? "rounded-full p-1  border-2 border-solid bg-white border-indigo-600"
									: ""
									}`}                            // className={`rounded-full bg-orange-100 cursor-pointer`}
								onClick={() => onChatClick && onChatClick()}
								preview={false}
								width={33}
							/>
						</span>
					</Tooltip>
				</div>
				{/* ) : null} */}
				<Chat
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
				/>
			</div> :
			<div className='hidden lg:flex justify-center items-center gap-2 lg:gap-3 xl:w-1/2 mx-1'></div>
}

			<div
				className={`transform transition duration-300 ${showChatModal
					? "translate-y-0 delay-300 opacity-100 chat_modal_open"
					: "-translate-y-full opacity-0 chat_modal_close"
					} fixed top-0 left-0 right-0 z-40 h-full overflow-auto`}>
				<ChatModal
					handleMicrophoneClick={handleMicrophoneClick}
					streaming={streaming}
					submitChatInput={submitChatInput}
					// submitImageUrl={submitImageUrl}
					onChatClick={onChatClick}
					onStopRecording={onStopRecording}
					disabledOutSideClick={disabledOutSideClick}
					showSettings={showSettings}
					openSettingModal={openSettingModal}
					chatInputMetadata={chatInputMetadata}
					chatTypeKey={CHAT_TYPE_CHAT}
					config={config}
					trackCollectionData={trackCollectionData}
					isBTInstance={isBTInstance}
					inputRef={inputRef}
					isFollowUpQuery={isFollowUpQuery}
					setIsFollowUpQuery={setIsFollowUpQuery}
					widgetHeaderRequest={widgetHeaderRequest}
					showSubmitImageTooltip={showSubmitImageTooltip}
					setShowSubmitImageTooltip={setShowSubmitImageTooltip}
					isBTNormalUserLoggedIn={isBTNormalUserLoggedIn}
					isAuraChatPage={isAuraChatPage}
				/>
			</div>
			<AuraChatSettingModal
				isOpen={settingModalOpen}
				onClose={closeSettingModal}
				mode={auraChatSettingMode}
			// showImageTemplate={isShowImageTemplate}
			/>
		</>
	);
};

export default ChatContainer;

