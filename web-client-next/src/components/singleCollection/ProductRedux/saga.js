import { call, put } from "redux-saga/effects";
import {
  FETCH_PRODUCT_DETAILS_SUCCESS,
  FETCH_PRODUCT_DETAILS_FAILURE,
} from "./constants";
import { takeLatest } from "redux-saga/effects";
import { FETCH_PRODUCT_DETAILS } from "./constants";
import { customProductsAPIs } from "../../../helper/serverAPIs";
 
function* fetchProductDetailsSaga(action) {
    // console.log('sss');
    
  try {
    const { mfr_code, image } = action.payload;
 
    const res = yield call(
      customProductsAPIs.fetchProductDetailsAPICall,
      mfr_code,
      image
    );
  // console.log('fdsfdsffds',image);


    if (res && res.status === 200 && res.data) {
      // console.log('dfdfdgf',res.data);
      
      yield put({
        type: FETCH_PRODUCT_DETAILS_SUCCESS,
        payload: res.data,
      });
    } else {
      yield put({ type: FETCH_PRODUCT_DETAILS_FAILURE });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: FETCH_PRODUCT_DETAILS_FAILURE });
  }
}



export default function* watchProductDetails() {
  yield takeLatest(FETCH_PRODUCT_DETAILS, fetchProductDetailsSaga);
}
 