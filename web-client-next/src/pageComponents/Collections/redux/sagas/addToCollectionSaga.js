// REMOVE
import { takeLatest, call, delay, put } from "redux-saga/effects";
import { ADD_TO_COLLECTIONS_ASYNC } from "../constants";
import { getCollectionsAsync, setAddingCollection } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getTTid } from "../../../../helper/getTrackerInfo";
import { COLLECTION_PRIVATE } from "../../../../constants/codes";
function* addToCollectionAsync(action) {
	try {
		const api = `https://api.yfret.com/wishlist/add_to_collection/`;
		yield put(setAddingCollection(true));
		let { data, status } = yield call(
			apiCall,
			{
				api,
			},
			"post",
			{
				access_key,
				name: action?.payload?.name ?? "",
				is_influencer: false,
				type: action?.payload?.type ?? "custom",
				mfr_code: action?.payload?.mfr_code,
				access: action?.payload?.access || COLLECTION_PRIVATE,
				user_id: action?.payload?.user_id,
				expert_id: action?.payload?.expert_id,
			}
		);
		if (status === 200) {
			yield put(getCollectionsAsync());
			action?.payload?.onSuccess && action.payload.onSuccess(data);
		}
	} catch (err) {
		action?.payload?.onFailure && action.payload.onFailure();
	} finally {
		yield put(setAddingCollection(false));
	}
}

export function* addToCollectionWatcher() {
	yield takeLatest(ADD_TO_COLLECTIONS_ASYNC, addToCollectionAsync);
}
