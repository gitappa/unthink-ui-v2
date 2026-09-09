import { SET_KIOSK_ACCESS } from "./constants";

const initialState = {
	hasAccess: null,
};

const kioskReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_KIOSK_ACCESS:
			return {
				...state,
				hasAccess: action.payload,
			};

		default:
			return state;
	}
};

export default kioskReducer;
