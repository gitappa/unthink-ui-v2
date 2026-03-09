import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
	const headerWrapperRef = useRef(null);
	const headerContentRef = useRef(null);
	const stickyStartYRef = useRef(0);
	const [isHeaderFixed, setIsHeaderFixed] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [fixedLayout, setFixedLayout] = useState({ left: 0, width: 0 });

	const onWishlistClick = () => {
		dispatch(openWishlistModal());
	};
	// console.log('applied', currentUser.emailId ? 'hello' : null);

	const [storeData] = useSelector((state) => [state.store.data]);
	const syncStickyMetrics = useCallback(() => {
		if (!headerWrapperRef.current || !headerContentRef.current) {
			return;
		}
 
		const wrapperRect = headerWrapperRef.current.getBoundingClientRect();
		const contentRect = headerContentRef.current.getBoundingClientRect();

		stickyStartYRef.current = wrapperRect.top + window.scrollY;
		setHeaderHeight((prevHeight) =>
			prevHeight !== contentRect.height ? contentRect.height : prevHeight
		);
		setFixedLayout((prevLayout) => {
			const nextLayout = {
				left: wrapperRect.left,
				width: wrapperRect.width,
			};

			if (
				prevLayout.left === nextLayout.left &&
				prevLayout.width === nextLayout.width
			) {
				return prevLayout;
			}

			return nextLayout;
		});
	}, []);

	const handleStickyScroll = useCallback(() => {
		const shouldFixHeader = window.scrollY >= stickyStartYRef.current;
		setIsHeaderFixed((prevState) =>
			prevState !== shouldFixHeader ? shouldFixHeader : prevState
		);
	}, []);

	const handleStickyResize = useCallback(() => {
		syncStickyMetrics();
		handleStickyScroll();
	}, [handleStickyScroll, syncStickyMetrics]);

	useEffect(() => {
		handleStickyResize();

		window.addEventListener('scroll', handleStickyScroll, { passive: true });
		window.addEventListener('resize', handleStickyResize);

		return () => {
			window.removeEventListener('scroll', handleStickyScroll);
			window.removeEventListener('resize', handleStickyResize);
		};
	}, [handleStickyResize, handleStickyScroll]);

	useEffect(() => {
		if (!isHeaderFixed) {
			return;
		}

		syncStickyMetrics();
	}, [isHeaderFixed, syncStickyMetrics]);

	const headerContentStyle = useMemo(() => {
		if (!isHeaderFixed) {
			return undefined;
		}

		return {
			position: 'fixed',
			top: 0,
			left: `${fixedLayout.left}px`,
			width: `${fixedLayout.width}px`,
			zIndex: 60,
			background: themeCodes.header.header_bg,
			// borderRadius:'12px'
		};
	}, [fixedLayout.left, fixedLayout.width, isHeaderFixed, themeCodes.header.header_bg]);

	// console.log('zinsd',storeData.is_droppWallet_connect_enabled);
	return (
		<>
			<div
				className={styles.announcementBar}
				style={{
					background: themeCodes.header.announcement_bar_bg,
					color: themeCodes.header.announcement_bar_text,
					fontWeight: themeCodes.header.font_weight,
				}}>
				EVERY OUTFIT HAS A LOVE STORY – LET’S CREATE YOURS TOGETHER!
			</div>
			<div
				ref={headerWrapperRef}
				className={styles.headerWrapper}
				style={{
					background: themeCodes.header.header_bg,
					minHeight: isHeaderFixed ? `${headerHeight}px` : undefined,
					margin: isHeaderFixed ? 0 : undefined,
				}}>

				<div
					ref={headerContentRef}
					id='heroesVillains_desktop_header_menu'
					className={styles.headerContent}
					style={headerContentStyle}>
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
							

							<button className={styles.collectionButton}
								onClick={() =>
									navigate(getThemeCollectionsPagePath(THEME_ALL))
								}>
								Collections
							</button>
							{
								storeData?.is_droppWallet_connect_enabled &&
								<Image src={walletIcon} style={{filter:'brightness(0) opacity(0.7)'}} onClick={() => setisDropDown(true)} alt="wallet" height={24} width={24} className={styles.walletIcon} />
							}

							{currentUser?.emailId ? (
								<FaRegHeart style={{filter:'brightness(0) opacity(0.7)'}}
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
