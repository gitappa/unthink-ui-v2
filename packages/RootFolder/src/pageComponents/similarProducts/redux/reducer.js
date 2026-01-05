import {
	FETCH_SIMILAR_PRODUCTS,
	FETCH_SIMILAR_PRODUCTS_FAILURE,
	FETCH_SIMILAR_PRODUCTS_SUCCESS,
	SHOW_SIMILAR,
} from "./constants";

const initialState = {
	showSimilar: false,
	productMfr: "",
	similarProducts: [],
	isFetching: false,
};

const similarProductsReducer = (state = initialState, action) => {
	const payload = action?.payload;
	const newState = { ...state };
	switch (action.type) {
		case SHOW_SIMILAR:
			newState.showSimilar = payload ?? false;
			return newState;

		case FETCH_SIMILAR_PRODUCTS:
			newState.isFetching = true;
			return newState;

		case FETCH_SIMILAR_PRODUCTS_SUCCESS:
			newState.similarProducts = payload ?? [];
			newState.isFetching = false;
			newState.productMfr = action.productData.mfr_code;
			return newState;

		case FETCH_SIMILAR_PRODUCTS_FAILURE:
			newState.isFetching = false;
			newState.productMfr = "";
			newState.showSimilar = false;
			return newState;

		default:
			return newState;
	}
};

export default similarProductsReducer;
