import React from "react";
import { Image } from "antd";

import auth_need_help_aura from "../../images/staticpageimages/auth_need_help_aura.png";

export default function NeedHelpSection() {
	return (
		<div className='h-full flex items-center justify-center flex-col'>
			<Image
				className='rounded-full shadow-lg'
				src={auth_need_help_aura}
				preview={false}
			/>
			<p className='text-3xl font-medium mt-4'>Need help? Ask Aura!</p>
		</div>
	);
}
