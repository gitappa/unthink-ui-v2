import {
	CLEAR_INFLUENCER_COLLECTIONS,
	GET_INFLUENCER_COLLECTION,
	GET_INFLUENCER_COLLECTIONS,
	GET_INFLUENCER_COLLECTIONS_FAILURE,
	GET_INFLUENCER_COLLECTIONS_SUCCESS,
	GET_INFLUENCER_COLLECTION_FAILURE,
	GET_INFLUENCER_COLLECTION_SUCCESS,
	GET_INFLUENCER_INFO,
	GET_INFLUENCER_INFO_FAILURE,
	GET_INFLUENCER_INFO_SUCCESS,
	REPLACE_AND_UPDATE_INFLUENCER_COLLECTION_DATA,
} from "./constants";

const initialState = {
	data: {},
	isFetching: false,
	error: false,
	collections: {
		data: [],
		isFetching: false,
		count: "",
	},
};

const reducer = (state = initialState, action = {}) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case GET_INFLUENCER_INFO:
			newState.data = {};
			newState.isFetching = true;
			newState.error = false;
			return newState;
		case GET_INFLUENCER_INFO_SUCCESS:
			newState.data = payload;
			newState.isFetching = false;
			newState.error = false;
			return newState;
		case GET_INFLUENCER_INFO_FAILURE:
			newState.data = {};
			newState.isFetching = false;
			newState.error = true;
			return newState;

		case GET_INFLUENCER_COLLECTIONS:
			newState.collections.isFetching = true;
			return newState;

		case GET_INFLUENCER_COLLECTIONS_SUCCESS:
			newState.collections.data = payload;
			newState.collections.params = action.params;
			newState.collections.count = action.count;
			newState.collections.isFetching = false;
			return newState;

		case GET_INFLUENCER_COLLECTIONS_FAILURE:
			newState.collections.data = [];
			newState.collections.isFetching = false;
			return newState;

		// single collection
		case GET_INFLUENCER_COLLECTION:
			newState.collections.isFetching = true;
			return newState;
		case GET_INFLUENCER_COLLECTION_SUCCESS:
			const { _id } = payload;
			if (_id) {
				const collIndex = newState.collections.data.findIndex(
					(i) => i._id === _id
				);

				if (collIndex !== -1) {
					newState.collections.data[collIndex] = payload;
					newState.collections.data = newState.collections.data.slice(); // copy array with new reference // to take effect wherever it is being used
				} else {
					newState.collections.data.push(payload);
				}
			}
			newState.collections.isFetching = false;

			return newState;
		case REPLACE_AND_UPDATE_INFLUENCER_COLLECTION_DATA:
			// replace and update influencer collection full data
			// NEW
			if (payload._id) {
				const ind = newState.collections.data.findIndex(
					(cl) => cl._id === payload._id
				);

				if (ind !== -1) {
					newState.collections.data[ind] = { ...payload };
					newState.collections.data = newState.collections.data.slice(); // copy array with new reference // to take effect wherever it is being used
				}
			}

			return newState;
		case GET_INFLUENCER_COLLECTION_FAILURE:
			newState.collections.data = [];
			newState.collections.isFetching = false;
			return newState;
		// New case: Clear influencer collections
		case CLEAR_INFLUENCER_COLLECTIONS:
			newState.collections.data = [];
			newState.collections.isFetching = false;
			newState.collections.params = null; // Optional: Clear any params if necessary
			return newState;
		default:
			return state;
	}
};

export default reducer;
