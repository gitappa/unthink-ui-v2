import {
	DELETE_WISHLIST,
	DELETE_WISHLIST_SUCCESS,
	DELETE_WISHLIST_FAILURE,
	DELETE_WISHLIST_RESET,
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

const deleteWishlistReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case DELETE_WISHLIST:
			newState.isFetching = true;
			newState.error = false;
			newState.success = false;
			newState.data = {};

			return newState;
		case DELETE_WISHLIST_SUCCESS:
			newState.isFetching = false;
			newState.error = false;
			newState.success = true;
			newState.data = payload;

			return newState;
		case DELETE_WISHLIST_FAILURE:
			newState.isFetching = false;
			newState.error = true;
			newState.success = false;
			newState.data = payload;

			return newState;
		case DELETE_WISHLIST_RESET:
			return { ...initialWishlistOperationState };

		default:
			return newState;
	}
};

export default deleteWishlistReducer;
