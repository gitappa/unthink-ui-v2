import React, { useCallback, useState } from "react";
import { useNavigate } from "../../helper/useNavigate";
import { Drawer, Image } from "antd";
import { CloseOutlined, HomeOutlined } from "@ant-design/icons";

import { samskaraHeaderMenu } from "./SamskaraHeader";

import drawerMenuIcon from "../../images/drawerMenuIcon.svg";
import avatarImg from "../../images/avatar-black.svg";
import downArrowIcon from "../../images/downArrowIcon.svg";
import samskaraLogo from "../../images/samskara_instance_logo.png";
import {
	SIMILAR_MODAL_Z_INDEX,
	STORE_USER_NAME_SAMSKARA,
	MAIN_SITE_URL,
} from "../../constants/codes";

import styles from './samskaraHeader.module.scss';

const SamskaraMobileHeader = ({ showProfileIcon, setShowMenu }) => {
	const navigate = useNavigate();
	const [openMenu, setOpenMenu] = useState(false);
	const [activeMenu, setActiveMenu] = useState([]);

	const toggleSubMenu = useCallback(
		(menu) => {
			if (activeMenu.includes(menu)) {
				setActiveMenu(activeMenu.filter((item) => item !== menu));
			} else {
				setActiveMenu([...activeMenu, menu]);
			}
		},
		[activeMenu]
	);

	return (
		<div
			className='flex items-center justify-between bg-white py-2 px-4'
			style={{ height: "78.11px" }}>
			<div className='flex flex-row items-center gap-4'>
				<Image
					src={drawerMenuIcon}
					width={32}
					preview={false}
					className='cursor-pointer h-8 text-black-101'
					onClick={() => setOpenMenu(true)}
				/>
				{/* <HomeOutlined
					className='flex text-2xl cursor-pointer mb-1.25'
					onClick={() => navigate(PATH_ROOT)}
				/> */}
			</div>

			<div>
				<Image
					src={samskaraLogo}
					width={180}
					preview={false}
					className='cursor-pointer'
					onClick={() => navigate(MAIN_SITE_URL[STORE_USER_NAME_SAMSKARA])}
				/>
			</div>

			{/* show profile menu mobile UI on user profile icon click */}
			<div>
				{showProfileIcon ? (
					<Image
						src={avatarImg}
						preview={false}
						className='cursor-pointer pr-1 pl-2'
						onClick={() => setShowMenu(true)}
					/>
				) : null}
			</div>

			<Drawer
				closable={true}
				open={openMenu}
				placement='left'
				width={350}
				title=' '
				closeIcon={
					<CloseOutlined
						className='text-black-101 h-4 w-4 stroke-current stroke-13 cursor-pointer'
						onClick={() => setOpenMenu(false)}
					/>
				}
				styles={{
					body: {
						padding: "0px",
					}
				}}
				zIndex={SIMILAR_MODAL_Z_INDEX}
				className='samskara_mobile_drawer_menu'>
				<div className='px-5'>
				{samskaraHeaderMenu && samskaraHeaderMenu.map((menu) => {
					return menu && menu.href ? (
							<div
								key={menu.label}
								className='flex flex-col border-t border-gray-107'>
								<div className='flex items-center justify-between'>
									<a
										className='w-full text-lg text-black-101 py-3.5 pr-5 pl-0 leading-none cursor-pointer'
										href={menu.href}
										target='_blank'>
										{menu.label}
									</a>
									{menu?.children ? (
										<div
											className='w-10 flex items-center justify-end border-l border-gray-107 cursor-pointer'
											onClick={() => toggleSubMenu(menu.label)}>
											<button
												className={`transition-transform transform ${
													activeMenu.includes(menu.label)
														? "rotate-180"
														: "rotate-0"
												}`}>
												<img src={downArrowIcon} preview={false} />
											</button>
										</div>
									) : null}
								</div>

						{menu?.children && activeMenu.includes(menu.label)
							? menu.children?.map((subMenu) => {
									return subMenu && subMenu.href ? (
										<a
											key={subMenu.label}
											className='text-xs text-black-101 py-1.75 px-0 cursor-pointer'
											href={subMenu.href}
											target='_blank'>
											{subMenu.label}
										</a>
									) : null;
								})
							: null}
							</div>
					) : null;
				})}
				</div>
			</Drawer>
		</div>
	);
};

export default SamskaraMobileHeader;
