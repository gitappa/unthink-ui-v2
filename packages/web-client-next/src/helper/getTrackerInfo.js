import Cookies from "js-cookie";

import {
	COOKIE_DEBUG_VIEW,
	COOKIE_EMAIL,
	COOKIE_TT_ID,
	COOKIE_USER_TYPE,
	COOKIE_USER_TYPE_GUEST,
	COOKIE_USER_TYPE_REGISTERED,
	DEBUG_LOCAL_STORAGE_UNTHINK,
	LOCAL_STORAGE_PREV_S_ID,
	LOCAL_STORAGE_S_ID,
	LOCAL_STORAGE_LOGGED_IN_USER_ID,
	NEW_USER_LOCAL_STORAGE,
	SEND_MESSAGE_WITH_PREFIX_SS_KEY,
	SIGN_IN_EXPIRE_DAYS,
	SOCKET_MESSAGE_PREFIX_MESSAGE,
} from "../constants/codes";

export const setTTid = (value, expires = SIGN_IN_EXPIRE_DAYS) => {
	return Cookies.set(COOKIE_TT_ID, value, { expires });
};

export const getTTid = () => {
	return Cookies.get(COOKIE_TT_ID);
};

export const removeTTid = () => {
	return Cookies.remove(COOKIE_TT_ID);
};

export const setSid = (value) => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.setItem(LOCAL_STORAGE_S_ID, value);
	}
};

export const getSid = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.getItem(LOCAL_STORAGE_S_ID);
	}
	return null;
};

export const removeSid = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.removeItem(LOCAL_STORAGE_S_ID);
	}
};

export const setPrevSid = (value) => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.setItem(LOCAL_STORAGE_PREV_S_ID, value);
	}
};

export const getPrevSid = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.getItem(LOCAL_STORAGE_PREV_S_ID);
	}
	return null;
};

export const removePrevSid = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.getItem(LOCAL_STORAGE_PREV_S_ID);
	}
	return null;
};

export const setUserId = (value) => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_USER_ID, value);
	}
};

export const getUserId = () => {
	if (typeof window !== "undefined" && window?.localStorage) {
		return window.localStorage.getItem(LOCAL_STORAGE_LOGGED_IN_USER_ID);
	}
	return null;
};

export const removeUserId = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.removeItem(LOCAL_STORAGE_LOGGED_IN_USER_ID);
	}
};

export const getTz = () => {
	const now = new Date();
	const tz = now.getTimezoneOffset();
	return tz.toString();
};

export const getTimeStamp = () => +new Date();

export const setUserEmail = (value, expires = SIGN_IN_EXPIRE_DAYS) => {
	Cookies.set(COOKIE_EMAIL, value, { expires });
};

// use to set locals on user sign in from anywhere
export const userSignInSetLocal = (userId, emailId) => {
	setTTid(userId);
	setIsRegistered(true);
	emailId && setUserEmail(emailId);
};

export const getUserEmail = () => {
	return Cookies.get(COOKIE_EMAIL);
};

export const removeUserEmail = () => {
	Cookies.remove(COOKIE_EMAIL);
};

export const setIsRegistered = (value, expires = SIGN_IN_EXPIRE_DAYS) => {
	Cookies.set(
		COOKIE_USER_TYPE,
		value ? COOKIE_USER_TYPE_REGISTERED : COOKIE_USER_TYPE_GUEST,
		{ expires }
	);
};

export const getIsRegistered = () => {
	return Cookies.get(COOKIE_USER_TYPE) === COOKIE_USER_TYPE_REGISTERED;
};

export const getDebugViewCookie = () => Cookies.get(COOKIE_DEBUG_VIEW);

export const isDebugCookie = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.getItem("debug") === DEBUG_LOCAL_STORAGE_UNTHINK;
	}
	return false;
};

export const isEnableAICookie = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.getItem("enableai") === "true";
	}
	return false;
};

export const isEnableAICookieFalse = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.getItem("enableai") === "false";
	}
	return false;
};

export const isSendSocketMessageWithPrefix = () => {
	if (typeof window !== "undefined" && window && window.sessionStorage) {
		return window.sessionStorage.getItem(SEND_MESSAGE_WITH_PREFIX_SS_KEY) === "true";
	}
	return false;
};

export const setIsSendSocketMessageWithPrefix = (value) => {
	if (typeof window !== "undefined" && window && window.sessionStorage) {
		return window.sessionStorage.setItem(
			SEND_MESSAGE_WITH_PREFIX_SS_KEY,
			value ? "true" : "false"
		);
	}
};

export const updateSocketMessageWithPrefix = (message = "") =>
	message === "Hi"
		? message
		: isSendSocketMessageWithPrefix()
		? SOCKET_MESSAGE_PREFIX_MESSAGE + message
		: message;

export const getIsNewUser = () => {
	if (typeof window !== "undefined" && window.localStorage) {
		return !(window.localStorage.getItem(NEW_USER_LOCAL_STORAGE) === "true");
	}
	return true;
};

export const setIsNewUser = (value = "false") => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage.setItem(NEW_USER_LOCAL_STORAGE, value);
	}
};

export const getTrackerEventId = () => {
	if (typeof window !== "undefined" && window.sessionStorage) {
		return window.sessionStorage.getItem("event_id");
	}
	return null;
};

export const setTrackerEventId = (value) => {
	if (typeof window !== "undefined" && window.sessionStorage) {
		return window.sessionStorage.setItem("event_id", value);
	}
};

export const getIsAppVisited = () => {
	if (typeof window !== "undefined" && window.sessionStorage) {
		return window.sessionStorage.getItem("visited") === "true";
	}
	return false;
};

export const setIsAppVisited = (value = "true") => {
	if (typeof window !== "undefined" && window.sessionStorage) {
		return window.sessionStorage.setItem("visited", value);
	}
};
