import { SET_KIOSK_ACCESS, SET_KIOSK_LOGIN } from "./constants";

export const setKioskAccess = (payload) => ({
	type: SET_KIOSK_ACCESS,
	payload,
});

export const setKioskLogin = (payload) => ({
	type: SET_KIOSK_LOGIN,
	payload,
});
