// REMOVE
import { takeLatest, call, put, select } from "redux-saga/effects";

import {
	FETCH_SHARED_PAGE_RECOMMENDATIONS,
	HANDLE_SHARED_PAGE_REC_PRODUCT_CLICK,
} from "../constants";
import {
	fetchSharedPageRecommendations,
	fetchSharedPageRecommendationsFailure,
	fetchSharedPageRecommendationsSuccess,
} from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getSid, getTTid } from "../../../../helper/getTrackerInfo";
import { sharedPageRecommendationsIpp } from "../../../../constants/codes";

function* handleRecProductClick() {
	const recommendations = yield select((state) => state.shared.recommendations);
	// if (!recommendations.isFetching && !recommendations.data?.length) {
	if (!recommendations.isFetching) {
		yield put(fetchSharedPageRecommendations());
	}
}

function* fetchRecommendations() {
	try {
		const api = `https://aura.yfret.com/aura/personalized_recommendations/`;
		const payload = {
			api,
			access_key,
			tt_id: getTTid(),
			sid: getSid(),
			ipp: sharedPageRecommendationsIpp,
			current_page: 1,
		};

		const { data, status } = yield call(apiCall, payload);

		if (status === 200) {
			yield put(
				fetchSharedPageRecommendationsSuccess(
					data.data?.slice(0, sharedPageRecommendationsIpp) || []
				)
			);
		} else {
			yield put(fetchSharedPageRecommendationsFailure());
		}
	} catch (err) {
		console.log(err);
		yield put(fetchSharedPageRecommendationsFailure(err));
	}
}

export function* recommendationsWatcher() {
	yield takeLatest(HANDLE_SHARED_PAGE_REC_PRODUCT_CLICK, handleRecProductClick);
	yield takeLatest(FETCH_SHARED_PAGE_RECOMMENDATIONS, fetchRecommendations);
}
