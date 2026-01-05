import {
	ADD_CHAT_MESSAGE_FROM_CLIENT,
	ADD_CHAT_MESSAGE_FROM_SERVER,
	SET_CHAT_MINIMIZE_STATUS,
	SET_CHAT_SUGGESTIONS,
	SET_CHAT_PRODUCTS,
	SET_CHAT_PRODUCT_TITLE,
	SET_SOCKET_ID,
	SET_CHAT_MESSAGE,
	SET_SHOW_LOADER,
	SET_CHAT_MUTE,
	SET_CHAT_PRODUCT_URL,
	SET_CHAT_PRODUCT_PAGE,
	SET_AURA_SUGGESTIONS,
	GET_CHAT_PRODUCTS_ASYNC,
	UPDATE_CHAT_PRODUCTS,
	UPDATE_CHAT_PRODUCTS_LOADING,
	SET_CHAT_PRODUCT_PAGE_NO,
	SET_CHAT_IPP,
	UPDATE_CHAT_GENERAL_TEXT,
	UPDATE_CHAT_GENERAL_SUGGESTIONS,
} from "./constants";
export const setClientChatMessage = (payload) => ({
	type: ADD_CHAT_MESSAGE_FROM_CLIENT,
	payload,
});
export const setShowLoader = (payload) => ({
	type: SET_SHOW_LOADER,
	payload,
});
export const setServerChatMessage = (payload) => ({
	type: ADD_CHAT_MESSAGE_FROM_SERVER,
	payload,
});
export const setMiniMizedStatus = (payload) => ({
	type: SET_CHAT_MINIMIZE_STATUS,
	payload,
});
export const setChatSuggestions = (payload) => ({
	type: SET_CHAT_SUGGESTIONS,
	payload,
});
export const setChatProducts = (payload) => ({
	type: SET_CHAT_PRODUCTS,
	payload,
});
export const setChatProductTitle = (payload) => ({
	type: SET_CHAT_PRODUCT_TITLE,
	payload,
});
export const setMessage = (payload) => ({
	type: SET_CHAT_MESSAGE,
	payload,
});
export const setSocketId = (payload) => ({ type: SET_SOCKET_ID, payload });
export const setChatMute = (payload) => ({ type: SET_CHAT_MUTE, payload });
export const setAuraSuggestion = (payload) => ({
	type: SET_AURA_SUGGESTIONS,
	payload,
});
export const setChatProductUrl = (payload) => ({
	type: SET_CHAT_PRODUCT_URL,
	payload,
});
export const setChatProductPage = (payload) => ({
	type: SET_CHAT_PRODUCT_PAGE,
	payload,
});
export const getChatProductsAsync = (payload) => ({
	type: GET_CHAT_PRODUCTS_ASYNC,
	payload,
});
export const updateChatProducts = (payload) => ({
	type: UPDATE_CHAT_PRODUCTS,
	payload,
});
export const updateChatProductsLoading = (payload) => ({
	type: UPDATE_CHAT_PRODUCTS_LOADING,
	payload,
});
export const setChatProductPageNo = (payload) => ({
	type: SET_CHAT_PRODUCT_PAGE_NO,
	payload,
});
export const setChatIpp = (payload) => ({
	type: SET_CHAT_IPP,
	payload,
});
export const updateChatGeneralText = (payload) => ({
	type: UPDATE_CHAT_GENERAL_TEXT,
	payload,
});
export const updateChatGeneralSuggestions = (payload) => ({
	type: UPDATE_CHAT_GENERAL_SUGGESTIONS,
	payload,
});
