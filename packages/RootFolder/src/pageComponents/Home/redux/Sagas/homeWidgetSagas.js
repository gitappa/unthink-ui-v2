// REMOVE
import { takeEvery, call, delay, put } from "redux-saga/effects";
import { GET_HOME_PAGE_WIDGET_ASYNC } from "../constants";
import { setHomePageWidget, setHomePageWidgetLoading } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
function* getHomeWidgetsAsync(action) {
	try {
		yield put(
			setHomePageWidgetLoading({
				type: action?.payload?.type ?? "new_arrivals",
				isLoading: true,
			})
		);

		const api = `https://api.yfret.com/productlist/${
			action?.payload?.type ?? "new_arrivals"
		}/`;
		let payload = { ...action.payload };
		let { data, status } = yield call(apiCall, {
			api,
			access_key,
			ipp: 16,
		});
		if (status === 200)
			yield put(
				setHomePageWidget({
					data,
					type: action?.payload?.type ?? "new_arrivals",
				})
			);
	} catch (err) {
	} finally {
		yield put(
			setHomePageWidgetLoading({
				type: action?.payload?.type ?? "new_arrivals",
				isLoading: false,
			})
		);
	}
}

export function* getHomeWidgetWatcher() {
	yield takeEvery(GET_HOME_PAGE_WIDGET_ASYNC, getHomeWidgetsAsync);
}
