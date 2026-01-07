// REMOVE
import React, { useState } from "react";
import Link from "next/link";
import { CaretRightFilled } from "@ant-design/icons";

import CarousalContainer from "../../components/carousel/CarouselContainer";

// import try_it_now from "../../images/newStaticPageImages/productsPage/try_it_now.svg";
import collection_cover_1 from "../../images/newStaticPageImages/productsPage/collection_cover_1.png";
import collection_cover_2 from "../../images/newStaticPageImages/productsPage/collection_cover_2.png";
import collection_cover_3 from "../../images/newStaticPageImages/productsPage/collection_cover_3.png";
import collection_cover_4 from "../../images/newStaticPageImages/productsPage/collection_cover_4.png";
import collection_cover_5 from "../../images/newStaticPageImages/productsPage/collection_cover_5.png";

const carouselItems = [
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

const RootStatic = () => {
	const [playVideo, setPlayVideo] = useState(true);

	return (
		<div className='font-firaSans'>
			<section className='lg:mt-32 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto px-5 md:px-0'>
				<div className='w-full publisher_title_container text-center flex flex-col items-center'>
					<h1 className='text-4xl lg:text-7xl text-lightgray-101 font-normal'>
						Revolutionizing Consumer
						{/* <br /> Experiences With AI */}
					</h1>
					<p className='text-lightgray-104 text-xl lg:text-3xl-1 lg:leading-44 mx-auto'>
						Welcome to the future of retail and e-commerce, <br /> where
						technology and real people come together to create a seamless and
						personalized shopping experience.
					</p>
				</div>
			</section>

			<section className='bg-slate-900 lg:mx-0 2xl:mx-0 p-5 lg:p-14 mt-24 lg:mt-36 relative'>
				{/* <img
					alt='try_it_now'
					src={try_it_now}
					className='absolute -top-24 md:-top-20 lg:-top-36 w-24 lg:w-auto'
				/> */}
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto'>
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
				{carouselItems?.length >= 5 ? (
					<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto mt-7 lg:mt-14'>
						<CarousalContainer items={carouselItems} hideTitle />
					</div>
				) : null}
			</section>

			<section className='mt-28 lg:mt-52 px-5 md:px-0'>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto text-center xl:text-left flex xl:gap-8 flex-col-reverse xl:flex-row items-center justify-between'>
					<div className='max-w-xl-1 w-full'>
						<h1 className='text-3xl lg:text-6xl text-lightgray-101 font-normal mt-10 lg:mt-16'>
							<span className='font-bold'>
								Contextual <br /> product discovery <br /> powered by AI and
								<br /> real people
							</span>{" "}
						</h1>
					</div>

					<div className='w-full relative'>
						{playVideo ? (
							<video
								autoPlay
								loop
								muted
								id='home_page_video'
								playsInline // to make it auto play on iphone
								poster='https://cdn.unthink.ai/img/unthink_ai/POSTER_BRANDS_INTRO.png'
								// poster='https://cdn.yfret.com/static/img/POSTER_BRANDS_INTRO.webp'
								className='rounded-xl'>
								<source
									src='https://cdn.unthink.ai/video/GIF_BRANDS_INTRO.mp4'
									// src='https://cdn.yfret.com/static/vid/GIF_BRANDS_INTRO.webm'
									type='video/mp4'
								/>
							</video>
						) : (
							<>
								<img
									id='home_page_poster'
									src='https://cdn.unthink.ai/img/unthink_ai/POSTER_BRANDS_INTRO.png'
									className='rounded-xl'
								/>

								<div
									className='absolute w-full h-full top-0 flex cursor-pointer'
									onClick={() => setPlayVideo(true)}>
									<CaretRightFilled className='text-white text-7xl m-auto' />
								</div>
							</>
						)}
					</div>
				</div>
			</section>

			<section className='mb-28 lg:mb-52 mt-9 lg:mt-24 px-5 md:px-0'>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto font-extrabold text-lightgray-104 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0'>
					<Link
						className='text-current cursor-pointer border border-current hover:text-blue-107 rounded-xl px-3 py-1'
						href='/brands'>
						Brands(Online and Offline)
					</Link>
					<Link
						className='text-current cursor-pointer border border-current hover:text-blue-107 rounded-xl px-3 py-1'
						href='/publishers'>
						Publishers, Influencers & Shopify brands
					</Link>
					<Link
						className='text-current cursor-pointer border border-current hover:text-blue-107 rounded-xl px-3 py-1'
						href='/pop-up-store'>
						Online Pop-up Store
					</Link>
				</div>
			</section>
		</div>
	);
};

export default RootStatic;
