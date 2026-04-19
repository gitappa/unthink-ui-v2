import { CLOSE_APP_MESSAGE, SHOW_APP_MESSAGE } from "./constants";

const initialState = {
	data: {
		message: "",
		title: "",
		type: "",
	},
	isOpen: false,
};

const appMessageModalReducer = (state = initialState, action = {}) => {
	const newState = { ...state };
	const { payload = {} } = action;

	switch (action.type) {
		case SHOW_APP_MESSAGE:
			newState.data.message = payload.message;
			newState.data.title = payload.title;
			newState.data.type = payload.type;
			newState.isOpen = true;

			return newState;
		case CLOSE_APP_MESSAGE:
			return {
				...initialState,
				data: {
					...initialState.data,
				},
			};

		default:
			return state;
	}
};

export default appMessageModalReducer;
