import {
	UPDATE_WISHLIST,
	UPDATE_WISHLIST_SUCCESS,
	UPDATE_WISHLIST_FAILURE,
	UPDATE_WISHLIST_RESET,
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

const updateWishlistReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case UPDATE_WISHLIST:
			newState.isFetching = true;
			newState.error = false;
			newState.success = false;
			newState.data = {};

			return newState;
		case UPDATE_WISHLIST_SUCCESS:
			newState.isFetching = false;
			newState.error = false;
			newState.success = true;
			newState.data = payload;

			return newState;
		case UPDATE_WISHLIST_FAILURE:
			newState.isFetching = false;
			newState.error = true;
			newState.success = false;
			newState.data = payload;

			return newState;
		case UPDATE_WISHLIST_RESET:
			return { ...initialWishlistOperationState };

		default:
			return newState;
	}
};

export default updateWishlistReducer;
