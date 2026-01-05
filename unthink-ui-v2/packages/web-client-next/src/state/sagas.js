import { all, fork } from "redux-saga/effects";
import * as homeSagas from "../pageComponents/Home/redux/Sagas";
import * as collectionSagas from "../pageComponents/Collections/redux/sagas";
import * as chatSagas from "../pageComponents/chat/redux/sagas";
import * as sharedSagas from "../pageComponents/shared/redux/saga";
import authSagas from "../pageComponents/Auth/redux/saga";
import influencerSaga from "../pageComponents/Influencer/redux/saga";
// import collectionPageSaga from "../pageComponents/collectionPage/redux/saga";
import * as appStateSaga from "../pageComponents/appState/saga";
import * as wishlistActionsSagas from "../pageComponents/wishlistActions/redux/saga";
import * as earnedRewardModalSagas from "../pageComponents/earnedRewardModal/redux/saga";
import categoriesSagas from "../pageComponents/categories/redux/saga";
import chatHookSagas from "../hooks/chat/redux/saga";
import storeDataSagas from "../pageComponents/store/redux/saga";
import creatorCollectionWatcherSaga from "../pageComponents/Auth/redux/CreatorSaga";
import collectionDetectSaga from "../pageComponents/createStore/redux/saga";
import  cartSaga  from "../pageComponents/DeliveryDetails/redux/saga";

export default function* rootSaga() {
	yield all(
		[
			...Object.values(homeSagas),
			...Object.values(collectionSagas),
			...Object.values(chatSagas),
			...Object.values(sharedSagas),
			...Object.values(authSagas),
			...Object.values(influencerSaga),
			// ...Object.values(collectionPageSaga),
			...Object.values(appStateSaga),
			...Object.values(categoriesSagas),
			...Object.values(wishlistActionsSagas),
			...Object.values(earnedRewardModalSagas),
			...Object.values(chatHookSagas),
			...Object.values(storeDataSagas),
			...Object.values(creatorCollectionWatcherSaga),
			...Object.values(collectionDetectSaga),
			...Object.values(cartSaga),
		].map(fork)
	);
}
