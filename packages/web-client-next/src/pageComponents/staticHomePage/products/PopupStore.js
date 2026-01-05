import React from "react";
import Image from "next/image";
import { useNavigate } from "../../../helper/useNavigate";

import store_product_image from "../../../images/newStaticPageImages/store_product_image.svg";
import publisher_page_AI_image from "../../../images/newStaticPageImages/publisher_page_AI_image.svg";
import aura_into_image from "../../../images/newStaticPageImages/aura_into_image.svg";
import recommendations_image from "../../../images/newStaticPageImages/recommendations_image.svg";
import collections_icon from "../../../images/newStaticPageImages/productsPage/collections_icon.svg";
import http_lock_icon from "../../../images/newStaticPageImages/productsPage/http_lock_icon.svg";
import web3_icon from "../../../images/newStaticPageImages/productsPage/web3_icon.svg";
import analytics_icon from "../../../images/newStaticPageImages/productsPage/analytics_icon.svg";
import mobile_responsive_icon from "../../../images/newStaticPageImages/productsPage/mobile_responsive_icon.svg";
import leaderboard_icon from "../../../images/newStaticPageImages/productsPage/leaderboard_icon.svg";
import campaign_icon from "../../../images/newStaticPageImages/productsPage/campaign_icon.svg";
import theming_icon from "../../../images/newStaticPageImages/productsPage/theming_icon.svg";
import catalog_icon from "../../../images/newStaticPageImages/productsPage/catalog_icon.svg";
import ContactUs from "../../../components/staticPageComponents/ContactUs";
import { ROUTES } from "../../../constants/codes";

