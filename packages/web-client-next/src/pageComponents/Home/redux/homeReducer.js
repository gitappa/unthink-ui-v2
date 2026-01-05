import {
	SET_HOME_PAGE_WIDGET,
	SET_HOME_PAGE_WIDGET_LOADING,
	SET_HOME_PAGE_CATEGORY,
	SET_HOME_PAGE_CATEGORY_LOADING,
	SET_USER_PROFILE,
	RESET_HOME_WIDGETS,
	RESET_CATEGORY,
} from "./constants";
const initialState = {
	widgets: [],
	category: {
		isLoading: false,
		data: [],
	},
	userProfile: [],
};

const homeReducer = (state = initialState, action) => {
	const payload = action?.payload ?? {};
	const newState = { ...state };
	switch (action.type) {
		case SET_HOME_PAGE_CATEGORY: {
			const category = { ...newState.category };
			category.data = payload ?? [];
			newState.category = category;
			return newState;
		}
		case SET_HOME_PAGE_CATEGORY_LOADING: {
			const category = { ...newState.category };
			category.isLoading = payload ?? false;
			newState.category = category;
			return newState;
		}
		case SET_HOME_PAGE_WIDGET:
			if (payload.type) {
				if (!newState.widgets.includes(payload.type))
					newState.widgets.push(payload.type);
				newState[payload.type] = payload.data;
			}
			return newState;
		case SET_HOME_PAGE_WIDGET_LOADING:
			if (payload.type) {
				if (!newState.widgets.includes(payload.type))
					newState.widgets.push(payload.type);
				newState[payload.type] = {
					...((newState[payload?.type] && newState[payload.type]) ?? {}),
					isLoading: payload?.isLoading ?? false,
				};
			}
			return newState;
		case SET_USER_PROFILE:
			newState.userProfile = action.payload;
			return newState;
		case RESET_HOME_WIDGETS:
			newState.widgets = [];
			return newState;
		case RESET_CATEGORY:
			newState.category.isLoading = false;
			newState.category.data = [];
			return newState;
		default:
			return state;
	}
};
export default homeReducer;
