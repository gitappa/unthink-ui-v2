import {
	FETCH_INFLUENCER_LIST,
	FETCH_INFLUENCER_LIST_FAILURE,
	FETCH_INFLUENCER_LIST_SUCCESS,
	SET_SHOW_PEOPLE,
} from "./constants";

export const fetchInfluencerList = () => ({
	type: FETCH_INFLUENCER_LIST,
});

export const fetchInfluencerListSuccess = (payload) => ({
	type: FETCH_INFLUENCER_LIST_SUCCESS,
	payload,
});

export const fetchInfluencerListFailure = () => ({
	type: FETCH_INFLUENCER_LIST_FAILURE,
});

export const setShowPeople = (payload) => ({
	type: SET_SHOW_PEOPLE,
	payload,
});
