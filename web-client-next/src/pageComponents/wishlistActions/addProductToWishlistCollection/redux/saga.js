import { takeLatest, call, put, select } from "redux-saga/effects";
import { notification } from "antd";
import {
  addProductToWishlistCollectionSuccess,
  addProductToWishlistCollectionFailure,
} from "./actions";
import { wishlistCollectionAPIs } from "../../../../helper/serverAPIs";
import { getAuthUserData, getIsGuestUser } from "../../../Auth/redux/selector";
import { ADD_PRODUCT_TO_WISHLIST_COLLECTION } from "./constants";

function* addProductToWishlistCollectionSaga(action) {
  const {
    mfr_code,
    product_name,
    product_image,
    successMessage = "Product added to wishlist successfully!",
    errorMessage = "Failed to add product to wishlist. Please try again.",
    store,
    eventId,
    user_id,
  } = action.payload;

  try {
    // Get authenticated user data from Redux
    // const authUser = yield select(getAuthUserData);
    const isGuestUser = yield select(getIsGuestUser);
    // const user_id = authUser?.user_id;

    // Validate required fields
    if (!user_id) {
      throw new Error("User ID is required to add product to wishlist");
    }

    if (!mfr_code || !product_name || !product_image) {
      throw new Error("Product details (mfr_code, name, image) are required");
    }

    // Prepare the payload
    const payload = {
      collection_type: "my_wishlist_collection",
      status: "published",
      collection_name: "my wishlist",
      user_id,
      store: store || "dothelook",
      Event_id: eventId,
      product_lists: [
        {
          mfr_code,
          name: product_name,
          image: product_image,
        },
      ],
    };

    if (isGuestUser) {
      payload.user_type = "guest";
    }

    // Call the API
    const res = yield call(
      wishlistCollectionAPIs.addProductToWishlistCollectionAPICall,
      payload,
    );

    const { data, status } = res;

    if (status === 200 && data?.status_code === 200) {
      yield put(addProductToWishlistCollectionSuccess(data));

      if (successMessage) {
        notification.success({
          message: "Success",
          description: successMessage,
          duration: 2,
        });
      }

      return;
    }

    throw new Error(data?.status_desc || "Failed to add product to wishlist");
  } catch (err) {
    console.error("[Wishlist Collection] Error:", err);

    const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.status_desc ||
      err.message ||
      errorMessage;

    yield put(addProductToWishlistCollectionFailure(errorMsg));

    notification.error({
      message: "Error",
      description: errorMsg,
      duration: 2,
    });
  }
}

function* addProductToWishlistCollectionWatcher() {
  yield takeLatest(
    ADD_PRODUCT_TO_WISHLIST_COLLECTION,
    addProductToWishlistCollectionSaga,
  );
}

export { addProductToWishlistCollectionWatcher };
