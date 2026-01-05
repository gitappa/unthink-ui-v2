// not using
import React, { useState } from "react";
import Link from "next/link";

import ContactUsField from "../../components/staticPageComponents/ContactUsField";
import RequestOurMediaKitModal from "../../components/staticPageComponents/RequestOurMediaKitModal";

import travel_shopping_festival_image from "../../images/newStaticPageImages/shoppingFestival/travel_shopping_festival.png";
import check_icon_green_image from "../../images/newStaticPageImages/shoppingFestival/check_icon_green.png";

import styles from './shoppingFestival.module.scss';

const influencerApplyNowGoogleFormLink = "https://forms.gle/xjTzZJgSAaaZcUkS6";

const ShoppingFestival = () => {
	const [isRequestMediaKitModalOpen, setIsRequestMediaKitModalOpen] =
		useState(false);

	const handleSubmitButtonClick = () =>
		window?.open && window.open(influencerApplyNowGoogleFormLink, "_blank");

	const handleRequestMediaKitModalOpen = (e) => {
		e.preventDefault();
		setIsRequestMediaKitModalOpen(true);
	};

	const handleRequestMediaKitModalClose = () => {
		setIsRequestMediaKitModalOpen(false);
	};

	return (
		<div className='max-w-340 tablet:max-w-768 mx-auto desktop:max-w-1324 px-2 tablet:px-8'>
			{isRequestMediaKitModalOpen && (
				<RequestOurMediaKitModal
					formId='travel_shopping_festival_request_media_kit'
					showModal
					onCloseModal={handleRequestMediaKitModalClose}
				/>
			)}
			<section className='flex flex-col desktop:flex-row pt-32 pb-36 mb-2.5 font-firaSans'>
				<div className='desktop:ml-25 w-full tablet:w-auto'>
					<img
						className='max-w-640 w-full tablet:w-auto'
						src={travel_shopping_festival_image}
						alt='travel shopping festival image'
					/>
				</div>
				<div className='tablet:pl-18.5'>
					<div className='mt-18.5'>
						<h5 className='text-display-l font-semibold text-slate-400'>
							FROM
						</h5>
						<h5 className='mt-6 text-display-l font-bold text-white'>
							Feb 24th - Mar 24th, 2023
						</h5>
					</div>
					<div className='mt-28 pt-2'>
						<h5 className='text-display-l font-semibold text-slate-400'>
							LET’S GO...
						</h5>
						<div className='mt-7 max-w-448'>
							<ContactUsField
								id='travel_shopping_festival_contact_field'
								inputProps={{
									style: {
										background: "rgba(255, 255, 255, 0.1)",
									},
								}}
								buttonText='Apply Now'
								handleSubmitButtonClick={handleSubmitButtonClick}
								clearEmailOnSuccess
							/>
							<p className='text-sm text-slate-400 mt-4'>
								Are you a Brand?{" "}
								<span
									role='button'
									className='underline cursor-pointer'
									onClick={handleRequestMediaKitModalOpen}>
									Request a Media Kit
								</span>
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className='flex flex-col justify-center min-h-512'>
				<div>
					<h1 className='font-playfairDisplay text-4xl tablet:text-6xl-3 text-slate-400'>
						3 steps to awesomeness
					</h1>
				</div>
				<div className='grid gap-6 desktop:grid-cols-3 grid-flow-row mt-45px font-firaSans'>
					<div className='p-6 border-2 border-slat-103 rounded-md'>
						<h2 className='text-xl-1.5 leading-8 text-slate-100'>
							1. Apply to join the club and get a wallet
						</h2>
						<p className='mt-3 text-xl leading-7 text-slate-400'>
							If you’re a creator who posts regular content on Travel - this is
							for you!
						</p>
					</div>
					<div className='p-6 border-2 border-slat-103 rounded-md'>
						<h2 className='text-xl-1.5 leading-8 text-slate-100'>
							2. Create shopping collections & content
						</h2>
						<p className='mt-3 text-xl leading-7 text-slate-400'>
							Use our AI tool to quickly generate travel content and curate
							related products
						</p>
					</div>
					<div className='p-6 border-2 border-slat-103 rounded-md'>
						<h2 className='text-xl-1.5 leading-8 text-slate-100'>
							3. Share with your followers and earn rewards!
						</h2>
						<p className='mt-3 text-xl leading-7 text-slate-400'>
							Gift cards, NFT loyalty tokens and more!
						</p>
					</div>
				</div>
			</section>

			<section className='min-h-512 mt-32 mb-40 festival-rewards-section rounded-md p-8'>
				<div>
					<h1 className='font-playfairDisplay text-4xl tablet:text-6xl-3 text-slate-400'>
						Sign-up & get exclusive festival rewards
					</h1>
				</div>
				<div className='grid grid-flow-row gap-12 mt-16 tablet:pl-5'>
					<div className='flex'>
						<img
							src={check_icon_green_image}
							alt='check icon image'
							className='h-8 object-none'
						/>
						<p className='ml-2.5 text-2xl tablet:text-xl-1.5 text-slate-100'>
							First 25 Creators who sign up and create collections get free gift
							cards
						</p>
					</div>
					<div className='flex'>
						<img
							src={check_icon_green_image}
							alt='check icon image'
							className='h-8 object-none'
						/>
						<p className='ml-2.5 text-2xl tablet:text-xl-1.5 text-slate-100'>
							Free credits to use AI tools
						</p>
					</div>
					<div className='flex'>
						<img
							src={check_icon_green_image}
							alt='check icon image'
							className='h-8 object-none'
						/>
						<p className='ml-2.5 text-2xl tablet:text-xl-1.5 text-slate-100'>
							Surprise rewards unlocked
						</p>
					</div>
				</div>
				<div className='flex mt-16 tablet:pl-9 flex-wrap'>
					<Link
						role='button'
						className='border-0.75 rounded-md border-indigo-600 p-3.5 min-w-38 text-indigo-400 font-bold text-sm text-center'
						href='/creators'>
						Learn More
					</Link>
					<a
						href={influencerApplyNowGoogleFormLink}
						target='_blank'
						role='button'
						className='border-0.75 rounded-md border-indigo-600 bg-indigo-600 p-3.5 min-w-38 text-white font-bold text-sm text-center tablet:ml-5 mt-5 tablet:mt-0'>
						Apply Now
					</a>
				</div>
			</section>
		</div>
	);
};

export default ShoppingFestival;
