import {
	SHOW_SIMILAR,
	FETCH_SIMILAR_PRODUCTS,
	FETCH_SIMILAR_PRODUCTS_FAILURE,
	FETCH_SIMILAR_PRODUCTS_SUCCESS,
} from "./constants";

export const setShowSimilar = (payload) => ({
	type: SHOW_SIMILAR,
	payload,
});

export const fetchSimilarProducts = (payload) => ({
	type: FETCH_SIMILAR_PRODUCTS,
	payload,
});

export const fetchSimilarProductsSuccess = (productData, payload) => ({
	type: FETCH_SIMILAR_PRODUCTS_SUCCESS,
	productData,
	payload,
});

export const fetchSimilarProductsFailure = () => ({
	type: FETCH_SIMILAR_PRODUCTS_FAILURE,
});
