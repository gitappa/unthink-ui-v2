import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Spin, Table } from "antd";
import { TrophyFilled } from "@ant-design/icons";

import Modal from "../../components/modal/Modal";
import { fetchLeaderboardUrl, profileAPIs } from "../../helper/serverAPIs";
import defaultAvatar from "../../images/avatar.svg";
import {
	AdminCheck,
	generateRoute,
	generateShareV2Url,
	getDateString,
} from "../../helper/utils";
import { getDebugViewCookie } from "../../helper/getTrackerInfo";
import {
	adminUserId,
	auraYfretUserCollBaseUrl,
	current_store_name,
	isStagingEnv,
	is_store_instance,
	super_admin,
} from "../../constants/config";
import { COOKIE_DEBUG_VIEW_ADMIN_VIEW } from "../../constants/codes";
import { useSelector } from "react-redux";
import ShareOptions from "../shared/shareOptions";
import styles from "./Leaderboard.module.scss";

// const newUIEnable = true;

const Leaderboard = ({ isOpen, handleClose }) => {
	const [authUser, leaderboard_settings, admin_list] = useSelector((state) => [
		state.auth.user.data,
		state.store.data.leaderboard_settings,
		state.store.data.admin_list,
	]);


	const isAdminLoggedIn = AdminCheck(authUser, current_store_name, adminUserId, admin_list);


	const isStoreAdminLoggedIn = useMemo(
		() =>
			is_store_instance &&
			authUser.user_name &&
			authUser.user_name === super_admin,
		[authUser.user_name]
	);

	const sharePageUrl = generateShareV2Url(
		authUser?.user_id,
		authUser?.user_name
	);

	const [isLoading, setIsLoading] = useState(false);
	const [usersData, setUsersData] = useState({});
	const [showShareProfile, setShowShareProfile] = useState(false);

	const myData = useMemo(
		() => usersData.data?.find((u) => u.user_id === authUser.user_id) || {},
		[usersData.data, authUser.user_id]
	);

	const isAdminViewEnabled = useMemo(
		() => getDebugViewCookie() === COOKIE_DEBUG_VIEW_ADMIN_VIEW,
		[]
	);

	const leaderboardParams = useMemo(
		() => ({
			filters: JSON.stringify({
				user_type: "signed_user",
				// featured: isAdminViewEnabled ? undefined : true,
				// status: "active",
			}),
			// sort: { published_collections: -1 },
		}),
		[isAdminViewEnabled]
	);

	const fetchLeaderboardData = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await profileAPIs.fetchLeaderboardAPICall(leaderboardParams);

			if (res.data && res.data.status_code === 200) {
				setUsersData(res.data);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			fetchLeaderboardData();
		}
	}, [isOpen]);

	const handleOpenUserProfile = useCallback((user_name, user_id) => {
		if (user_name) {
			const shareUrl = generateRoute(user_id, user_name);
			// navigate(shareUrl);
			window.open(shareUrl, "_blank"); // opening in new tab for now // can be changed
		}
	}, []);

	const columns = useMemo(() => {
		const columnToDisplay = leaderboard_settings?.table_column
			.filter((col) => col.is_display)
			.map((col) => {
				const columnData = {
					title: col.label,
					dataIndex: col.key,
				};

				if (col.key !== "user_name") {
					columnData.sorter = (a, b) => a[col.key] - b[col.key];
				}

				if (col.key === "user_name") {
					columnData.render = (
						_,
						{ first_name, last_name, user_name, user_id, role }
					) => (
						<>
							<button
								onClick={() => handleOpenUserProfile(user_name, user_id)}
								className={styles['userNameButton']}>
								<b>{user_name}</b>
							</button>{" "}
							{first_name?.trim() || last_name?.trim()
								? `(${first_name || ""} ${last_name || ""})`
								: ""}
							{role === "super_admin" ? (
								<div className={styles['adminBadge']}>
									Admin
								</div>
							) : null}
							{/* <p>{emailId}</p> */}
						</>
					);
				}

				return columnData;
			});

		return columnToDisplay;
	}, [handleClose, leaderboard_settings]);

	// const columns = useMemo(
	// 	() => [
	// 		{
	// 			title: "Rank",
	// 			dataIndex: "rank",
	// 			sorter: (a, b) => a.rank - b.rank,
	// 		},
	// 		{
	// 			title: "Name",
	// 			dataIndex: "user_name",
	// 			render: (_, { first_name, last_name, user_name, user_id, role }) => (
	// 				<>
	// 					<button
	// 						onClick={() => handleOpenUserProfile(user_name, user_id)}
	// 						className='px-0 hover:underline'>
	// 						<b>{user_name}</b>
	// 					</button>{" "}
	// 					{first_name?.trim() || last_name?.trim()
	// 						? `(${first_name || ""} ${last_name || ""})`
	// 						: ""}
	// 					{role === "super_admin" ? (
	// 						<div className='inline-block px-1.25 py-0.5 ml-1 bg-green-500 text-white rounded-lg text-xs leading-none'>
	// 							Admin
	// 						</div>
	// 					) : null}
	// 					{/* <p>{emailId}</p> */}
	// 				</>
	// 			),
	// 		},
	// 		{
	// 			title: "Published Collections",
	// 			dataIndex: "published_collections",
	// 			sorter: (a, b) => a.published_collections - b.published_collections,
	// 		},
	// 		{
	// 			title: "Wallet user",
	// 			dataIndex: "wallet user",
	// 			render: (_, val) => <span>{val["wallet user"] ? "Yes" : "No"}</span>,
	// 		},
	// 		{
	// 			title: "Issued NFTs",
	// 			dataIndex: "NFT_details",
	// 			render: (_, { NFT_details = [] }) => (
	// 				<div className='grid grid-cols-1 gap-2'>
	// 					{NFT_details.map((nft) => (
	// 						<div key={nft.issue_date}>
	// 							<p>
	// 								<b>{nft.token_name}</b> {`(${nft.status})`}
	// 							</p>
	// 							<p>{nft.token_description}</p>
	// 							<p>{nft.issue_date}</p>
	// 						</div>
	// 					))}
	// 				</div>
	// 			),
	// 		},
	// 		{
	// 			title: "created_on",
	// 			dataIndex: "created_on",
	// 			render: (_, { created_on }) => <span>{getDateString(created_on)}</span>,
	// 			// defaultSortOrder: "descend", // ascend
	// 			sorter: (a, b) => a.created_on - b.created_on,
	// 		},
	// 		{
	// 			title: "Referrals",
	// 			dataIndex: "referrals_count",
	// 			sorter: (a, b) => a.referrals_count - b.referrals_count,
	// 		},
	// 	],
	// 	[handleClose]
	// );

	const downloadInCsvHRef = useMemo(() => {
		try {
			const myUrlWithParams = new URL(
				`${auraYfretUserCollBaseUrl}${fetchLeaderboardUrl}`
			);

			myUrlWithParams.searchParams.append("response_format", "csv");
			for (const key in leaderboardParams) {
				myUrlWithParams.searchParams.append(
					key,
					JSON.stringify(leaderboardParams[key])
				);
			}

			return myUrlWithParams.href;
		} catch (error) {
			return "";
		}
	}, [leaderboardParams]);

	return (
		<div>
			<Modal
				isOpen={isOpen}
				headerText='Leaderboard'
				onClose={handleClose}
				size='md'>
				<div className={styles['container']}>
					{isLoading ? (
						<div className={styles['spinnerWrapper']}>
							<Spin size='large' />
						</div>
					) : (
						<div className={styles['contentWrapper']}>
							{usersData.count ? (
								<>
									{isAdminLoggedIn || isStoreAdminLoggedIn ? (
										<>
											{downloadInCsvHRef && (
												<div className={styles['downloadButtonWrapper']}>
													<a
														className={styles['downloadButton']}
														role='button'
														href={downloadInCsvHRef}
														download>
														Download in CSV
													</a>
												</div>
											)}

											<div className={styles['statsGrid']}>
												{usersData.count
													.filter((user) => user.is_display && user.display_type !== "timestamp")
													.map((user) => {
														return (
															<div key={user?.label} className={styles['statCard']}>
																<p className={styles['statValue']}>
																	{user?.value}
																</p>
																<p className={styles['statLabel']}>{user?.label}</p>
															</div>
														);
													})}

												{/* <div className='py-5 rounded-2xl bg-indigo-200 text-center'>
													<p className='text-4xl font-bold'>
														{usersData.count.brands}
													</p>
													<p className='font-bold'>Brands</p>
												</div>
												<div className='py-5 rounded-2xl bg-indigo-200 text-center'>
													<p className='text-4xl font-bold'>
														{usersData.count.transferred_NFT}
													</p>
													<p className='font-bold'>NFTs transferred</p>
												</div>
												{usersData.count.total_collections ? (
													<div className='py-5 rounded-2xl bg-indigo-200 text-center'>
														<p className='text-4xl font-bold'>
															{usersData.count.total_collections}
														</p>
														<p className='font-bold'>Collections Created</p>
													</div>
												) : null}
												{usersData.count.total_published_collections ? (
													<div className='py-5 rounded-2xl bg-indigo-200 text-center'>
														<p className='text-4xl font-bold'>
															{usersData.count.total_published_collections}
														</p>
														<p className='font-bold'>Collections Published</p>
													</div>
												) : null} */}
											</div>
											{usersData.count
												.filter((user) => user.is_display && user.display_type === "timestamp")
												.map((user) => {
													return (
														<div className={styles['timestampWrapper']}>
															<p className={styles['timestampLabel']}>
																{user?.label}
															</p>
															<p className={styles['timestampValue']}>{user?.value}</p>
														</div>
													);
												})}
											<div className={styles['tableWrapper']}>
												<Table
													className={styles['table']}
													columns={columns}
													dataSource={usersData.data}
													// onChange={onChange}
													pagination={false}
													rowKey='user_id'
												/>
											</div>
										</>
									) : (
										isStagingEnv && (
											<div className={styles['userViewGrid']}>
												<div className={styles['card']}>
													<div className={styles['cardHeader']}>
														Current Rankings
													</div>
													<div className={styles['cardContent']}>
														Congratulate the most active members of our
														community 🎉
													</div>
													<div className=''>
														<table className={styles['rankingsTable']}>
															{usersData.data.map((user, index) => (
																<tr>
																	<td>
																		<div className={styles['trophyWrapper']}>
																			{index === 0 ? (
																				<TrophyFilled className={styles['trophyGold']} />
																			) : null}
																			{index === 1 ? (
																				<TrophyFilled className={styles['trophySilver']} />
																			) : null}
																			{index === 2 ? (
																				<TrophyFilled className={styles['trophyBronze']} />
																			) : null}
																			<span
																				className={`${styles['rankNumber']} ${index < 3 ? styles['rankNumberWhite'] : ''}`}>
																				{index + 1}
																			</span>
																		</div>
																	</td>
																	<td>{user.total_collections}000 pts</td>
																	<td>
																		<img
																			className={styles['userAvatar']}
																			src={user.profile_image || defaultAvatar}
																		/>
																	</td>
																	<td>{user.user_name}</td>
																	<td>Congratulate 🎉</td>
																</tr>
															))}
														</table>
													</div>
												</div>
												<div className={`${styles['card']} ${styles['myPointsCard']}`}>
													<div className={styles['cardHeader']}>
														My Points
													</div>

													{authUser.user_id ? (
														<div className={styles['myPointsContent']}>
															<div>
																<div className={styles['userProfileSection']}>
																	<img
																		className={styles['userAvatarLarge']}
																		src={
																			authUser.profile_image || defaultAvatar
																		}
																	/>
																	<div className={styles['userInfo']}>
																		<p>
																			{authUser.first_name} {authUser.last_name}
																		</p>
																		<p>202000 points</p>
																	</div>
																</div>
																<div className={styles['shareButtonWrapper']}>
																	{showShareProfile && (
																		<ShareOptions
																			url={sharePageUrl}
																			setShow={setShowShareProfile}
																		/>
																	)}
																	{sharePageUrl && (
																		<button
																			className={styles['shareButton']}
																			onClick={() =>
																				setShowShareProfile(!showShareProfile)
																			}>
																			Share
																		</button>
																	)}
																</div>
															</div>
															<div>
																<p>Challenge completion progress: 66%</p>
																<p>Current rank: 6</p>
															</div>
														</div>
													) : null}
													<hr className={styles['divider']} />
													<p className={styles['challengeTitle']}>
														<b>Live a little, increase your ranking</b>
													</p>
													<hr className={styles['divider']} />
													<table className={styles['challengesTable']}>
														<tr>
															<th>Challenges</th>
															<th>Points Earned</th>
															<th>Max Points</th>
														</tr>

														<tr>
															<td>Create/Update profile</td>
															<td>200</td>
															<td>20000</td>
														</tr>
														<tr>
															<td>Create collections</td>
															<td>200</td>
															<td>20000</td>
														</tr>
														<tr>
															<td>Publish collections</td>
															<td>200</td>
															<td>20000</td>
														</tr>
													</table>
												</div>
											</div>
										)
									)}
								</>
							) : (
								!isLoading && (
									<div className={styles['noDataMessage']}>
										Unable to fetch details. Please try again later.
									</div>
								)
							)}
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default React.memo(Leaderboard);
