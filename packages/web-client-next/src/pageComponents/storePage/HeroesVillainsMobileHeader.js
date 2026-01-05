import React, { useCallback, useState } from "react";
import { useNavigate } from "../../helper/useNavigate";
import { Drawer, Image } from "antd";
import { CloseOutlined, MenuOutlined, HomeOutlined } from "@ant-design/icons";

import { heroesVillainsHeaderMenu } from "./HeroesVillainsHeader";

import avatarImg from "../../images/avatar-black.svg";
import downArrowIcon from "../../images/downArrowIcon.svg";
import heroesVillainsLogo from "../../images/heroesvillains_instance_logo.webp";
import {
	SIMILAR_MODAL_Z_INDEX,
	MAIN_SITE_URL,
	STORE_USER_NAME_HEROESVILLAINS,
} from "../../constants/codes";

import styles from './heroesVillainsHeader.module.scss';

const HeroesVillainsMobileHeader = ({ showProfileIcon, setShowMenu }) => {
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
				<MenuOutlined
					width={32}
					preview={false}
					className='cursor-pointer h-8 text-black-101 text-2xl flex items-center'
					onClick={() => setOpenMenu(true)}
				/>
				{/* <HomeOutlined
					className='flex text-2xl cursor-pointer mb-1.5'
					onClick={() => navigate(PATH_ROOT)}
				/> */}
			</div>

			<div className='flex w-14 sm:w-18.5'>
				<Image
					src={heroesVillainsLogo}
					preview={false}
					className='cursor-pointer'
					onClick={() =>
						navigate(MAIN_SITE_URL[STORE_USER_NAME_HEROESVILLAINS])
					}
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
						className='flex items-center text-black-101 h-9 w-9 stroke-current stroke-13 cursor-pointer'
						onClick={() => setOpenMenu(false)}
					/>
				}
				styles={{
					body: {
						padding: "0px",
					}
				}}
				zIndex={SIMILAR_MODAL_Z_INDEX}
				className='heroesVillains_mobile_drawer_menu'>
				<div className='px-5'>
					{heroesVillainsHeaderMenu && heroesVillainsHeaderMenu.map((menu) => {
						return menu && menu.href ? (
							<div
								key={menu.label}
								className='flex flex-col border-b border-gray-107'>
								<div className='flex items-center justify-between'>
									<a
										className='w-full text-base text-black-101 font-light py-5 pr-5 pl-0 leading-6 cursor-pointer'
										href={menu.href}
										target='_blank'>
										{menu.label}
									</a>
									{menu?.children ? (
										<div
											className='w-10 flex items-center justify-end cursor-pointer'
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
												className='text-sm text-black-101 font-light py-1.75 px-0 cursor-pointer'
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

export default HeroesVillainsMobileHeader;
