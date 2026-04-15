import { call, put, select, takeLatest } from "redux-saga/effects";
import { notification } from "antd";

import { similarProductsAPIs } from "../../../helper/serverAPIs";
import {
	fetchSimilarProductsFailure,
	fetchSimilarProductsSuccess,
	setShowSimilar,
} from "./actions";
import { FETCH_SIMILAR_PRODUCTS } from "./constants";

function* similarProductsAPICall(action) {
	const productMfr = yield select(
		(state) => state.appState.similarProducts.productMfr
	);
	const currentSimilarProducts = yield select(
		(state) => state.appState.similarProducts.similarProducts
	);

	yield put(setShowSimilar(true)); // opening similar products below drawer modal

	const { mfr_code, name } = action.payload;

	if (productMfr === mfr_code && currentSimilarProducts.length) {
		yield put(
			fetchSimilarProductsSuccess(action.payload, currentSimilarProducts)
		);
	} else if (mfr_code && name) {
		try {
			let { data, status } = yield call(
				similarProductsAPIs.fetchSimilarProductsAPICall,
				{
					product_name: name,
				}
			);

			if (status === 200 && data?.data?.products) {
				yield put(
					fetchSimilarProductsSuccess(action.payload, data.data.products)
				);
			} else {
				yield put(fetchSimilarProductsFailure());
			}
		} catch (err) {
			if (action.payload.errorMessage)
				notification["error"]({ message: action.payload.errorMessage });
			yield put(fetchSimilarProductsFailure());
		}
	}
}

export function* similarProductsWatcher() {
	yield takeLatest(FETCH_SIMILAR_PRODUCTS, similarProductsAPICall);
}
