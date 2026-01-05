// not using
// old file location : pages/products/shop-widget.js
// old route : /products/shop-widget

import React from "react";

import publisher_page_AI_image from "../../../images/newStaticPageImages/publisher_page_AI_image.svg";
import plug_image from "../../../images/newStaticPageImages/productsPage/plug_image.svg";
import collections_icon from "../../../images/newStaticPageImages/productsPage/collections_icon.svg";
import http_lock_icon from "../../../images/newStaticPageImages/productsPage/http_lock_icon.svg";
import web3_icon from "../../../images/newStaticPageImages/productsPage/web3_icon.svg";
import analytics_icon from "../../../images/newStaticPageImages/productsPage/analytics_icon.svg";
import mobile_responsive_icon from "../../../images/newStaticPageImages/productsPage/mobile_responsive_icon.svg";
import theming_icon from "../../../images/newStaticPageImages/productsPage/theming_icon.svg";
import try_it_now from "../../../images/newStaticPageImages/productsPage/try_it_now.svg";
import collection_cover_1 from "../../../images/newStaticPageImages/productsPage/collection_cover_1.png";
import collection_cover_2 from "../../../images/newStaticPageImages/productsPage/collection_cover_2.png";
import collection_cover_3 from "../../../images/newStaticPageImages/productsPage/collection_cover_3.png";
import collection_cover_4 from "../../../images/newStaticPageImages/productsPage/collection_cover_4.png";
import collection_cover_5 from "../../../images/newStaticPageImages/productsPage/collection_cover_5.png";
import CarousalContainer from "../../../components/carousel/CarouselContainer";

export const carouselItems = [
	{
		title: "BT Collection",
		cover_image: collection_cover_1,
	},
	{
		title: "11 In-Flight Essentials",
		cover_image: collection_cover_2,
	},
	{
		title: "Backpacks & Rugsacks",
		cover_image: collection_cover_3,
	},
	{
		title: "Campaign Collection",
		cover_image: collection_cover_4,
	},
	{
		title: "Travel Essentials",
		cover_image: collection_cover_5,
	},
];

const ShopWidget = () => {
	return (
		<div className='font-firaSans'>
			<section className='mt-24 lg:mt-32 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto'>
				<div className='max-w-340 md:max-w-s-3 lg:max-w-xl-1 mx-auto text-center flex flex-col items-center'>
					<h1 className='text-4xl lg:text-7xl text-lightgray-101 font-normal font-firaSans'>
						A shopping widget for every article
					</h1>
					<p className='text-lightgray-104 text-xl lg:text-3xl-1 lg:leading-44 mx-auto'>
						Replace irrelevant ads to shoppable products.
					</p>
				</div>
			</section>

			<section className='bg-slate-900 lg:mx-12 2xl:mx-72 p-5 lg:p-14 mt-24 relative'>
				<img
					alt='try_it_now'
					src={try_it_now}
					className='absolute -top-24 md:-top-20 lg:-top-36 w-24 lg:w-auto'
				/>
				<div className='xl:max-w-screen-xl lg:max-w-4xl md:max-w-2xl max-w-sm w-full mx-auto'>
					<div>
						<h1 className='text-xl lg:text-xl-2 text-white lg:font-semibold '>
							My collections and products
						</h1>
					</div>
					<div className='pr-4 flex flex-wrap'>
						<div className='cursor-pointer rounded-full shadow mr-4 my-1 w-max bg-black-103'>
							<h5 className='m-0 px-2 sm:px-4 py-1 font-normal text-xs md:text-sm text-white'>
								Footwear
							</h5>
						</div>
						<div className='cursor-pointer rounded-full shadow mr-4 my-1 w-max bg-black-103'>
							<h5 className='m-0 px-2 sm:px-4 py-1 font-normal text-xs md:text-sm text-white'>
								Chess
							</h5>
						</div>
						<div className='cursor-pointer rounded-full shadow mr-4 my-1 w-max bg-black-103'>
							<h5 className='m-0 px-2 sm:px-4 py-1 font-normal text-xs md:text-sm text-white'>
								Summer Collection
							</h5>
						</div>
						<div className='cursor-pointer rounded-full shadow mr-4 my-1 w-max bg-black-103'>
							<h5 className='m-0 px-2 sm:px-4 py-1 font-normal text-xs md:text-sm text-white'>
								Daily Driver
							</h5>
						</div>
					</div>
				</div>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-6xl-3 mx-auto mt-7 lg:mt-14'>
					<CarousalContainer items={carouselItems} hideTitle />
				</div>
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between'>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-gray-103 font-normal'>
							Products that match{" "}
							<span className='whitespace-nowrap'>your content</span>
						</h1>
						<p className='max-w-lg text-lightgray-104 text-lg lg:text-xl-1.5'>
							AI-assisted product selection with final control to you. Because
							you know what your audience likes!
						</p>
					</div>
				</div>
				<div>
					{/* <img src={publisher_page_AI_image} alt='publisher_page_AI_image' /> */}
					<iframe
						className='rounded-2xl lg:rounded-32 w-80 md:w-504 xl:w-695 h-56 md:h-340 xl:h-456'
						width='100%'
						height='100%'
						src='https://www.youtube.com/embed/qbAjKSneXXM'
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen='allowFullScreen'></iframe>
				</div>
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between'>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-gray-103 font-normal'>
							Plug-n-Play
						</h1>
						<p className='max-w-lg text-lightgray-104 text-lg lg:text-xl-1.5 m-0'>
							Add a code snippet once and get matching products under every
							article automatically, with the control overrides that you need.
						</p>
						{/* <p className='max-w-lg text-lightgray-104 text-lg lg:text-xl-1.5 m-0 pt-1'>
							Speak naturally and see Aura help you find exactly what you need.
						</p> */}
					</div>
				</div>
				<div>
					<img src={plug_image} alt='plug_image' />
				</div>
			</section>
			<section className='mt-28 lg:mt-52 mb-28 lg:mb-60 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto '>
				<h1 className='text-3xl lg:text-5xl text-gray-103 text-center'>
					...& some more things ✨
				</h1>
				<div className='mt-9 lg:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-12 lg:gap-y-24'>
					<div className='flex items-start'>
						<img
							className='mt-0.75 lg:mt-0.5 w-5 lg:w-6'
							src={collections_icon}
							alt='collections_icon'
						/>
						<div className='px-5'>
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5'>
								Simple JS Code
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
								Blazing fast
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
							<h3 className='text-gray-103 text-xl lg:text-xl-1.5 xl:whitespace-nowrap'>
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
				</div>
			</section>
		</div>
	);
};

export default ShopWidget;
