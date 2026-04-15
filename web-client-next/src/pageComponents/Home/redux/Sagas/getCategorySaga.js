// REMOVE
import { takeEvery, call, delay, put } from "redux-saga/effects";
import { GET_HOME_PAGE_CATEGORY_ASYNC } from "../constants";
import { setHomePageCategory, setHomePageCategoryLoading } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
function* getHomeCategoryAsync(action) {
	try {
		yield put(setHomePageCategoryLoading(true));

		const api = `https://api.yfret.com/category/`;
		let { data, status } = yield call(apiCall, {
			api,
			access_key,
			ipp: 16,
		});
		if (status === 200) yield put(setHomePageCategory(data?.data ?? []));
	} catch (err) {
		console.log(err);
	} finally {
		yield put(setHomePageCategoryLoading(false));
	}
}

export function* getHomeCategoryWatcher() {
	yield takeEvery(GET_HOME_PAGE_CATEGORY_ASYNC, getHomeCategoryAsync);
}
