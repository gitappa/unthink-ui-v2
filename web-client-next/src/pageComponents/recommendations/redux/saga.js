import { takeLatest, call, put, select, delay } from "redux-saga/effects";

import { FETCH_RECOMMENDATIONS, HANDLE_REC_PRODUCT_CLICK } from "./constants";
import {
	fetchRecommendations,
	fetchRecommendationsFailure,
	fetchRecommendationsSuccess,
} from "./actions";
import { recommendationsAPIs } from "../../../helper/serverAPIs";
import { enable_recommendations } from "../../../constants/config";

const delayTime = 2000;

function* handleRecProductClick() {
	const recommendations = yield select(
		(state) => state.appState.recommendations
	);
	if (!recommendations.fetching) {
		yield put(fetchRecommendations());
	}
}

function* fetchRecommendationsAPICall() {
	if (enable_recommendations) {
		try {
			yield delay(delayTime); //manually added delay
			const { data, status } = yield call(
				recommendationsAPIs.fetchReccomendationsAPICall
			);

			if (status === 200) {
				yield put(fetchRecommendationsSuccess(data?.data || []));
			} else {
				yield put(fetchRecommendationsFailure());
			}
		} catch (err) {
			console.log(err);
			yield put(fetchRecommendationsFailure(err));
		}
	}
}

export function* recommendationsWatcher() {
	yield takeLatest(HANDLE_REC_PRODUCT_CLICK, handleRecProductClick);
	yield takeLatest(FETCH_RECOMMENDATIONS, fetchRecommendationsAPICall);
}
