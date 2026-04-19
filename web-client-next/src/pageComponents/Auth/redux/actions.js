import {
	GET_CREATOR_COLLECTIONS,
	GET_CREATOR_COLLECTIONS_FAILURE,
	GET_CREATOR_COLLECTIONS_SUCCESS,
	GET_SINGLE_USER_COLLECTION,
	GET_SINGLE_USER_COLLECTION_FAILURE,
	GET_SINGLE_USER_COLLECTION_SUCCESS,
	GET_USER_COLLECTION,
	GET_USER_COLLECTIONS,
	GET_USER_COLLECTIONS_FAILURE,
	GET_USER_COLLECTIONS_RESET,
	GET_USER_COLLECTIONS_SUCCESS,
	GET_USER_COLLECTION_FAILURE,
	GET_USER_COLLECTION_SUCCESS,
	GET_USER_INFO,
	GET_USER_INFO_FAILURE,
	GET_USER_INFO_SUCCESS,
	GUEST_POPUP_SHOW,
	IS_SAVING_USER_INFO,
	REMOVE_COLLECTION_FROM_USER_COLLECTIONS,
	REMOVE_PRODUCTS_FROM_USER_COLLECTIONS,
	REPLACE_AND_UPDATE_USER_COLLECTION_DATA,
	REPLACE_SORTED_USER_COLLECTIONS,
	SAVE_USER_INFO,
	SET_STARRED_USER_COLLECTIONS,
	SET_UPDATED_STATUS_USER_COLLECTIONS,
} from "./constants";

export const getUserInfo = () => ({
	type: GET_USER_INFO,
});

export const getUserInfoSuccess = (payload, options = {}) => ({
	type: GET_USER_INFO_SUCCESS,
	payload,
	options,
});

export const getUserInfoFailure = (payload) => ({
	type: GET_USER_INFO_FAILURE,
	payload,
});

export const saveUserInfo = (payload, successMessage) => ({
	type: SAVE_USER_INFO,
	payload,
	successMessage,
});

export const setIsSavingUserInfo = (payload) => ({
	type: IS_SAVING_USER_INFO,
	payload,
});

export const getUserCollections = ({ product_limits, summary, Mystatus, ipp, current_page } = {}) => ({
	type: GET_USER_COLLECTIONS,
	payload: { product_limits, summary, Mystatus, ipp, current_page },
});

export const getUserCollectionsSuccess = (payload, count, params) => ({
	type: GET_USER_COLLECTIONS_SUCCESS,
	payload,
	params,
	count
});

export const getUserCollectionsFailure = () => ({
	type: GET_USER_COLLECTIONS_FAILURE,
});

export const getUserCollectionsReset = () => ({
	type: GET_USER_COLLECTIONS_RESET,
});

export const getUserCollection = (payload) => ({
	type: GET_USER_COLLECTION,
	payload,
});

export const getUserCollectionSuccess = (payload) => ({
	type: GET_USER_COLLECTION_SUCCESS,
	payload,
});

export const getUserCollectionFailure = () => ({
	type: GET_USER_COLLECTION_FAILURE,
});

// SINGLE ID STORE ACTION

export const getSingleUserCollection = (payload) => ({
	type: GET_SINGLE_USER_COLLECTION,
	payload,
});

export const getSingleUserCollectionSuccess = (payload) => ({
	type: GET_SINGLE_USER_COLLECTION_SUCCESS,
	payload,
});

export const getSingleUserCollectionFailure = () => ({
	type: GET_SINGLE_USER_COLLECTION_FAILURE,
});

export const removeProductsFromUserCollections = (_id, products) => ({
	// NEW
	type: REMOVE_PRODUCTS_FROM_USER_COLLECTIONS,
	_id,
	products,
});

export const setStarredUserCollections = (collections, starred) => ({
	// NEW
	type: SET_STARRED_USER_COLLECTIONS,
	collections,
	starred,
});

export const setUpdatedStatusUserCollections = (_id, status) => ({
	// set current auth user's collection status in redux state
	// NEW
	type: SET_UPDATED_STATUS_USER_COLLECTIONS,
	_id,
	status,
});

export const replaceSortedUserCollections = (collections) => ({
	// replace sorted collections with current auth user's collections
	// NEW
	type: REPLACE_SORTED_USER_COLLECTIONS,
	collections,
});

export const replaceAndUpdateUserCollectionData = (payload) => ({
	// replace and update user collection full data
	// NEW
	type: REPLACE_AND_UPDATE_USER_COLLECTION_DATA,
	payload,
});

export const removeCollectionFromUserCollection = (payload) => ({
	type: REMOVE_COLLECTION_FROM_USER_COLLECTIONS,
	payload,
});

export const GuestPopUpShow = (show) => ({
	type: GUEST_POPUP_SHOW,
	payload: show,
});

export const getCreatorCollection = () => ({
	type: GET_CREATOR_COLLECTIONS,
});

// Action on success
export const getCreatorCollectionSuccess = (data) => ({
	type: GET_CREATOR_COLLECTIONS_SUCCESS,
	payload: data,
});

// Action on failure
export const getCreatorCollectionFailure = (error) => ({
	type: GET_CREATOR_COLLECTIONS_FAILURE,
	payload: error,
});