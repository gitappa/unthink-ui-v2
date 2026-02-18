import axios from "axios";
import { CANCEL } from "redux-saga";

export const apiCall = (params, method = "get", data = {}, config = {}) => {
	const axiosParams = { ...params };
	const api = axiosParams.api;
	delete axiosParams.api;
	let cancel;
	const promise = axios({
		method: method,
		url: api,
		params: axiosParams,
		data,
		...config,
		cancelToken: new axios.CancelToken((c) => {
			cancel = c;
		}),
	});
	// Cancel the request
	promise[CANCEL] = cancel;
	return promise;
};

export const apiInstance = ({
	url,
	method = "get",
	data = {},
	params = {},
	config = {},
}) => {
	let cancel;
	const promise = axios({
		method,
		url,
		params,
		data,
		...config,
		cancelToken: new axios.CancelToken((c) => {
			cancel = c;
		}),
	});
	console.log('promise',promise);
	
	// Cancel the request
	promise[CANCEL] = cancel;
	console.log('promises',promise);

	return promise;
};

export const postApiCall = (params) => {
	const axiosParams = { ...params };
	const api = axiosParams.api;
	delete axiosParams.api;
	let cancel;
	const promise = axios.post(api, {
		...axiosParams,
		cancelToken: new axios.CancelToken((c) => {
			// An executor function receives a cancel function as a parameter
			cancel = c;
		}),
	});

	// Cancel the request
	promise[CANCEL] = cancel;
	return promise;
};

export const putApiCall = (params) => {
	const axiosParams = { ...params };
	const api = axiosParams.api;
	delete axiosParams.api;

	let cancel;
	const promise = axios.put(api, {
		...axiosParams,
		cancelToken: new axios.CancelToken((c) => {
			// An executor function receives a cancel function as a parameter
			cancel = c;
		}),
	});

	// Cancel the request
	promise[CANCEL] = cancel;
	return promise;
};

export const deleteApiCall = (params) => {
	const axiosParams = { ...params };
	const api = axiosParams.api;
	delete axiosParams.api;

	let cancel;
	const promise = axios.delete(api, {
		...axiosParams,
		cancelToken: new axios.CancelToken((c) => {
			// An executor function receives a cancel function as a parameter
			cancel = c;
		}),
	});

	// Cancel the request
	promise[CANCEL] = cancel;
	return promise;
};
