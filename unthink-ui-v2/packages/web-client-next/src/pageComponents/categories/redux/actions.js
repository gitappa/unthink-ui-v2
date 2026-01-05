import {
	FETCH_CATEGORIES,
	FETCH_CATEGORIES_FAILURE,
	FETCH_CATEGORIES_RESET,
	FETCH_CATEGORIES_SUCCESS,
	OPEN_MENU_ITEM,
	SHOW_CATEGORIES,
	UPDATE_CATEGORIES_DATA_INFLUENCER_WIDGET_STARRED,
} from "./constants";

export const setShowCategories = (payload) => ({
	type: SHOW_CATEGORIES,
	payload,
});

export const fetchCategories = (metadata) => ({
	type: FETCH_CATEGORIES,
	metadata,
});

export const fetchCategoriesSuccess = (payload, metadata) => ({
	type: FETCH_CATEGORIES_SUCCESS,
	payload,
	metadata,
});

export const fetchCategoriesFailure = (payload) => ({
	type: FETCH_CATEGORIES_FAILURE,
	payload,
});

export const fetchCategoriesReset = () => ({
	type: FETCH_CATEGORIES_RESET,
});

export const updateCategoriesDataInfluencerWidgetStarred = (key, starred) => ({
	// action to update influencer starred value in categories data stored in redux to avoid fetch API call
	type: UPDATE_CATEGORIES_DATA_INFLUENCER_WIDGET_STARRED,
	payload: { key, starred },
});

export const openMenuItem = (payload) => ({
	type: OPEN_MENU_ITEM,
	payload,
});
