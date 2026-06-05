import {
	ADD_PRODUCT_TO_WISHLIST_COLLECTION,
	ADD_PRODUCT_TO_WISHLIST_COLLECTION_SUCCESS,
	ADD_PRODUCT_TO_WISHLIST_COLLECTION_FAILURE,
	ADD_PRODUCT_TO_WISHLIST_COLLECTION_RESET,
} from "./constants";

const initialState = {
	isLoading: false,
	data: null,
	error: null,
	successMessage: "",
};

const addProductToWishlistCollectionReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case ADD_PRODUCT_TO_WISHLIST_COLLECTION:
			return {
				...state,
				isLoading: true,
				error: null,
				successMessage: "",
			};

		case ADD_PRODUCT_TO_WISHLIST_COLLECTION_SUCCESS:
			return {
				...state,
				isLoading: false,
				data: payload,
				error: null,
				successMessage: "Product added to wishlist successfully!",
			};

		case ADD_PRODUCT_TO_WISHLIST_COLLECTION_FAILURE:
			return {
				...state,
				isLoading: false,
				error: payload,
				successMessage: "",
			};

		case ADD_PRODUCT_TO_WISHLIST_COLLECTION_RESET:
			return initialState;

		default:
			return state;
	}
};

export default addProductToWishlistCollectionReducer;
