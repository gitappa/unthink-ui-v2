import {
	REMOVE_FROM_WISHLIST,
	REMOVE_FROM_WISHLIST_SUCCESS,
	REMOVE_FROM_WISHLIST_FAILURE,
	REMOVE_FROM_WISHLIST_RESET,
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

const removeFromWishlistReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case REMOVE_FROM_WISHLIST:
			newState.isFetching = true;
			newState.error = false;
			newState.success = false;
			newState.data = {};

			return newState;
		case REMOVE_FROM_WISHLIST_SUCCESS:
			newState.isFetching = false;
			newState.error = false;
			newState.success = true;
			newState.data = payload;

			return newState;
		case REMOVE_FROM_WISHLIST_FAILURE:
			newState.isFetching = false;
			newState.error = true;
			newState.success = false;
			newState.data = payload;

			return newState;
		case REMOVE_FROM_WISHLIST_RESET:
			return { ...initialWishlistOperationState };

		default:
			return newState;
	}
};

export default removeFromWishlistReducer;
