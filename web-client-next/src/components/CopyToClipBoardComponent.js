import React, { useState } from "react";
import { Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../helper/copyToClipboard";
import styles from "./CopyToClipBoardComponent.module.css";

const CopyToClipBoardComponent = ({ textToCopy }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		await copyToClipboard(textToCopy);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 1500);
	};

	return (
		<Tooltip title={isCopied ? "Copied" : "Copy"}>
			<CopyOutlined className={styles.copyIcon} onClick={handleCopy} />
		</Tooltip>
	);
};

export default CopyToClipBoardComponent;
