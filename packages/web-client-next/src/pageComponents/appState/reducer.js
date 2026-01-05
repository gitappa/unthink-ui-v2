import { combineReducers } from "redux";
import peopleReducer from "../people/redux/reducer";
import recommendationReducer from "../recommendations/redux/reducer";
import wishlistReducer from "../wishlist/redux/reducer";
import rewardsReducer from "../rewards/redux/reducer";
import similarProductsReducer from "../similarProducts/redux/reducer";
import carouselReducer from "../../components/carousel/redux/reducer";
import appLoaderReducer from "../appLoader/redux/reducer";
import appMessageModalReducer from "../appMessageModal/redux/reducer";
import earnedRewardModalReducer from "../earnedRewardModal/redux/reducer";
import productModalReducer from "../customProductModal/redux/reducer";

const appStateReducer = combineReducers({
	recommendations: recommendationReducer,
	wishlist: wishlistReducer,
	people: peopleReducer,
	rewards: rewardsReducer,
	similarProducts: similarProductsReducer,
	carousel: carouselReducer,
	appLoader: appLoaderReducer,
	appMessageModal: appMessageModalReducer,
	productModal: productModalReducer,
	earnedRewardModal: earnedRewardModalReducer,
});

export default appStateReducer;
