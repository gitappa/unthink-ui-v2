import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./Loader.module.css";

const PageLoader = ({ isLoading = false }) =>
	isLoading ? (
		<div className={styles.pageLoaderOverlay}>
			<Spin indicator={<LoadingOutlined className={styles.pageLoaderIcon} spin />} />
		</div>
	) : null;

export default React.memo(PageLoader);
