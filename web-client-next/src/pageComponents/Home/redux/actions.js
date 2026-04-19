import {
	SET_HOME_PAGE_WIDGET,
	SET_HOME_PAGE_WIDGET_LOADING,
	GET_HOME_PAGE_WIDGET_ASYNC,
	SET_HOME_PAGE_CATEGORY,
	SET_HOME_PAGE_CATEGORY_LOADING,
	GET_HOME_PAGE_CATEGORY_ASYNC,
	RESET_HOME_WIDGETS,
	RESET_CATEGORY,
	SET_USER_PROFILE,
} from "./constants";

export const setHomePageWidget = (payload) => ({
	type: SET_HOME_PAGE_WIDGET,
	payload,
});

export const setHomePageWidgetLoading = (payload) => ({
	type: SET_HOME_PAGE_WIDGET_LOADING,
	payload,
});

export const getHomePageWidgetAsync = (payload) => ({
	type: GET_HOME_PAGE_WIDGET_ASYNC,
	payload,
});

export const setHomePageCategory = (payload) => ({
	type: SET_HOME_PAGE_CATEGORY,
	payload,
});

export const setHomePageCategoryLoading = (payload) => ({
	type: SET_HOME_PAGE_CATEGORY_LOADING,
	payload,
});

export const getHomePageCategoryAsync = (payload) => ({
	type: GET_HOME_PAGE_CATEGORY_ASYNC,
	payload,
});
export const resetHomeWidgets = () => ({
	type: RESET_HOME_WIDGETS,
});
export const resetCategory = () => ({
	type: RESET_CATEGORY,
});
export const setUserProfile = (payload) => ({
	type: SET_USER_PROFILE,
	payload,
});
