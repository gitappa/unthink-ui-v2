import {
	UPDATE_WISHLIST,
	UPDATE_WISHLIST_SUCCESS,
	UPDATE_WISHLIST_FAILURE,
	UPDATE_WISHLIST_RESET,
} from "./constants";

export const updateWishlist = (payload) => ({
	type: UPDATE_WISHLIST,
	payload,
});

export const updateWishlistSuccess = (payload) => ({
	type: UPDATE_WISHLIST_SUCCESS,
	payload,
});

export const updateWishlistFailure = (payload) => ({
	type: UPDATE_WISHLIST_FAILURE,
	payload,
});

export const updateWishlistReset = () => ({
	type: UPDATE_WISHLIST_RESET,
});
