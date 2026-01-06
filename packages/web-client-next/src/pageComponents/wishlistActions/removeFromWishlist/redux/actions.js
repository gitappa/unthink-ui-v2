import {
	REMOVE_FROM_WISHLIST,
	REMOVE_FROM_WISHLIST_SUCCESS,
	REMOVE_FROM_WISHLIST_FAILURE,
	REMOVE_FROM_WISHLIST_RESET,
} from "./constants";

export const removeFromWishlist = (payload) => ({
	type: REMOVE_FROM_WISHLIST,
	payload,
});

export const removeFromWishlistSuccess = (payload) => ({
	type: REMOVE_FROM_WISHLIST_SUCCESS,
	payload,
});

export const removeFromWishlistFailure = (payload) => ({
	type: REMOVE_FROM_WISHLIST_FAILURE,
	payload,
});

export const removeFromWishlistReset = () => ({
	type: REMOVE_FROM_WISHLIST_RESET,
});
