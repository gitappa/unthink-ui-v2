import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import {
	getParams,
	startAuraSearchTimer,
	stopAuraSearchTimer,
} from "../../helper/utils";
import { SocketContext } from "../../context/socketV2";
import { CHAT_TYPE_CHAT, PARAM_SEARCH_TEXT } from "../../constants/codes";
import { setShowChatLoader, setSocketException } from "./redux/actions";
import { isDebugCookie } from "../../helper/getTrackerInfo";

// for testing purpose only
const chatMessages = [
	"show me some red shoes",
	"show me watches",
	"show me red dresses",
	"shirts",
	"show new products",
	"show bracelets",
	"running shoes",
	"red hoodies",
];

export const useChat = (chatTypeKey = CHAT_TYPE_CHAT) => {
	const { socket, sendSocketClientMessage, sendSocketClientShopALook } =
		useContext(SocketContext);
	const auraSearchText = getParams(PARAM_SEARCH_TEXT);
	const dispatch = useDispatch();

	const socketException = (data) => {
		if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
			return;
		}
		if (Number(sessionStorage.getItem("socketCount")) >= 3) {
			stopAuraSearchTimer();
			dispatch(setSocketException(data));
			dispatch(setShowChatLoader(false, chatTypeKey));
			socket.disconnect();
			sessionStorage.removeItem("socketCount");
		}
	};

	const sendMessage = (message, image_url, metadata, userMetadata, imageGenerate) => {
		dispatch(setShowChatLoader(true, chatTypeKey)); // need to add timer for fallback

		if (isDebugCookie()) {
			console.time("##responseTime"); // added for testing purpose only . should be remove later
		}

		const socketPayload = {
			message,
			image_url,
			metadata,
			userMetadata,
			imageGenerate,
		};

		sendSocketClientMessage(socketPayload);

		const handleDelayFallback = () => {
			// removing chat loading on delay fallback
			dispatch(setShowChatLoader(false, chatTypeKey));
		};
		// start aura search timer for delay fallback
		startAuraSearchTimer(handleDelayFallback);
		socketException({
			message: "Aura is facing some trouble. You can search after some time",
		});
	};

	const sendShopALookImageUrl = (image_url, metadata) => {
		dispatch(setShowChatLoader(true, chatTypeKey)); // need to add timer for fallback

		if (isDebugCookie()) {
			console.time("##responseTime"); // added for testing purpose only . should be remove later
		}

		sendSocketClientShopALook({ image_url, metadata });

		const handleDelayFallback = () => {
			// removing chat loading on delay fallback
			dispatch(setShowChatLoader(false, chatTypeKey));
		};
		// start aura search timer for delay fallback
		startAuraSearchTimer(handleDelayFallback);
		socketException({
			message: "Aura is facing some trouble. You can try after some time",
		});
	};

	const sendAddProductsFromAmazonMessage = (metadata) => {
		sendSocketClientMessage({
			message: undefined,
			image_url: undefined,
			metadata,
		});
	};

	// for testing purpose only. sending multiple chat messages at a time
	// const sendAllMessages = () => {
	// 	chatMessages.forEach((message) => {
	// 		sendMessage(message);
	// 	});
	// };

	return {
		sendMessage,
		sendShopALookImageUrl,
		sendAddProductsFromAmazonMessage,
		auraSearchText,
	};
};
