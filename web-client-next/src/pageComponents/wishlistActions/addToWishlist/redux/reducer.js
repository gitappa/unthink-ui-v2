import {
	ADD_TO_WISHLIST,
	ADD_TO_WISHLIST_SUCCESS,
	ADD_TO_WISHLIST_FAILURE,
	ADD_TO_WISHLIST_RESET,
} from "./constants";

const initialWishlistOperationState = {
	isFetching: false,
	error: false,
	success: false,
	data: {},
};

const initialState = {
	...initialWishlistOperationState,
};

const addToWishlistReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case ADD_TO_WISHLIST:
			newState.isFetching = true;
			newState.error = false;
			newState.success = false;
			newState.data = {};

			return newState;
		case ADD_TO_WISHLIST_SUCCESS:
			newState.isFetching = false;
			newState.error = false;
			newState.success = true;
			newState.data = payload;

			return newState;
		case ADD_TO_WISHLIST_FAILURE:
			newState.isFetching = false;
			newState.error = true;
			newState.success = false;
			newState.data = payload;

			return newState;
		case ADD_TO_WISHLIST_RESET:
			return { ...initialWishlistOperationState };

		default:
			return newState;
	}
};

export default addToWishlistReducer;
