import {
	APPLY_WISHLIST_PRODUCTS_FILTER,
	APPLY_WISHLIST_PRODUCTS_FILTER_SUCCESS,
	APPLY_WISHLIST_PRODUCTS_FILTER_FAILURE,
	APPLY_WISHLIST_PRODUCTS_FILTER_RESET,
	REMOVE_PRODUCTS_FROM_APPLIED_FILTERS_USER_COLLECTION,
} from "./constants";

const initialWishlistOperationState = {
	isFetching: false,
	error: false,
	success: false,
	data: {},
	filteredData: {},
	appliedFiltersActionData: {},
};

const initialState = {
	...initialWishlistOperationState,
};

const applyWishlistProductsFilterReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case APPLY_WISHLIST_PRODUCTS_FILTER:
			newState.isFetching = true;
			newState.error = false;
			newState.success = false;
			newState.data = {};

			return newState;
		case APPLY_WISHLIST_PRODUCTS_FILTER_SUCCESS:
			newState.isFetching = false;
			newState.error = false;
			newState.success = true;
			newState.data = payload;
			newState.filteredData = payload;
			newState.appliedFiltersActionData = action.appliedFiltersActionData;

			return newState;
		case APPLY_WISHLIST_PRODUCTS_FILTER_FAILURE:
			newState.isFetching = false;
			newState.error = true;
			newState.success = false;
			newState.data = payload;

			return newState;

		case APPLY_WISHLIST_PRODUCTS_FILTER_RESET:
			return { ...initialWishlistOperationState };

		case REMOVE_PRODUCTS_FROM_APPLIED_FILTERS_USER_COLLECTION: {
			// NEW
			const { _id, products } = action;
			const collection =
				_id && newState.filteredData._id === _id
					? newState.filteredData
					: undefined;

			if (collection && products) {
				collection.product_lists = collection.product_lists.filter(
					(p) => !products.includes(p.mfr_code)
				);
			}

			return newState;
		}

		default:
			return newState;
	}
};

export default applyWishlistProductsFilterReducer;
