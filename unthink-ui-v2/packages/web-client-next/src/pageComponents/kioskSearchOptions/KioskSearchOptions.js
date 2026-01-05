import React from "react";

import aura_assistant from "../../images/chat/aura_assistant_image.png";
// import listening_avatar from "../../images/videos/listening_avatar.gif";

import styles from './kioskSearchOptions.module.scss';

export const KioskSearchOptions = ({
	displaySearchOptions,
	handleSetSearchOption,
}) => {
	return (
		<div
			id='kiosk-search-options'
			className='flex flex-col items-center justify-center h-full'>
			<div className='pt-0 max-w-4xl lg:max-w-3xl-2 2xl:max-w-6xl-2 w-full px-10 lg:px-0'>
				<div className='max-w-s-3 tablet:max-w-lg desktop:max-w-964 flex justify-center flex-col items-center'>
					<div className='relative mb-6 w-full'>
						<div className='bubble bubble-bottom-left ml-auto md:ml-24 w-full-50 md:w-full-100 md:max-w-640 p-2.5 md:p-4.5'>
							How can i help you today ?
						</div>
						<img
							src={aura_assistant}
							className='w-24 md:w-32 rounded-full bg-orange-100 cursor-pointer mt-6'
						/>
					</div>
				</div>
				<div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
					{displaySearchOptions.map((searchOptions) => (
						<div
							className={`flex flex-col border-2 border-gray-106 shadow-md w-full rounded-xl px-3.5 md:px-5 py-3.5 md:py-5 text-left font-medium cursor-pointer bg-lightgray-101`}
							onClick={() => handleSetSearchOption(searchOptions)}>
							<div className='flex justify-between'>
								<div
									className={`truncate text-xl md:text-xl-1.5 text-black-100`}>
									{searchOptions.title}
								</div>
							</div>

							<div
								className={`ellipsis_2 text-base md:text-lg font-normal text-black-101 opacity-80`}>
								{searchOptions.subTitle}
							</div>

							<div className={`ellipsis_2 text-base font-normal text-gray-106`}>
								{searchOptions.text_example}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
