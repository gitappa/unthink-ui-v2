import { notification } from "antd";
import { call, takeLatest } from "redux-saga/effects";
import { collectionAPIs } from "../../../helper/serverAPIs";
import {
  FETCH_MY_TRYONS_COLLECTION,
  FETCH_MY_WISHLIST_COLLECTION,
} from "./constant";

function showNoWishlistWarning() {
  notification.warning({
    message: "No wishlist found",
  });
}

function showNoTryonsWarning() {
  notification.warning({
    message: "No Try ons Collections found.",
  });
}

function* fetchMyWishlistCollectionSaga(action) {
  try {
    const { currentUser, router } = action.payload || {};

    if (!currentUser?.user_id || !currentUser?.user_name) {
      showNoWishlistWarning();
      return;
    }

    const params = {
      path: `my_wishlist_${currentUser.user_id}`,
    };

    const { data = {}, status } = yield call(
      collectionAPIs.fetchCollectionsAPICall,
      params,
    );

    const collections = data.data || [];
    // console.log('collections',collections.product_lists?.length)
    if (status !== 200 || !collections?.product_lists?.length) {
      showNoWishlistWarning();
      return;
    }

    router.push(`/influencer/${currentUser.user_name}/${collections[0]._id}`);
  } catch (err) {
    console.error(err);
    showNoWishlistWarning();
  }
}

function* fetchMyTryonsCollectionSaga(action) {
  try {
    const { authUser, router } = action.payload || {};

    if (!authUser?.user_id || !authUser?.user_name) {
      showNoTryonsWarning();
      return;
    }

    const params = {
      collection_name: "my tryons",
      user_id: authUser.user_id,
      type: "system",
    };

    const { data = {}, status } = yield call(
      collectionAPIs.fetchCollectionsAPICall,
      params,
    );

    const collections = data.data || [];
// console.log(collections[0]?.product_lists?.length);

    if (status !== 200 || !collections[0]?.product_lists?.length) {
      showNoTryonsWarning();
      return;
    }

    router.push(`/influencer/${authUser.user_name}/${collections[0]._id}`);
  } catch (err) {
    console.error(err);
    showNoTryonsWarning();
  }
}

export default function* myWishlistWatcher() {
  yield takeLatest(FETCH_MY_WISHLIST_COLLECTION, fetchMyWishlistCollectionSaga);
  yield takeLatest(FETCH_MY_TRYONS_COLLECTION, fetchMyTryonsCollectionSaga);
}

