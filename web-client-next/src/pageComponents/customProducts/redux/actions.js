import {
	FETCH_CUSTOM_PRODUCTS,
	FETCH_CUSTOM_PRODUCTS_SUCCESS,
	FETCH_CUSTOM_PRODUCTS_FAILURE,
	REMOVE_CUSTOM_PRODUCTS,
	REMOVE_CUSTOM_PRODUCTS_SUCCESS,
	REMOVE_CUSTOM_PRODUCTS_FAILURE,
	REMOVE_PRODUCTS_FROM_SAVED_CUSTOM_PRODUCTS,
	UPDATE_CUSTOM_PRODUCTS,
	UPDATE_CUSTOM_PRODUCTS_SUCCESS,
	UPDATE_CUSTOM_PRODUCTS_FAILURE,
} from "./constants";

export const fetchCustomProducts = (payload) => ({
	type: FETCH_CUSTOM_PRODUCTS,
	payload,
});

export const fetchCustomProductsSuccess = (payload) => ({
	type: FETCH_CUSTOM_PRODUCTS_SUCCESS,
	payload,
});

export const fetchCustomProductsFailure = () => ({
	type: FETCH_CUSTOM_PRODUCTS_FAILURE,
});

export const removeCustomProducts = (payload) => ({
	type: REMOVE_CUSTOM_PRODUCTS,
	payload,
});

export const removeCustomProductsSuccess = () => ({
	type: REMOVE_CUSTOM_PRODUCTS_SUCCESS,
});

export const removeCustomProductsFailure = () => ({
	type: REMOVE_CUSTOM_PRODUCTS_FAILURE,
});

export const removeProductsFromSavedCustomProducts = (mfr_codes) => ({
	type: REMOVE_PRODUCTS_FROM_SAVED_CUSTOM_PRODUCTS,
	mfr_codes,
});

export const updateCustomProducts = (product_lists, user_id) => ({
	type: UPDATE_CUSTOM_PRODUCTS,
	product_lists,
	user_id,
});

export const updateCustomProductsSuccess = (payload) => ({
	type: UPDATE_CUSTOM_PRODUCTS_SUCCESS,
	payload
});

export const updateCustomProductsFailure = () => ({
	type: UPDATE_CUSTOM_PRODUCTS_FAILURE,
});
