import React, { useState } from "react";
import Image from "next/image";
import { useNavigate } from "../../helper/useNavigate";

import ContactUsField from "../../components/staticPageComponents/ContactUsField";
import Trustbar from "../../components/staticPageComponents/TrustBar";
import ContactUs from "../../components/staticPageComponents/ContactUs";
import Accordion from "../../components/CustomAccordian/Accordian";
import styles from "./styles.module.css";
// import VideoModal from "../../components/staticPageComponents/VideoModal";

import creator_AI_image from "../../images/newStaticPageImages/creator_AI_image.svg";
import web3_fire_image from "../../images/newStaticPageImages/web3_fire_image.svg";
import brands_frame from "../../images/newStaticPageImages/brands_frame.svg";
import easy_icon from "../../images/newStaticPageImages/easy_icon.svg";
import reward_black_icon from "../../images/newStaticPageImages/reward_black_icon.svg";
import money_icon from "../../images/newStaticPageImages/money_icon.svg";
import git_nft_money_group from "../../images/newStaticPageImages/git_nft_money_group.svg";
import { ROUTES } from "../../constants/codes";
// import creators_image from "../../images/newStaticPageImages/creators_image.svg";
// import play_circle_icon from "../../images/newStaticPageImages/play_circle_icon.svg";

const Creators = () => {
	const navigate = useNavigate();
	// const [showVideoModal, setShowVideoModal] = useState(false);

	return (
		<div className='font-firaSans'>
			<section className={styles.creators_first_container + ' py-24 lg:py-32'}>
				<div className='max-w-340 md:max-w-748 lg:max-w-4xl mx-auto publisher_title_container text-center flex flex-col items-center'>
					<h1 className='text-4xl lg:text-7xl text-lightgray-101 font-normal font-firaSans z-10'>
						Get paid for being you.
					</h1>
					<p className='text-lightgray-104 text-xl lg:text-3xl-1 lg:leading-44 font-firaSans max-w-2xl px-4 mx-auto z-10'>
						Create your own <span className='font-bold'>Pop-up store</span>{" "}
						anywhere, with products that reflect your personality & monetize
						your followers
					</p>
					<div className='py-16 my-0.75 max-w-sm w-full'>
						<ContactUsField
							id='creators_contact_field'
							clearEmailOnSuccess
						// onSuccessCallback={(email) => {
						// 	navigate(
						// 		ROUTES.TRY_FOR_FREE_PAGE
						// 		// 	{ // redirecting to try for free before // removed it for now
						// 		// 	state: {
						// 		// 		email,
						// 		// 	},
						// 		// }
						// 	);
						// }}
						/>
					</div>
				</div>
			</section>
			<section className='px-3 mt-20 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto'>
				<Trustbar text='Trusted by creators in social media & gaming' />
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto text-center flex flex-col items-center'>
				<h1 className='max-w-xl mx-auto text-3xl lg:text-5xl text-lightgray-101 font-normal'>
					An online pop-up store that just ...
					<span className='font-bold'>“Pops”</span>
				</h1>
				<h1 className='max-w-xl text-lightgray-104 text-lg lg:text-xl-1.5 font-normal'>
					Your very own store, filled with the products that scream your
					personality
				</h1>
				<button
					className='bg-indigo-600 text-white border-none rounded-md px-9 py-3 h-full font-bold my-3'
					onClick={() => navigate("/products/pop-up-store")}>
					Learn More
				</button>
				<div className='pt-12'>
					{/* <img className='pt-12' src={creators_image} alt='creators_image' /> */}
					<iframe
						className='rounded-2xl lg:rounded-32 w-80 md:w-656 xl:w-695 h-56 md:h-340 xl:h-456'
						width='100%'
						height='100%'
						src='https://www.youtube.com/embed/VCijXybh44I'
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen='allowFullScreen'></iframe>
				</div>
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between'>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
							Create collections of products{" "}
							<span className='font-pacifico whitespace-nowrap'>you love</span>
						</h1>
						<p className='max-w-lg lg:pr-7 text-lightgray-104 text-lg lg:text-xl-1.5'>
							Curate from over a million products from top brands - for your
							audience.
						</p>
					</div>
				</div>
				<div>
					<Image src={creator_AI_image} alt='creator_AI_image' width={600} height={400} />
				</div>
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col lg:flex-row items-center justify-between'>
				<div className='lg:mr-11 xl:mr-0'>
					<Image src={brands_frame} alt='brands_frame' width={500} height={400} />
				</div>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
							Get noticed by top-notch lifestyle brands
						</h1>
						<p className='max-w-lg lg:pr-7 text-lightgray-104 text-lg lg:text-xl-1.5'>
							Show off your expertise and see a constant inflow of exciting
							campaigns.
						</p>
					</div>
				</div>
			</section>
			<section className='mt-28 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto flex flex-col-reverse lg:flex-row items-center justify-between'>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
							Join a growing Web3 community and watch your influence grow
						</h1>
						<p className='max-w-lg lg:pr-10 text-lightgray-104 text-lg lg:text-xl-1.5 lg:whitespace-nowrap'>
							Web3 is not just the future - it’s already here.
						</p>
					</div>
				</div>
				<div>
					<img
						className='ml-auto'
						src={web3_fire_image}
						alt='web3_fire_image'
					/>
				</div>
			</section>
			<section className='max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto mt-28 lg:mt-52 flex flex-col lg:flex-row items-center justify-between'>
				<div className='lg:mr-11 xl:mr-0'>
					<img
						className='ml-auto'
						src={git_nft_money_group}
						alt='git_nft_money_group'
					/>
				</div>
				<div>
					<div className='max-w-lg mx-auto text-center lg:text-left pt-8 lg:pt-0'>
						<h1 className='text-3xl lg:text-5xl text-lightgray-101 font-normal'>
							Earn NFTs, rewards and commissions instantly
						</h1>
						<p className='max-w-lg lg:pr-10 text-lightgray-104 text-lg lg:text-xl-1.5'>
							Start earning within minutes
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
						{/* <div
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
						</div> */}
						{/* <VideoModal
							showModal={showVideoModal}
							onCloseModal={() => setShowVideoModal(false)}
							videoUrl='https://www.youtube.com/embed/qbAjKSneXXM/?autoplay=1'
						/> */}
					</div>
				</div>
			</section>

			{/* faq */}
			<section className='mt-20 lg:mt-52 max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto px-2.5 sm:px-0'>
				<Accordion />
			</section>

			<section className='mt-28 lg:mt-52 mb-28 lg:mb-60'>
				{/* <p className='text-center pb-4 lg:pb-8 text-white max-w-s-2 lg:max-w-max mx-auto px-3.5'>
					Note: All payments happen via USDT - as good as USD!
				</p> */}
				<ContactUs
					title='Monetize your audience. Sign-up and  get your own personalized NFT!'
					showLink
					id='creators_contact_form'
				// onSuccessCallback={(email) => {
				// 	navigate(ROUTES.TRY_FOR_FREE_PAGE);
				// }}
				/>
			</section>
		</div>
	);
};

export default Creators;
