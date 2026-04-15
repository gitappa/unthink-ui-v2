// REMOVE
import { takeLatest, call, put } from "redux-saga/effects";
import { EDIT_COLLECTION } from "../constants";
import { setCreatingCollection } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";

function* editCollectionAsync(action) {
	try {
		yield put(setCreatingCollection(true));

		const {
			user_id,
			type,
			is_influencer,
			collection_id,
			access,
			name,
			description,
		} = action?.payload || {};

		const payload = {
			access_key,
			user_id,
			collection_id,
			name,
			description,
			is_influencer: is_influencer || false,
			type,
			access,
		};

		const api = `https://api.yfret.com/wishlist/update_collections/`;

		let { data, status } = yield call(
			apiCall,
			{
				api,
			},
			"post",
			payload
		);
		if (status === 200)
			action?.payload?.onSuccess && action.payload.onSuccess(data);
	} catch (error) {
		console.log("edit collection error :", error);
	} finally {
		yield put(setCreatingCollection(false));
	}
}

export function* editCollectionWatcher() {
	yield takeLatest(EDIT_COLLECTION, editCollectionAsync);
}
