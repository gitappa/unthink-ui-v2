import { takeLatest, call, put, select } from "redux-saga/effects";
import { notification } from "antd";

import { tokenAPIs } from "../../../helper/serverAPIs";
import { showEarnedRewardModal } from "./actions";
import { showAppMessage } from "../../appMessageModal/redux/actions";
import {
	deregisterAppLoader,
	registerAppLoader,
} from "../../appLoader/redux/actions";
import { getTTid } from "../../../helper/getTrackerInfo";
import {
	CLAIM_EARNED_NFT_REWARD,
	CONNECT_VENLY_WALLET,
	VALIDATE_AND_SHOW_EARNED_NFT_REWARD,
} from "./constants";
import {
	EARNED_NFT_DESCRIPTIONS,
	EARNED_NFT_NAMES,
	EARNED_REWARD_MODAL_TYPES,
} from "../../../constants/codes";
import {
	generateVenlyUserDetails,
	isWalletExists,
	logoutVenlyUser,
	saveVenlyUserInfo,
	venlyGetAccount,
} from "../../../helper/venlyUtils";
import { getAuthUserData, getAuthUserUserId } from "../../Auth/redux/selector";
import { getUserInfo } from "../../Auth/redux/actions";

function* validateAndShowEarnedNFTRewardSaga(action) {
	const { type, data = {} } = action.payload;

	try {
		const params = {
			user_id: getTTid(),
			type,
			store_name: data.store_name,
		};

		let res = yield call(tokenAPIs.verifyUserRewardEligibilityAPICall, params);
		let { data: resData } = res;

		if (resData.status_code) {
			if (data.checkForNFTRewardShowNotification) {
				notification["success"]({
					message: "Congratulations 🎉",
					description: `You have earned ${EARNED_NFT_NAMES[type]} NFT! Go to rewards to claim it.`,
				});
			} else {
				yield put(
					showEarnedRewardModal({
						// title: "Congratulations!",
						// message: `You have earned ${EARNED_NFT_NAMES[type]} NFT`,
						type,
						data: resData,
					})
				);
			}
		} else {
			if (data.errorMessage)
				notification["error"]({ message: data.errorMessage });
		}

		throw res;
	} catch (error) {
		if (error.response?.data?.status_code) {
			yield put(
				showEarnedRewardModal({
					// title: "Congratulations!",
					// message: `You have earned ${EARNED_NFT_NAMES[type]} NFT`,
					type,
					data: error.response.data,
				})
			);
		}
		if (data.errorMessage)
			notification["error"]({ message: data.errorMessage });
	}
}

function* claimEarnedNFTRewardSaga(action) {
	const { type, data = {} } = action.payload;

	try {
		yield put(registerAppLoader("claimEarnedNFTRewardSaga"));
		const params = {
			metadata_name: EARNED_NFT_NAMES[type],
			metadata_description: EARNED_NFT_DESCRIPTIONS[type],
			type,
			user_id: getTTid(),
		};

		let res = yield call(tokenAPIs.createAndTransferNFT, params);
		let { data: resData } = res;

		if (resData.status_code === 200) {
			if (type === EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT) {
				const authUserUserId = yield select(getAuthUserUserId);
				localStorage.setItem(`level1NFTClaimed${authUserUserId}`, true);
			}

			if (action.payload.onSuccess) {
				action.payload.onSuccess();
			} else {
				yield put(
					showAppMessage(
						"Congratulations",
						`You have received the ${EARNED_NFT_NAMES[type]} NFT!`
					)
				);
			}
		} else {
			if (data.errorMessage)
				notification["error"]({ message: data.errorMessage });
		}

		throw res;
	} catch (error) {
		if (data.errorMessage)
			notification["error"]({ message: data.errorMessage });
	} finally {
		yield put(deregisterAppLoader("claimEarnedNFTRewardSaga"));
	}
}

function* connectVenlyWalletSaga(action) {
	let message = "";
	let logoutVenlyUserNeeded = false;

	try {
		yield put(registerAppLoader("connectVenlyWalletSaga"));
		let venlyUser = yield call(generateVenlyUserDetails);
		const currentUser = yield select(getAuthUserData);

		yield call(venlyGetAccount);
		venlyUser = yield call(generateVenlyUserDetails);
		// setIsPageLoading(true);
		if (venlyUser && venlyUser.userId) {
			if (venlyUser.email === currentUser.emailId) {
				if (isWalletExists(venlyUser.wallets)) {
					if (!currentUser.venlyUser?.wallets?.length) {
						// save venly details if user's venly details not saved or wallets are not saved
						yield call(saveVenlyUserInfo, currentUser, venlyUser);
						yield put(getUserInfo());
					}

					if (action.payload.onSuccess) {
						action.payload.onSuccess(); // open wallet / do action venly venly connected nad user info saved
					} else {
						notification.success({
							message: "Your wallet has been successfully connected",
						});
					}

					return;
				} else {
					message = "Please try again and link wallet in venly pop-up";
				}
			} else {
				if (currentUser.emailId) {
					message = `Please login with ${currentUser.emailId} in venly pop-up`;
					logoutVenlyUserNeeded = true;
				}
			}
		} else {
			message = "Unable to connect to venly, Please try again";
		}
	} catch (error) {
		console.error("error : ", error);
		message = "Unable to connect to venly, Please try again";
	} finally {
		yield put(deregisterAppLoader("connectVenlyWalletSaga"));
	}

	message && notification.warning({ message });
	logoutVenlyUserNeeded && logoutVenlyUser();
}

function* validateAndShowEarnedRewardWatcher() {
	yield takeLatest(
		VALIDATE_AND_SHOW_EARNED_NFT_REWARD,
		validateAndShowEarnedNFTRewardSaga
	);
	yield takeLatest(CLAIM_EARNED_NFT_REWARD, claimEarnedNFTRewardSaga);
	yield takeLatest(CONNECT_VENLY_WALLET, connectVenlyWalletSaga);
}

export { validateAndShowEarnedRewardWatcher };
