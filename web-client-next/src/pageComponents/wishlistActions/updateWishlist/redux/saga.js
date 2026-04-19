import { takeLatest, call, put, select } from "redux-saga/effects";
import { notification } from "antd";

import {
	collectionAPIs,
	collectionPageAPIs,
} from "../../../../helper/serverAPIs";
import {
	updateWishlist,
	updateWishlistFailure,
	updateWishlistSuccess,
} from "./actions";
import {
	COLLECTION_GENERATED_BY_BLOG_BASED,
	COLLECTION_GENERATED_BY_DESC_BASED,
	EARNED_REWARD_MODAL_TYPES,
	PUBLISHED,
} from "../../../../constants/codes";
import { UPDATE_WISHLIST } from "./constants";
import {
	getSingleUserCollectionSuccess,
	getUserCollection,
	getUserCollections,
	getUserCollectionSuccess,
	replaceAndUpdateUserCollectionData,
	setStarredUserCollections,
	setUpdatedStatusUserCollections,
} from "../../../Auth/redux/actions";
import { addToWishlist } from "../../addToWishlist/redux/actions";
import {
	getAuthUserCollections,
	getAuthUserUserId,
	getAuthUserVenlyUser,
	getIsGuestUser,
} from "../../../Auth/redux/selector";
import { showAppMessage } from "../../../appMessageModal/redux/actions";
import { checkIsFavoriteCollection } from "../../../../helper/utils";
import { validateAndShowEarnedNFTReward } from "../../../earnedRewardModal/redux/actions";
import { is_store_instance } from "../../../../constants/config";
import { replaceAndUpdateInfluencerCollectionData } from "../../../Influencer/redux/actions";

