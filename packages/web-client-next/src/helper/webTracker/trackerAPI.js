// import axios from "axios";

// import { access_key } from "../../constants/config";
// import {
// 	getIsRegistered,
// 	getPrevSid,
// 	getSid,
// 	getTimeStamp,
// 	getTrackerEventId,
// 	getTTid,
// 	getTz,
// 	getUserEmail,
// 	setTrackerEventId,
// } from "../getTrackerInfo";
// import { generateRandomNumber, getCurrentUrl } from "../utils";

// const baseURL = "https://track.yfret.com";
// const defaultUrl = "/event/";

// const webTrackerInstance = axios.create({
// 	baseURL,
// });

// webTrackerInstance.interceptors.response.use(
// 	function (response) {
// 		// Any status code that lie within the range of 2xx cause this function to trigger
// 		if (response.data.id) setTrackerEventId(response.data.id);
// 		return response;
// 	},
// 	function (error) {
// 		// Any status codes that falls outside the range of 2xx cause this function to trigger
// 		return Promise.reject(error);
// 	}
// );

// const getDefaultParams = () => {
// 	const defaultParams = {
// 		"api_version": "1.1.0",
// 		"sid": getSid(),
// 		"tz": getTz(),
// 		"tt_id": getTTid(),
// 		"og:url": getCurrentUrl(),
// 		"when": getTimeStamp(),
// 		"user_type": getIsRegistered() ? "email" : "guest", // if registered user = email else guest
// 		"event_id": getTrackerEventId(),
// 		// "event_id":
// 		// 	"" +
// 		// 	generateRandomNumber() +
// 		// 	generateRandomNumber() +
// 		// 	generateRandomNumber(), // "Random number of length ... like, 286029134881183921341855413455088088802"
// 		"user_id": getIsRegistered() ? getUserEmail() : undefined, // if user_type is registered then user_id is required / if user_type is guest ignore this field"
// 		access_key,
// 	};
// 	if (getPrevSid() !== "null" && getPrevSid() !== null) {
// 		defaultParams.prev_sid = getPrevSid();
// 	}
// 	return defaultParams;
// };

// export default ({
// 	// removed tracking API calls for now as some API work to be done
// 	url = defaultUrl,
// 	method = "get",
// 	data = {},
// 	params,
// 	config = {},
// }) =>
// 	webTrackerInstance({
// 		method,
// 		url,
// 		params: {
// 			...getDefaultParams(),
// 			...params,
// 		},
// 		data,
// 		...config,
// 	});
