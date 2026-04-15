import { PEOPLE } from "../../../constants/codes";
import {
	FETCH_INFLUENCER_LIST,
	FETCH_INFLUENCER_LIST_FAILURE,
	FETCH_INFLUENCER_LIST_SUCCESS,
	OPEN_MENU_ITEM,
	SET_SHOW_PEOPLE,
} from "./constants";

const initialState = {
	showPeople: false,
	list: [],
	fetching: false,
};

const peopleReducer = (state = initialState, action) => {
	const payload = action.payload;
	const newState = { ...state };
	switch (action.type) {
		case OPEN_MENU_ITEM:
			newState.showPeople = state.showPeople ? false : payload === PEOPLE;
			return newState;
		case SET_SHOW_PEOPLE:
			newState.showPeople = payload ?? false;
			return newState;
		case FETCH_INFLUENCER_LIST:
			newState.fetching = true;
			return newState;
		case FETCH_INFLUENCER_LIST_SUCCESS:
			newState.list = payload ?? [];
			newState.fetching = false;
			return newState;
		case FETCH_INFLUENCER_LIST_FAILURE:
			newState.fetching = false;
			return newState;
		default:
			return state;
	}
};

export default peopleReducer;
