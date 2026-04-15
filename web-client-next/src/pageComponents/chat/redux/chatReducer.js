import {
	ADD_CHAT_MESSAGE_FROM_SERVER,
	ADD_CHAT_MESSAGE_FROM_CLIENT,
	SET_CHAT_MINIMIZE_STATUS,
	SET_CHAT_SUGGESTIONS,
	SET_CHAT_PRODUCTS,
	SET_CHAT_PRODUCT_TITLE,
	SET_SOCKET_ID,
	SET_SHOW_LOADER,
	SET_CHAT_MESSAGE,
	SET_CHAT_MUTE,
	SET_AURA_SUGGESTIONS,
	SET_CHAT_PRODUCT_URL,
	SET_CHAT_PRODUCT_PAGE,
	UPDATE_CHAT_PRODUCTS,
	SET_CHAT_PRODUCT_PAGE_NO,
	UPDATE_CHAT_PRODUCTS_LOADING,
	UPDATE_CHAT_GENERAL_TEXT,
	UPDATE_CHAT_GENERAL_SUGGESTIONS,
	SET_CHAT_IPP,
} from "./constants";
const initialState = {
	socketId: "",
	messageData: [],
	isFetching: false,
	isTyping: false,
	isMinimized: false,
	suggestions: [],
	productData: [],
	productTitle: "",
	showLoader: false,
	message: "",
	mute: true,
	auraSuggestions: "",
	productUrl: "",
	currentPage: 1,
	productLoading: false,
	ipp: 16,
	pageNo: 1,
	generalText: "", // REMOVE
	generalSuggestions: [],
};

const chatReducer = (state = initialState, action) => {
	const newState = { ...state };
	const payload = action.payload ?? {};
	switch (action.type) {
		case UPDATE_CHAT_PRODUCTS_LOADING:
			newState.productLoading = payload;
			return newState;
		case SET_CHAT_PRODUCT_PAGE_NO:
			newState.pageNo = payload;
			return newState;
		case UPDATE_CHAT_PRODUCTS:
			newState.productData = [...newState.productData, ...payload.data];
			return newState;
		case SET_CHAT_PRODUCT_URL:
			newState.productUrl = payload;
			newState.currentPage = 1;
			newState.pageNo = 1;
			return newState;
		case SET_CHAT_PRODUCT_PAGE:
			newState.currentPage = payload;
			return newState;
		case SET_AURA_SUGGESTIONS:
			newState.auraSuggestions = action.payload ?? "";
			return newState;
		case SET_CHAT_MUTE:
			newState.mute = action.payload ?? false;
			return newState;
		case SET_CHAT_MESSAGE:
			newState.message = action.payload;
			return newState;
		case UPDATE_CHAT_GENERAL_SUGGESTIONS:
			newState.generalSuggestions = action.payload;
			return newState;
		case UPDATE_CHAT_GENERAL_TEXT:
			newState.generalText = action.payload;
			return newState;
		case SET_SHOW_LOADER:
			newState.showLoader = action?.payload ?? false;
			return newState;
		case SET_SOCKET_ID:
			newState.socketId = payload;
			return newState;
		case SET_CHAT_PRODUCT_TITLE:
			newState.productTitle = payload ?? "";
			return newState;
		case SET_CHAT_IPP:
			newState.ipp = action.payload ?? newState.ipp;
			return newState;
		case ADD_CHAT_MESSAGE_FROM_CLIENT:
		case ADD_CHAT_MESSAGE_FROM_SERVER: {
			if (typeof payload.message === "string") {
				if (payload.messageId) {
					const isAvailableMessageId =
						newState.messageData.filter(
							(d) => d.messageId === payload.messageId
						).length > 0;
					if (isAvailableMessageId) {
						const messageData = newState.messageData.map((data) => {
							if (data.messageId === payload.messageId) {
								return {
									...data,
									message: payload.message,
								};
							}
							return data;
						});
						newState.messageData = messageData;
						return newState;
					}
				}
				const dataSet = [...newState.messageData];
				const message = {
					from:
						action.type === ADD_CHAT_MESSAGE_FROM_CLIENT ? "client" : "server",
					message: payload.message,
				};
				if (payload.messageId) {
					message.messageId = payload.messageId;
				}
				dataSet.push(message);
				newState.messageData = dataSet;
			}
			return newState;
		}
		case SET_CHAT_SUGGESTIONS:
			newState.suggestions = payload ?? [];
			return newState;
		case SET_CHAT_PRODUCTS:
			newState.productData = payload ?? [];
			return newState;
		case SET_CHAT_MINIMIZE_STATUS:
			newState.isMinimized = payload.status ?? false;
			return newState;
		default: {
			return state;
		}
	}
};
export default chatReducer;
