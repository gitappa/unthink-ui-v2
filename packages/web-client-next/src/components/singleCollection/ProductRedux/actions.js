import { FETCH_PRODUCT_DETAILS, FETCH_PRODUCT_DETAILS_FAILURE, FETCH_PRODUCT_DETAILS_SUCCESS } from "./constants";

export const fetchProductDetails = (payload) => ({
  type: FETCH_PRODUCT_DETAILS,
  payload, // { mfr_code, image }
});

export const fetchProductDetailsSuccess = (payload) => ({
  type: FETCH_PRODUCT_DETAILS_SUCCESS,
  payload,
});

export const fetchProductDetailsFailure = () => ({
  type: FETCH_PRODUCT_DETAILS_FAILURE,
});
