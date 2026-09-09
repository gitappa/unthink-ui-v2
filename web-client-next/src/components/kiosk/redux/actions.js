import { SET_KIOSK_ACCESS } from "./constants";

export const setKioskAccess = (payload) => ({
	type: SET_KIOSK_ACCESS,
	payload,
});
