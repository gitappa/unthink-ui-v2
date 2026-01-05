import React, { useCallback, useState } from "react";
import {
	BarsOutlined,
	ThunderboltOutlined,
	WarningOutlined,
} from "@ant-design/icons";

import { TAGS_TITLE } from "../../constants/codes";

const MENU_ITEMS = {
	CREATE_CONTENT: "CREATE_CONTENT",
	PUBLISH_AND_SHARE: "PUBLISH_AND_SHARE",
	CONNECT_WALLET: "CONNECT_WALLET",
	REDEEM_REWARDS: "REDEEM_REWARDS",
};

const menuItems = [
	{
		key: "1",
		title: "1. Create Content",
		value: MENU_ITEMS.CREATE_CONTENT,
	},
	{
		key: "2",
		title: "2. Publish and share",
		value: MENU_ITEMS.PUBLISH_AND_SHARE,
	},
	// hidden 3. Connect your wallet and 4. Redeem rewards menu for now
	// {
	// 	key: "3",
	// 	title: "3. Connect your wallet",
	// 	value: MENU_ITEMS.CONNECT_WALLET,
	// },
	// {
	// 	key: "4",
	// 	title: "4. Redeem rewards",
	// 	value: MENU_ITEMS.REDEEM_REWARDS,
	// },
];

