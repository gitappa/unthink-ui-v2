import {
	ADD_TO_CART,
	ADD_TO_CART_FAILURE,
	ADD_TO_CART_SUCCESS,
	FETCH_CART,
	FETCH_CART_FAILURE,
	FETCH_CART_SUCCESS,
	REMOVE_FROM_CART,
	REMOVE_FROM_CART_FAILURE,
	REMOVE_FROM_CART_SUCCESS,
	CREATE_LOYALTY_BADGE,
	CREATE_LOYALTY_BADGE_FAILURE,
	CREATE_LOYALTY_BADGE_SUCCESS,
	FETCH_EARNING_POINTS,
	FETCH_EARNING_POINTS_FAILURE,
	FETCH_EARNING_POINTS_SUCCESS,
} from "./constant";

// ADD TO CART
export const addToCart = (payload) => ({
	type: ADD_TO_CART,
	payload,
});

export const addToCartSuccess = (data) => ({
	type: ADD_TO_CART_SUCCESS,
	payload: data,
});

export const addToCartFailure = (error) => ({
	type: ADD_TO_CART_FAILURE,
	payload: error,
});

// FETCH CART
export const fetchCart = (collection_path) => ({
	type: FETCH_CART,
	payload: { collection_path },
});

export const fetchCartSuccess = (data) => ({
	type: FETCH_CART_SUCCESS,
	payload: data,
});

export const fetchCartFailure = (error) => ({
	type: FETCH_CART_FAILURE,
	payload: error,
});
// Remove cart item
export const removeFromCart = (payload) => ({
	type: REMOVE_FROM_CART,
	payload,
});

export const removeFromCartSuccess = (data) => ({
	type: REMOVE_FROM_CART_SUCCESS,
	payload: data,
});

export const removeFromCartFailure = (error) => ({
	type: REMOVE_FROM_CART_FAILURE,
	payload: error,
});

export const createLoyaltyBadge = (payload) => ({
	type: CREATE_LOYALTY_BADGE,
	payload,
});

export const createLoyaltyBadgeSuccess = (imageUrl) => ({
	type: CREATE_LOYALTY_BADGE_SUCCESS,
	payload: imageUrl,
});

export const createLoyaltyBadgeFailure = (error) => ({
	type: CREATE_LOYALTY_BADGE_FAILURE,
	payload: error,
});

export const fetchEarningPoints = (payload) => ({
	type: FETCH_EARNING_POINTS,
	payload,
});

export const fetchEarningPointsSuccess = (data) => ({
	type: FETCH_EARNING_POINTS_SUCCESS,
	payload: data,
});

export const fetchEarningPointsFailure = (error) => ({
	type: FETCH_EARNING_POINTS_FAILURE,
	payload: error,
});
