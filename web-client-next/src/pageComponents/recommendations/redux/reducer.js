import {
	CLEAR_RECOMMENDATIONS,
	FETCH_RECOMMENDATIONS,
	FETCH_RECOMMENDATIONS_FAILURE,
	FETCH_RECOMMENDATIONS_SUCCESS,
} from "./constants";

const initialState = {
	data: [],
	fetching: false,
};

const recommendationReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case FETCH_RECOMMENDATIONS:
			newState.fetching = true;
			return newState;
		case FETCH_RECOMMENDATIONS_SUCCESS:
			newState.fetching = false;
			newState.data = payload || [];
			return newState;
		case FETCH_RECOMMENDATIONS_FAILURE:
			newState.fetching = false;
			return newState;
		default:
			return newState;
	}
};

export default recommendationReducer;
