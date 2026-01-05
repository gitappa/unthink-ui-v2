// REMOVE
import { takeLatest, call, select, put } from "redux-saga/effects";
import { DELETE_COLLECTIONS_ASYNC } from "../constants";
import { setCollectionDetails } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getTTid } from "../../../../helper/getTrackerInfo";
const collectionState = (state) => state.collections;
const removefromCollection = (list, id) => {
	const updatedList = list.map((data) => {
		const newCollections = data.collections.filter(
			(collection) => collection.collection_id !== id
		);
		data.collections = newCollections;
		return data;
	});
	return updatedList;
};
function* deleteCollectionAsync(action) {
	try {
		const api = `https://api.yfret.com/wishlist/delete_collection/`;
		const state = yield select(collectionState);
		let { data, status } = yield call(
			apiCall,
			{
				api,
			},
			"post",
			{
				user_id: getTTid(),
				access_key,
				collection_id: action?.payload?.collection_id,
			}
		);
		if (status === 200 && data.status_code === 200) {
			yield put(
				setCollectionDetails({
					data: removefromCollection(
						state.collectionList.data,
						action.payload?.collection_id
					),
				})
			);

			action?.payload?.onSuccess && action.payload.onSuccess(data);
		} else {
			action?.payload?.onFailure && action.payload.onFailure();
		}
	} catch (err) {
		action?.payload?.onFailure && action.payload.onFailure();
	}
}

export function* deleteCollectionWatcher() {
	yield takeLatest(DELETE_COLLECTIONS_ASYNC, deleteCollectionAsync);
}
