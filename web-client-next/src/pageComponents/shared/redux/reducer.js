import {
	CLEAR_SHARED_PAGE_COLLECTIONS,
	CLEAR_SHARED_PAGE_RECOMMENDATIONS_FAILURE,
	FETCH_SHARED_PAGE_COLLECTIONS_SUCCESS,
	FETCH_SHARED_PAGE_RECOMMENDATIONS,
	FETCH_SHARED_PAGE_RECOMMENDATIONS_FAILURE,
	FETCH_SHARED_PAGE_RECOMMENDATIONS_SUCCESS,
	SET_HELP_ME_SHOP_MODAL_OPEN,
	SET_HELP_ME_SHOP_MODAL_SHARED_LINK,
	SET_USER_INFO,
	SET_USER_INFO_FETCHING,
} from "./constants";

const initialState = {
	user: {},
	isUserFetching: false,
	helpMeShopModal: {
		isOpen: false,
		sharedPageLink: null,
	},
	recommendations: {
		data: [],
		isFetching: false,
	},
	collections: {
		data: [],
		isFetching: false,
	},
};

const reducer = (state = initialState, action = {}) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case SET_USER_INFO:
			newState.user = payload ?? {};
			return newState;
		case SET_USER_INFO_FETCHING:
			newState.isUserFetching = payload ?? false;
			return newState;
		case SET_HELP_ME_SHOP_MODAL_OPEN:
			newState.helpMeShopModal.isOpen = payload ?? false;
			return newState;
		case SET_HELP_ME_SHOP_MODAL_SHARED_LINK:
			newState.helpMeShopModal.sharedPageLink = payload ?? null;
			return newState;

		case FETCH_SHARED_PAGE_RECOMMENDATIONS:
			newState.recommendations.isFetching = true;
			return newState;
		case FETCH_SHARED_PAGE_RECOMMENDATIONS_SUCCESS:
			newState.recommendations.isFetching = false;
			newState.recommendations.data = payload || [];
			return newState;
		case FETCH_SHARED_PAGE_RECOMMENDATIONS_FAILURE:
			newState.recommendations.isFetching = false;
			return newState;
		case CLEAR_SHARED_PAGE_RECOMMENDATIONS_FAILURE:
			newState.recommendations.isFetching = false;
			newState.recommendations.data = [];
			return newState;
		case FETCH_SHARED_PAGE_COLLECTIONS_SUCCESS:
			newState.collections.data = payload;
			return newState;
		case CLEAR_SHARED_PAGE_COLLECTIONS:
			newState.collections.data = [];
			return newState;

		default:
			return state;
	}
};

export default reducer;
