import { RESET_CAROUSEL_ACTION, SET_CAROUSEL_ACTION } from "./constants";

const initialState = {
	action: {
		type: "",
		action: "",
		metadata: {},
	},
};

const carouselReducer = (state = initialState, action) => {
	const payload = action.payload;
	switch (action.type) {
		case SET_CAROUSEL_ACTION:
			state.action = { ...state.action, ...payload };
			return { ...state };
		case RESET_CAROUSEL_ACTION:
			state.action = {
				type: "",
				action: "",
				metadata: {},
			};
			return { ...state };
			break;

		default:
			return state;
	}
};

export default carouselReducer;
