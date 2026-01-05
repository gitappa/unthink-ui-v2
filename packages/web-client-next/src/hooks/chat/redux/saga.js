import { takeLatest, put } from "redux-saga/effects";

import { setLocalChatMetadata } from "../../../helper/utils";
import {
	SET_AURA_CHAT_SETTING,
	SET_CHAT_SEARCH_TYPE,
	SET_SHOW_CHAT_MODAL,
} from "./constants";

import { resetAuraSearchResponse } from "./actions";

function* setAuraChatSettingToLocal(action) {
	try {
		// const {
		// 	gender,
		// 	age_group,
		// 	color,
		// aura_template_tags,
		// aura_template_desc,
		// cc_template_tags,
		// cc_template_desc,
		// blog_tag_template,
		// video_tags_template,
		// image_cc_template,
		// aura_ctl_desc,
		// aura_ctl_tags,
		// image_ctl_aura,
		// aura_stl_desc,
		// aura_stl_tags,
		// image_stl_aura,
		// aura_ss_desc,
		// aura_ss_tags,
		// cc_video_desctags,
		// 	cc_text,
		// 	cc_image,
		// 	cc_blog,
		// 	cc_video,
		// 	cc_shortvideo,
		// 	aura_text_ss,
		// 	aura_text_stl,
		// 	aura_text_ctl,
		// 	aura_image_stl,
		// 	aura_image_ctl,
		// 	activeChatSearchType,
		// } = action.payload;

		const { payload, localPayload } = action;
		const data = localPayload || payload;

		setLocalChatMetadata(data);
	} catch (err) {}
}

function* setChatSearchTypeToLocal(action) {
	try {
		const { payload } = action;

		setLocalChatMetadata({
			activeChatSearchType: payload,
		});
	} catch (err) {}
}

// on chat modal open and close every time this saga called with true or false value
function* setShowChatModal(action) {
	try {
		if (!action.payload) {
			yield put(resetAuraSearchResponse()); // reset AURA search response when close modal
		}
	} catch (err) {}
}

export function* chatSettingsWatcher() {
	yield takeLatest(SET_AURA_CHAT_SETTING, setAuraChatSettingToLocal);
	yield takeLatest(SET_CHAT_SEARCH_TYPE, setChatSearchTypeToLocal);
	yield takeLatest(SET_SHOW_CHAT_MODAL, setShowChatModal);
}

export default {
	chatSettingsWatcher,
};
