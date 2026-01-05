import {
	DELETE_WISHLIST,
	DELETE_WISHLIST_SUCCESS,
	DELETE_WISHLIST_FAILURE,
	DELETE_WISHLIST_RESET,
} from "./constants";

export const deleteWishlist = (payload) => ({
	type: DELETE_WISHLIST,
	payload,
});

export const deleteWishlistSuccess = (payload) => ({
	type: DELETE_WISHLIST_SUCCESS,
	payload,
});

export const deleteWishlistFailure = (payload) => ({
	type: DELETE_WISHLIST_FAILURE,
	payload,
});

export const deleteWishlistReset = () => ({
	type: DELETE_WISHLIST_RESET,
});
