import { call, put, takeLatest } from "redux-saga/effects";
import { message } from "antd";
import {
  collectionAPIs,
  CreateBadgeApiCall,
  EarningPointsApiCall,
} from "../../../helper/serverAPIs";
import { collectionQRCodeGenerator } from "../../../helper/utils";

import {
  ADD_TO_CART,
  CREATE_LOYALTY_BADGE,
  FETCH_EARNING_POINTS,
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
  createLoyaltyBadgeSuccess,
  createLoyaltyBadgeFailure,
  fetchEarningPointsSuccess,
  fetchEarningPointsFailure,
  
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
    const data = response?.data?.data || response?.data?.data?.[0] || response?.data?.data?.[1];
    // console.log("response", data)
    // console.log("ssssssssss", response)

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
    // console.log("fetchCartSagaresponse", response.data.data);
    

    const data =
      response?.data?.data && response?.data?.data?.length
        ? response?.data?.data[1] ||   response?.data?.data[0]
        : null; 
        // console.log('dsdsdsdsdsdsd', data);

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

    // console.log("🔔 removeProductsSaga response data:", data);

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

function* createLoyaltyBadgeSaga(action) {
  try {
    const response = yield call(CreateBadgeApiCall, {
      name: action.payload?.name ,
      points: action.payload?.points ,
      badge_image_url: action.payload?.badge_image_url,
      qr_page_url: collectionQRCodeGenerator(
        action.payload?.qr_page_url  
      ),
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const imageUrl = URL.createObjectURL(blob);

    yield put(createLoyaltyBadgeSuccess(imageUrl));
  } catch (error) {
    console.error("Error fetching loyalty badge:", error.response?.data || error);
    yield put(createLoyaltyBadgeFailure(error.response?.data || error));
  }
}

function* fetchEarningPointsSaga(action) {
  try {
    const response = yield call(EarningPointsApiCall, {
      user_id: action.payload?.user_id,
      store_name: action.payload?.store_name,
    });
    const data = response?.data?.data ?? response?.data;
 console.log('dfdbfd',data?.events[0]);
 
    yield put(fetchEarningPointsSuccess(data?.events[0]));
  } catch (error) {
    console.error("Error fetching earning points:", error.response?.data || error);
    yield put(fetchEarningPointsFailure(error.response?.data || error));
  }
}

// ✅ Export all sagas (important for Object.values in rootSaga)
export function* cartSaga() {
  yield takeLatest(ADD_TO_CART, addToCartSaga);
  yield takeLatest(FETCH_CART, fetchCartSaga);
  yield takeLatest(REMOVE_FROM_CART, removeProductsSaga);
  yield takeLatest(CREATE_LOYALTY_BADGE, createLoyaltyBadgeSaga);
  yield takeLatest(FETCH_EARNING_POINTS, fetchEarningPointsSaga);
}
export default {
  cartSaga
};
