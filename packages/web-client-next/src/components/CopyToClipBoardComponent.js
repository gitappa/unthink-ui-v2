import React, { useState } from "react";
import { Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import styles from "./CopyToClipBoardComponent.module.css";

const CopyToClipBoardComponent = ({ textToCopy }) => {
	const [isCopied, setIsCopied] = useState(false);

	return (
		<CopyToClipboard
			text={textToCopy}
			onCopy={() => {
				setIsCopied(true);
				setTimeout(() => {
					setIsCopied(false);
				}, 1500);
			}}>
			<Tooltip title={isCopied ? "Copied" : "Copy"}>
				<CopyOutlined className={styles.copyIcon} />
			</Tooltip>
		</CopyToClipboard>
	);
};

export default CopyToClipBoardComponent;
