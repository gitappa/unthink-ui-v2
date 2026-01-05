import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Row, Col, Button, notification, Input, Select } from "antd";

import {
	adminHederaWalletId,
	adminUnthinkTokenAddress,
	adminUserId,
	current_store_name,
	enable_transfer_NFT,
	enable_venly,
	isStagingEnv,
	venlyChainSecretType,
} from "../../constants/config";
import {
	getSingleWallet,
	getVenlyAccountDetails,
	isWalletExists,
} from "../../helper/venlyUtils";
import { profileAPIs, tokenAPIs } from "../../helper/serverAPIs";
import Loader from "../../components/Loader/loader";
import { getDebugViewCookie } from "../../helper/getTrackerInfo";
import {
	COOKIE_DEBUG_VIEW_ADMIN_VIEW,
	EARNED_REWARD_MODAL_TYPES,
	EARNED_NFT_STATUSES,
	EARNED_NFT_NAMES,
} from "../../constants/codes";
import { AdminCheck } from "../../helper/utils";

const NFTTypeOptions = [
	{
		label: EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT,
		value: EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT,
	},
];

const defaultNFTFormDataName = { ...EARNED_NFT_NAMES };

const defaultNFTFormDataDescription = {
	[EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT]:
		"Joined the Unthink creator community",
};

const filterInfluencers = (influencers = []) =>
	influencers.filter(
		(i) =>
			i.venlyUser && i.venlyUser.wallets && isWalletExists(i.venlyUser.wallets)
	);

const prepareInfluencersData = (influencers = []) =>
	influencers.map((i) => {
		if (i.NFT_details) {
			const level1NFT = i.NFT_details.find(
				(n) => n.type === EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT
			);

			if (level1NFT) {
				i.level1NFT = level1NFT;
			}
		}
		return i;
	});

const defaultNFTFormData = {
	type: NFTTypeOptions[0].value, // set first type default
	name: defaultNFTFormDataName[NFTTypeOptions[0].value], // set name based on the default type
	description: defaultNFTFormDataDescription[NFTTypeOptions[0].value], // set description based on the default type
};

