import { SET_STORE_DATA } from "./constants";

const initialState = {
	data: {},
};

const storeReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case SET_STORE_DATA:
			newState.data = payload;
			return newState;
		default:
			return state;
	}
};

export default storeReducer;
