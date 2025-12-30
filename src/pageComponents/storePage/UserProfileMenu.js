import React from "react";
import { Image, Dropdown, Typography, Tooltip } from "antd";

import avatarImg from "../../images/avatar-black.svg";
import userIcon from "../../images/swiftly-styled/User.svg";
import Link from "next/link";

const { Text } = Typography;

export const UserProfileMenu = ({
	isUserFetching,
	headerProfileMenu,
	currentUser,
	isSwiftlyStyledInstance = false,
	isDoTheLookInstance = false,

}) => {
	// URLSearchParamS
	const dropdownMenuProps =
		headerProfileMenu && Array.isArray(headerProfileMenu?.items)
			? { menu: headerProfileMenu }
			: Array.isArray(headerProfileMenu)
				? { menu: { items: headerProfileMenu } }
				: { overlay: headerProfileMenu };

	return (
		<>
			<Dropdown
				overlayClassName='fixed'
				disabled={isUserFetching}
				{...dropdownMenuProps}
				trigger={["click"]}
				destroyOnHidden>
				<div className='pl-3 xl:pl-6 lg:flex items-center hidden cursor-pointer'>
					{isSwiftlyStyledInstance || isDoTheLookInstance ? (
						<div className="flex gap-2 items-center">
							{currentUser?.user_name ? (
								// <Text
								// 	title={currentUser?.user_name}
								// 	ellipsis={true}
								// 	className='m-0 xl:text-base text-white font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2'>
								// 	{currentUser?.user_name}
								// </Text>
								<Tooltip title={currentUser?.user_name ? currentUser?.user_name : ""}>
									<img src={userIcon} alt='userIcon' />
								</Tooltip>
							) : (
								<Text
									ellipsis={true}
									className='m-0 xl:text-base text-white font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2'>
									SIGN IN
								</Text>
							)}
							{/* <Tooltip title={currentUser?.user_name ? currentUser?.user_name : ""}>
								<img src={userIcon} alt='userIcon' />
							</Tooltip> */}
						</div>
					) : (
						<>
							{currentUser?.user_name ? (
								// <img src={userIcon} alt='userIcon' />

								<Tooltip title={currentUser?.user_name ? currentUser?.user_name : ""} placement="top" >
									<img src={userIcon} alt='userIcon' className="h-6 " />
								</Tooltip>
								// <Text
								// 	title={currentUser?.user_name}
								// 	ellipsis={true}
								// 	className='m-0 xl:text-base font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2'>
								// 	{currentUser?.user_name}
								// </Text>
							) : (
								<>
								 
								<Text
									ellipsis={true}
									className='m-0 xl:text-base font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2'>
									SIGN IN
								</Text>
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