const ReviewCollectionStepHelp = ({
	className = "",
	hideGetStarted = false,
	onGetStarted = () => {},
}) => {
	const [step, setStep] = useState(MENU_ITEMS.CREATE_CONTENT);

	const handleNextClick = useCallback(
		() =>
			setStep((val) => {
				switch (val) {
					case MENU_ITEMS.CREATE_CONTENT:
						return MENU_ITEMS.PUBLISH_AND_SHARE;
					case MENU_ITEMS.PUBLISH_AND_SHARE:
						return MENU_ITEMS.CONNECT_WALLET;
					case MENU_ITEMS.CONNECT_WALLET:
						return MENU_ITEMS.REDEEM_REWARDS;
					default:
						return val;
				}
			}),
		[]
	);

	const handlePreviousClick = useCallback(
		() =>
			setStep((val) => {
				switch (val) {
					case MENU_ITEMS.REDEEM_REWARDS:
						return MENU_ITEMS.CONNECT_WALLET;
					case MENU_ITEMS.CONNECT_WALLET:
						return MENU_ITEMS.PUBLISH_AND_SHARE;
					case MENU_ITEMS.PUBLISH_AND_SHARE:
						return MENU_ITEMS.CREATE_CONTENT;
					default:
						return val;
				}
			}),
		[]
	);

	return (
		<div className={`help-step-container ${className}`}>
			<div className='text-xl font-medium text-lightgray-104 flex items-center overflow-auto leading-none'>
				{menuItems.map((i) => (
					<p
						role='tab'
						onClick={() => setStep(i.value)}
						key={i.key}
						className={`whitespace-nowrap text-current mx-2 p-0 xl:mx-3 cursor-pointer ${
							step === i.value
								? "text-slat-104 font-extrabold border-b-2 border-solid border-current"
								: ""
						}`}>
						{i.title}
					</p>
				))}
			</div>
			<div className='mt-10 px-2'>
				{step === MENU_ITEMS.CREATE_CONTENT ? (
					<>
						<div className='grid grid-cols-1 tablet:grid-cols-5 gap-4'>
							<div className='tablet:col-span-2 text-lg'>
								<p>
									First, think of something fun to write about, using prompts
									like: 10 packing essentials for a weekend roadtrip
								</p>
								<p className='mt-5'>
									Choose the {TAGS_TITLE} to find products that match the
									article.
								</p>
								<p className='mt-5'>
									Use the filter and multi-select features to narrow down the
									collection to suit your taste
								</p>
								<p className='mt-5'>
									Showcase products to feature on the top, and delete the ones
									you do not want!
								</p>
								<p className='mt-5'>
									Add more products any time using Aura Search.
								</p>
							</div>
							<div className='tablet:col-span-3'>
								<iframe
									width='100%'
									src='https://www.youtube.com/embed/DgDl3Cxp9xE'
									title='Create Collection'
									frameborder='0'
									className='rounded-2xl tablet:rounded-32 h-56 tablet:h-60 desktop:h-340'
									allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
									// allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
									allowfullscreen='allowfullscreen'></iframe>
							</div>
						</div>
						<div className='example-container grid grid-cols-1 tablet:grid-cols-3 gap-4 mt-16'>
							<div className='text-lg grid grid-cols-1 gap-4 h-content'>
								<div className='text-2xl text-center'>
									<BarsOutlined className='text-3xl' />
									<h3 className='mt-4'>Examples</h3>
								</div>
								<div className='example-content rounded-xl px-5 py-4'>
									What should I carry when I go camping?
								</div>
								<div className='example-content rounded-xl px-5 py-4'>
									What should I look for when I buy a backpack for hiking?
								</div>
								<div className='example-content rounded-xl px-5 py-4'>
									Give me some gift ideas for a teenager who likes to hike.
								</div>
							</div>
							<div className='text-lg grid grid-cols-1 gap-4 h-content'>
								<div className='text-2xl text-center'>
									<ThunderboltOutlined className='text-3xl' />
									<h3 className='mt-4'>Capabilities</h3>
								</div>
								<div className='capability-content rounded-xl px-5 py-4'>
									Write content from scratch.
								</div>
								<div className='capability-content rounded-xl px-5 py-4'>
									Match products to existing blogs.
								</div>
								<div className='capability-content rounded-xl px-5 py-4'>
									Create an FAQ.
								</div>
								<div className='capability-content rounded-xl px-5 py-4'>
									Enhance a product description.
								</div>
							</div>
							<div className='text-lg grid grid-cols-1 gap-4 h-content'>
								<div className='text-2xl text-center'>
									<WarningOutlined className='text-3xl' />
									<h3 className='mt-4'>Limitations</h3>
								</div>
								<div className='limitation-content rounded-xl px-5 py-4'>
									It sometimes takes a long time to match products.
								</div>
								<div className='limitation-content rounded-xl px-5 py-4'>
									The content written from scratch can sometimes sound
									repetitive.
								</div>
							</div>
						</div>
					</>
				) : null}
				{step === MENU_ITEMS.PUBLISH_AND_SHARE ? (
					<div className='grid grid-cols-1 tablet:grid-cols-5 gap-4'>
						<div className='tablet:col-span-2 text-lg'>
							<p>Add a nice title image and edit the slug URL if needed.</p>
							<p className='mt-5'>
								Preview the page and if you are ready, go ahead and publish your
								collection
							</p>
							<p className='mt-5'>
								Coming soon: You can host the page anywhere you want!
							</p>
						</div>
						<div className='tablet:col-span-3'>
							<iframe
								width='100%'
								src='https://www.youtube.com/embed/wpvyOchjBdY'
								title='Publish and share'
								frameborder='0'
								className='rounded-2xl tablet:rounded-32 h-56 tablet:h-60 desktop:h-340'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								// allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
								allowfullscreen='allowfullscreen'></iframe>
						</div>
					</div>
				) : null}
				{step === MENU_ITEMS.CONNECT_WALLET ? (
					<div className='grid grid-cols-1 tablet:grid-cols-5 gap-4'>
						<div className='tablet:col-span-2 text-white text-lg'>
							<p>Connect your wallet to receive your first NFT!</p>
						</div>
						<div className='tablet:col-span-3'>
							<iframe
								width='100%'
								src='https://www.youtube.com/embed/lrp-F00TPbs'
								title='Connect wallet'
								frameborder='0'
								className='rounded-2xl tablet:rounded-32 h-56 tablet:h-60 desktop:h-340'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								// allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
								allowfullscreen='allowfullscreen'></iframe>
						</div>
					</div>
				) : null}
				{step === MENU_ITEMS.REDEEM_REWARDS ? (
					<div className='grid grid-cols-1 tablet:grid-cols-5 gap-4'>
						<div className='tablet:col-span-2 text-white text-lg'>
							<p>
								Go on to the rewards page which is only accessible to NFT
								holders.
							</p>
							<p className='mt-5'>
								Explore rewards from giftcards, games, and other web3
								communities!
							</p>
						</div>
						<div className='tablet:col-span-3'>
							<img
								src='https://cdn.unthink.ai/img/unthink_main_2023/trophy_GIf.gif'
								alt='NFT reward'
								className='rounded-2xl tablet:rounded-32 w-full min-h-180 tablet:min-h-228 desktop:min-h-400'
							/>
						</div>
					</div>
				) : null}
			</div>
			<div className='flex justify-end gap-4 mt-6'>
				{/* hidden for last menu items */}
				{!hideGetStarted && step !== MENU_ITEMS.PUBLISH_AND_SHARE ? (
					<button
						onClick={onGetStarted}
						className='min-w-24 md:min-w-40 text-xs md:text-sm z-10 mt-4 md:mt-0 rounded-md py-2.5 px-3.5 h-full font-bold text-indigo-103 border-2 border-indigo-103'>
						Skip Tutorial
					</button>
				) : null}
				{step !== MENU_ITEMS.CREATE_CONTENT ? (
					<button
						onClick={handlePreviousClick}
						className='min-w-24 md:min-w-40 text-xs md:text-sm z-10 mt-4 md:mt-0 rounded-md py-2.5 px-3.5 h-full font-bold text-indigo-103 border-2 border-indigo-103'>
						Previous
					</button>
				) : null}
				{/* hidden for last menu items */}
				{step !== MENU_ITEMS.PUBLISH_AND_SHARE ? (
					<button
						onClick={handleNextClick}
						type='submit'
						className='min-w-24 md:min-w-40 text-xs md:text-sm z-10 mt-4 md:mt-0 bg-indigo-103 border-none rounded-md py-3 px-3.5 h-full font-bold text-white'>
						Next
					</button>
				) : null}
				{/* show for last menu items */}
				{!hideGetStarted && step === MENU_ITEMS.PUBLISH_AND_SHARE ? (
					<button
						onClick={onGetStarted}
						type='submit'
						className='min-w-24 md:min-w-40 text-xs md:text-sm z-10 mt-4 md:mt-0 bg-indigo-103 border-none rounded-md py-3 px-3.5 h-full font-bold text-white'>
						Get Started
					</button>
				) : null}
			</div>
		</div>
	);
};

export default React.memo(ReviewCollectionStepHelp);
