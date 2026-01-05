import { takeLatest, call, put, select } from "redux-saga/effects";
import { notification } from "antd";

import { addToWishlistSuccess, addToWishlistFailure } from "./actions";
import { collectionAPIs } from "../../../../helper/serverAPIs";
import { fetchRecommendations } from "../../../recommendations/redux/actions";
import { closeWishlistModal } from "../../../wishlist/redux/actions";
import {
	getUserCollection,
	getUserCollections,
	getUserCollectionSuccess,
	replaceAndUpdateUserCollectionData,
} from "../../../Auth/redux/actions";
import { ADD_TO_WISHLIST } from "./constants";
import { removeFromWishlist } from "../../removeFromWishlist/redux/actions";
import {
	getCurrentUserFavoriteCollection,
	getIsGuestUser,
} from "../../../Auth/redux/selector";
import { rerunApplyWishlistProductsFilter } from "../../applyWishlistProductsFilter/redux/actions";

function* addToWishlistSaga(action) {
	const {
		_id: collection_id,
		products,
		product_lists,
		collection_name,
		type,
		user_id,
		replace,
		showcase,
	} = action.payload;

	try {
		const payload = {
			collection_id,
			products,
			product_lists,
			collection_name,
			type,
			user_id,
			replace,
			showcase,
		};

		const isGuestUser = yield select(getIsGuestUser);
		if (isGuestUser) {
			payload.user_type = "guest";
		}

		// products = [ // products array format
		// 	{
		// 		mfr_code: "aly210121-001-03",
		// 		tagged_by: "tops",
		// 		starred: true, // only for showcase the products
		// 	},
		// ]

		const res = yield call(collectionAPIs.addToCollectionAPICall, payload);

		const { data, status } = res;

		if (status === 200 && data.status_code === 200) {
			yield put(
				addToWishlistSuccess({ ...data, showcase, products, product_lists })
			);

			if (action.payload.successMessage) {
				notification["success"]({ message: action.payload.successMessage });
			}

			if (action.payload.fetchRecommendations)
				yield put(fetchRecommendations());

			if (action.payload.fetchUserCollection) {
				if (data?.data?._id) {
					yield put(replaceAndUpdateUserCollectionData(data.data, true)); // updating data from API response directly to reducer without calling single collection get data API
				} else {
					yield put(getUserCollectionSuccess(data.data[0])); // fetch current auth user's single collection from API
				}
			}

			if (action.payload.rerunApplyWishlistProductsFilter)
				yield put(rerunApplyWishlistProductsFilter());

			if (action.payload.closeModalOnSuccess) yield put(closeWishlistModal());

			if (action.payload.removeFromFavorites) {
				// remove this item from favorites
				const userFavoriteCollection = yield select(
					getCurrentUserFavoriteCollection
				);

				if (userFavoriteCollection && products) {
					yield put(
						removeFromWishlist({
							_id: userFavoriteCollection._id,
							products: products.map((p) => p.mfr_code),
							removeFromUserCollections: true,
						})
					);
				}
			}

			return;
		}

		throw res;
	} catch (err) {
		if (action.payload.errorMessage)
			notification["error"]({ message: action.payload.errorMessage });

		yield put(addToWishlistFailure(err.data));
	}
}

function* addToWishlistWatcher() {
	yield takeLatest(ADD_TO_WISHLIST, addToWishlistSaga);
}

export { addToWishlistWatcher };
