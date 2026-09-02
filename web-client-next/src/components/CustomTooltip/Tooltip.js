import React from "react";
import { Popover } from "antd";

import close_bg_icon from "../../images/close_bg_icon.svg";

const Tooltip = ({
	headerText,
	messageText,
	children,
	onClose,
	placement = "bottomRight",
	color = "black",
	...rest
}) => {
	const content = (
		<div onClick={(e) => e.stopPropagation()}>
			<div className='float-right rounded-full'>
				<img
					className='cursor-pointer'
					src={close_bg_icon}
					alt=""
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}
				/>
			</div>
			{headerText ? (
				<h1 className='m-0 text-[28px] font-bold text-white'>{headerText}</h1>
			) : null}
			{messageText ? (
				<h2 className='text-xl font-medium text-white'>{messageText}</h2>
			) : null}
		</div>
	);
console.log('Helo World')
	return (
		<Popover
			placement={placement}
			content={content}
			arrowContent='as'
			overlayInnerStyle={{
				opacity: "0.8",
				backgroundColor: "rgba(0, 0, 0)",
				borderRadius: "12px",
			}}
			color={color}
			{...rest}>
			{children}
		</Popover>
	);
};

export default Tooltip;
