import {
	REORDER_WISHLIST,
	REORDER_WISHLIST_SUCCESS,
	REORDER_WISHLIST_FAILURE,
	REORDER_WISHLIST_RESET,
} from "./constants";

export const reorderWishlist = (payload) => ({
	type: REORDER_WISHLIST,
	payload,
});

export const reorderWishlistSuccess = (payload) => ({
	type: REORDER_WISHLIST_SUCCESS,
	payload,
});

export const reorderWishlistFailure = (payload) => ({
	type: REORDER_WISHLIST_FAILURE,
	payload,
});

export const reorderWishlistReset = () => ({
	type: REORDER_WISHLIST_RESET,
});
