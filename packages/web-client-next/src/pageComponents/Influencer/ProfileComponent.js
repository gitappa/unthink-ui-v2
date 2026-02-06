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
							style={{ aspectRatio: "3.1/1" }}
							src={getFinalImageUrl(pageUser.cover_image)}
							preview={false}
							width={"100%"}
							className='h-full object-cover lg:rounded-2xl'
						/>

						<div className='absolute top-3 left-3 block lg:hidden ml-11'>
							{instance_logo ? (
								<Image
									src={instance_logo}
									width={100}
									preview={false}
									className='max-h-12 object-contain cursor-pointer'
									onClick={() => home_page_url && navigate(home_page_url)}
								/>
							) : !is_store_instance ? (
								<Image src={unthink_favicon} width={29} preview={false} />
							) : null}
						</div>
					</div>
				)}
				<div
					className={`mx-4 block lg:flex ${isShowBanner ? "lg:mx-12" : "lg:mx-0"
						}`}>
					<div className={`${isShowBanner ? "-mt-16 lg:-mt-28" : "pt-2"}`}>
						<Image
							src={getFinalImageUrl(pageUser.profile_image) || defaultAvatar}
							preview={false}
							className={`${showRoundedImage ? "rounded-10" : "rounded-10"
								} object-cover max-w-s-2 w-120 lg:w-260 h-120 lg:h-260 backdrop-filter shadow-md`}
							width={"100%"}
						/>
					</div>
					<div className='w-full flex flex-col xl:flex-row'>
						<div className='flex justify-between gap-4 my-4 w-full'>
							<div className='flex lg:w-full flex-col gap-2 lg:gap-4'>
								<h1
									className={`text-xl md:text-3xl lg:text-4xl lg:leading-72 font-medium m-0 capitalize lg:px-6`}>
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
									<div className='flex items-center gap-1 lg:px-6 mt-1 lg:mt-0'>
										<span className='text-sm text-gray-106 whitespace-nowrap'>powered by</span>&nbsp;
										<a
											href='https://unthink.ai/'
											target='_blank'
											className='flex p-0'>
											<Image
												src={unthink_black_log}
												preview={false}
												height={"100%"}
												className='cursor-pointer h-3 lg:h-4'
											/>
										</a>
									</div>
								)}

								<div className='w-full lg:px-6 mt-2 hidden xl:flex'>
									<Text className='text-sm lg:text-lg leading-6 max-w-3xl-1 w-full whitespace-pre-line'>
										{pageUser.description || "Take a look at my collections"}
									</Text>
								</div>
							</div>
							<div className="flex gap-4 items-start">
								{isMyProfilePage && !isGuestUser && isPageOwner && (
									<EditOutlined
										title='Edit Collection'
										className='flex text-xl lg:text-xl-2 cursor-pointer'
										onClick={
											() => navigate(PROFILE) // redirection to edit profile page
										}
									/>
								)}
								<div className='relative flex justify-between'>
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
										<div className='flex w-5 lg:w-6'>
											<Image
												className='cursor-pointer'
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
						<div className='w-full lg:px-6 mt-2 flex xl:hidden'>
							<Text className='text-sm lg:text-lg leading-6 max-w-3xl-1 w-full whitespace-pre-line'>
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
