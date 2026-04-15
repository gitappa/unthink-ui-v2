import {
	SHOW_EARNED_REWARD_MODAL,
	CLOSE_EARNED_REWARD_MODAL,
	VALIDATE_AND_SHOW_EARNED_NFT_REWARD,
	CLAIM_EARNED_NFT_REWARD,
	CONNECT_VENLY_WALLET,
} from "./constants";
import { EARNED_REWARD_MODAL_TYPES } from "../../../constants/codes";

export const showEarnedRewardModal = ({
	title = "",
	message = "",
	type = EARNED_REWARD_MODAL_TYPES.DEFAULT,
	data = {},
}) => ({
	type: SHOW_EARNED_REWARD_MODAL,
	payload: {
		message,
		title,
		type,
		data,
	},
});

export const closeEarnedRewardModal = () => ({
	type: CLOSE_EARNED_REWARD_MODAL,
});

export const validateAndShowEarnedNFTReward = (type, data = {}) => ({
	type: VALIDATE_AND_SHOW_EARNED_NFT_REWARD,
	payload: {
		type,
		data,
	},
});

export const claimEarnedNFTReward = ({ type, data = {}, onSuccess }) => ({
	type: CLAIM_EARNED_NFT_REWARD,
	payload: {
		type,
		data,
		onSuccess,
	},
});

export const connectVenlyWallet = (onSuccess, data = {}) => ({
	type: CONNECT_VENLY_WALLET,
	payload: {
		onSuccess,
		data,
	},
});
