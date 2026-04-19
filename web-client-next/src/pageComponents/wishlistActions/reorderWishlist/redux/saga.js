import { takeLatest, call, put } from "redux-saga/effects";
import { notification } from "antd";

import { reorderWishlistSuccess, reorderWishlistFailure } from "./actions";
import { collectionAPIs } from "../../../../helper/serverAPIs";
import {
	getUserCollections,
	replaceSortedUserCollections,
} from "../../../Auth/redux/actions";
import { REORDER_WISHLIST } from "./constants";

function* reorderWishlistSaga(action) {
	const { collections } = action.payload;

	// collections array format
	// collection id list
	// collections = [
	// 	"179545996091997800648397996472026219777",
	// 	"206510613956532416875273527374571344246",
	// 	"214121036773029940994481737712315465128",
	// ];

	try {
		const payload = {
			ordered_collections_id: collections,
		};

		const res = yield call(collectionAPIs.reorderCollectionAPICall, payload);
		const { data, status } = res;

		if (status === 200 && data.status_code === 200) {
			yield put(reorderWishlistSuccess(data));

			if (action.payload.successMessage)
				notification["success"]({ message: action.payload.successMessage });

			if (action.payload.fetchUserCollections) yield put(getUserCollections());

			if (
				action.payload.replaceInUserCollections &&
				action.payload.collectionsWithDetails
			) {
				yield put(
					replaceSortedUserCollections(action.payload.collectionsWithDetails)
				);
			}

			return;
		}

		throw res;
	} catch (err) {
		if (action.payload.errorMessage)
			notification["error"]({ message: action.payload.errorMessage });

		yield put(reorderWishlistFailure(err.data));
	}
}

function* reorderWishlistWatcher() {
	yield takeLatest(REORDER_WISHLIST, reorderWishlistSaga);
}

export { reorderWishlistWatcher };
