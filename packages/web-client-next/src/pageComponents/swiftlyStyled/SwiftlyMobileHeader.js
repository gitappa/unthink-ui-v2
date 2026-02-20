import React, { useMemo } from "react";
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { Typography } from "antd";
import searchIcon from "../../images/swiftly-styled/Aura - Search.svg";
import userIcon from "../../images/swiftly-styled/User.svg";

import useTheme from "../../hooks/chat/useTheme";
import { setShowChatModal } from "../../hooks/chat/redux/actions";
import { PATH_ROOT, STORE_USER_NAME_SWIFTLYSTYLED } from "../../constants/codes";
import { current_store_name, is_store_instance } from "../../constants/config";
import styles from "./swiftlyMobileHeader.module.scss";

const SwiftlyMobileHeader = ({ showProfileIcon, setShowMenu,headerProfileMenu }) => {
	const { Text } = Typography;
	const dispatch = useDispatch();
	const router = useRouter();
	const navigate = (path) => router.push(path);
	const { themeCodes } = useTheme();
	
	// console.log('headerProfileMenu full:', headerProfileMenu);
	// console.log('headerProfileMenu.items:', headerProfileMenu?.items);
	
	// Extract all menu items data
	const extractedMenuData = headerProfileMenu?.items?.map((menuItem, idx) => ({
		index: idx,
		key: menuItem.key,
		className: menuItem.className,
		label: menuItem.label,
		onClick: menuItem.onClick ? 'has onClick' : 'no onClick'
	}));
	
	// console.log('Extracted menu items:', extractedMenuData[0].onClick);

	const isSwiftlyStyledInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED,
		[]
	);

	return (
		<>
			<div
				className={styles.announcementBar}
				style={{
					background: themeCodes.header.announcement_bar_bg,
					color: themeCodes.header.announcement_bar_text,
				}}>
				<span className={styles.announcementText}>
					EVERY OUTFIT HAS A LOVE STORY – LET'S CREATE YOURS TOGETHER!
				</span>
			</div>
			<div
				className={styles.headerContainer}
				style={{ height: "76px", background: themeCodes.header.header_bg }}>
				<button
					type='button'
					className={styles.searchButton}
					onClick={() => dispatch(setShowChatModal(true))}
					aria-label='Search'>
					<img
						src={searchIcon}
						alt='searchIcon'
						className={styles.searchIcon}
						style={{ filter: "invert(1)" }}
					/>
				</button>

				<div className={styles.logoContainer}>
					<span
						className={styles.logoText}
						onClick={() => navigate(PATH_ROOT)}>
						{isSwiftlyStyledInstance ? "SwiftlyStyled" : "DoTheLook"}
					</span>
				</div>

				<div className={styles.profileIconWrapper}>
					{showProfileIcon ? (
						<button
							type='button'
							className={styles.profileButton}
							style={{width:40}}
							onClick={() => setShowMenu(true)}
							aria-label='Open profile menu'>
							<img
								src={userIcon}
								alt='userIcon'
								className={styles.userIcon}
								style={{ filter: "invert(1)" }}
							/>
						</button>
					) : 
					<Text 
						ellipsis={true}
						onClick={() => navigate(extractedMenuData?.[0]?.label?.props?.href)}
						className='m-0 w-full xl:text-base text-white font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2 cursor-pointer'>
						SIGN IN
					</Text>
					}
				</div>
			</div>
		</>
	);
};

export default SwiftlyMobileHeader;
