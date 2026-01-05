import { call, put, select, takeLatest } from "redux-saga/effects";
import { notification } from "antd";

import {
	FETCH_CUSTOM_PRODUCTS,
	REMOVE_CUSTOM_PRODUCTS,
	UPDATE_CUSTOM_PRODUCTS,
} from "./constants";
import { collectionAPIs, customProductsAPIs } from "../../../helper/serverAPIs";
import {
	fetchCustomProducts,
	fetchCustomProductsSuccess,
	fetchCustomProductsFailure,
	removeCustomProductsSuccess,
	removeCustomProductsFailure,
	removeProductsFromSavedCustomProducts,
	updateCustomProductsSuccess,
	updateCustomProductsFailure,
} from "./actions";

function* fetchCustomProductsSaga(action) {

	const { product_sort_by, product_sort_order, filters, ipp, current_page } = action.payload

	console.log("current_page in saga", current_page);

	try {
		const payload = {
			product_sort_by,
			product_sort_order,
			filters,
			ipp,
			current_page
		};

		console.log("current_page", current_page);


		const res = yield call(
			collectionAPIs.fetchSortProductsAPICall,
			payload
		);

		const { data, status } = res;

		if (status === 200 && data?.status_code === 200 && data.data) {
			yield put(fetchCustomProductsSuccess(data));
		} else {
			yield put(fetchCustomProductsFailure());
		}
	} catch {
		yield put(fetchCustomProductsFailure());
	}
}

function* removeCustomProductsSaga(action) {
	try {
		const {
			mfr_codes,
			product_sort_by,
			product_sort_order,
			filters,
			ipp,
			current_page
		} = action.payload;

		const payload = { mfr_codes };

		const authUser = yield select((state) => state.auth.user.data);

		// const payload2 = {
		// 	product_sort_by,
		// 	product_sort_order,
		// 	filters: { "brand": authUser?.user_name, "custom_product": true },
		// 	ipp,
		// 	current_page
		// }

		const res = yield call(
			customProductsAPIs.removeCustomProductsAPICall,
			payload
		);

		if (res?.status === 200 && res?.data?.status_code === 200) {
			notification.success({
				message: "Product(s) deleted successfully",
			});

			yield put(removeProductsFromSavedCustomProducts(mfr_codes));
			yield put(removeCustomProductsSuccess());
			// yield put(fetchCustomProducts(payload2));

		} else {
			notification.error({
				message: "Unable to delete product(s), please try again later.",
			});

			yield put(removeCustomProductsFailure());
		}
	} catch (err) {
		console.error("Error in removeCustomProductsSaga:", err); // Debugging log

		notification.error({
			message: "Unable to delete product(s), please try again later.",
		});

		yield put(removeCustomProductsFailure());
	}
}



function* updateCustomProductsSaga(action) {
	const { product_lists, user_id } = action;

	try {
		const res = yield call(
			customProductsAPIs.updateCustomProductsAPICall,
			product_lists,
			user_id
		);

		const { data, status } = res;

		if (status === 200 && data?.status_code === 200) {
			notification["success"]({
				message: "Product changes saved",
			});

			yield put(updateCustomProductsSuccess(data));
		} else {
			notification["error"]({
				message: "Unable to update product, please try after sometime",
			});

			yield put(updateCustomProductsFailure());
		}
	} catch (err) {
		// Show error message if there's any exception or failure
		notification["error"]({
			message: "Unable to update product, please try after sometime",
		});
		yield put(updateCustomProductsFailure());
	}
}


export function* customProductsWatcher() {
	yield takeLatest(FETCH_CUSTOM_PRODUCTS, fetchCustomProductsSaga);
	yield takeLatest(REMOVE_CUSTOM_PRODUCTS, removeCustomProductsSaga);
	yield takeLatest(UPDATE_CUSTOM_PRODUCTS, updateCustomProductsSaga);
}
