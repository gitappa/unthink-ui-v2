import { CATEGORIES } from "../../../constants/codes";
// import { GET_USER_INFO_SUCCESS } from "../../Auth/redux/constants";
import {
	FETCH_CATEGORIES,
	FETCH_CATEGORIES_FAILURE,
	FETCH_CATEGORIES_RESET,
	FETCH_CATEGORIES_SUCCESS,
	OPEN_MENU_ITEM,
	SHOW_CATEGORIES,
	UPDATE_CATEGORIES_DATA_INFLUENCER_WIDGET_STARRED,
} from "./constants";

const initialState = () => ({
	list: [],
	metadata: {},
	isFetching: false,
	showCategories: false,
	success: false,
	error: false,
});

const categoriesReducer = (state = initialState(), action) => {
	const payload = action.payload;
	const newState = { ...state };

	switch (action.type) {
		case SHOW_CATEGORIES:
			newState.showCategories = payload ?? false;
			return newState;
		case OPEN_MENU_ITEM:
			newState.showCategories = state.showCategories
				? false
				: payload === CATEGORIES;
			return newState;
		case FETCH_CATEGORIES:
			newState.isFetching = true;
			newState.success = false;
			newState.error = false;
			newState.list = [];
			newState.metadata = {};
			return newState;
		case FETCH_CATEGORIES_SUCCESS:
			newState.list = payload;
			newState.isFetching = false;
			newState.success = true;
			newState.error = false;
			newState.metadata = action.metadata;
			return newState;
		case FETCH_CATEGORIES_FAILURE:
			newState.list = [];
			newState.isFetching = false;
			newState.success = false;
			newState.error = true;
			newState.metadata = {};
			return newState;
		case FETCH_CATEGORIES_RESET:
			return initialState();
		case UPDATE_CATEGORIES_DATA_INFLUENCER_WIDGET_STARRED:
			// update influencer starred value in categories data stored in redux to avoid fetch API call
			const influencerWidget = newState.list.find(
				(c) => c.widget_type === "influencer_widget"
			);

			if (influencerWidget && influencerWidget.next_level) {
				const infUser = influencerWidget.next_level.find(
					(u) => u.key === payload.key
				);

				infUser.starred = payload.starred;
			}

			return newState;
		default:
			return newState;
	}
};

export default categoriesReducer;