function* updateWishlistSaga(action) {
	const {
		_id,
		user_name,
		collection_name,
		description,
		description_old,
		cover_image,
		tags,
		keyword_tag_map,
		status,
		enableReRun,
		enableReFetchProducts,
		generated_by,
		image_url,
		blog_url,
		video_url,
		starred,
		path,
		attributesData = {},
		product_sort_by,
		product_sort_order,
		collection_theme,
		userbrand,
		profile_image,
		cover_image_coordinates,
		whistListPublish,
	} = action.payload;

	try {
		const payload = {
			cover_image_coordinates,
			collection_id: _id,
			user_name,
			collection_name,
			description,
			description_old,
			cover_image,
			tags,
			keyword_tag_map,
			status,
			image_url,
			blog_url,
			video_url,
			starred,
			path,
			product_sort_by,
			product_sort_order,
			collection_theme,
			profile_image,
			userMetadata: { brand: userbrand },
			...attributesData,
		};

		const isGuestUser = yield select(getIsGuestUser);
		if (isGuestUser) {
			payload.user_type = "guest";
		}

		// const isCollectionPageOwner = yield select(enablePlist); // REMOVE

		// if (isCollectionPageOwner && action?.payload?.blog_url) { // REMOVE
		// 	payload.collection = "blog_collection";
		// 	payload.blog_url = action?.payload?.blog_url;
		// 	payload.collection_name = action?.payload?.collection_name;
		// 	payload.store = yield select(getCurrentUserStore);
		// }

		if (enableReRun) {
			// fetch attributes based on the description and the blog entered and send the same in the create collection API
			const getAttributesPayload = {
				tags,
			};

			if (generated_by === COLLECTION_GENERATED_BY_DESC_BASED) {
				getAttributesPayload.description = description;
			} else if (generated_by === COLLECTION_GENERATED_BY_BLOG_BASED) {
				getAttributesPayload.blog_url = blog_url;
			}

			let attrResponse = yield call(
				collectionPageAPIs.getAttributesAPICall,
				getAttributesPayload
			);

			if (attrResponse.data && attrResponse.data.status_code === 200) {
				if (attrResponse.data.data.tags) {
					payload.tags = attrResponse.data.data.tags;
				}

				if (attrResponse.data.data.description) {
					payload.description_old = payload.description;
					payload.description = attrResponse.data.data.description;
				}

				if (attrResponse.data.data.show_filters) {
					payload.show_filters = attrResponse.data.data.show_filters;
				}
			}
		}

		let res = yield call(collectionAPIs.updateCollectionAPICall, payload);
		let { data: resData } = res;
		
		if (resData.status_code === 200) {
			// let showFiltersToSave; // REMOVE

			if (enableReFetchProducts && tags?.length) {
				// fetch products based on the tags and save it with add to collection API
				// took this inside to fix the intermittent issue of loosing the updated tags

				let productsResponse = yield call(
					collectionPageAPIs.fetchProductsAPICall,
					{
						tags,
						try_gpt: "no",
						replace: true,
						complete: true,
						collection_id: _id,
					}
				);

				if (
					productsResponse.data &&
					productsResponse.data.status_code === 200 &&
					productsResponse.data.data &&
					productsResponse.data.data.data &&
					productsResponse.data.data.data._id
				) {
					yield put(
						replaceAndUpdateUserCollectionData(productsResponse.data.data.data)
					);

					// REMOVE
					// const productsToAdd = productsResponse.data.data.data.map((pr) => ({
					// 	mfr_code: pr.mfr_code,
					// 	tagged_by: pr.tagged_by || [],
					// }));
					// const addToWishlistPayload = {
					// 	_id,
					// 	products: productsToAdd,
					// 	replace: true,
					// 	fetchUserCollection: true, // fetch collections after success add to collection
					// };
					// showFiltersToSave = productsResponse.data.data.show_filters;
					// yield put(addToWishlist(addToWishlistPayload));
				}
			}

			if (action.payload.fetchUserCollections) yield put(getUserCollections()); // fetch current auth user's all collections from API

			if (action.payload.fetchUserCollection) {
				if (resData?.data?._id) {
					yield put(replaceAndUpdateUserCollectionData(resData.data, true)); // updating data from API response directly to reducer without calling single collection get data API
					yield put(
						replaceAndUpdateInfluencerCollectionData(resData.data, true)
					); // updating data from API response directly to reducer without calling single collection get data API
				} else {
					yield put(getUserCollectionSuccess(resData.data[0])); // fetch current auth user's single collection from API
				}
			}

			yield put(updateWishlistSuccess(resData));
			if (!whistListPublish) {
				yield put(getSingleUserCollectionSuccess(resData.data[0])); // fetch current auth user's single collection from API
			}

			// REMOVE	
			// if (showFiltersToSave) {
			// 	const editPayload = {
			// 		_id,
			// 		attributesData: {
			// 			show_filters: showFiltersToSave,
			// 		},
			// 		fetchUserCollection: true, // fetch collections after success add to collection
			// 	};

			// 	yield put(updateWishlist(editPayload));
			// }

			if (action.payload.successMessage)
				// showing success message if coming from action
				notification["success"]({ message: action.payload.successMessage });

			if (
				!is_store_instance &&
				action.payload.checkForNFTReward &&
				status === PUBLISHED
			) {
				const authUserUserId = yield select(getAuthUserUserId);
				const authUserVenlyUser = yield select(getAuthUserVenlyUser);
				const authUserCollections = yield select(getAuthUserCollections);

				if (
					!localStorage.getItem(`level1NFTClaimed${authUserUserId}`) &&
					authUserCollections.filter((data) => !checkIsFavoriteCollection(data))
						.length >= 1
				) {
					// a separate saga call to check and then only show the claim or success modal
					yield put(
						validateAndShowEarnedNFTReward(
							EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT,
							{
								checkForNFTRewardShowNotification:
									!!action.payload.checkForNFTRewardShowNotification,
							}
						)
					);
				}
			}

			if (action.payload.successAppMessage) {
				// showing success message on app message modal if coming from action
				yield put(
					showAppMessage(
						action.payload.successAppMessage.title,
						action.payload.successAppMessage.message
					)
				);
			}

			if (action.payload.updateStatusInUserCollections && status)
				yield put(setUpdatedStatusUserCollections(_id, status)); // set current auth user's collection status in redux state

			if (
				action.payload.setStarredUserCollections &&
				typeof starred === "boolean"
			)
				// set current auth user's collection starred value without fetching collections from API
				yield put(setStarredUserCollections([{ _id: _id }], starred));

			return;
			// notification["success"]({ // REMOVE
			// 	message: `${WISHLIST_TITLE} Updated Successfully!`,
			// });
			// yield put(getUserCollections());
			// yield put(setIsupdateWishlist(false));
			// yield put(setShowWishlistProducts(true));
		} else {
			// notification["error"]({ // REMOVE
			// 	message: `Unable to update ${WISHLIST_TITLE}`,
			// });
		}

		throw res;
	} catch (error) {
		if (action.payload.errorMessage)
			notification["error"]({ message: action.payload.errorMessage });
		yield put(updateWishlistFailure(error.data));
	}
}

function* updateWishlistWatcher() {
	yield takeLatest(UPDATE_WISHLIST, updateWishlistSaga);
}

export { updateWishlistWatcher };
