// REMOVE
import { takeLatest, call } from "redux-saga/effects";
import { REMOVE_FROM_COLLECTIONS_ASYNC } from "../constants";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getTTid } from "../../../../helper/getTrackerInfo";
function* removeFromCollectionAsync(action) {
	try {
		const api = `https://api.yfret.com/wishlist/remove_from_collection/`;
		let { data, status } = yield call(
			apiCall,
			{
				api,
			},
			"post",
			{
				user_id: action?.payload?.user_id,
				expert_id: action?.payload?.expert_id,
				access_key,
				name: action?.payload?.name ?? "",
				is_influencer: false,
				type: action?.payload?.type ?? "custom",
				mfr_code: action?.payload?.mfr_code,
				...(action?.payload?.collection_id
					? { collection_id: action?.payload?.collection_id }
					: {}),
			}
		);
		if (status === 200)
			action?.payload?.onSuccess && action.payload.onSuccess(data);
	} catch (err) {
		action?.payload?.onFailure && action.payload.onFailure();
	}
}

export function* removeFromCollectionWatcher() {
	yield takeLatest(REMOVE_FROM_COLLECTIONS_ASYNC, removeFromCollectionAsync);
}
