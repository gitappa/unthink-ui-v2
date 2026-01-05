import { getCurrentUrl, URLAddParam } from "../utils";
// import trackerAPI from "./trackerAPI"; // removed tracking API calls for now as some API work to be done

export default {
	onPageView: ({
		object_id,
		iCode = "UTH-DIRECT",
		collectionICode = "UTH-DIRECT",
		cCode,
		collectionName,
		campCode,
		...rest
	}) => {
		const currentUrl = getCurrentUrl();
		const params = {
			object_type: "shared_page",
			action_type: "view",
			["og:url"]: currentUrl,
			object_id, // shared page owner id
			influencer_code: iCode,
			campaign_code: campCode || "UTHUNCAMP",
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
	onCollectionClick: ({ object_id, iCode, cCode, ...rest }) => {
		const params = {
			object_type: "shared_collection",
			action_type: "view",
			object_id, // collection id of the collection which user clicked
			...rest,
		};

		if (iCode && cCode) {
			if (typeof window !== "undefined" && window.location) {
				params["og:url"] =
					window.location.origin +
					window.location.pathname +
					window.location.search +
					(window.location.search == "" ? "?" : "&") +
					`yfret_utm_source=${iCode}/${cCode}`; // yfret_utm_source=owner's influencer code"/company_code
			}
		}

		// trackerAPI({ // removed tracking API calls for now as some API work to be done
		// 	params,
		// });
	},
	onCollectionProductClick: ({
		mfrCode,
		iCode = "UTH-DIRECT",
		campCode,
		collectionICode = "UTH-DIRECT",
		collectionId,
		product_brand,
		brand,
		collectionName,
		...rest
	}) => {
		const currentUrl = getCurrentUrl();
		const params = {
			["og:url"]: currentUrl,
			object_type: "product",
			action_type: "view",
			object_id: mfrCode,
			collection_id: collectionId,
			product_brand,
			brand,
			influencer_code: iCode,
			campaign_code: campCode || (collectionId && "UTHUNCAMP"),
			user: {}, // kept it as it is for now
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
	onCollectionBannerClick: ({
		image,
		iCode = "UTH-DIRECT",
		campCode,
		collectionICode = "UTH-DIRECT",
		collectionId,
		collectionName,
		sponsored,
		...rest
	}) => {
		const currentUrl = getCurrentUrl();
		const params = {
			["og:url"]: currentUrl,
			object_type: "banner",
			action_type: "view",
			object_id: image,
			collection_id: collectionId,
			influencer_code: iCode,
			campaign_code: campCode || (collectionId && "UTHUNCAMP"),
			sponsored,
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
};
