import { call, put, takeLatest } from "redux-saga/effects";
import {
    getCreatorCollectionSuccess,
    getCreatorCollectionFailure,
} from "./actions";
import { GET_CREATOR_COLLECTIONS } from "./constants";
import { collectionAPIs } from "../../../helper/serverAPIs";

function* fetchCreatorCollectionSaga() {
    try {
        const response = yield call(collectionAPIs.fetchCreatorCollectionAPICall);
        yield put(getCreatorCollectionSuccess(response.data));
    } catch (error) {
        yield put(getCreatorCollectionFailure(error.message));
    }
}

function* creatorCollectionWatcherSaga() {
    yield takeLatest(GET_CREATOR_COLLECTIONS, fetchCreatorCollectionSaga);
}

export default {
    creatorCollectionWatcherSaga,
};;
