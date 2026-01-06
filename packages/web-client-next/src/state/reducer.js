import { combineReducers } from "redux";

import chatReducer from "../pageComponents/chat/redux/chatReducer";
import homeReducer from "../pageComponents/Home/redux/homeReducer";
import collectionsReducer from "../pageComponents/Collections/redux/collectionReducer";
import SharedReducer from "../pageComponents/shared/redux/reducer";
import authReducer from "../pageComponents/Auth/redux/reducer";
import chatReducerV2 from "../hooks/chat/redux/reducer";
import influencerReducer from "../pageComponents/Influencer/redux/reducer";
// import collectionPageReducer from "../pageComponents/collectionPage/redux/reducer";
import appStateReducer from "../pageComponents/appState/reducer";
import categoriesReducer from "../pageComponents/categories/redux/reducer";
import productDetailsCopyModalReducer from "../pageComponents/productDetailsCopyModal/redux/reducer";
import collectionShareModalReducer from "../pageComponents/collectionShareModal/redux/reducer";
import wishlistActionsReducer from "../pageComponents/wishlistActions/redux/reducer";
import storeReducer from "../pageComponents/store/redux/reducer";
import autoCreateCollectionModalReducer from "../pageComponents/autoCreateCollectionModal/redux/reducer";
import showMoreReducer from "../pageComponents/collectionPage/redux/reducer";
import GuestPopUpReducer from "../pageComponents/Auth/redux/GuestReducer";
import creatorCollectionReducer from "../pageComponents/Auth/redux/CreatorReducer";
import attributePoolReducer from "../pageComponents/createStore/redux/reducer";
import { cartReducer } from "../pageComponents/DeliveryDetails/redux/reducer";

const rootReducer = combineReducers({
	chat: chatReducer,
	home: homeReducer,
	collections: collectionsReducer,
	shared: SharedReducer,
	auth: authReducer,
	chatV2: chatReducerV2,
	influencer: influencerReducer,
	showMoreReducer: showMoreReducer,
	GuestPopUpReducer: GuestPopUpReducer,
	creatorCollection: creatorCollectionReducer,
	attributePool: attributePoolReducer,
	// collectionPage: collectionPageReducer,
	appState: appStateReducer,
	store: storeReducer,
	categories: categoriesReducer,
	productDetailsCopyModal: productDetailsCopyModalReducer, // handle modal to show image url and redirect url of product and copy
	collectionShareModal: collectionShareModalReducer, // handle modal to show image url and redirect url of product and copy
	autoCreateCollectionModal: autoCreateCollectionModalReducer, // handle modal to create and share collection
	wishlistActions: wishlistActionsReducer, // handle wishlist (collection) actions only like, API call
	cart:cartReducer,
});

export default rootReducer;
