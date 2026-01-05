import { takeLatest, call, put, select } from "redux-saga/effects";
import { notification } from "antd";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);

import { deleteWishlistSuccess, deleteWishlistFailure } from "./actions";
import { collectionAPIs } from "../../../../helper/serverAPIs";
import { DELETE_WISHLIST } from "./constants";
import { getIsGuestUser } from "../../../Auth/redux/selector";
import { getUserCollections, removeCollectionFromUserCollection } from "../../../Auth/redux/actions";
import {
	setSelectedCollectionData,
	setSelectedWishlistId,
} from "../../../wishlist/redux/actions";
import { current_store_name } from "../../../../constants/config";
import { FETCH_COLLECTIONS_PRODUCT_LIMIT } from "../../../../constants/codes";

function* deleteWishlistSaga(action) {
	try {

		const collectionIds = action.payload._id

		const params = {
			collection_id: collectionIds,
			store: current_store_name
		};

		const payload = {};

		const isGuestUser = yield select(getIsGuestUser);
		if (isGuestUser) {
			payload.user_type = "guest";
		}

		const res = yield call(
			collectionAPIs.deleteCollectionAPICall,
			params,
			payload
		);
		const { data, status } = res;

		if (status === 200 && data.status_code === 200) {
			if (action.payload.successMessage)
				// showing success message if coming from action
				notification["success"]({ message: action.payload.successMessage });

			yield put(deleteWishlistSuccess(data));
			yield put(getUserCollections({
				product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT,
				summary: true
			}))

			// clearing selected collection data and id to close collection details sidebar
			if (action.payload.clearSelectedCollectionData) {
				yield put(setSelectedCollectionData(null));
				yield put(setSelectedWishlistId(""));
			}

			if (action.payload.removeCollectionFromUserCollections) {
				yield put(
					removeCollectionFromUserCollection({ _id: action.payload._id })
				);
			}

			if (action.payload.redirectToPathOnSuccess)
				navigate(action.payload.redirectToPathOnSuccess); // redirect to given path on success

			return;
		} else {
			if (action.payload.errorMessage)
				notification["error"]({
					message: data.status_desc || action.payload.errorMessage,
				});
		}

		throw res;
	} catch (err) {
		if (action.payload.errorMessage)
			notification["error"]({ message: action.payload.errorMessage });

		yield put(deleteWishlistFailure(err.data || {}));
	}
}

function* deleteWishlistWatcher() {
	yield takeLatest(DELETE_WISHLIST, deleteWishlistSaga);
}

export { deleteWishlistWatcher };
