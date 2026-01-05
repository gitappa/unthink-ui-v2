import {
	FETCH_RECOMMENDATIONS,
	FETCH_RECOMMENDATIONS_FAILURE,
	FETCH_RECOMMENDATIONS_SUCCESS,
	HANDLE_REC_PRODUCT_CLICK,
} from "./constants";

export const handleRecProductClick = () => ({
	type: HANDLE_REC_PRODUCT_CLICK,
});

export const fetchRecommendations = () => ({
	type: FETCH_RECOMMENDATIONS,
});

export const fetchRecommendationsSuccess = (payload) => ({
	type: FETCH_RECOMMENDATIONS_SUCCESS,
	payload,
});

export const fetchRecommendationsFailure = (payload) => ({
	type: FETCH_RECOMMENDATIONS_FAILURE,
	payload,
});
