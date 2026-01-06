import { VenlyConnect } from "@venly/connect";
import {
	enable_venly,
	isStagingEnv,
	venlyChainSecretType,
	venly_client_id,
	venly_environment,
} from "../constants/config";
import { authAPIs, profileAPIs } from "./serverAPIs";

// connect venly widget using client id and environment
export const connectVenly = (
	venlyClientId = venly_client_id,
	venlyEnv = venly_environment
) => {
	if (typeof window !== "undefined") {
		const parameters = {
			windowMode: "POPUP",
		};

		if (venlyEnv !== "production") {
			parameters.environment = "staging";
		}

		window.venlyConnect = new VenlyConnect(venlyClientId, parameters);
	}
};

export const venlyGetAccount = (
	loginIdpHint = "",
	chainSecretType = venlyChainSecretType,
	requiredWallet = false
) =>
	typeof window !== "undefined" &&
	window &&
	window.venlyConnect &&
	window.venlyConnect.flows
		.getAccount(chainSecretType, {
			idpHint: loginIdpHint,
		})
		.then((account) => {
			if (
				account &&
				account.auth &&
				account.isAuthenticated === true &&
				account.auth.subject &&
				(!requiredWallet ||
					(account.wallets &&
						account.wallets.some((w) => w.secretType === chainSecretType)))
			) {
				if (
					!requiredWallet ||
					(account.wallets &&
						account.wallets.some((w) => w.secretType === chainSecretType))
				) {
					return account;
				} else {
					return venlyGetAccount(loginIdpHint, chainSecretType);
				}
			}
		});

export const isVenlyUserAuthenticated = () =>
	typeof window !== "undefined" &&
	window &&
	window.venlyConnect &&
	window.venlyConnect.auth &&
	window.venlyConnect.auth.authenticated === true;

export const venlyRetrieveUserInfo = () =>
	isVenlyUserAuthenticated() && window.venlyConnect.api.getProfile();

export const venlyRetrieveWallets = (secretType) => {
	if (isVenlyUserAuthenticated()) {
		const filters = {};
		if (secretType) {
			filters.secretType = secretType;
		}

		return window.venlyConnect.api.getWallets(filters);
	}
};

export const venlyRetrieveNFTs = (walletId) => {
	if (isVenlyUserAuthenticated()) {
		return (
			window.venlyConnect && window.venlyConnect.api.getNonfungibles(walletId)
		);
	}
};

export const getVenlyAccountDetails = async (
	chainSecretType = venlyChainSecretType,
	loginIdpHint = ""
) => {
	try {
		if (isVenlyUserAuthenticated()) {
			const wallets = await venlyRetrieveWallets(chainSecretType);

			// ask user infite time to connect at least one wallet
			// if (!wallets.length) {
			// 	// start
			// 	// asking for authentication for venly and wallet from user and calling this function again
			// 	await venlyGetAccount(loginIdpHint, chainSecretType);
			// 	return getVenlyAccountDetails(
			// 		chainSecretType,
			// 		loginIdpHint
			// 	);
			// 	// end
			// }

			return {
				profile: await venlyRetrieveUserInfo(),
				wallets,
			};
		} else {
			// start
			// asking for authentication for venly and wallet from user and calling this function again
			await venlyGetAccount(loginIdpHint, chainSecretType);
			return getVenlyAccountDetails(chainSecretType, loginIdpHint);
			// end
		}
	} catch (error) {
		return false;
	}
};

export const openVenlyWallet = () => {
	window.open(
		venly_environment === "production"
			? "https://wallet.venly.io" // production wallet link
			: "https://wallet-staging.venly.io", // staging wallet link
		"_blank"
	);
};

export const generateVenlyUserDetails = async () => {
	if (isVenlyUserAuthenticated()) {
		const venlyUserProfile = await (window.venlyConnect &&
			window.venlyConnect.api?.getProfile());
		const venlyUserWallets = await (window.venlyConnect &&
			window.venlyConnect.api?.getWallets());

		return {
			...(venlyUserProfile || {}),
			wallets: venlyUserWallets || [],
		};
	}

	return {};
};

// check if the wallet exists with the specified chain type
export const isWalletExists = (wallets = [], chain = venlyChainSecretType) => {
	return wallets.some((w) => w.secretType === chain);
};

// get the first wallet exists with the specified chain type
export const getSingleWallet = (wallets = [], chain = venlyChainSecretType) => {
	return wallets.find((w) => w.secretType === chain);
};

// save user's new venly info
export const saveVenlyUserInfo = async (userInfo = {}, venlyUser = {}) => {
	try {
		if (userInfo._id && venlyUser.userId) {
			const payload = {
				profileData: {
					user_id: userInfo.user_id, // required
					is_influencer: userInfo.is_influencer, // required
					_id: userInfo._id, // required
					venlyUser: venlyUser,
				},
			};

			await profileAPIs.saveUserInfoAPICall(payload);
			return true;
		}
	} catch (error) {
		return false;
	}
};

// logout the venly user in the venly widget
export const logoutVenlyUser = () =>
	typeof window !== "undefined" &&
	window &&
	window.venlyConnect &&
	window.venlyConnect.logout &&
	window.venlyConnect.logout();

// check if the user id already registered with the email id without venly
// if yes save the venly details with the user and success the signup
// return true if user found and save the details
export const checkUserRegisteredWithoutVenlyAndSave = async (
	email,
	successCallback,
	errorCallback
) => {
	try {
		const venlyUser = await generateVenlyUserDetails();
		if (enable_venly && email && venlyUser.userId) {
			const registeredUserRes = await authAPIs.getUserInfoAPICall({
				emailId: email,
			});

			const registeredUser = { ...(registeredUserRes?.data?.data || {}) };

			if (registeredUser.emailId) {
				if (
					registeredUser.venlyUser &&
					registeredUser.venlyUser.userId &&
					venlyUser.userId &&
					registeredUser.venlyUser.userId !== venlyUser.userId
				) {
					errorCallback();
					logoutVenlyUser();
					return true;
				} else if (
					!registeredUser.venlyUser || // if user is already registered but not with venly
					!registeredUser.venlyUser.wallets ||
					!registeredUser.venlyUser.wallets.length
				) {
					const isUserInfoSaved = await saveVenlyUserInfo(
						registeredUser,
						venlyUser
					);

					if (isUserInfoSaved) {
						successCallback(
							registeredUser.user_id,
							registeredUser.emailId,
							true,
							{},
							registeredUser.influencer_code
						);
						return true;
					}
				} else if (
					// if user is already registered with venly as well
					registeredUser.venlyUser &&
					registeredUser.venlyUser.userId === venlyUser.userId
				) {
					successCallback(
						registeredUser.user_id,
						registeredUser.emailId,
						true,
						{},
						registeredUser.influencer_code
					);
					return true;
				}
			}
		}

		return false;
	} catch (error) {
		isStagingEnv &&
			console.log("error in checkUserRegisteredWithoutVenly : ", error);
		return false;
	}
};
