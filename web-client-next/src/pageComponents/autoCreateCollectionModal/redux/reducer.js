import {
	CLOSE_AUTO_CREATE_COLLECTION_MODAL,
	OPEN_AUTO_CREATE_COLLECTION_MODAL,
} from "./constants";

const initialState = {
	isOpen: false,
	data: {},
};

const autoCreateCollectionModalReducer = (
	state = initialState,
	action = {}
) => {
	const newState = { ...state };
	const { payload = {} } = action;

	switch (action.type) {
		case OPEN_AUTO_CREATE_COLLECTION_MODAL:
			newState.isOpen = true;
			newState.data = payload || {};
			return newState;
		case CLOSE_AUTO_CREATE_COLLECTION_MODAL:
			newState.isOpen = false;
			newState.data = {};
			return newState;
		default:
			return state;
	}
};

export default autoCreateCollectionModalReducer;
