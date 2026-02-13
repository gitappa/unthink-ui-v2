import React, { useMemo, useState } from "react";
import { useRouter } from 'next/router';
import { EditOutlined } from "@ant-design/icons";
import { Image, Typography } from "antd";

import ShareOptions from "../shared/shareOptions";
import { getFinalImageUrl } from "../../helper/utils";
import {
	home_page_url,
	instance_logo,
	is_store_instance,
} from "../../constants/config";

// import verified_icon from "../../images/profilePage/verified_icon.svg";
// import header_darktheme from "../../images/chat/header_darktheme_toggle.svg";
// import header_aura from "../../images/chat/header_aura_image.png";
import unthink_black_log from "../../images/unthink_black_log.svg";
import defaultAvatar from "../../images/avatar.svg";
import share_icon from "../../images/profilePage/share_icon.svg";
import unthink_favicon from "../../images/staticpageimages/unthink_favicon.png";
import { PROFILE } from "../../constants/codes";
import styles from "./ProfileComponent.module.css";

const { Text } = Typography;

const ProfileComponent = ({
	sharePageUrl,
	pageUser,
	name,
	showBanner = false,
	showRoundedImage = false,
	qrCodeGeneratorURL,
	isPageOwner,
	isGuestUser,
	isMyProfilePage,
}) => {
	const router = useRouter();
	const navigate = (path) => router.push(path);
	const [showShareProfile, setShowShareProfile] = useState(false);

	const isShowBanner = useMemo(
		() => showBanner && !!pageUser.cover_image,
		[showBanner, pageUser.cover_image]
	);

	return (
		<div>
			<div>
				{isShowBanner && (
					<div>
						<Image
							src={getFinalImageUrl(pageUser.cover_image)}
							preview={false}
							width={"100%"}
							className={styles['banner-image']}
						/>

						<div className={styles['logo-container']}>
							{instance_logo ? (
								<Image
									src={instance_logo}
									width={100}
									preview={false}
									className={styles['logo-image']}
									onClick={() => home_page_url && navigate(home_page_url)}
								/>
							) : !is_store_instance ? (
								<Image src={unthink_favicon} width={29} preview={false} />
							) : null}
						</div>
					</div>
				)}
				<div
					className={`${styles['profile-container']} ${isShowBanner ? styles['profile-container-with-banner'] : styles['profile-container-without-banner']}`}>
					<div className={`${isShowBanner ? styles['profile-image-wrapper-with-banner'] : styles['profile-image-wrapper']}`}>
						<Image
							src={getFinalImageUrl(pageUser.profile_image) || defaultAvatar}
							preview={false}
							className={styles['profile-image']}
							width={"100%"}
						/>
					</div>
					<div className={styles['profile-content']}>
						<div className={styles['profile-header']}>
							<div className={styles['profile-info']}>
								<h1
									className={styles['profile-name']}>
									{name}
								</h1>
								{/* {!getIsCollectionPage() && (
									<div className='flex'>
										<Image
											className='w-full'
											src={verified_icon}
											preview={false}
										/>
									</div>
								)} */}
								{/* powered by unthink */}
								{is_store_instance && (
									<div className={styles['powered-by-container']}>
										<span className={styles['powered-by-text']}>powered by</span>&nbsp;
										<a
											href='https://unthink.ai/'
											target='_blank'
											className={styles['powered-by-link']}>
											<Image
												src={unthink_black_log}
												preview={false}
												height={"100%"}
												className={styles['powered-by-logo']}
											/>
										</a>
									</div>
								)}

								<div className={styles['description-container']}>
									<Text className={styles['description-text']}>
										{pageUser.description || "Take a look at my collections"}
									</Text>
								</div>
							</div>
							<div className={styles['actions-container']}>
								{isMyProfilePage && !isGuestUser && isPageOwner && (
									<EditOutlined
										title='Edit Collection'
										className={styles['edit-icon']}
										onClick={
											() => navigate(PROFILE) // redirection to edit profile page
										}
									/>
								)}
								<div className={styles['share-container']}>
									{showShareProfile && (
										<>
										<ShareOptions
											url={qrCodeGeneratorURL}
											setShow={setShowShareProfile}
											isOpen={showShareProfile}
											onClose={() => setShowShareProfile(false)}
											qrCodeGeneratorURL={qrCodeGeneratorURL}
											true
											/>
										 
											</>
									)}
									{/* // added div for responsive in mobile ui */}
									{sharePageUrl && (
										<div className={styles['share-icon-wrapper']}>
											<Image
												className={styles['share-icon']}
												src={share_icon}
												preview={false}
												onClick={() => setShowShareProfile(!showShareProfile)}
											/>
										</div>
									)}
								</div>
								{/* <img
									className='w-20 lg:w-25 h-20 lg:h-25 object-cover'
									src={qrCodeGeneratorURL}
								/> */}
							</div>
							{/* <div className='pl-4 lg:hidden flex'>
								<Image src={header_darktheme} preview={false} width={33} />
							</div> */}
						</div>
						<div className={styles['description-mobile']}>
							<Text className={styles['description-text']}>
								{pageUser.description || "Take a look at my collections"}
							</Text>
						</div>
					</div>
				</div>
			</div>
			{/* <div className='max-w-6xl-1 mx-auto hidden lg:flex justify-between items-center w-full pt-16'>
				<div className='block w-full pr-4'>
					<Text className='text-sm max-w-3xl-1 w-full'>
						{detailsToShow?.description || "Take a look at my collections"}
					</Text>
					{detailsToShow?.blog_url && (
						<div className='flex items-center'>
							<h1 className='text-sm pt-2'>
								See the full article{" "}
								<a
									className='text-primary underline p-0'
									href={detailsToShow?.blog_url}>
									here
								</a>
							</h1>
							<CopyToClipBoardComponent textToCopy={detailsToShow?.blog_url} />
						</div>
					)}
				</div>
				<div className='flex justify-end w-full items-center'>
					<Image
						src={header_aura}
						preview={false}
						onClick={() => dispatch(setChatUserAction(AURA_CLICK))}
						className='cursor-pointer'
					/>
					<div className='pl-4'>
						<div className='flex items-center'>
							<h1 className='m-0 font-semibold text-xl-2 leading-8 pr-4'>
								Aura
							</h1>
							<div
								className='cursor-pointer w-6 flex'
								onClick={() => dispatch(setChatMute(!isMute))}>
								{isMute ? (
									<Image src={icon_volume_mute} preview={false} height={14} />
								) : (
									<Image src={icon_volume} preview={false} height={14} />
								)}
							</div>
						</div>
						<h1 className='m-0 text-xl'>Your new shopping assistant</h1>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default ProfileComponent;
