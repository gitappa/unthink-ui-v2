import {
	ADD_TO_WISHLIST,
	ADD_TO_WISHLIST_SUCCESS,
	ADD_TO_WISHLIST_FAILURE,
	ADD_TO_WISHLIST_RESET,
} from "./constants";

export const addToWishlist = (payload) => ({
	type: ADD_TO_WISHLIST,
	payload,
});

export const addToWishlistSuccess = (payload) => ({
	type: ADD_TO_WISHLIST_SUCCESS,
	payload,
});

export const addToWishlistFailure = (payload) => ({
	type: ADD_TO_WISHLIST_FAILURE,
	payload,
});

export const addToWishlistReset = () => ({
	type: ADD_TO_WISHLIST_RESET,
});
