import { takeLatest, call, put, select } from "redux-saga/effects";
import { GET_CHAT_PRODUCTS_ASYNC } from "../constants";
import {
	setChatProductPage,
	updateChatProducts,
	updateChatProductsLoading,
	setChatProductPageNo,
} from "../actions";
import { apiCall } from "../../../../helper/apiCall";
import { access_key } from "../../../../constants/config";
const chatState = (state) => state.chat;
function* getChatProductAsync(action) {
	try {
		yield put(updateChatProductsLoading(true));
		const state = yield select(chatState);
		const api = `${state.productUrl}`;
		const url = new URL(api);
		let apiUrl = url.origin + url.pathname;
		let urlParams = {};
		for (const [key, value] of url.searchParams) {
			urlParams[key] = value;
		}
		let { data, status } = yield call(apiCall, {
			api: apiUrl,
			...urlParams,
			access_key,
			current_page: state.currentPage,
		});
		if (status === 200) {
			yield put(setChatProductPage(state.currentPage + 1));
			yield put(updateChatProducts(data));
			yield put(setChatProductPageNo(state?.pageNo + 1));
			action?.payload?.onSuccess &&
				action?.payload?.onSuccess(data?.data ?? []);
		} else {
			action?.payload?.onFailure && action?.payload?.onFailure();
		}
	} catch (err) {
		console.log(err);
		action?.payload?.onFailure && action?.payload?.onFailure();
	} finally {
		yield put(updateChatProductsLoading(false));
	}
}

export function* getHomeWidgetWatcher() {
	yield takeLatest(GET_CHAT_PRODUCTS_ASYNC, getChatProductAsync);
}
