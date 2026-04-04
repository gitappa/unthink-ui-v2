import React from "react";
import { Dropdown, Typography, Tooltip } from "antd";
import Image from "next/image";

import userIcon from "../../images/swiftly-styled/User.svg";
import userProfileIcon from "../../images/swiftly-styled/userprofile.png";
import avatarImg from "../../images/avatar-black.svg";
import Link from "next/link";
import { ROUTES } from "../../constants/codes";
import { is_store_instance } from "../../constants/config";
import useTheme from "../../hooks/chat/useTheme";
 
const { Text } = Typography;

export const UserProfileMenu = ({
	isUserFetching,
	headerProfileMenu,
	currentUser,
	isSwiftlyStyledInstance = false,
	isDoTheLookInstance = false,
	isMobileMenu = false,
	onClose
}) => {
		const { themeCodes } = useTheme();
	console.log('dfdffvzsc',themeCodes.header.fills);
	
	const items = headerProfileMenu?.items || [];

	const dropdownMenuProps =
		headerProfileMenu && Array.isArray(headerProfileMenu?.items)
			? { menu: headerProfileMenu }
			: Array.isArray(headerProfileMenu)
				? { menu: { items: headerProfileMenu } }
				: { overlay: headerProfileMenu };

	if (isMobileMenu) {
		return (
			<div className="flex flex-col items-center gap-8 w-full py-10">
				{items.map((item) => (
					<div
						key={item.key}
						onClick={() => {
							item.onClick && item.onClick();
							onClose && onClose();
						}}
						className="text-xl font-medium text-white cursor-pointer hover:opacity-80 transition-opacity"
					>
						{item.label}
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			<Dropdown
				overlayClassName='fixed'
				disabled={isUserFetching}
				{...dropdownMenuProps}
				trigger={["click"]}
				destroyOnHidden>
				<div className=' flex items-center cursor-pointer'>
					{isSwiftlyStyledInstance || isDoTheLookInstance ? (
						<div className="flex gap-1 items-center">
							{currentUser?.user_name ? (
								// <Text
								// 	title={currentUser?.user_name}
								// 	ellipsis={true}
								// 	className='m-0 xl:text-base text-white font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2'>
								// 	{currentUser?.user_name}
								// </Text>
								<>
									<p className="header-username" style={{color: themeCodes.header.textColor,}}>{currentUser?.user_name.length > 10 ? currentUser?.user_name.slice(0, 10) + '...' : currentUser?.user_name}</p>
									<Image src={userProfileIcon} alt='userIcon' width={24} height={24} style={{ fill:'white' , filter:themeCodes?.header?.fills ? themeCodes.header.fills : 'brightness(0) opacity(0.7)' }} />
								</>
							) : (
								<Link href={is_store_instance ? ROUTES.SIGN_IN_PAGE : ROUTES.TRY_FOR_FREE_PAGE}>
									<Text
										ellipsis={true}
										className='m-0 lg:text-base   font-bold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2' style={{ color:themeCodes?.header?.textColor? themeCodes?.header?.textColor :  '#4F4F4F' }}>
										Sign In
									</Text>
								</Link>
							)}
							{/* <Tooltip title={currentUser?.user_name ? currentUser?.user_name : ""}>
								<Image src={userIcon} alt='userIcon' width={24} height={24} />
							</Tooltip> */}
						</div>
					) : (
						<>
							{currentUser?.user_name ? (
								// <Image src={userIcon} alt='userIcon' width={24} height={24} />

								<Tooltip title={currentUser?.user_name ? currentUser?.user_name : ""} placement="top" >
									<Image src={userIcon} alt='userIcon' className="h-6" width={24} height={24} style={{  filter:themeCodes?.header?.fills ? themeCodes?.header?.fills : 'brightness(0) opacity(0.7)' }} />
								</Tooltip>
								// <Text
								// 	title={currentUser?.user_name}
								// 	ellipsis={true}
								// 	className='m-0 xl:text-base font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2'>
								// 	{currentUser?.user_name}
								// </Text>
							) : (
								<>
									<Link href={is_store_instance ? ROUTES.SIGN_IN_PAGE : ROUTES.TRY_FOR_FREE_PAGE}>
										<Text
											ellipsis={true}
											className='m-0 xl:text-base font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2' style={{ color:themeCodes?.header?.textColor? themeCodes?.header?.textColor :  '#4F4F4F' }} >
											Sign In
										</Text>
									</Link>
								</>
							)}
							{/* <Image src={avatarImg} preview={false} className='pr-1 pl-2' /> */}
						</>
					)}
				</div>
			</Dropdown>
		</>
	);
};
