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
	getwishlistUserCollection,
	removeProductsFromUserCollections,
} from "../../../Auth/redux/actions";
import { REMOVE_FROM_WISHLIST } from "./constants";
import { removeProductsFromAppliedFiltersUserCollection } from "../../applyWishlistProductsFilter/redux/actions";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);

function* removeFromWishlistSaga(action) {
	const { _id: collection_id, products,store, deleted_tag,wishlistCallBack ,user_id,type,collection_name } = action.payload;

	try {
		const payload = {
			collection_id,
			products,
			deleted_tag,
			collection_name,
			type,
			user_id,
			store
		};
		// products: ["aly210121-001-03"] // products format
		const res = yield call(collectionAPIs.removeFromCollectionAPICall, payload);
		const { data, status } = res;
		if (status === 200 && data.status_code === 200) {
			yield put(removeFromWishlistSuccess({ ...data, products }));
			// console.log("removeFromWishlistSaga",  status_desc,data);
			if (action.payload.successMessage)
				notification["success"]({ message: data.status_desc });

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
			if (action.payload.wishlistCallBack) yield put(getwishlistUserCollection({ path: `my_wishlist_${user_id  }` }));
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
