// REMOVE
import { takeLatest, call, put } from "redux-saga/effects";
import { notification } from "antd";

import { UPDATE_COLLECTIONS_STATUS } from "../constants";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getCollectionsAsync } from "../actions";

function* fnUpdateCollectionStatus(action) {
	console.log("action : ", action);

	try {
		// will need to add separate is fetching state
		const api = `https://api.yfret.com/shared/collections/update/`;
		let { data, status } = yield call(
			apiCall,
			{
				api,
			},
			"post",
			{
				access_key,
				expert_id: action.payload.expert_id,
				user_id: action.payload.user_id,
				access: action.payload.access,
				collection_id: action.payload.collection_id,
				name: action.payload.name,
				status: action.payload.status,
				collection: true,
			}
		);
		if (status === 200 && data?.status_code === 200) {
			yield put(getCollectionsAsync());
			notification["success"]({
				message: "Success",
				description: "Collection status updated successfully",
			});
		} else
			notification["failure"]({
				message: "failure",
				description: "Failed to update Collection status",
			});
	} catch (err) {
		console.log(err);
	}
}

export function* updateCollectionStatusWatcher() {
	yield takeLatest(UPDATE_COLLECTIONS_STATUS, fnUpdateCollectionStatus);
}
