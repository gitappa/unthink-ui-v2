import { SUPER_ADMIN } from "../../../constants/codes";
import { checkIsFavoriteCollection } from "../../../helper/utils";

export const getIsSuperAdminUser = (state) =>
	state.auth.user.data.role === SUPER_ADMIN;

// if user name and email id same than take the part of email before @ otherwise take username as store
export const getCurrentUserStore = (state) =>
	state.auth.user.data.emailId === state.auth.user.data.user_name
		? state.auth.user.data.emailId?.split("@")[0]
		: state.auth.user.data.user_name;

export const getAuthUserData = (state) => state.auth.user.data;

export const getAuthUserUserId = (state) => state.auth.user.data.user_id;

export const getAuthAdminList = (state) => state.store.data.admin_list;

export const getAuthUserUserName = (state) => state.auth.user.data.user_name;

export const getAuthUserVenlyUser = (state) => state.auth.user.data.venlyUser;

export const getAuthUserCollections = (state) =>
	state.auth.user.collections.data;

export const getIsInfluencer = (state) =>
	state.auth.user.data.is_influencer && state.auth.user.data.company_code;

export const getIsGuestUser = (state) => state.auth.user.userNotFound;

export const getAuthUserInfluencerCode = (state) =>
	state.auth.user.data.influencer_code;

// get the current user's favorite collection details from the store
export const getCurrentUserFavoriteCollection = (state) =>
	state.auth.user.collections.data.find(checkIsFavoriteCollection);
