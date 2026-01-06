import {
	CLOSE_EARNED_REWARD_MODAL,
	SHOW_EARNED_REWARD_MODAL,
} from "./constants";

const initialState = {
	data: {
		message: "",
		title: "",
		type: "",
		data: {},
	},
	isOpen: false,
};

const appMessageModalReducer = (state = initialState, action = {}) => {
	const newState = { ...state };
	const { payload = {} } = action;

	switch (action.type) {
		case SHOW_EARNED_REWARD_MODAL:
			newState.data.message = payload.message;
			newState.data.title = payload.title;
			newState.data.type = payload.type;
			newState.data.data = payload.data || {};
			newState.isOpen = true;

			return newState;
		case CLOSE_EARNED_REWARD_MODAL:
			return {
				...initialState,
				data: {
					...initialState.data,
					data: { ...initialState.data.data },
				},
			};

		default:
			return state;
	}
};

export default appMessageModalReducer;
