// REMOVE
import { takeLatest, call, delay, put } from "redux-saga/effects";
import { GET_COLLECTION_PRODUCTS_ASYNC } from "../constants";
import {
	setCollectionProductsFetching,
	setCollectionProducts,
} from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getTTid } from "../../../../helper/getTrackerInfo";
function* getCollectionProductsAsync(action) {
	try {
		yield put(setCollectionProductsFetching(true));
		const mfrcode_list = JSON.stringify(
			action.payload?.map((data) => data.mfr_code) ?? []
		);
		const api = `https://api.yfret.com/fetch_details/fetch_by_mfr/`;
		let { data, status } = yield call(apiCall, {
			api,
			access_key,
			mfrcode_list: mfrcode_list,
		});
		if (status === 200) yield put(setCollectionProducts(data.data));
	} catch (err) {
		console.log(err);
	} finally {
		yield put(setCollectionProductsFetching(false));
	}
}

export function* getCollectionProductsWatcher() {
	yield takeLatest(GET_COLLECTION_PRODUCTS_ASYNC, getCollectionProductsAsync);
}
