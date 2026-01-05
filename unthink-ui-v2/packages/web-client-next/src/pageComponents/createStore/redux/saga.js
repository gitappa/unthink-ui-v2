import { call, put, takeLatest } from "redux-saga/effects";
import { GET_STORED_ATTRIBUTES, UPDATE_STORED_ATTRIBUTE_POOL } from "./constants";
import { collectionAPIs, customProductsAPIs } from "../../../helper/serverAPIs";
import { getStoredAttributesFailure, getStoredAttributeSuccess, updateStoredAttributePoolFailure, updateStoredAttributePoolSuccess } from "./action";

function* fetchPoolSaga(action) {
    console.log("GET_STORED_ATTRIBUTES", action.payload);
    try {
        const response = yield call(collectionAPIs.FetchPoolKeyApi, action.payload);
        console.log(response);
        yield put(getStoredAttributeSuccess(response?.data?.data));
    } catch (error) {
        yield put(getStoredAttributesFailure(error.message));
    }
}

function* updatePoolSaga(action) {
    console.log("UPDATE_STORED_ATTRIBUTE_POOL", action.payload);
    try {
        const response = yield call(customProductsAPIs.updatePoolAPICall, action.payload);
        console.log("updatePoolAPICall", response.data);
        yield put(updateStoredAttributePoolSuccess(response?.data));
    } catch (error) {
        yield put(updateStoredAttributePoolFailure(error.message));
    }
}


function* collectionDetectSaga() {
    yield takeLatest(GET_STORED_ATTRIBUTES, fetchPoolSaga);
    yield takeLatest(UPDATE_STORED_ATTRIBUTE_POOL, updatePoolSaga);
}

export default {
    collectionDetectSaga,
};
