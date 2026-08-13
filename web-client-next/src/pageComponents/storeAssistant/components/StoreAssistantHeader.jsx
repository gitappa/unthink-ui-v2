import React from "react";
import { Dropdown } from "antd";
import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";

import { getAssistantDisplayName } from "../utils/storeAssistantAccess";
import styles from "../StoreAssistantDashboard.module.scss";

const StoreAssistantHeader = ({
  authUser,
  storeData,
  profileItems,
  onSelectProfileItem,
  onMenuClick,
}) => {
  const router = useRouter();
  const menuItems = [
    ...profileItems.map((item) => ({
      key: item.key,
      label: item.label,
      icon: <item.icon />,
      onClick: () => onSelectProfileItem(item),
    })),
    { type: "divider" },
    {
      key: "signout",
      label: "Sign Out",
      icon: <FiLogOut />,
      onClick: () => router.push("/signout?redirect=/signin"),
    },
  ];

  return (
    <header className={styles.header}>
      <button type="button" className={styles.mobileMenuButton} onClick={onMenuClick}>
        <FiMenu />
      </button>
      <div className={styles.brandBlock}>
        <div className={styles.brandMark}>A</div>
        <div>
          <p>{storeData?.store_name || storeData?.user_name || "Store"}</p>
          <h2>Assistant Dashboard</h2>
        </div>
      </div>

      <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
        <button type="button" className={styles.profileButton}>
          <span>{getAssistantDisplayName(authUser)}</span>
          <FiUser />
        </button>
      </Dropdown>
    </header>
  );
};

export default StoreAssistantHeader;
