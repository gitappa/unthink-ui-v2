import React from "react";
import { Dropdown, Typography, Tooltip } from "antd";
import Image from "next/image";

import userIcon from "../../images/swiftly-styled/User.svg";
import userProfileIcon from "../../images/swiftly-styled/userprofile.png";
import avatarImg from "../../images/avatar-black.svg";
import Link from "next/link";

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
				// trigger={["click"]}
				destroyOnHidden>
				<div className='pl-3 xl:pl-6 flex items-center cursor-pointer'>
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
									<Image src={userProfileIcon} alt='userIcon' width={24} height={24} style={{ fill: 'white' }} />
									{/* <BiSolidUserCircle /> */}
								</Tooltip>
							) : (
								<Text
									ellipsis={true}
									className='m-0 xl:text-base text-white font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2'>
									SIGN IN
								</Text>
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
									<Image src={userIcon} alt='userIcon' className="h-6" width={24} height={24} />
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
