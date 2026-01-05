import { takeLatest, call, put, select } from "redux-saga/effects";
import {
	GET_SINGLE_USER_COLLECTION,
	GET_USER_COLLECTION,
	GET_USER_COLLECTIONS,
	GET_USER_INFO,
	SAVE_USER_INFO,
} from "./constants";
import {
	getSingleUserCollectionFailure,
	getSingleUserCollectionSuccess,
	getUserCollectionFailure,
	getUserCollectionsFailure,
	getUserCollectionsSuccess,
	getUserCollectionSuccess,
	getUserInfoFailure,
	getUserInfoSuccess,
	setIsSavingUserInfo,
} from "./actions";
import { getInfluencerCollectionSuccess } from "../../Influencer/redux/actions";
import {
	authAPIs,
	collectionAPIs,
	profileAPIs,
} from "../../../helper/serverAPIs";
import { getTTid } from "../../../helper/getTrackerInfo";
import { getCollectionsView } from "../../../helper/utils";
import { getAuthUserUserName } from "./selector";
import { customProductsWatcher } from "../../customProducts/redux/saga";
// import { getInfluencerInfoSuccess } from "../../Influencer/redux/actions"; // REMOVE
// import {
// 	authUserState,
// 	sharedUserState,
// } from "../../collectionPage/redux/selectors"; // REMOVE

export function* getUserInfoData() {
	try {
		let { data, status } = yield call(authAPIs.getUserInfoAPICall);
		if (status === 200 && data?.status_code === 200 && data?.data?.user_id) {
			yield put(
				getUserInfoSuccess(data.data, {
					resetCollections: true,
				})
			);
			// const authUser = yield select(authUserState); // REMOVE
			// const sharedUser = yield select(sharedUserState);
			// if (
			// 	authUser?.data?.user_id &&
			// 	sharedUser?.data?.user_id &&
			// 	authUser?.data?.user_id === sharedUser?.data?.user_id
			// ) {
			// 	yield put(getInfluencerInfoSuccess(data));
			// }
		} else
			yield put(
				getUserInfoSuccess(
					{
						user_id: getTTid(),
					},
					{
						resetCollections: true,
					}
				)
			);
	} catch (err) {
		console.log(err);
		yield put(getUserInfoFailure(err));
	}
}

export function* saveUserInfoData(action) {
	try {
		yield put(setIsSavingUserInfo(true));
		let { data, status } = yield call(profileAPIs.saveUserInfoAPICall, {
			profileData: action.payload.userInfo,
		});
		if (status === 200 && data?.status_code === 200 && data?.data?.user_id) {
			{
				yield put(
					getUserInfoSuccess(data.data, {
						resetCollections: action.payload.resetCollections ?? true,
					})
				);
				action.payload.onSuccess && action.payload.onSuccess();

				// if (window) window.location.href = "/store/";
			}
		} else {
			yield put(getUserInfoFailure(data));
			action.payload.onFailure && action.payload.onFailure();
		}
	} catch (err) {
		yield put(getUserInfoFailure(err));
		action.payload.onFailure && action.payload.onFailure();
	} finally {
		yield put(setIsSavingUserInfo(false));
	}
}

export function* userInfoWatcher() {
	yield takeLatest(GET_USER_INFO, getUserInfoData);
	yield takeLatest(SAVE_USER_INFO, saveUserInfoData);
}

// collections saga
function* fetchUserCollectionsSaga(action) {
	try {
		const authUserUserName = yield select(getAuthUserUserName);

		const { product_limits, summary, view = getCollectionsView(authUserUserName), Mystatus, ipp, current_page } =
			action.payload;

		const params = { user_id: getTTid(), product_limits, view, summary, status: Mystatus, ipp, current_page };

		const { data = {}, status } = yield call(
			collectionAPIs.fetchCollectionsAPICall,
			params
		);

		if (status === 200) {
			console.log("data.data", data.data);

			yield put(getUserCollectionsSuccess(data.data || [], data.count, params));
		}
	} catch (err) {
		console.error(err);
		yield put(getUserCollectionsFailure());
	}
}

// single collection saga
function* fetchUserCollectionSaga(action) {
	try {
		const {
			_id: collection_id,
			product_sort_by,
			product_sort_order,
			product_limits
		} = action.payload;



		const params = {
			// user_id: getTTid(),
			collection_id,
			product_sort_by,
			product_sort_order,
			product_limits
		};

		const { data = {}, status } = yield call(
			collectionAPIs.fetchCollectionsAPICall,
			params
		);

		if (status === 200 && data.data) {
			const collData = data.data[0]
				? {
					...data.data[0],
					detailed: true,
				}
				: {};
			yield put(getUserCollectionSuccess(collData));
			yield put(getInfluencerCollectionSuccess(collData));
		}
	} catch (err) {
		console.error(err);
		yield put(getUserCollectionFailure());
	}
}

function* fetchUserSingleCollectionSaga(action) {
	try {
		const {
			_id: collection_id,
			product_sort_by,
			product_sort_order,
			product_limits
		} = action.payload;



		const params = {
			// user_id: getTTid(),
			collection_id,
			product_sort_by,
			product_sort_order,
			product_limits
		};

		const { data = {}, status } = yield call(
			collectionAPIs.fetchCollectionsAPICall,
			params
		);

		if (status === 200 && data.data) {
			const collData = data.data[0]
				? {
					...data.data[0],
					detailed: true,
				}
				: {};
			yield put(getSingleUserCollectionSuccess(collData));
		}
	} catch (err) {
		console.error(err);
		yield put(getSingleUserCollectionFailure());
	}
}

export function* userCollectionsWatcher() {
	yield takeLatest(GET_USER_COLLECTIONS, fetchUserCollectionsSaga);
	yield takeLatest(GET_USER_COLLECTION, fetchUserCollectionSaga);
	yield takeLatest(GET_SINGLE_USER_COLLECTION, fetchUserSingleCollectionSaga);
}

export default {
	userInfoWatcher,
	userCollectionsWatcher,
	customProductsWatcher,
	// getUserInfoData,
};
