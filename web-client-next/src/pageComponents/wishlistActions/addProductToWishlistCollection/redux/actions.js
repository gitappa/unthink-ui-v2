import {
	ADD_PRODUCT_TO_WISHLIST_COLLECTION,
	ADD_PRODUCT_TO_WISHLIST_COLLECTION_SUCCESS,
	ADD_PRODUCT_TO_WISHLIST_COLLECTION_FAILURE,
	ADD_PRODUCT_TO_WISHLIST_COLLECTION_RESET,
} from "./constants";

export const addProductToWishlistCollection = (payload) => ({
	type: ADD_PRODUCT_TO_WISHLIST_COLLECTION,
	payload,
});

export const addProductToWishlistCollectionSuccess = (payload) => ({
	type: ADD_PRODUCT_TO_WISHLIST_COLLECTION_SUCCESS,
	payload,
});

export const addProductToWishlistCollectionFailure = (payload) => ({
	type: ADD_PRODUCT_TO_WISHLIST_COLLECTION_FAILURE,
	payload,
});

export const addProductToWishlistCollectionReset = () => ({
	type: ADD_PRODUCT_TO_WISHLIST_COLLECTION_RESET,
});
