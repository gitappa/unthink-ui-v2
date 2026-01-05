import { takeLatest, call, put, select } from "redux-saga/effects";
import { notification } from "antd";

import {
	applyWishlistProductsFilterSuccess,
	applyWishlistProductsFilterFailure,
	applyWishlistProductsFilter,
} from "./actions";
import { collectionAPIs } from "../../../../helper/serverAPIs";
import { getAppliedFiltersActionData } from "./selectors";
import {
	getUserCollections,
	replaceAndUpdateUserCollectionData,
} from "../../../Auth/redux/actions";
import {
	APPLY_WISHLIST_PRODUCTS_FILTER,
	RERUN_APPLY_WISHLIST_PRODUCTS_FILTER,
} from "./constants";

function* applyWishlistProductsFilterSaga(action) {
	const { _id: collection_id, filters, clear = false } = action.payload;

	try {
		let res;
		if (clear) {
			res = yield call(
				collectionAPIs.clearCollectionProductsFilterAPICall,
				collection_id
			);
		} else {
			const payload = {
				collection_id,
				filters,
			};

			// filters format
			// filters = {
			// 	brand: ["Colorescience"],
			// 	product_brand: ["Strole"],
			// 	discount: ["above 20"],
			// 	price: {
			// 		min: 0,
			// 		max: 217,
			// 	},
			// };

			res = yield call(
				collectionAPIs.applyCollectionProductsFilterAPICall,
				payload
			);
		}

		const { data, status } = res;

		if (status === 200 && data.status_code === 200) {
			yield put(applyWishlistProductsFilterSuccess(data.data, action.payload));

			if (
				action.payload.replaceAndUpdateUserCollectionData &&
				data.data &&
				data.data._id
			)
				yield put(replaceAndUpdateUserCollectionData(data.data));

			if (action.payload.fetchUserCollections) yield put(getUserCollections());

			if (action.payload.successMessage)
				notification["success"]({ message: action.payload.successMessage });

			return;
		}

		throw res;
	} catch (err) {
		if (action.payload.errorMessage)
			notification["error"]({ message: action.payload.errorMessage });

		yield put(applyWishlistProductsFilterFailure(err.data));
	}
}

function* rerunApplyWishlistProductsFilterSaga() {
	try {
		const appliedFiltersActionData = yield select(getAppliedFiltersActionData);

		if (appliedFiltersActionData._id) {
			yield put(applyWishlistProductsFilter(appliedFiltersActionData));
		}
	} catch (err) {}
}

function* applyWishlistProductsFilterWatcher() {
	yield takeLatest(
		APPLY_WISHLIST_PRODUCTS_FILTER,
		applyWishlistProductsFilterSaga
	);
	yield takeLatest(
		RERUN_APPLY_WISHLIST_PRODUCTS_FILTER,
		rerunApplyWishlistProductsFilterSaga
	);
}

export { applyWishlistProductsFilterWatcher };
