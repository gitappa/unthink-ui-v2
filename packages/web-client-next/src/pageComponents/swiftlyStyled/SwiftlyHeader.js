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
import styles from './SwiftlyHeader.module.css';

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
				className={styles.announcementBar}
				style={{
					background: themeCodes.header.announcement_bar_bg,
					color: themeCodes.header.announcement_bar_text,
				}}>
				EVERY OUTFIT HAS A LOVE STORY – LET’S CREATE YOURS TOGETHER!
			</div>
			<div className={styles.headerWrapper} style={{ background: themeCodes.header.header_bg }}>

				<div
					id='heroesVillains_desktop_header_menu'
					className={styles.headerContent}>
					{/* set width only to keep content center aligned */}
					<div className={styles.logoContainer}>
						<div className={styles.logo} onClick={() => navigate(PATH_ROOT)}>
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

					{/* <div className='flex-1 flex justify-center'> */}
					<ChatContainer
						disabledOutSideClick={disabledOutSideClick}
						config={config}
						trackCollectionData={trackCollectionData}
						isBTInstance={isBTInstance}
					/>
					{/* </div> */}

					{/* set width only to keep the aura center aligned */}
					<div className={styles.rightSection}>
						<div className={styles.collections}>
							{
								storeData?.is_droppWallet_connect_enabled &&
								<Image src={walletIcon} onClick={() => setisDropDown(true)} alt="wallet" height={24} width={24} className={styles.walletIcon} />
							}

							<button className={styles.collectionButton}
								onClick={() =>
									navigate(getThemeCollectionsPagePath(THEME_ALL))
								}>
								COLLECTIONS
							</button>

							{currentUser?.emailId ? (
								<FaRegHeart
									onClick={onWishlistClick}
									className={styles.wishlistIcon}
								/>
							) : null}
							{storeData?.pdp_settings?.is_add_to_cart_button && (
								<Link href='/cart' className={styles.cartLink}>
									<FiShoppingCart className={styles.cartIcon} />
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
