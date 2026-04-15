// REMOVE
import { takeLatest, call, delay, put } from "redux-saga/effects";
import { GET_COLLECTIONS_ASYNC } from "../constants";
import { setCollectionDetailsFetching, setCollectionDetails } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getTTid } from "../../../../helper/getTrackerInfo";
function* getCollectionListAsync(action) {
	try {
		yield put(setCollectionDetailsFetching(true));

		const api = `https://api.yfret.com/wishlist/view_collection/`;
		const user_id = action?.payload?.userId ?? getTTid();
		let { data, status } = yield call(apiCall, {
			api,
			access_key,
			user_id,
		});
		if (status === 200) yield put(setCollectionDetails(data, user_id));
	} catch (err) {
		console.log(err);
	} finally {
		yield put(setCollectionDetailsFetching(false));
	}
}

export function* getHomeWidgetWatcher() {
	yield takeLatest(GET_COLLECTIONS_ASYNC, getCollectionListAsync);
}
