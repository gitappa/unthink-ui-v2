const gTagEvent = "event";

const event_collection_page_view = "collection_page_view";
const event_shop_widget_click = "shop_widget_click";
const event_collection_product_click = "collection_product_click";
const event_aura_product_click = "aura_product_click";

export const gTagCollectionPageView = (data) => {
	if (typeof window === "undefined" || !window.location?.href) {
		return "";
	}
	// let collection_id = data._id && data._id.toString();

	console.log(data);

	const {
		collection_path,
		collection_status,
		user_id,
		user_name,
		collection_id,
		Clickpage,
	} = data;

	const mainUrl = window.location.href;
	const url = new URL(mainUrl);
	const platform =
		typeof navigator !== "undefined" && navigator.userAgentData?.mobile !== undefined
			? navigator.userAgentData.mobile
				? "mobile"
				: "web"
			: typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
				? "mobile"
				: "web";

	// UTM params
	url.searchParams.set("utm_source", "unthink");
	url.searchParams.set("utm_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("utm_campaign", collection_id);
	// url.searchParams.set('utm_term', term);
	url.searchParams.set("utm_content", Clickpage);
	// unthink params
	url.searchParams.set("unthink_source", Clickpage);
	url.searchParams.set("unthink_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("unthink_campaign", collection_id);
	// url.searchParams.set('unthink_shared', shared_id || '');
	// url.searchParams.set('unthink_term', term);

	const og_url = url.href;
	console.log(og_url);

	let user = user_id;
	if (user && user_name) {
		user = user + "|" + user_name;
	}

	console.log(user);

	window.gtag &&
		window.gtag(gTagEvent, event_collection_page_view, {
			collection_path,
			collection_status,
			user,
			collection_id,
			og_url,
		});

	window.history?.replaceState?.({}, "", og_url);

	return url.toString();
};

export const gTagCollectionProductClick = (data) => {
	if (typeof window === "undefined" || !window.location?.href) {
		return "";
	}
	const Clickpage =
		typeof sessionStorage !== "undefined"
			? sessionStorage.getItem("clickPage")
			: null;

	const {
		mft_code,
		collection_path,
		user_id,
		user_name,
		collection_id,
		collection_name,
	} = data;

	console.log(data);

	const mainUrl = window.location.href;
	const url = new URL(mainUrl);
	const platform =
		typeof navigator !== "undefined" && navigator.userAgentData?.mobile !== undefined
			? navigator.userAgentData.mobile
				? "mobile"
				: "web"
			: typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
				? "mobile"
				: "web";

	// UTM params
	url.searchParams.set("utm_source", "unthink");
	url.searchParams.set("utm_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("utm_campaign", collection_id);
	// url.searchParams.set('utm_term', term);
	url.searchParams.set("utm_content", Clickpage);
	// unthink params
	url.searchParams.set("unthink_source", Clickpage);
	url.searchParams.set("unthink_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("unthink_campaign", collection_id);
	// url.searchParams.set('unthink_shared', shared_id || '');
	// url.searchParams.set('unthink_term', term);

	let user = user_id;
	if (user && user_name) {
		user = user + "|" + user_name;
	}

	const og_url = url.href;
	console.log(og_url);
	console.log(user);

	window.gtag &&
		window.gtag(gTagEvent, event_collection_product_click, {
			mft_code,
			collection_path,
			user,
			collection_id,
			collection_name,
			og_url,
		});

	window.history?.replaceState?.({}, "", og_url);

	return url.toString();
};

export const gTagAuraProductClick = (data) => {
	if (typeof window === "undefined" || !window.location?.href) {
		return "";
	}
	const { mft_code, aura_widget, user_id, user_name, term } = data;

	console.log(data);

	const mainUrl = window.location.href;
	const url = new URL(mainUrl);
	const platform =
		typeof navigator !== "undefined" && navigator.userAgentData?.mobile !== undefined
			? navigator.userAgentData.mobile
				? "mobile"
				: "web"
			: typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
				? "mobile"
				: "web";

	// UTM params
	url.searchParams.set("utm_source", "unthink");
	url.searchParams.set("utm_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("utm_campaign", aura_widget);
	url.searchParams.set("utm_term", term);
	url.searchParams.set("utm_content", "unthink_aura_widget");
	// unthink params
	url.searchParams.set("unthink_source", "unthink_aura_widget");
	url.searchParams.set("unthink_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("unthink_campaign", aura_widget);
	// url.searchParams.set("unthink_shared", shared_id || "");
	url.searchParams.set("unthink_term", term);

	let user = user_id;
	if (user && user_name) {
		user = user + "|" + user_name;
	}

	const og_url = url.href;

	console.log(user);
	console.log(og_url);

	window.gtag &&
		window.gtag(gTagEvent, event_aura_product_click, {
			mft_code,
			aura_widget,
			user,
			term,
			og_url,
		});

	window.history?.replaceState?.({}, "", og_url);

	return url.toString();
};

export const gTagShopWidgetClick = (data) => {
	if (typeof window === "undefined" || !window.location?.href) {
		return "";
	}
	const {
		collection_path,
		collection_status,
		shared_id,
		user,
		collection_id,
		term
	} = data;

	console.log(data);

	const mainUrl = window.location.href;
	const url = new URL(mainUrl);
	const platform =
		typeof navigator !== "undefined" && navigator.userAgentData?.mobile !== undefined
			? navigator.userAgentData.mobile
				? "mobile"
				: "web"
			: typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
				? "mobile"
				: "web";

	// UTM params
	url.searchParams.set("utm_source", "unthink");
	url.searchParams.set("utm_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("utm_campaign", collection_id);
	// url.searchParams.set("utm_term", term);
	url.searchParams.set("utm_content", "unthink_collection_carousel");
	// unthink params
	url.searchParams.set("unthink_source", "unthink_collection_carousel");
	url.searchParams.set("unthink_medium", platform || ""); // 'web' or 'mobile'
	url.searchParams.set("unthink_campaign", collection_id);
	// url.searchParams.set("unthink_shared", shared_id || "");
	// url.searchParams.set("unthink_term", term);

	const og_url = url.href;

	console.log(og_url);

	// if (window.gtag) {
	// 	window.gtag(gTagEvent, event_shop_widget_click, {
	// 		collection_id,
	// 		collection_path,
	// 		collection_status,
	// 		user,
	// 		shared_id,
	// 		term,
	// 		og_url,
	// 	});
	// }

	// window.history.replaceState({}, "", og_url);

	// return url.toString();
};
