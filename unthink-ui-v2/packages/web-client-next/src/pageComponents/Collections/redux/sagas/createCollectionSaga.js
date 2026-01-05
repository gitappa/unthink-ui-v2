// REMOVE
import { takeLatest, call, delay, put, select } from "redux-saga/effects";
import { CREATE_COLLECTIONS_ASYNC } from "../constants";
import { setCreatingCollection } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getTTid } from "../../../../helper/getTrackerInfo";
import { getCurrentUrl } from "../../../../helper/utils";
import {
	getCreateCollectionAPI,
	getProductsListFromCollections,
} from "../../collectionsUtils";

function* createCollectionAsync(action) {
	try {
		yield put(setCreatingCollection(true));
		let payload;
		if (action.payload.isSharedCreateCollection) {
			const collectionList = yield select(
				(state) => state?.collections?.collectionList?.data ?? []
			);
			const product_list = getProductsListFromCollections(
				collectionList,
				action.payload.collections
			);

			const {
				name = "",
				description = "",
				collOwnerUserId,
				expert_name = "",
				user_name = "",
			} = action?.payload || {};

			payload = {
				access_key,
				expert_id: getTTid(),
				user_id: collOwnerUserId,
				expert_name,
				fname: user_name,
				shared_page: getCurrentUrl(),
				name,
				description,
				type: "shared", // constant for shared collections
				product_list,
			};
		} else {
			payload = {
				user_id: getTTid(),
				access_key,
				name: action?.payload?.name ?? "",
				description: action?.payload?.description ?? "",
				is_influencer: false,
				type: "custom",
			};
		}

		const api = `https://api.yfret.com${getCreateCollectionAPI(
			action.payload.isSharedCreateCollection
		)}`;
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
	} catch (err) {
		action?.payload?.onFailure && action.payload.onFailure();
	} finally {
		yield put(setCreatingCollection(false));
	}
}

export function* createCollectionWatcher() {
	yield takeLatest(CREATE_COLLECTIONS_ASYNC, createCollectionAsync);
}
