import React, { useState } from "react";
import Image from "next/image";
import { useNavigate } from "../../helper/useNavigate";

import ContactUsField from "../../components/staticPageComponents/ContactUsField";
import Trustbar from "../../components/staticPageComponents/TrustBar";

import store_product_image from "../../images/newStaticPageImages/store_product_image.svg";
import publisher_page_AI_image from "../../images/newStaticPageImages/publisher_page_AI_image.svg";
import searchbar_image from "../../images/newStaticPageImages/searchbar_image.svg";
import easy_icon from "../../images/newStaticPageImages/easy_icon.svg";
import reward_black_icon from "../../images/newStaticPageImages/reward_black_icon.svg";
import money_icon from "../../images/newStaticPageImages/money_icon.svg";
import git_nft_money_group from "../../images/newStaticPageImages/git_nft_money_group.svg";
import play_circle_icon from "../../images/newStaticPageImages/play_circle_icon.svg";
import ContactUs from "../../components/staticPageComponents/ContactUs";
import Accordion from "../../components/CustomAccordian/Accordian";
import VideoModal from "../../components/staticPageComponents/VideoModal";
import { ROUTES } from "../../constants/codes";

const Publishers = () => {
	const navigate = useNavigate();
	const [showVideoModal, setShowVideoModal] = useState(false);

	return (
		<div className='font-firaSans'>
			<section className='publisher_first_container py-24 lg:py-32'>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl mx-auto publisher_title_container text-center flex flex-col items-center'>
					<h1 className='text-4xl lg:text-7xl text-lightgray-101 font-normal font-firaSans z-10'>
						Get started
						<br />
						with Unthink AI today
					</h1>
					<p className='text-lightgray-104 text-xl lg:text-3xl-1 lg:leading-44 font-firaSans max-w-lg mx-auto z-10'>
						Unlock the power of AI <br /> to transform your business!
					</p>
					<div className='py-16 my-0.75 max-w-sm w-full'>
						<ContactUsField
							id='publishers_contact_field'
							clearEmailOnSuccess
							// onSuccessCallback={(email) => {
							// 	navigate(ROUTES.TRY_FOR_FREE_PAGE);
							// }}
						/>
					</div>
				</div>
			</section>
			<section className='px-3 mt-20 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto'>
				<Trustbar text='Trusted by leading Publishers and Blogs' />
			</section>
			<section className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto text-center mt-28 lg:mt-52 flex flex-col items-center'>
				<h1 className='max-w-xl mx-auto text-3xl lg:text-5xl text-lightgray-101 font-normal'>
					Your site gets the <span className='whitespace-nowrap'>new-age</span>{" "}
					Ecommerce superpowers
				</h1>
				<h1 className='max-w-480 px-9 text-lightgray-104 text-lg lg:text-xl-1.5 font-normal'>
					Get your own plug-n-play store with a smart voice assistant
				</h1>
				<button
					className='bg-indigo-600 text-white border-none rounded-md px-9 py-3 h-full font-bold my-3'
					onClick={() => navigate("/products/pop-up-store")}>
					Learn More
				</button>
				<Image
					className='pt-12'
					src={store_product_image}
					alt='store_product_image'
					width={958}
					height={815}
				/>
			</section>
			<section className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto mt-28 lg:mt-52 flex flex-col-reverse lg:flex-row items-center justify-between'>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
							Curate products from your favorite brands for{" "}
							<span className='font-pacifico whitespace-nowrap'>
								your audience
							</span>
						</h1>
						<p className='max-w-lg lg:pr-7 text-lightgray-104 text-lg lg:text-xl-1.5'>
							Your audience only gets contextual shopping suggestions that are
							relevant to the content they consume on your site
						</p>
					</div>
				</div>
				<div>
					<Image src={publisher_page_AI_image} alt='publisher_page_AI_image' width={500} height={400} />
				</div>
			</section>
			<section className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto mt-28 lg:mt-52 flex flex-col lg:flex-row items-center justify-between'>
				<div className='lg:mr-11 xl:mr-0'>
					<Image
						className='ml-auto'
						src={searchbar_image}
						alt='searchbar_image'
						width={549}
						height={144}
					/>
				</div>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
							Host the store on your domain
						</h1>
						<p className='max-w-lg lg:pr-10 text-lightgray-104 text-lg lg:text-xl-1.5'>
							Connect your domain and host your custom Unthink store on your own
							sub-domain, or even a subdirectory.
						</p>
					</div>
				</div>
			</section>
			{/* <section className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto mt-28 lg:mt-52 flex flex-col-reverse lg:flex-row items-center justify-between'>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
							Earn NFTs, rewards and commissions instantly
						</h1>
						<p className='max-w-lg lg:pr-10 text-lightgray-104 text-lg lg:text-xl-1.5'>
							Earn & build your community around Web3
						</p>
						<div className='flex flex-col items-center lg:items-start max-w-screen-md w-full text-lightgray-104'>
							<div className='flex items-center pb-5 lg:py-4'>
								<div className='w-8'>
										<Image className='mx-auto' src={easy_icon} alt='easy_icon' width={50} height={50} />
								</div>
								<span className='text-lg lg:text-xl-1.5 pl-3'>Easy Set-up</span>
							</div>
							<div className='flex items-center pb-5 lg:py-4'>
								<div className='w-8'>
									<img
										className='mx-auto'
										src={reward_black_icon}
										alt='reward_black_icon'
									/>
								</div>
								<span className='text-lg lg:text-xl-1.5 pl-3'>
									Instant rewards
								</span>
							</div>
							<div className='flex items-center pb-5 lg:py-4'>
								<div className='w-8'>
										<Image className='mx-auto' src={money_icon} alt='money_icon' width={50} height={50} />
								</div>
								<span className='text-lg lg:text-xl-1.5 pl-3'>
									Transparent earnings
								</span>
							</div>
						</div>
						// commented
						<div
							className='flex items-center mt-6 lg:mt-12 cursor-pointer max-w-max mx-auto lg:mx-0'
							onClick={() => setShowVideoModal(true)}>
							<img
								className='w-8 lg:w-11'
								src={play_circle_icon}
								alt='play_circle_icon'
							/>
							<h3 className='text-lg lg:text-xl-1.5 font-bold pl-4 text-slat-50 m-0'>
								Watch Video
							</h3>
						</div>
						// commented
						<VideoModal
							showModal={showVideoModal}
							onCloseModal={() => setShowVideoModal(false)}
							videoUrl='https://www.youtube.com/embed/qbAjKSneXXM/?autoplay=1'
						/>
					</div>
				</div>
				<div>
					<img
						className='ml-auto'
						src={git_nft_money_group}
						alt='git_nft_money_group'
					/>
				</div>
			</section> */}

			{/* faq */}
			{/* <section className='mt-20 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto px-2.5 sm:px-0'>
				<Accordion />
			</section> */}

			<section className='mt-28 lg:mt-52 mb-28 lg:mb-60'>
				{/* <p className='text-center pb-4 lg:pb-8 text-white max-w-s-2 lg:max-w-max mx-auto px-3.5'>
					Note: All payments happen via USDT - as good as USD!
				</p> */}
				<ContactUs
					title='Join a growing Web3 community & monetize your audience'
					id='publishers_contact_form'
					// onSuccessCallback={(email) => {
					// 	navigate(ROUTES.TRY_FOR_FREE_PAGE);
					// }}
				/>
			</section>
		</div>
	);
};

export default Publishers;
