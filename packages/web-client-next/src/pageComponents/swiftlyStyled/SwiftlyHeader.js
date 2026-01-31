import React from "react";
import Link from 'next/link';
import { useNavigate } from "../../helper/useNavigate";

import useTheme from "../../hooks/chat/useTheme";
import { PATH_ROOT } from "../../constants/codes";
import { THEME_ALL } from "../../constants/themeCodes";
import ChatContainer from "../storePage/ChatContainer";
import { UserProfileMenu } from "../storePage/UserProfileMenu";
import { getThemeCollectionsPagePath } from "../../helper/utils";
import { openWishlistModal } from "../wishlist/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { HeartOutlined } from "@ant-design/icons";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import walletIcon from "../../components/singleCollection/images/wallet_new.svg";
import Image from "next/image";
import  styles from './header.module.scss'

const SwiftlyHeader = ({
	disabledOutSideClick,
	config,
	trackCollectionData,
	isBTInstance,
	showProfileIcon,
	isUserFetching,
	headerProfileMenu,
	currentUser,
	isSwiftlyStyledInstance,
	isDoTheLookInstance,
	isRootPage,
	setisDropDown
}) => {
	const navigate = useNavigate();
	const { themeCodes } = useTheme();
	const dispatch = useDispatch();
	const onWishlistClick = () => {
		dispatch(openWishlistModal());
	};
	console.log('applied', currentUser.emailId ? 'hello' : null);

	const [storeData] = useSelector((state) => [state.store.data]);
	// console.log('zinsd',storeData.is_droppWallet_connect_enabled);
	return (
		<>
			<div
				className='hidden lg:flex items-center justify-center h-[30px] text-[13px] tracking-[1px] text-center px-3'
				style={{
					background: themeCodes.header.announcement_bar_bg,
					color: themeCodes.header.announcement_bar_text,
				}}>
				EVERY OUTFIT HAS A LOVE STORY – LET’S CREATE YOURS TOGETHER!
			</div>
			<div className='w-full' style={{ background: themeCodes.header.header_bg }}>

				<div
					id='heroesVillains_desktop_header_menu'
					className='w-full flex items-center justify-between lg:px-8 lg:py-2 lg:h-20'>
					{/* set width only to keep content center aligned */}
					<div className='w-40 hidden lg:flex items-center justify-start text-white cursor-pointer'>
						<div className={`${styles.logo}`} onClick={() => navigate(PATH_ROOT)}>
							{isSwiftlyStyledInstance ? "SwiftlyStyled" : "DoTheLook"}
						</div>
					</div>
					{/* {
							isSwiftlyStyledInstance ? (
								<ChatContainer
									disabledOutSideClick={disabledOutSideClick}
									config={config}
									trackCollectionData={trackCollectionData}
									isBTInstance={isBTInstance}
								/>
							) : isDoTheLookInstance && !isRootPage ? (
								// isDotheLookInstance true and not root page
								<ChatContainer
									disabledOutSideClick={disabledOutSideClick}
									config={config}
									trackCollectionData={trackCollectionData}
									isBTInstance={isBTInstance}
								/>
							) : null
						} */}

					<div className='flex-1 flex justify-center'>
						<ChatContainer
							disabledOutSideClick={disabledOutSideClick}
							config={config}
							trackCollectionData={trackCollectionData}
							isBTInstance={isBTInstance}
						/>
					</div>

					{/* set width only to keep the aura center aligned */}
					<div className=' hidden lg:flex justify-end'>
						<div className='collections flex items-center'>
							{
								storeData?.is_droppWallet_connect_enabled &&
							<button className="text-white mr-6 rounded" onClick={() => setisDropDown(true)} >
								<Image src={walletIcon} alt="wallet" height={30} width={30} className="rounded-xl" />
							</button>
							}

							<button className="text-white"
								onClick={() =>
									navigate(getThemeCollectionsPagePath(THEME_ALL))
								}>
								COLLECTIONS
							</button>

							{currentUser?.emailId ? (
								<FaRegHeart
									onClick={onWishlistClick}
									className='text-white cursor-pointer h-6 w-6 ml-6'
								/>
							) : null}
							{storeData?.pdp_settings?.is_add_to_cart_button && (
								<Link href='/cart' className="p-0">
									<FiShoppingCart className='text-white cursor-pointer ml-6 h-6 w-6' />
								</Link>
							)}
							<UserProfileMenu
								isUserFetching={isUserFetching}
								headerProfileMenu={headerProfileMenu}
								currentUser={currentUser}
								isSwiftlyStyledInstance={isSwiftlyStyledInstance}
								isDoTheLookInstance={isDoTheLookInstance}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SwiftlyHeader;
