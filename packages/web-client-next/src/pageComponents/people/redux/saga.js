import { call, put, takeLatest } from "redux-saga/effects";
import {
	fetchInfluencerListFailure,
	fetchInfluencerListSuccess,
} from "./actions";
import { FETCH_INFLUENCER_LIST } from "./constants";
import { influencerAPIs } from "../../../helper/serverAPIs";

function* fetchInfluencerListAPI() {
	try {
		let { data } = yield call(influencerAPIs.fetchAllInfluencerDetailsAPICall);

		if (data?.status_code === 200 && data?.data) {
			const list = data.data?.filter((influencer) => influencer?.first_name);
			yield put(fetchInfluencerListSuccess(list));
		} else {
			yield put(fetchInfluencerListFailure());
		}
	} catch (err) {
		yield put(fetchInfluencerListFailure());
	}
}

export function* fetchInfluencerListWatcher() {
	yield takeLatest(FETCH_INFLUENCER_LIST, fetchInfluencerListAPI);
}
