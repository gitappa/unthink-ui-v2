import { SET_KIOSK_ACCESS, SET_KIOSK_LOGIN } from "./constants";

const initialState = {
	hasAccess: null,
	login: null,
	userId: "",
};

const kioskReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_KIOSK_ACCESS:
			return {
				...state,
				hasAccess: action.payload,
			};

		case SET_KIOSK_LOGIN:
			return {
				...state,
				login: action.payload,
				userId:
					typeof action.payload === "string"
						? action.payload
						: action.payload?.user_id || "",
			};

		default:
			return state;
	}
};

export default kioskReducer;
