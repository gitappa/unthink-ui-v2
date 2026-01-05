import { takeLatest, call, put } from "redux-saga/effects";

import { setStoreData } from "./actions";
import { GET_CREATOR_STORE_DATA, GET_STORE_DATA } from "./constants";
import { authAPIs } from "../../../helper/serverAPIs";

function* getStoreDataSaga() {
	try {
		const res = yield call(authAPIs.getStoreDetailsAPICall);
		const { data, status } = res;

		if (status === 200 && data.status_code === 200 && data.data?.[0]) {
			yield put(setStoreData(data.data[0]));
		}
	} catch (err) {
		console.error(err);
	}
}

function* getCreatorStoreDataSaga(action) {
	try {
		const res = yield call(authAPIs.getCreatoreStoreDetailsAPICall, action.payload);
		const { data, status } = res;

		if (status === 200 && data.status_code === 200 && data.data?.[0]) {
			yield put(setStoreData(data.data[0]));
		}
	} catch (err) {
		console.error(err);
	}
}

function* storeDataWatcher() {
	yield takeLatest(GET_STORE_DATA, getStoreDataSaga);
	yield takeLatest(GET_CREATOR_STORE_DATA, getCreatorStoreDataSaga);
}

export default { storeDataWatcher };
