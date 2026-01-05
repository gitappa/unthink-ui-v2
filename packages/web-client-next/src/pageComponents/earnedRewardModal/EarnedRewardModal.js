import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/modal/Modal";
import {
	claimEarnedNFTReward,
	closeEarnedRewardModal,
	connectVenlyWallet,
	validateAndShowEarnedNFTReward,
} from "./redux/actions";
import {
	EARNED_NFT_NAMES_TO_SHOW,
	EARNED_NFT_STATUSES,
	EARNED_REWARD_MODAL_TYPES,
	EARN_REWARDS,
} from "../../constants/codes";
import { openVenlyWallet } from "../../helper/venlyUtils";
import { openMenuItem } from "../categories/redux/actions";

const EarnedRewardModal = ({}) => {
	const [isModalOpen, modalData, authUser] = useSelector((state) => [
		state.appState.earnedRewardModal.isOpen,
		state.appState.earnedRewardModal.data,
		state.auth.user.data,
	]);

	const { data: messageData } = modalData;

	const dispatch = useDispatch();

	const onModalClose = useCallback(() => {
		dispatch(closeEarnedRewardModal());
	}, []);

	const modalSize = useMemo(() => {
		switch (modalData.type) {
			case EARNED_REWARD_MODAL_TYPES.DEFAULT:
				return "sm";

			default:
				break;
		}

		return "md";
	}, [modalData.type]);

	const handleClaimNFT = (type) => {
		dispatch(
			claimEarnedNFTReward({
				type,
				onSuccess: function onSuccess() {
					dispatch(validateAndShowEarnedNFTReward(modalData.type));
				},
			})
		);
		dispatch(closeEarnedRewardModal());
	};

	const handleViewMyRewardsPage = () => {
		dispatch(openMenuItem(EARN_REWARDS));
		dispatch(closeEarnedRewardModal());
	};

	const handleConnectWalletClick = () => {
		dispatch(
			connectVenlyWallet(function onSuccess() {
				dispatch(validateAndShowEarnedNFTReward(modalData.type));
			})
		);
		dispatch(closeEarnedRewardModal());
	};

	const hasConnectWalletDependency = [
		"NOT_A_VENLY_USER",
		"WALLET_NOT_CONNECTED",
	].includes(messageData?.error_code);

	const NFTDetails = messageData?.data?.NFT?.find(
		(n) => n.type === modalData.type
	);

	useEffect(() => {
		if (
			!localStorage.getItem(`level1NFTClaimed${authUser.user_id}`) &&
			NFTDetails &&
			NFTDetails.type === EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT &&
			NFTDetails.status === EARNED_NFT_STATUSES.TRANSFERRED
		) {
			localStorage.setItem(`level1NFTClaimed${authUser.user_id}`, true);
		}
	}, [NFTDetails]);

	const isNFTEarned =
		NFTDetails && NFTDetails.status
			? NFTDetails.status === EARNED_NFT_STATUSES.EARNED
			: true;

	const headerText = modalData.title || "Congratulations 🎉";

	const messageToShow =
		modalData.message ||
		([EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT].includes(modalData.type)
			? isNFTEarned
				? `You have earned ${EARNED_NFT_NAMES_TO_SHOW[modalData.type]} NFT!`
				: `You have received ${EARNED_NFT_NAMES_TO_SHOW[modalData.type]} NFT!`
			: "");

	return (
		<Modal
			isOpen={isModalOpen}
			headerText={headerText}
			onClose={onModalClose}
			size={modalSize}
			zIndexClassName='z-50'>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					{messageToShow ? (
						<p className='text-xl font-medium mb-2'>{messageToShow}</p>
					) : null}

					{[EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT].includes(modalData.type) ? (
						<>
							{hasConnectWalletDependency ? (
								<div>
									<p className='text-xl font-medium mb-2'>
										Please connect your wallet to claim it.
									</p>

									<button
										className='text-base text-white font-bold px-3 py-1 rounded bg-indigo-600'
										onClick={handleConnectWalletClick}>
										Connect
									</button>
								</div>
							) : (
								<>
									{isNFTEarned ? (
										<div>
											<p className='text-xl font-medium mb-2'>
												Click on the claim button below to claim it.
											</p>

											<button
												className='text-base text-white font-bold px-3 py-1 rounded bg-indigo-600'
												onClick={() => handleClaimNFT(modalData.type)}>
												Claim
											</button>
										</div>
									) : (
										<div className='tablet:flex'>
											<div>
												<button
													className='text-base text-white font-bold px-3 py-1 rounded bg-indigo-600 mr-0 tablet:mr-3 mb-3 tablet:mb-0'
													onClick={() => openVenlyWallet()}>
													View in my wallet
												</button>
											</div>
											<div>
												<button
													className='text-base text-white font-bold px-3 py-1 rounded bg-indigo-600'
													onClick={() => handleViewMyRewardsPage()}>
													View my rewards page
												</button>
											</div>
										</div>
									)}
								</>
							)}
						</>
					) : null}
				</div>
				<div>
					<img
						src='https://cdn.unthink.ai/img/unthink_main_2023/trophy_GIf.gif'
						alt='NFT reward'
						className='rounded-2xl tablet:rounded-32 w-full h-auto'
					/>
				</div>
			</div>
		</Modal>
	);
};

export default React.memo(EarnedRewardModal);
