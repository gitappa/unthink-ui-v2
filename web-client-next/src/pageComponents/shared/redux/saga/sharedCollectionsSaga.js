import { takeLatest, call, put } from "redux-saga/effects";

import { FETCH_SHARED_PAGE_COLLECTIONS } from "../constants";
import { fetchSharedPageCollectionsSuccess } from "../actions";
import { getTTid } from "../../../../helper/getTrackerInfo";
import { collectionAPIs } from "../../../../helper/serverAPIs";

function* fetchCollections({ userId = getTTid() }) {
	// UPDATE // CONFIRM WHERE WE USING THIS
	try {
		const { data = {}, status } = yield call(
			collectionAPIs.fetchCollectionsAPICall,
			{ user_id: userId }
		);

		if (status === 200) {
			yield put(fetchSharedPageCollectionsSuccess(data.data || []));
		}
	} catch (err) {
		console.error(err);
	}
}

export function* sharedCollectionsWatcher() {
	yield takeLatest(FETCH_SHARED_PAGE_COLLECTIONS, fetchCollections);
}
