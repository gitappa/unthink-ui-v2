import { SHOW_APP_MESSAGE, CLOSE_APP_MESSAGE } from "./constants";
import { APP_MESSAGE_MODAL_TYPES } from "../../../constants/codes";

export const showAppMessage = (
	title = "",
	message = "",
	type = APP_MESSAGE_MODAL_TYPES.DEFAULT
) => ({
	type: SHOW_APP_MESSAGE,
	payload: {
		message,
		title,
		type,
	},
});

export const closeAppMessage = () => ({
	type: CLOSE_APP_MESSAGE,
});
