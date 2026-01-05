// REMOVE
import React, { useState } from "react";
import Image from "next/image";
import { useNavigate } from "../../helper/useNavigate";
import { CaretRightFilled } from "@ant-design/icons";

import forzieriLogo from "../../images/newStaticPageImages/brands/forzieri.svg";
import jcpennyLogo from "../../images/newStaticPageImages/brands/jcpenny.svg";
import bebeLogo from "../../images/newStaticPageImages/brands/bebe.svg";
import hurlayLogo from "../../images/newStaticPageImages/brands/hurlay.svg";
import perryellisLogo from "../../images/newStaticPageImages/brands/perryellis.svg";
// import campaign_flow from "../../images/newStaticPageImages/brands/campaign_flow.svg";
// import channel_flow from "../../images/newStaticPageImages/brands/channel_flow.svg";
import ContactUs from "../../components/staticPageComponents/ContactUs";
import AudienceTab from "../../components/staticPageComponents/AudienceTab";
import ContactUsField from "../../components/staticPageComponents/ContactUsField";
import { ROUTES } from "../../constants/codes";

const Brands = () => {
	const navigate = useNavigate();
	const [playVideo, setPlayVideo] = useState(true);

	return (
		<div className='font-firaSans'>
			<section className='mt-16 lg:mt-20'>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-7xl xl:px-8 mx-auto text-center xl:text-left flex xl:gap-8 flex-col-reverse xl:flex-row items-center justify-between'>
					<div className='max-w-xl-1 w-full'>
						<h1 className='text-4xl lg:text-7xl text-lightgray-101 font-normal font-firaSans mt-10 lg:mt-16'>
							<span className='font-bold'>
								Engage your customers contextually
							</span>{" "}
						</h1>
						<p className='text-lightgray-104 text-xl lg:text-3xl-1 lg:leading-44 font-firaSans max-w-2xl mx-auto mb-3'>
							With products matching their need
						</p>
						<ContactUsField
							id='brands_contact_field_top'
							inputProps={{
								style: {
									background: "rgba(255, 255, 255, 0.1)",
									color: "white",
								},
							}}
							collectFullInfo
							clearEmailOnSuccess
							buttonText='Request a demo'
						/>
					</div>

					<div className='w-full relative'>
						{playVideo ? (
							<video
								autoPlay
								loop
								muted
								id='home_page_video'
								playsInline // to make it auto play on iphone
								poster='https://cdn.yfret.com/static/img/POSTER_BRANDS_INTRO.png'
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
									src='https://cdn.yfret.com/static/img/POSTER_BRANDS_INTRO.png'
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
			{/* <section className='px-4 mt-28 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto'>
				<div className='relative max-w-6xl mx-auto trusbar_container'>
					<div className='flex flex-wrap items-center justify-evenly py-5 lg:py-12 bg-lightgray-106 bg-opacity-20 backdrop-filter backdrop-blur-4xl rounded-md relative text-center z-10'>
						<img
							className='py-2 lg:py-0 z-10 w-20 xl:w-auto'
							src={forzieriLogo}
							alt='forzieriLogo'
						/>
						<img
							className='py-2 lg:py-0 z-10 w-20 xl:w-auto'
							src={jcpennyLogo}
							alt='jcpennyLogo'
						/>
						<img
							className='py-2 lg:py-0 z-10 w-20 xl:w-auto'
							src={hurlayLogo}
							alt='hurlayLogo'
						/>
						<Image
							className='py-2 lg:py-0 z-10 w-20 xl:w-auto'
							src={bebeLogo}
							alt='bebeLogo'
							width={80}
							height={40}
						/>
						<img
							className='py-2 lg:py-0 z-10 w-44 xl:w-auto'
							src={perryellisLogo}
							alt='perryellisLogo'
						/>
					</div>
				</div>
			</section> */}
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col items-center'>
				<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal text-center'>
					Place your products{" "}
					<span className='font-pacifico'>Contextually</span>
				</h1>
				<AudienceTab />
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col'>
				<div>
					<h1 className='mr-auto text-3xl lg:text-5xl text-lightgray-101 font-normal'>
						Bring the power of AI to the Brand
					</h1>
					<h1 className='mr-auto text-lightgray-104 text-lg lg:text-xl-1.5 font-normal'>
						Aura - the AI helper app
					</h1>
				</div>
				<div className='flex flex-col mt-12 gap-7 md:gap-0 w-full max-w-4xl mx-auto'>
					<div className='flex flex-col-reverse md:flex-row items-center gap-3 md:gap-7 md:-mb-2.5 ml-auto'>
						<div className='bg-slate-900 rounded-xl p-4'>
							<h1 className='text-xl lg:text-2xl lg:leading-44 text-gray-103 font-normal'>
								How can i match my new white sofa ?
							</h1>
							<p className='text-lightgray-104 text-md lg:text-lg m-0'>
								Find other products that go with it - like coffee tables, lamps
								etc
							</p>
						</div>
						<div className='w-60 h-60'>
							<img
								className='ml-auto w-60 h-60 rounded-xl object-cover'
								src={
									"https://cdn.unthink.ai/img/unthink_ai/whiteSofa_mlmfjdn_340_340.webp"
								}
							/>
						</div>
					</div>
					<div className='flex flex-col-reverse md:flex-row-reverse items-center gap-3 md:gap-7 md:-mt-2.5 md:-mb-2.5 mr-auto'>
						<div className='bg-slate-900 rounded-xl p-4'>
							<h1 className='text-xl lg:text-2xl lg:leading-44 text-gray-103 font-normal'>
								Help with WFH stylish decor for my study
							</h1>
							<p className='text-lightgray-104 text-md lg:text-lg m-0'>
								Create a full look from scratch
							</p>
						</div>
						<div className='w-60 h-60'>
							<img
								className='ml-auto w-60 h-60 rounded-xl object-cover'
								src={
									"https://cdn.unthink.ai/img/unthink_ai/wfh_ilifugp_340_340.webp"
								}
							/>
						</div>
					</div>
					<div className='flex flex-col-reverse md:flex-row items-center gap-3 md:gap-7 md:-mt-2.5 ml-auto'>
						<div className='bg-slate-900 rounded-xl p-4'>
							<h1 className='text-xl lg:text-2xl lg:leading-44 text-gray-103 font-normal'>
								Help me find items matching a look like this
							</h1>
							<p className='text-lightgray-104 text-md lg:text-lg m-0'>
								Find products matching a look from a photo
							</p>
						</div>
						<div className='w-60 h-60'>
							<img
								className='ml-auto w-60 h-60 rounded-xl object-cover'
								src={
									"https://cdn.unthink.ai/img/unthink_ai/completeLook_lvatpmh_340_340.webp"
								}
							/>
						</div>
					</div>
				</div>
			</section>
			{/* // HIDDEN this section out until we create a replacement graphic */}
			{/* <section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto text-center flex flex-col items-center'>
				<div className='max-w-xl mx-auto'>
					<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
						Campaigns that drive revenue? Yes!
					</h1>
					<p className='text-lightgray-104 text-lg lg:text-xl-1.5 max-w-md mx-auto mb-0'>
						Instant payouts to channel partners via Web3 wallets
					</p>
				</div>
				<img
					className='mt-8 lg:mt-72px'
					src={campaign_flow}
					alt='campaign_flow'
				/>
			</section> */}
			{/* UPDATED NEW UI */}
			{/* <section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto text-center flex flex-col items-center'>
				<div className='max-w-xl mx-auto'>
					<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
						Campaigns that drive revenue!
					</h1>
					<p className='text-lightgray-104 text-lg lg:text-xl-1.5 max-w-md mx-auto mb-0'>
						Incentivize publishers and creators to become your brand
						ambassadors. Recognize and reward them!
					</p>
				</div>
				<video
					src='https://s3-us-west-1.amazonaws.com/cem.3816.img/unthink_main/wzqhkjl?x-amz-meta-file_name=Trophy_Final.mp4' // BE url updated
					className='rounded-32 max-w-480 w-full h-full mt-8 lg:mt-72px lg:max-w-964'
					autoPlay={true}
					loop
					muted
					type='video/mp4'></video>
			</section> */}
			<section className='mt-28 lg:mt-32 mb-28 lg:mb-60'>
				<ContactUs
					title='Drive more sales and build an engaged community'
					id='brands_contact_form_bottom'
					// onSuccessCallback={(email) => {
					// 	navigate(ROUTES.TRY_FOR_FREE_PAGE);
					// }}
					submitButtonText='Contact Us'
				/>
			</section>
		</div>
	);
};

export default Brands;
