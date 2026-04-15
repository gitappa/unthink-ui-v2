import {
	SET_USER_INFO,
	GET_USER_INFO_ASYNC,
	SET_USER_INFO_FETCHING,
	SET_HELP_ME_SHOP_MODAL_OPEN,
	SET_HELP_ME_SHOP_MODAL_SHARED_LINK,
	FETCH_SHARED_PAGE_RECOMMENDATIONS,
	FETCH_SHARED_PAGE_RECOMMENDATIONS_SUCCESS,
	FETCH_SHARED_PAGE_RECOMMENDATIONS_FAILURE,
	HANDLE_SHARED_PAGE_REC_PRODUCT_CLICK,
	CLEAR_SHARED_PAGE_RECOMMENDATIONS_FAILURE,
	FETCH_SHARED_PAGE_COLLECTIONS,
	FETCH_SHARED_PAGE_COLLECTIONS_SUCCESS,
	CLEAR_SHARED_PAGE_COLLECTIONS,
} from "./constants";

export const setUserInfo = (payload) => ({
	type: SET_USER_INFO,
	payload,
});
export const getUserInfoAsync = (payload) => ({
	type: GET_USER_INFO_ASYNC,
	payload,
});
export const setUserInfoFetching = (payload) => ({
	type: SET_USER_INFO_FETCHING,
	payload,
});

export const setHelpMeShopModalOpen = (payload) => ({
	type: SET_HELP_ME_SHOP_MODAL_OPEN,
	payload,
});

export const setHelpMeShopModalSharedLink = (payload) => ({
	type: SET_HELP_ME_SHOP_MODAL_SHARED_LINK,
	payload,
});

export const handleSharedPageRecProductClick = () => ({
	type: HANDLE_SHARED_PAGE_REC_PRODUCT_CLICK,
});

export const fetchSharedPageRecommendations = () => ({
	type: FETCH_SHARED_PAGE_RECOMMENDATIONS,
});

export const fetchSharedPageRecommendationsSuccess = (payload) => ({
	type: FETCH_SHARED_PAGE_RECOMMENDATIONS_SUCCESS,
	payload,
});

export const fetchSharedPageRecommendationsFailure = (payload) => ({
	type: FETCH_SHARED_PAGE_RECOMMENDATIONS_FAILURE,
	payload,
});

export const clearSharedPageRecommendationsFailure = () => ({
	type: CLEAR_SHARED_PAGE_RECOMMENDATIONS_FAILURE,
});

export const fetchSharedPageCollections = ({ userId }) => ({
	type: FETCH_SHARED_PAGE_COLLECTIONS,
	userId,
});

export const fetchSharedPageCollectionsSuccess = (payload) => ({
	type: FETCH_SHARED_PAGE_COLLECTIONS_SUCCESS,
	payload,
});

export const clearSharedPageCollections = () => ({
	type: CLEAR_SHARED_PAGE_COLLECTIONS,
});
