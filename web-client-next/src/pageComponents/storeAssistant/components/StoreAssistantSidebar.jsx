import React from "react";
import { FiExternalLink, FiX } from "react-icons/fi";

import styles from "../StoreAssistantDashboard.module.scss";

const StoreAssistantSidebar = ({ navItems, activeTab, onSelectNavItem, mobileMenuOpen }) => (
  <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ""}`}>
    <div className={styles.sidebarHeader}>
      <span>Assistant Tools</span>
      <FiX />
    </div>
    <nav className={styles.navList}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.type === "tab" && item.key === activeTab;
        return (
          <button
            type="button"
            key={item.key}
            className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
            onClick={() => onSelectNavItem(item)}
          >
            <span className={styles.navIcon}><Icon /></span>
            <span>
              <strong>{item.label}</strong>
              {item.description ? <small>{item.description}</small> : null}
            </span>
            {item.type === "event" ? <FiExternalLink className={styles.externalIcon} /> : null}
          </button>
        );
      })}
    </nav>
  </aside>
);

export default StoreAssistantSidebar;
