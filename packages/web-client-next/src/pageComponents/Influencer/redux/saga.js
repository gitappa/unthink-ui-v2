import { takeLatest, call, put, select } from "redux-saga/effects";

import {
	GET_INFLUENCER_COLLECTION,
	GET_INFLUENCER_COLLECTIONS,
	GET_INFLUENCER_INFO,
} from "./constants";
import {
	getInfluencerInfoSuccess,
	getInfluencerCollectionsSuccess,
	getInfluencerInfoFailure,
	getInfluencerCollectionsFailure,
	getInfluencerCollectionSuccess,
	getInfluencerCollectionFailure,
} from "./actions";

import { authAPIs, collectionAPIs } from "../../../helper/serverAPIs";
import { getAuthUserUserName } from "../../Auth/redux/selector";
import { getCollectionPageView } from "../../../helper/utils";
import { getUserId } from "../../../helper/getTrackerInfo";
import { getSingleUserCollectionSuccess, getUserCollectionsSuccess, getUserCollectionSuccess } from "../../Auth/redux/actions";

function* getUserInfoDataAsync(action) {
	try {
		let { data, status } = yield call(
			authAPIs.getUserInfoAPICall,
			action?.payload
		);

		if (status === 200 && data.data?.user_id)
			yield put(getInfluencerInfoSuccess(data.data));
		else yield put(getInfluencerInfoFailure());
	} catch (err) {
		yield put(getInfluencerInfoFailure());
	}
}

// collections saga
function* fetchCollections(action) {
	// const authUserUserName = yield select(getAuthUserUserName);

	const authUserId = getUserId(); // logged in user id

	const {
		user_id,
		collection_id,
		store,
		path,
		isStoreHomePage,
		collection_theme,
		product_limits,
		ipp,
		current_page
	} = action.payload;

	const view = getCollectionPageView(user_id === authUserId, isStoreHomePage);

	const params = {
		user_id,
		collection_id,
		store,
		path,
		product_limits: 12,
		view: !collection_theme ? view : undefined,
		collection_theme,
		ipp,
		current_page
	};

	try {
		const { data = {}, status } = yield call(
			collectionAPIs.fetchCollectionsAPICall,
			params
		);

		if (status === 200)
			yield put(getInfluencerCollectionsSuccess(data.data || [], data.count, params));
		else yield put(getInfluencerCollectionsFailure());
	} catch (err) {
		yield put(getInfluencerCollectionsFailure());
	}
}

// single collection saga
function* fetchCollection(action) {
	// const authUserUserName = yield select(getAuthUserUserName);
	const authUserId = getUserId(); // logged in user id
	const {
		user_id,
		collection_id,
		store,
		path,
		isStoreHomePage,
		product_sort_by,
		product_sort_order,
	} = action.payload;

	// const view = getCollectionPageView(user_id === authUserId, isStoreHomePage);

	const params = {
		user_id,
		collection_id,
		store,
		path,
		// view,
		product_sort_by,
		product_sort_order,
	};

	try {
		const { data = {}, status } = yield call(
			collectionAPIs.fetchCollectionsAPICall,
			params
		);

		if (status === 200 && data.data) {
			yield put(getUserCollectionsSuccess(data.data));
			const collData = data.data[0]
				? {
					...data.data[0],
					detailed: true,
				}
				: {};
			yield put(getInfluencerCollectionSuccess(collData));
			yield put(getSingleUserCollectionSuccess(collData));
		} else {
			yield put(getInfluencerCollectionFailure());
		}
	} catch (err) {
		yield put(getInfluencerCollectionFailure());
	}
}

export function* influencerWatcher() {
	yield takeLatest(GET_INFLUENCER_INFO, getUserInfoDataAsync);
	yield takeLatest(GET_INFLUENCER_COLLECTIONS, fetchCollections);
	yield takeLatest(GET_INFLUENCER_COLLECTION, fetchCollection);
}

export default {
	influencerWatcher,
};
