import {
	GET_COLLECTIONS_ASYNC,
	SET_COLLECTION_DETAILS,
	SET_COLLECTION_DETAILS_FETCHING,
	SET_SELECTED_COLLECTION,
	SET_SHOW_GALLERY,
	UPDATE_RECENTLY_VIEWED_LIST,
	SET_COLLECTION_PRODUCT_CODES,
	SET_COLLECTION_PRODUCTS,
	GET_COLLECTION_PRODUCTS_ASYNC,
	SET_COLLECTION_PRODUCTS_FETCHING,
	SET_COLLECTION_TITLE,
	SET_SHOW_COLLECTION,
	CREATE_COLLECTIONS_ASYNC,
	SET_CREATING_COLLECTION,
	ADD_TO_COLLECTIONS_ASYNC,
	DELETE_COLLECTIONS_ASYNC,
	SET_SELECTED_COLLECTION_ID,
	REMOVE_FROM_COLLECTIONS_ASYNC,
	SET_PRODUCT_TO_SAVE_AFTER_COLLECTION_CREATED,
	SET_SHOW_COLLECTION_MODAL,
	SET_ADDING_COLLECTION,
	ADD_MFRCODE_TO_COLLECTIONS,
	UPDATE_COLLECTIONS_STATUS,
	SET_COLLECTION_FOR_EDIT,
	EDIT_COLLECTION,
} from "./constants";

export const getCollectionsAsync = (payload) => ({
	type: GET_COLLECTIONS_ASYNC,
	payload,
});
export const setCollectionDetails = (payload, collectionListUserId) => ({
	type: SET_COLLECTION_DETAILS,
	payload,
	collectionListUserId,
});

export const setCollectionDetailsFetching = (payload) => ({
	type: SET_COLLECTION_DETAILS_FETCHING,
	payload,
});

export const setSelectedCollection = (payload) => ({
	type: SET_SELECTED_COLLECTION,
	payload,
});
export const setShowGallery = (payload) => ({
	type: SET_SHOW_GALLERY,
	payload,
});
export const updateRecentlyViewedList = (payload) => ({
	type: UPDATE_RECENTLY_VIEWED_LIST,
	payload,
});
export const setCollectionProductCodes = (payload) => ({
	type: SET_COLLECTION_PRODUCT_CODES,
	payload,
});
export const setCollectionProducts = (payload) => ({
	type: SET_COLLECTION_PRODUCTS,
	payload,
});
export const setCollectionProductsFetching = (payload) => ({
	type: SET_COLLECTION_PRODUCTS_FETCHING,
	payload,
});
export const getCollectionProductsAsync = (payload) => ({
	type: GET_COLLECTION_PRODUCTS_ASYNC,
	payload,
});
export const setCollectionTitle = (payload) => ({
	type: SET_COLLECTION_TITLE,
	payload,
});
export const setShowCollection = (payload, isSharedCreateCollection) => ({
	type: SET_SHOW_COLLECTION,
	payload,
	isSharedCreateCollection,
});
export const createCollectionAsync = (payload) => ({
	type: CREATE_COLLECTIONS_ASYNC,
	payload,
});
export const setCreatingCollection = (payload) => ({
	type: SET_CREATING_COLLECTION,
	payload,
});
export const addToCollectionAsync = (payload) => ({
	// REMOVE
	type: ADD_TO_COLLECTIONS_ASYNC,
	payload,
});
export const deleteCollectionAsync = (payload) => ({
	payload,
	type: DELETE_COLLECTIONS_ASYNC,
});
export const updateCollectionStatus = (payload) => ({
	type: UPDATE_COLLECTIONS_STATUS,
	payload,
});
export const setSelectedCollectionId = (payload) => ({
	type: SET_SELECTED_COLLECTION_ID,
	payload,
});
export const removeFromCollectionAsync = (payload) => ({
	type: REMOVE_FROM_COLLECTIONS_ASYNC,
	payload,
});
export const setProductToSaveAfterCollectionCreated = (payload) => ({
	type: SET_PRODUCT_TO_SAVE_AFTER_COLLECTION_CREATED,
	payload,
});
export const setShowCollectionModal = (payload) => ({
	type: SET_SHOW_COLLECTION_MODAL,
	payload,
});
export const setAddingCollection = (payload) => ({
	type: SET_ADDING_COLLECTION,
	payload,
});
export const addMfrCodeToCollection = (payload) => ({
	type: ADD_MFRCODE_TO_COLLECTIONS,
	payload,
});

export const setCollectionForEdit = (payload) => ({
	type: SET_COLLECTION_FOR_EDIT,
	payload,
});

export const editCollection = (payload) => ({
	type: EDIT_COLLECTION,
	payload,
});
