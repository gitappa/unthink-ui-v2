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
} from "./constant";

const initialState = {
	loading: false,
	collection: null,
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

		default:
			return state;
	}
};