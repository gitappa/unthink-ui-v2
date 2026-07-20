import {
	ADD_TO_CART,
	ADD_TO_CART_SUCCESS,
	ADD_TO_CART_FAILURE,
	FETCH_CART,
	FETCH_CART_SUCCESS,
	FETCH_CART_FAILURE,
	REMOVE_FROM_CART,
	REMOVE_FROM_CART_SUCCESS,
	REMOVE_FROM_CART_FAILURE,
	CREATE_LOYALTY_BADGE,
	CREATE_LOYALTY_BADGE_FAILURE,
	CREATE_LOYALTY_BADGE_SUCCESS,
	FETCH_EARNING_POINTS,
	FETCH_EARNING_POINTS_FAILURE,
	FETCH_EARNING_POINTS_SUCCESS,
} from "./constant";

const initialState = {
	loading: false,
	collection: null,
	imageLoyaltyBadge: null,
	imageLoyaltyBadgeLoading: false,
	imageLoyaltyBadgeError: null,
	earningPoints: null,
	earningPointsLoading: false,
	earningPointsError: null,
	error: null,
};

const userAddressInitialState = {
	loading: false,
	address: null,
	error: null,
};

export const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
		case FETCH_CART:
			return {
				...state,
				loading: true,
				error: null,
			};
		case ADD_TO_CART_SUCCESS:
		case FETCH_CART_SUCCESS:
			return {
				...state,
				loading: false,
				collection: action.payload,
			};

		case ADD_TO_CART_FAILURE:
		case FETCH_CART_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case REMOVE_FROM_CART:
			return {
				...state,
				loading: true,
				error: null,
			};

		case REMOVE_FROM_CART_SUCCESS:
			return {
				...state,
				loading: false,
				collection: action.payload,
			};

		case REMOVE_FROM_CART_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		case CREATE_LOYALTY_BADGE:
			return {
				...state,
				imageLoyaltyBadgeLoading: true,
				imageLoyaltyBadgeError: null,
			};

		case CREATE_LOYALTY_BADGE_SUCCESS:
			return {
				...state,
				imageLoyaltyBadgeLoading: false,
				imageLoyaltyBadge: action.payload,
			};

		case CREATE_LOYALTY_BADGE_FAILURE:
			return {
				...state,
				imageLoyaltyBadgeLoading: false,
				imageLoyaltyBadgeError: action.payload,
			};

		case FETCH_EARNING_POINTS:
			return {
				...state,
				earningPointsLoading: true,
				earningPointsError: null,
			};

		case FETCH_EARNING_POINTS_SUCCESS:
			return {
				...state,
				earningPointsLoading: false,
				earningPoints: action.payload,
			};

		case FETCH_EARNING_POINTS_FAILURE:
			return {
				...state,
				earningPointsLoading: false,
				earningPointsError: action.payload,
			};

		default:
			return state;
	}
};
