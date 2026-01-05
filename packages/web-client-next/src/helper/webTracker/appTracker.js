import { getCurrentHostname, getCurrentUrl, URLAddParam } from "../utils";
// import trackerAPI from "./trackerAPI"; // removed tracking API calls for now as some API work to be done
import {
	getIsAppVisited,
	getIsNewUser,
	setIsAppVisited,
	setIsNewUser,
} from "../getTrackerInfo";

export default {
	onVisit: ({ ...rest } = {}) => {
		// console.log("getIsAppVisited() : ", getIsAppVisited());
		// console.log("window.sessionStorage : ", window.sessionStorage);
		if (!getIsAppVisited()) {
			const params = {
				object_type: "website",
				action_type: "visit",
				object_id: getCurrentHostname(), // current page url hostname
				...rest,
			};

			if (getIsNewUser()) {
				params.new_user = true;
				setIsNewUser();
			}

			// trackerAPI({ // removed tracking API calls for now as some API work to be done
			// 	params,
			// });
			setIsAppVisited();
		}
	},
	onCreateNewWishlist: ({
		collectionId,
		iCode = "UTH-DIRECT",
		campCode,
		referrerICode = "UTH-DIRECT",
		...rest
	}) => {
		const currentUrl = getCurrentUrl();
		const params = {
			["og:url"]: currentUrl,
			object_type: "create_collection",
			action_type: "view",
			object_id: collectionId,
			influencer_code: iCode,
			campaign_code: campCode || "UTHUNCAMP",
			...rest,
		};

		if (referrerICode && params["og:url"]) {
			params["og:url"] = URLAddParam(
				params["og:url"],
				"yfret_utm_source",
				referrerICode
			);
		}

		// trackerAPI({ // removed tracking API calls for now as some API work to be done
		// 	params,
		// });
	},
	onAddItemToWishlist: ({
		mfrCode,
		collectionId,
		product_brand,
		brand,
		iCode = "UTH-DIRECT",
		campCode,
		collectionName,
		collectionICode = "UTH-DIRECT",
		...rest
	}) => {
		const currentUrl = getCurrentUrl();

		const params = {
			["og:url"]: currentUrl,
			object_type: "product",
			action_type: "add_to_collection",
			object_id: mfrCode, //product.mfr_code
			collection_id: collectionId, // in which we are adding the product
			product_brand,
			brand,
			influencer_code: iCode,
			campaign_code: campCode || (collectionId && "UTHUNCAMP"),
			...rest,
		};

		if (params["og:url"]) {
			if (collectionICode) {
				params["og:url"] = URLAddParam(
					params["og:url"],
					"yfret_utm_source",
					collectionICode
				);
			}

			if (collectionName) {
				params["og:url"] = URLAddParam(
					params["og:url"],
					"yfret_utm_campaign",
					collectionName
				);
			}
		}

		// trackerAPI({ // removed tracking API calls for now as some API work to be done
		// 	params,
		// });
	},
	onSignUpSuccess: ({ user_id, emailId, iCode = "UTH-DIRECT", ...rest }) => {
		const params = {
			tt_id: user_id,
			object_id: emailId,
			user_id: emailId,
			influencer_code: iCode,
			user_type: "email",
			object_type: "user",
			action_type: "register",
			new_user: "true",
			...rest,
		};

		// trackerAPI({ // removed tracking API calls for now as some API work to be done
		// 	params,
		// });
	},
};
