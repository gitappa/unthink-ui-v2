import {
	APPLY_WISHLIST_PRODUCTS_FILTER,
	APPLY_WISHLIST_PRODUCTS_FILTER_SUCCESS,
	APPLY_WISHLIST_PRODUCTS_FILTER_FAILURE,
	APPLY_WISHLIST_PRODUCTS_FILTER_RESET,
	REMOVE_PRODUCTS_FROM_APPLIED_FILTERS_USER_COLLECTION,
	RERUN_APPLY_WISHLIST_PRODUCTS_FILTER,
} from "./constants";

export const applyWishlistProductsFilter = (payload) => ({
	type: APPLY_WISHLIST_PRODUCTS_FILTER,
	payload,
});

export const rerunApplyWishlistProductsFilter = () => ({
	type: RERUN_APPLY_WISHLIST_PRODUCTS_FILTER,
});

export const applyWishlistProductsFilterSuccess = (
	payload,
	appliedFiltersActionData
) => ({
	type: APPLY_WISHLIST_PRODUCTS_FILTER_SUCCESS,
	payload,
	appliedFiltersActionData,
});

export const applyWishlistProductsFilterFailure = (payload) => ({
	type: APPLY_WISHLIST_PRODUCTS_FILTER_FAILURE,
	payload,
});

export const applyWishlistProductsFilterReset = () => ({
	type: APPLY_WISHLIST_PRODUCTS_FILTER_RESET,
});

export const removeProductsFromAppliedFiltersUserCollection = (
	_id,
	products
) => ({
	// NEW
	type: REMOVE_PRODUCTS_FROM_APPLIED_FILTERS_USER_COLLECTION,
	_id,
	products,
});
