import { DEREGISTER_APP_LOADER, REGISTER_APP_LOADER } from "./constants";

const initialState = {
	list: [],
};

const appLoaderReducer = (state = initialState, action = {}) => {
	const newState = { ...state };
	switch (action.type) {
		case REGISTER_APP_LOADER:
			if (!newState.list.includes(action.name)) {
				newState.list.push(action.name);
			}

			return newState;
		case DEREGISTER_APP_LOADER:
			const index = newState.list.indexOf(action.name);
			if (index !== -1) {
				newState.list.splice(index, 1); // Removes the index element
			}

			return newState;

		default:
			return state;
	}
};

export default appLoaderReducer;