const PopupStore = () => {
	const navigate = useNavigate();
	return (
		<div className='font-firaSans'>
			<section className='mt-24 lg:mt-32 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto'>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl mx-auto text-center flex flex-col items-center'>
					<h1 className='text-4xl lg:text-7xl text-lightgray-101 font-normal font-firaSans'>
						An <span className='font-bold'>online</span> pop-up{" "}
						<span className='font-bold'>store</span> that just...
						<span className='font-bold'>“Pops”</span>
					</h1>
					<p className='text-lightgray-104 text-xl lg:text-3xl-1 lg:leading-44 font-firaSans max-w-sm lg:max-w-lg mx-auto'>
						Build Plug-and-play store pages in under 2 minutes with Unthink.AI
					</p>
				</div>
				<Image
					className='pt-7 mx-auto px-8 lg:px-0'
					src={store_product_image}
					alt='store_product_image'
					width={958}
					height={815}
				/>
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between'>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-gray-103 font-normal'>
							Products curated by{" "}
							<span className='whitespace-nowrap'>AI + Humans</span>
						</h1>
						<p className='max-w-lg text-lightgray-104 text-lg lg:text-xl-1.5'>
							Your audience only gets contextual shopping suggestions that are
							relevant to the content they consume on your site.
						</p>
					</div>
				</div>
				<div>
					<img src={publisher_page_AI_image} alt='publisher_page_AI_image' />
				</div>
			</section>
			<section className='mt-28 lg:mt-52'>
				<h1 className='text-3xl lg:text-5xl text-gray-103 text-center max-w-xs px-0.75 lg:max-w-480 mx-auto'>
					Take Personalization to the next level
				</h1>
				<div className='px-4 pt-10 lg:pt-20 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between'>
					<div>
						<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
							<h1 className='text-3xl lg:text-3xl-1 lg:leading-44 text-gray-103 font-normal'>
								Aura - Smart Voice Assistant
							</h1>
							<p className='max-w-lg text-lightgray-104 text-lg lg:text-xl-1.5 m-0'>
								The next best thing to a real store assistant.
							</p>
							<p className='max-w-lg lg:pr-2.5 text-lightgray-104 text-lg lg:text-xl-1.5'>
								Speak naturally and see Aura help you find exactly what you
								need.
							</p>
						</div>
					</div>
					<div>
						<video
							src='https://cdn.unthink.ai/video/search_red_dress.mp4' // BE url updated
							className='rounded-32 max-w-480 max-h-340 w-full h-full'
							autoPlay={true}
							loop
							muted
							type='video/mp4'></video>
					</div>
				</div>
			</section>
			<section className='mt-28 lg:mt-52'>
				<div className='lg:pt-20 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between'>
					<div>
						<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
							<h1 className='text-3xl lg:text-3xl-1 lg:whitespace-nowrap lg:leading-44 text-gray-103 font-normal'>
								1-1 Personalized Recommendations
							</h1>
							<p className='max-w-md text-lightgray-104 text-lg lg:text-xl-1.5 m-0'>
								Our AI engine learns the user’s taste in real time. Oh, and did
								we mention that the recommendations are super quick, and
								relevant?
							</p>
						</div>
						<div className='flex items-center justify-center lg:justify-start pt-6'>
							<div className='border-r-2 border-white border-opacity-25 pr-6'>
								<h4 className='m-0 text-3xl-1 leading-44 text-white'>20+</h4>
								<h6 className='m-0 text-xl text-white'>Parameters</h6>
							</div>
							<div className='pl-6'>
								<h4 className='m-0 text-3xl-1 leading-44 text-white'>
									0.2 sec
								</h4>
								<h6 className='m-0 text-xl text-white'>Recommendations</h6>
							</div>
						</div>
					</div>
					<div>
						<img src={recommendations_image} alt='recommendations_image' />
					</div>
				</div>
			</section>
			{/* more things sections */}
			<section className='mt-28 lg:mt-52'>
				<h1 className='text-3xl lg:text-5xl text-gray-103 text-center'>
					...& some more things ✨
				</h1>
				<div className='mt-9 lg:mt-24 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-12 lg:gap-y-24'>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={collections_icon}
							alt='collections_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Collections
							</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								React to trends immediately with quick collection pages
							</p>
						</div>
					</div>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={http_lock_icon}
							alt='http_lock_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Connect to your own domain
							</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								Rich content on your site by hosting influencer collections
							</p>
						</div>
					</div>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={web3_icon}
							alt='web3_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>Web 3</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								Become part of the first live web3 shopping community.
							</p>
						</div>
					</div>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={analytics_icon}
							alt='analytics_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Google Analytics Integration
							</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								Track the performance of the collections on your own Google
								Analytics account.
							</p>
						</div>
					</div>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={mobile_responsive_icon}
							alt='mobile_responsive_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Mobile Responsive
							</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								The collection pages adapt to any screen size or resolution
								automatically
							</p>
						</div>
					</div>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={leaderboard_icon}
							alt='leaderboard_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Leaderboard
							</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								Supercharge your campaigns and grow your following with
								leaderboards for your brand ambassadors
							</p>
						</div>
					</div>

					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={campaign_icon}
							alt='campaign_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Campaign Analytics
							</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								Measure the ROI of the campaign down to which influencers enable
								the best engagement and conversions
							</p>
						</div>
					</div>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={theming_icon}
							alt='theming_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>Theming</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								Customize the fonts and colors to match your website
							</p>
						</div>
					</div>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={catalog_icon}
							alt='catalog_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Catalog Classifier
							</h3>
							<p className='max-w-xs text-lightgray-104 text-base lg:text-xl'>
								Talk to us about our catalog classifier that can auto-correct
								your product catalog and optimize it for search
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className='mt-28 lg:mt-52 mb-28 lg:mb-60'>
				<ContactUs
					title='Create your own store in under 2 minutes!'
					id='popUpStore_contact_form'
					// onSuccessCallback={(email) => {
					// 	navigate(ROUTES.TRY_FOR_FREE_PAGE);
					// }}
				/>
			</section>
		</div>
	);
};

export default PopupStore;
