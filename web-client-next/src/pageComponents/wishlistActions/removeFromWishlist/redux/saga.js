import { takeLatest, call, put } from "redux-saga/effects";
import { notification } from "antd";

import {
	removeFromWishlistSuccess,
	removeFromWishlistFailure,
} from "./actions";
import { collectionAPIs } from "../../../../helper/serverAPIs";
import { closeWishlistModal } from "../../../wishlist/redux/actions";
import {
	getUserCollection,
	getUserCollections,
	getUserCollectionSuccess,
	removeProductsFromUserCollections,
} from "../../../Auth/redux/actions";
import { REMOVE_FROM_WISHLIST } from "./constants";
import { removeProductsFromAppliedFiltersUserCollection } from "../../applyWishlistProductsFilter/redux/actions";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);

function* removeFromWishlistSaga(action) {
	const { _id: collection_id, products, deleted_tag } = action.payload;

	try {
		const payload = {
			collection_id,
			products,
			deleted_tag,
		};
		// products: ["aly210121-001-03"] // products format
		const res = yield call(collectionAPIs.removeFromCollectionAPICall, payload);
		const { data, status } = res;
		if (status === 200 && data.status_code === 200) {
			yield put(removeFromWishlistSuccess({ ...data, products }));

			if (action.payload.successMessage)
				notification["success"]({ message: action.payload.successMessage });

			if (action.payload.removeFromUserCollections)
				yield put(removeProductsFromUserCollections(collection_id, products));

			if (action.payload.removeFromAppliedFiltersUserCollection)
				yield put(
					removeProductsFromAppliedFiltersUserCollection(
						collection_id,
						products
					)
				);
			if (status === 200 && data.status_code === 200) yield put(getUserCollectionSuccess(data.data));

			if (action.payload.closeModalOnSuccess) yield put(closeWishlistModal());
			return;
		}


		throw res;
	} catch (err) {
		if (action.payload.errorMessage)
			notification["error"]({ message: action.payload.errorMessage });

		yield put(removeFromWishlistFailure(err.data));
	}
}

function* removeFromWishlistWatcher() {
	yield takeLatest(REMOVE_FROM_WISHLIST, removeFromWishlistSaga);
}

export { removeFromWishlistWatcher };
