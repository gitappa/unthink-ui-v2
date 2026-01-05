import React from "react";
import { Image } from "antd";

import header_aura from "../../images/chat/header_aura_image.png";
import star_ai_icon_logo from "../../images/unthink_star_ai_icon.svg";


const MobileChat = ({ onChatClick }) => {
	return (
		<div onClick={onChatClick} className='flex flex-col items-center self-baseline'>
			<Image
				src={star_ai_icon_logo}
				className='rounded-full cursor-pointer'
				preview={false}
				width={30}
			/>
			<h1 className='text-xs text-center m-0 text-black-200 dark:text-white'>Search</h1>
		</div>
	);
};

export default MobileChat;
