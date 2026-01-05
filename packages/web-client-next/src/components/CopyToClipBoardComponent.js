import React, { useState } from "react";
import { Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";

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
				<CopyOutlined className='pl-2 text-sm leading-none align-text-top cursor-pointer' />
			</Tooltip>
		</CopyToClipboard>
	);
};

export default CopyToClipBoardComponent;
