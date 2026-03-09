import React, { useMemo } from "react";
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
} from "../../constants/codes";
import { current_store_name, is_store_instance } from "../../constants/config";
import styles from "./swiftlyMobileHeader.module.scss";
import { useSelector } from "react-redux";
import walletIcon from "../../components/singleCollection/images/wallet_new.svg";
import Image from "next/image";
import { getThemeCollectionsPagePath } from "../../helper/utils";

const SwiftlyMobileHeader = ({
  showProfileIcon,
  setShowMenu,
  headerProfileMenu,
}) => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const router = useRouter();
  const navigate = (path) => router.push(path);
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

  return (
    <>
      <div
        className={styles.announcementBar}
        style={{
          background: themeCodes.header.announcement_bar_bg,
          color: themeCodes.header.announcement_bar_text,
        }}
      >
        <span className={styles.announcementText}>
          EVERY OUTFIT HAS A LOVE STORY – LET'S CREATE YOURS TOGETHER!
        </span>
      </div>
      <div
        className={styles.headerContainer}
        style={{ height: "76px", background: themeCodes.header.header_bg }}
      >
        <div className={styles.logoContainer}>
          <span className={styles.logoText} onClick={() => navigate(PATH_ROOT)}>
            {isSwiftlyStyledInstance ? "SwiftlyStyled" : "DoTheLook"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={styles.collectionButton}
            style={{ color: "black" }}
            onClick={() => navigate(getThemeCollectionsPagePath(THEME_ALL))}
          >
            Collection
          </button>

          <button
            type="button"
            className={styles.searchButton}
            onClick={() => dispatch(setShowChatModal(true))}
            aria-label="Search"
          >
            <img
              src={searchIcon}
              style={{ filter: "grayscale(100%) brightness(40%)" }}
              alt="searchIcon"
              className={styles.searchIcon}
              // style={{ filter: "invert(1)" }}
            />
          </button>

          {storeData?.is_droppWallet_connect_enabled && (
            <Image
              src={walletIcon}
              style={{ filter: "brightness(0) opacity(10)" }}
              onClick={() => setisDropDown(true)}
              alt="wallet"
              height={24}
              width={24}
              className={styles.walletIcon}
            />
          )}

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
                  style={{ filter: "grayscale(100%) brightness(40%)" }}
                  src={userIcon}
                  alt="userIcon"
                  className={styles.userIcon}
                  // style={{ filter: "invert(1)" }}
                />
              </button>
            ) : (
              <Text
                ellipsis={true}
                onClick={() =>
                  navigate(extractedMenuData?.[0]?.label?.props?.href)
                }
                className="m-0 w-full xl:text-base  font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2 cursor-pointer"
                style={{ color: "#4F4F4F" }}
              >
                SIGN IN
              </Text>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SwiftlyMobileHeader;
