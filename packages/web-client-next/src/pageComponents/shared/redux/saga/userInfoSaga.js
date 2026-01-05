// REMOVE
import { takeLatest, call, put } from "redux-saga/effects";
import { GET_USER_INFO_ASYNC } from "../constants";
import { setUserInfoFetching, setUserInfo } from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
import { getTTid } from "../../../../helper/getTrackerInfo";
function* getUserInfoDataAsync(action) {
	try {
		yield put(setUserInfoFetching(true));

		const api = `https://api.yfret.com/users/get_user_info/`;
		const payload = {
			api,
			access_key,
		};
		if (action?.payload?.userId) {
			payload.user_id = action?.payload?.userId;
		} else if (action?.payload?.user_name) {
			payload.user_name = action?.payload?.user_name;
		} else {
			payload.user_id = getTTid();
		}
		let { data, status } = yield call(apiCall, payload);
		if (status === 200 && data?.data?.user_id) yield put(setUserInfo(data));
		else yield put(setUserInfo({ data: { user_id: payload.user_id } }));
	} catch (err) {
		console.log(err);
	} finally {
		yield put(setUserInfoFetching(false));
	}
}

export function* getUserInfoWatcher() {
	yield takeLatest(GET_USER_INFO_ASYNC, getUserInfoDataAsync);
}