const AttributionModal = ({
	attribution,
	showAttributionModal,
	handleCloseAttributionModal,
	statsModalTitle,
}) => {
	const [isVenlyActive, setIsVenlyActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // update it with register loader once new flow done
	const [influencers, setInfluencers] = useState([]);
	const [authUser, admin_list] = useSelector((state) => [state.auth.user.data, state.store.data.admin_list]);
	const [selectedUserForNFT, setSelectedUserForNFT] = useState({});

	const isAdminLoggedIn = AdminCheck(authUser.data, current_store_name, adminUserId, admin_list);


	const [NFTFormData, setNFTFormData] = useState({
		...defaultNFTFormData,
	});

	// const isAdminView = useMemo(
	// 	() => getDebugViewCookie() === COOKIE_DEBUG_VIEW_ADMIN_VIEW,
	// 	[]
	// );

	const isVenlyFlagEnabled = enable_venly;

	const isFungibleTokenTransferEnabled =
		isVenlyFlagEnabled && adminHederaWalletId && adminUnthinkTokenAddress;

	const isNFTTransferEnabled = enable_transfer_NFT;

	const attributionsList = [
		"influencer ",
		"total collections",
		"unique visitors",
		"total visitors count",
		"brand page visits",
		"brands visited",
	];

	const fetchVenlyAccountDetails = async () => {
		const venlyAccountDetails = await getVenlyAccountDetails();

		isStagingEnv && console.log("venlyAccountDetails : ", venlyAccountDetails); // should be removed later

		venlyAccountDetails?.profile?.userId &&
			setIsVenlyActive(isAdminLoggedIn);
	};

	const fetchInfluencerDetails = async () => {
		try {
			setIsLoading(true);
			const result = await profileAPIs.fetchInfluencersAPICall({
				featured: true,
			});
			if (result.data?.data) {
				setInfluencers(
					prepareInfluencersData(filterInfluencers(result.data?.data))
				);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isAdminLoggedIn && showAttributionModal) {
			if (isFungibleTokenTransferEnabled) {
				fetchVenlyAccountDetails();
			}

			if (showAttributionModal) {
				fetchInfluencerDetails();
			}
		}

		return () => {
			setIsVenlyActive(false);
			handleSelectInfluencerForNFT(); // reset nft form and select user
		};
	}, [showAttributionModal]);

	console.log(isAdminLoggedIn);


	// transfer fungible token to specified wallet address
	const handleTransferTokens = (inf) => {
		const wallet = getSingleWallet(inf.venlyUser.wallets);
		const to = wallet && wallet.address;
		const value = inf.noOfTokens || 0;

		if (isVenlyFlagEnabled && to && value && window && window.venlyConnect) {
			//Creating the signer
			const signer = window.venlyConnect.createSigner();

			//Asking the signer to transfer ERC20 token to a blockchain address.
			signer
				.executeTokenTransfer({
					walletId: adminHederaWalletId,
					to,
					value,
					tokenAddress: adminUnthinkTokenAddress,
					secretType: venlyChainSecretType, // HEDERA
				})
				.then((result) => {
					console.log("tokens transfer success result : ", result);
					notification.success({
						message: "Success",
						description: `${value} tokens transferred successfully `,
					});
				})
				.catch((err) => {
					console.error("err while transferring token : ", err);
					notification.error({
						message: "Error",
						description: `Failed to transfer ${value} tokens`,
					});
				});
		}
	};

	// transfer NFT to specified wallet address
	const handleTransferNFT = async () => {
		const to = selectedUserForNFT.user_id;
		const {
			type: NFTType,
			name: NFTName,
			description: NFTDescription,
		} = NFTFormData;

		try {
			setIsLoading(true);

			// form validation and show error message = START
			let errorMessage;

			if (!NFTType) {
				errorMessage = "Please select Token Type";
			} else if (!NFTName) {
				errorMessage = "Please enter Token Name";
			} else if (!NFTDescription) {
				errorMessage = "Please enter Token Description";
			}

			if (errorMessage) {
				notification.error({
					message: "Error",
					description: errorMessage,
				});
				return;
			}
			// form validation and show error message = END

			if (isVenlyFlagEnabled && to) {
				const response = await tokenAPIs.createAndTransferNFT({
					metadata_name: NFTName,
					metadata_description: NFTDescription,
					type: NFTType,
					user_id: to,
				});

				if (response.data.status_code === 200) {
					notification.success({
						message: "Success",
						description: "NFT transferred to the selected user",
					});
					handleSelectInfluencerForNFT(); // reset selected NFT user and form data
					fetchInfluencerDetails(); // fetch the updated details after transfer NFT success
				} else if (response.data.status_desc) {
					notification.error({
						message: "Error",
						description: "Unable to Issue NFT for the selected user",
					});
				}
			}
		} catch (error) {
			notification.error({
				message: "Error",
				description: "Unable to Issue NFT for the selected user",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const attributionsData = useMemo(() => {
		if (attribution) {
			let orderedAttributions = {};
			attributionsList.forEach((attribute) => {
				orderedAttributions[attribute] = attribution[attribute];
			});
			return {
				...orderedAttributions,
				...attribution,
			};
		}
	}, [attribution]);

	const handleNoOfTokensInputChange = (inf, value) => {
		inf.noOfTokens = +value;

		setInfluencers((infs) =>
			infs.map((i) => (i.venlyUser.userId === inf.venlyUser.userId ? inf : i))
		);
	};

	const handleSelectInfluencerForNFT = (inf) => {
		if (inf) {
			setSelectedUserForNFT(inf);
		} else {
			setSelectedUserForNFT({});
			setNFTFormData({
				...defaultNFTFormData,
			});
		}
	};

	const handleNFTInputChange = (name, value) => {
		const autoFillData = {};

		if (name === "type") {
			// auto fill the name and description based on the selected type
			autoFillData.name = defaultNFTFormDataName[value] || "";
			autoFillData.description = defaultNFTFormDataDescription[value] || "";
		}

		setNFTFormData((formData) => ({
			...formData,
			[name]: value,
			...autoFillData,
		}));
	};

	return (
		<div>
			<Modal
				title={statsModalTitle || "Audience stats:"}
				open={showAttributionModal}
				onCancel={handleCloseAttributionModal}
				cancelText='Close'
				okButtonProps={{ className: "hidden" }}>
				<>
					{attributionsData &&
						Object.keys(attributionsData).map((attribute) =>
							attributionsData[attribute] ? (
								<Row
									key={attribute}
									className='pt-3 border-b border-lightgray-105 border-opacity-60'>
									<Col className='capitalize' span={12}>
										{attribute}
									</Col>
									<Col span={12}>{attributionsData[attribute].toString()}</Col>
								</Row>
							) : null
						)}
					{isVenlyFlagEnabled && influencers.length ? (
						<div className='mt-5'>
							<h3 className='text-xl'>
								Influencers{" "}
								{influencers.length ? `(${influencers.length})` : ""}
							</h3>
							<div>
								{influencers
									.map((inf) => (
										<Row className='py-3 border-b border-lightgray-105 border-opacity-60 items-center'>
											<Col span={24}>
												<b>
													{inf.first_name || inf.last_name
														? `${inf.first_name || ""} ${inf.last_name || ""
														} | `
														: ""}
													{inf.venlyUser.email}
												</b>
											</Col>
											{/* next line  */}
											{isFungibleTokenTransferEnabled && isVenlyActive ? (
												<>
													<Col span={24} className='mt-2'>
														Transfer Fungible Tokens
													</Col>
													{/* next line */}
													<Col span={8}>
														<Input
															placeholder='No. of Tokens'
															type='number'
															min={0}
															value={inf.noOfTokens}
															onChange={(e) =>
																handleNoOfTokensInputChange(inf, e.target.value)
															}
														/>
													</Col>
													<Col span={4} className='pl-2'>
														<Button
															title="transfer fungible tokens to the influencer's wallet"
															onClick={() => handleTransferTokens(inf)}>
															Transfer
														</Button>
													</Col>
													<Col span={12}></Col>
												</>
											) : null}

											{/* next line  */}
											<Col span={12}>No. of collection(s) created:</Col>
											<Col span={12}>{inf.total_col_count}</Col>

											{/* next line  */}
											<Col span={12}>No. of published collection(s):</Col>
											<Col span={12}>{inf.total_published_col_count}</Col>

											{/* next line  */}
											{inf.level1NFT &&
												inf.level1NFT.status ===
												EARNED_NFT_STATUSES.TRANSFERRED ? (
												<>
													<Col span={12}>Transferred NFT(s):</Col>
													<Col span={12}>
														<span className='inline-block px-2 py-1 ml-1 bg-green-500 text-white rounded-lg text-xs leading-none'>
															{
																EARNED_NFT_NAMES[
																EARNED_REWARD_MODAL_TYPES.LEVEL_1_NFT
																]
															}
														</span>
													</Col>
												</>
											) : null}

											{/* next line  */}
											{isNFTTransferEnabled &&
												(!inf.level1NFT ||
													inf.level1NFT.status !==
													EARNED_NFT_STATUSES.TRANSFERRED) ? (
												<>
													<Col
														span={24}
														className={`mt-2 ${selectedUserForNFT.user_id !== inf.user_id
															? "text-purple-101 underline cursor-pointer"
															: "font-semibold"
															}`}
														onClick={() =>
															selectedUserForNFT.user_id !== inf.user_id &&
															handleSelectInfluencerForNFT(inf)
														}>
														Issue Non Fungible Token
													</Col>
													{selectedUserForNFT.user_id === inf.user_id && (
														<>
															{/* next line  */}
															<Col span={12} className='pr-2 pb-2'>
																Type
																<Select
																	className='w-full'
																	onChange={(value) =>
																		handleNFTInputChange("type", value)
																	}
																	options={NFTTypeOptions}
																	value={NFTFormData.type || null}
																	placeholder='Select Type'
																/>
															</Col>
															<Col
																span={12}
																className='flex justify-end mt-auto'></Col>
															{/* next line  */}
															<Col span={12} className='pr-2'>
																Name
																<Input
																	placeholder='enter name'
																	type='text'
																	value={NFTFormData.name}
																	onChange={(e) =>
																		handleNFTInputChange("name", e.target.value)
																	}
																/>
															</Col>
															<Col span={12}>
																Description
																<Input
																	placeholder='enter description'
																	type='text'
																	value={NFTFormData.description}
																	onChange={(e) =>
																		handleNFTInputChange(
																			"description",
																			e.target.value
																		)
																	}
																/>
															</Col>
															{/* next line  */}
															<Col span={24} className='flex pt-4'>
																<Button
																	className='mr-2'
																	onClick={handleTransferNFT}
																	title="create and mint a new NFT with the specified type and transfer to the influencer's wallet">
																	Issue NFT
																</Button>

																<Button
																	onClick={() =>
																		handleSelectInfluencerForNFT()
																	}>
																	Cancel
																</Button>
															</Col>
														</>
													)}
												</>
											) : null}
										</Row>
									))
									.reverse()}
							</div>
						</div>
					) : null}
				</>
				{isLoading && (
					<div className='fixed z-40 top-0 left-0 flex justify-center items-center w-full h-full backdrop-filter backdrop-contrast-75'>
						<Loader />
					</div>
				)}
			</Modal>
		</div>
	);
};

export default AttributionModal;
