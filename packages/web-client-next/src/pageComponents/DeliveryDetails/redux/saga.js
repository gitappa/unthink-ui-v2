import { call, put, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import { collectionAPIs } from "../../../helper/serverAPIs";

import {
  ADD_TO_CART,
  FETCH_CART,
  REMOVE_FROM_CART,
  
} from "./constant";

import {
  addToCartSuccess,
  addToCartFailure,
  fetchCartSuccess,
  fetchCartFailure,
  removeFromCartSuccess,
  removeFromCartFailure,
  
} from "./action";



// ✅ ADD TO CART Saga
function* addToCartSaga(action) {
  try {
    const payload = {
      ...action.payload,
      // domain_store: "pujaboxes",
      // is_display_amount: true,
    };

    const response = yield call(collectionAPIs.addToCollectionAPICall, payload);
    const data = response?.data?.data?.[0] || response?.data?.data;

    // console.log("addToCartSaga", data);

    if (data?._id) {
      localStorage.setItem("mycartcollectionid", data._id);
      message.success("Cart updated successfully!");
    }
    yield put(addToCartSuccess(data));
  } catch (error) {
    console.error("❌ addToCartSaga error:", error);
    message.error("Failed to update cart");
    yield put(addToCartFailure(error));
  }
}

// ✅ FETCH CART Saga
function* fetchCartSaga(action) {
  try {
    const response = yield call(collectionAPIs.fetchCollectionsAPICall, {
      is_display_amount: true,
      path: action.payload.collection_path,
    })
    console.log("fetchCartSagaresponse", response.data.data);
    

    const data =
      response?.data?.data && response?.data?.data?.length
        ? response?.data?.data[0] ||   response?.data?.data[1]
        : null; 
        console.log('dsdsdsdsdsdsd', data);

    yield put(fetchCartSuccess(data));
  } catch (error) {
    console.error("❌ fetchCartSaga error:", error);
    yield put(fetchCartFailure(error));
  }
}

// ✅ REMOVE PRODUCTS Saga
function* removeProductsSaga(action) {
  try {
    const payload = {
      ...action.payload,
      is_display_amount: true,
    };

    const response = yield call(collectionAPIs.removeFromCollectionAPICall, payload);
    const data = response?.data?.data;

    console.log("🔔 removeProductsSaga response data:", data);

    if (data?.collection_id) {
      localStorage.setItem("mycartcollectionid", data.collection_id);
      message.success("Products removed successfully!");
    }

    yield put(removeFromCartSuccess(data));
  } catch (error) {
    console.error("❌ removeProductsSaga error:", error);
    message.error("Failed to remove products");
    yield put(removeFromCartFailure(error));
  }
}

// ✅ Export all sagas (important for Object.values in rootSaga)
export function* cartSaga() {
  yield takeLatest(ADD_TO_CART, addToCartSaga);
  yield takeLatest(FETCH_CART, fetchCartSaga);
  yield takeLatest(REMOVE_FROM_CART, removeProductsSaga);
}
export default {
  cartSaga
};
