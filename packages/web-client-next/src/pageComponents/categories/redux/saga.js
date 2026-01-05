import { takeLatest, call, put, select } from "redux-saga/effects";

// import {
// 	// category_widget_type_suggestion_chip,
// 	COOKIE_DEBUG_VIEW_ADMIN_VIEW,
// } from "../../../constants/codes";
// import { getDebugViewCookie } from "../../../helper/getTrackerInfo";

import { categoriesAPIs } from "../../../helper/serverAPIs";
import { fetchCategoriesFailure, fetchCategoriesSuccess } from "./actions";
import {
	getAuthAdminList,
	getAuthUserData,
	getAuthUserUserId,
	getAuthUserUserName,
} from "../../Auth/redux/selector";
import {
	adminUserId,
	is_store_instance,
	super_admin,
	current_store_name,
} from "../../../constants/config";
import { FETCH_CATEGORIES } from "./constants";

function* fetchCategoriesAPICall(action) {
	try {
		const authUserUserId = yield select(getAuthUserUserId);
		const authUserUser = yield select(getAuthUserData);
		const authUserUserName = yield select(getAuthUserUserName);
		const admin_list = yield select(getAuthAdminList);

		const email = authUserUser?.emailId;
		const isEmailAdmin = admin_list?.includes(email);

		const isAdminLoggedIn =
			authUserUserId === adminUserId || isEmailAdmin ||
			(is_store_instance && authUserUserName === super_admin);

		const params = {
			// starred: true,
			store: is_store_instance ? current_store_name : undefined,
		};

		if (isAdminLoggedIn) {
			params.view = "admin";
		}

		const { data } = yield call(categoriesAPIs.fetchCategoriesAPICall, params);
		if (data?.status_code === 200 && data?.data) {
			let list = [...data.data];

			yield put(fetchCategoriesSuccess(list, action.metadata));
		} else {
			yield put(fetchCategoriesFailure());
		}
	} catch {
		yield put(fetchCategoriesFailure());
	}
}

export function* categoriesWatcher() {
	yield takeLatest(FETCH_CATEGORIES, fetchCategoriesAPICall);
}

export default {
	categoriesWatcher,
};
