import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Typography } from "antd";
import searchIcon from "../../images/swiftly-styled/Aura - Search.svg";
import userIcon from "../../images/swiftly-styled/User.svg";

import useTheme from "../../hooks/chat/useTheme";
import { setShowChatModal } from "../../hooks/chat/redux/actions";
import {
  PATH_ROOT,
  STORE_USER_NAME_SWIFTLYSTYLED,
  ROUTES,
} from "../../constants/codes";
import { current_store_name, is_store_instance } from "../../constants/config";
import styles from "./swiftlyMobileHeader.module.scss";
import { useSelector } from "react-redux";
import walletIcon from "../../components/singleCollection/images/wallet_new.svg";
import Image from "next/image";
import { getThemeCollectionsPagePath } from "../../helper/utils";
import { THEME_ALL } from "../../constants/themeCodes";
import { openWishlistModal } from "../wishlist/redux/actions";
import { FaRegHeart } from "react-icons/fa6";
import { BsBookmarkPlusFill } from "react-icons/bs";

const SwiftlyMobileHeader = ({
  showProfileIcon,
  setShowMenu,
  headerProfileMenu,
  setisDropDown
}) => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const router = useRouter();
  const navigate = useCallback((path) => {
    if (router.isReady && path) {
      router.push(path);
    }
  }, [router]);
  const { themeCodes } = useTheme();
  const [storeData] = useSelector((state) => [state.store.data]);
  // console.log('headerProfileMenu full:', headerProfileMenu);
  // console.log('headerProfileMenu.items:', headerProfileMenu?.items);

  // Extract all menu items data
  const extractedMenuData = headerProfileMenu?.items?.map((menuItem, idx) => ({
    index: idx,
    key: menuItem.key,
    className: menuItem.className,
    label: menuItem.label,
    onClick: menuItem.onClick ? "has onClick" : "no onClick",
  }));

  // console.log('Extracted menu items:', extractedMenuData[0].onClick);

  const isSwiftlyStyledInstance = useMemo(
    () =>
      is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED,
    [],
  );
  const onWishlistClick = () => {
    dispatch(openWishlistModal());
  };
  // console.log('storeData?.website_tagline',storeData?.website_tagline);
  
  return (
    <>
      <div
        className={styles.announcementBar}
        style={{
          background: themeCodes.header.announcement_bar_bg,
          color: themeCodes.header.announcement_bar_text,
        }}
      >
        <span className={styles.announcementText} 
        style={{display: storeData?.website_tagline === '' ? 'none' : ''}}
        >
           {storeData?.website_tagline ? storeData?.website_tagline : 'EVERY OUTFIT HAS A LOVE STORY – LET’S CREATE YOURS TOGETHER!' }
        </span>
      </div>
      <div
        className={styles.headerContainer}
        style={{ height: "76px", background: themeCodes.header.header_bg }}
      >
        <div className={styles.logoContainer}>
          <span className={styles.logoText} onClick={() => navigate(PATH_ROOT)}>
            {is_store_instance && current_store_name}
          </span> 
        </div>
        <div className="flex items-center gap-2.5">
          <button
            className={styles.collectionButton}
            style={{ color: "#4F4F4F" ,fontWeight:600,fontSize:14,fontFamily:''}}
            onClick={() => navigate(getThemeCollectionsPagePath(THEME_ALL))}
          >

            Collections
          </button>

          <button
            type="button"
            className={styles.searchButton}
            onClick={() => dispatch(setShowChatModal(true))}
            aria-label="Search"
          >
            <img
              src={searchIcon}
              style={{ filter: "brightness(0) opacity(0.7)" }}
              alt="searchIcon"
              className={styles.searchIcon}
              // style={{ filter: "invert(1)" }}
            />
          </button>

          {/* {storeData?.is_droppWallet_connect_enabled && (
            <Image
              src={walletIcon}
              style={{ filter: "brightness(0) opacity(0.7)" }}
              onClick={() => setisDropDown(true)}
              alt="wallet"
              height={24}
              width={24}
              className={styles.walletIcon}
            />
          )} */}

          <BsBookmarkPlusFill
                                onClick={onWishlistClick}
                                   style={{ filter: "brightness(0) opacity(0.7)" ,height:24,width:24}}
            
            
              height={24}
              width={24}
                                className={styles.walletIcon}
                              />


          <div className={styles.profileIconWrapper}>
            {showProfileIcon ? (
              <button
                type="button"
                className={styles.profileButton}
                // style={{width:40}}
                onClick={() => setShowMenu(true)}
                aria-label="Open profile menu"
              >
                <img
                  style={{ filter: "brightness(0) opacity(0.7)" }}
                  src={userIcon}
                  alt="userIcon"
                  className={styles.userIcon}
                  // style={{ filter: "invert(1)" }}
                />
              </button>
            ) : (
              <Text
                ellipsis={true}
                onClick={() => {
                  const signInPath = is_store_instance ? ROUTES.SIGN_IN_PAGE : ROUTES.TRY_FOR_FREE_PAGE;
                  navigate(signInPath);
                }}
                className="m-0 w-full xl:text-base  font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2 cursor-pointer"
                style={{ color: "#4F4F4F" }}
              >
                Sign In
              </Text>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SwiftlyMobileHeader;
