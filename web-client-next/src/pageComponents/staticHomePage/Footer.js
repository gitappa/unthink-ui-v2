import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import facebook_icon from "../../images/newStaticPageImages/facebook_icon.svg";
import linkdn_icon from "../../images/newStaticPageImages/linkdn_icon.svg";
// import twiter_icon from "../../images/newStaticPageImages/twiter_icon.svg";
import xIcon from "../../images/x_white_icon.png";

import youtube_icon from "../../images/newStaticPageImages/youtube_icon.svg";
import Link from "next/link";
import { generateOnContactFormSubmit } from "../../helper/utils";

const id = "subscribe_to_newsletter";

const Footer = () => {
	const emailFormInout = useRef(null);
	const [pageUrl, setPageUrl] = useState("");

	const clearEmailInput = () => {
		if (emailFormInout.current && emailFormInout.current.value) {
			emailFormInout.current.value = "";
		}
	};

	const onSuccessSubmit = () => {
		clearEmailInput();
	};

	useEffect(() => {
		// Set page URL on client side only
		if (typeof window !== "undefined") {
			setPageUrl(window?.location?.href || "");
		}
	}, []);

	useEffect(() => {
		document
			.getElementById(id)
			?.addEventListener(
				"submit",
				generateOnContactFormSubmit(id, true, onSuccessSubmit)
			);
		return () => {
			document
				.getElementById(id)
				?.removeEventListener(
					"submit",
					generateOnContactFormSubmit(id, true, onSuccessSubmit)
				);
		};
	}, []);

	return (
		<div className='pt-10 lg:pt-20 pb-3 bg-blue-106 text-slat-50 font-firaSans'>
			<div className='mx-9 xl:mx-72px'>
				{/* <img src={unthink_ai_logo_white} height={28} className='mt-3 px-4' /> */}
				<div className='flex flex-col lg:flex-row gap-12 2xl:gap-24'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-lg lg:max-w-none w-full mx-auto px-5 lg:px-0 flex-1 lg:gap-5 xl:gap-9 2xl:gap-12 lg:pb-20 footer_inner_container'>
						<div>
							<p className='text-sm leading-5 font-medium mt-8 uppercase'>
								Unthink.AI For
							</p>
							<Link
								href='/brands'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Brands
							</Link>
							<Link
								href='/publishers'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Publishers
							</Link>
							<Link
								href='/influencers'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Influencers
							</Link>
							<Link
							href='/publishers'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Game & Metaverse Platforms
							</Link>
						</div>
						<div>
							<p className='text-sm leading-5 font-medium mt-8 uppercase'>
								Products
							</p>
							<Link
								href='/pop-up-store'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Pop-up Store
							</Link>
							{/* <Link
								href='/products/shop-widget'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Shop Widget
							</Link> */}
						</div>
						<div>
							<p className='text-sm leading-5 font-medium mt-8 uppercase'>
								About
							</p>
							<Link
								href='/about'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Team
							</Link>
							<Link
								href='/about'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Advisor
							</Link>
							{/* <Link
								href='/about'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Careers
							</Link> */}
							<Link
								href='/about'
								className='mb-2 lg:mb-5 flex p-0 text-sm hover:text-current'>
								Contact
							</Link>
						</div>
						<div className='max-w-s-1'>
							<p className='text-sm leading-5 font-medium mt-8 uppercase'>
								Blog
							</p>
							<p className='mb-2 lg:mb-5 p-0'>
								<a
									className='p-0 text-sm hover:text-current'
									href='https://unthink.ai/blog/retailers-are-you-riding-the-digital-wave-ckkf5lzbg0017qvlh14b25yvg/'>
									Retailers, are you riding the digital wave?
								</a>
							</p>
							<p className='mb-2 lg:mb-5'>
								<a
									className='p-0 text-sm hover:text-current'
									href='https://unthink.ai/blog/a-playbook-for-onsite-recommendations-ckkf5lzad0007qvlhuo4gzffw/'>
									A Playbook for onsite recommendations
								</a>
							</p>
							<p className='mb-2 lg:mb-5'>
								<a
									className='p-0 text-sm hover:text-current'
									href='https://unthink.ai/blog/how-retail-brands-can-stand-out-in-front-of-likely-buyers-ckkjicrvv00000nlh8ub8gz7b/'>
									How retail brands can stand out in front of likely buyers
								</a>
							</p>
						</div>
					</div>
					<div className='max-w-lg w-full md:max-h-96 mx-auto flex-1 footer_glass_bg p-5 lg:p-8 mt-8 lg:mt-0 rounded-md border border-gray-105'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:flex justify-between'>
							<div className='max-w-s-1'>
								<p className='text-sm leading-5 font-medium uppercase'>
									NewsLetter
								</p>
								<p className='mb-2 lg:mb-5'>Retailers, are you riding the</p>
								<p className='mb-2 lg:mb-5'>A Playbook for onsite</p>
								<p className='mb-2 lg:mb-5'>
									How retail brands can stand can stand
								</p>
							</div>
							<div className='max-w-s-1 mt-8 md:mt-0'>
								<p className='text-sm leading-5 font-medium uppercase'>
									Podcast
								</p>
								<p className='mb-2 lg:mb-5'>
									<a
										className='p-0 text-sm hover:text-current'
										href='https://www.youtube.com/watch?v=D30V_fmw4rU'
										target='_blank'>
										Unthink Discussion with upcoming influencer
									</a>
								</p>
								<p className='mb-2 lg:mb-5'>
									<a
										className='p-0 text-sm hover:text-current'
										href='https://www.youtube.com/watch?v=KLMh7NC8aLk'
										target='_blank'>
										Upgrade Brand Loyalty to community building
									</a>
								</p>
							</div>
						</div>
						<p className='mt-4 lg:mt-3'>
							Subscribe to our Newsletter & Podcast
						</p>
						<form id={id}>
							<div className='flex flex-col md:flex-row gap-5 md:gap-0 items-center'>
								<input
									className='w-full text-left bg-white bg-opacity-20 placeholder-slat-102 text-slat-102 px-2.5 h-12 rounded-md lg:rounded-l-md border-0 hover:border-opacity-0'
									placeholder='Enter your email'
									required
									name='email'
									type='text'
									ref={emailFormInout}
								/>
								<input name='contact_number' type='hidden' />
								<input
									name='page_url'
									type='hidden'
									value={pageUrl}
								/>
								<input name='page_section' type='hidden' value={id} />

								<button
									className='w-40 text-xs md:text-sm z-10 bg-indigo-600 border-none rounded-md py-3 px-3.5 h-12 font-bold -ml-2.5 text-white'
									type='submit'>
									Subscribe
								</button>
							</div>
						</form>
					</div>
				</div>
				{/* made by part */}
				<div className='flex flex-col lg:flex-row items-center justify-between border-t-4 py-8 mt-2.5'>
					<div className='flex'>
						<p className='text-sm font-medium uppercase lg:m-0'>Privacy</p>
						<p className='text-sm font-medium uppercase pl-8 lg:m-0'>Terms</p>
					</div>
					<p className='uppercase lg:m-0'>&#169;2022 Unthink.ai</p>
					<div className='flex items-center'>
						<a className='px-4' href='https://x.com/unthinkai' target='_blank'>
							<Image src={xIcon} alt='x_icon' width={20} height={20} />
						</a>
						<a
							className='px-4'
							href='https://www.facebook.com/unthink.marketplace'
							target='_blank'>
							<Image src={facebook_icon} alt='facebook_icon' width={24} height={24} />
						</a>
						<a
							className='px-4'
							href='https://www.youtube.com/channel/UC64BmHK4Aq_7L_ueV3iciUA'
							target='_blank'>
							<Image src={youtube_icon} alt='youtube_icon' width={24} height={24} />
						</a>
						<a
							className='px-4'
							href='https://www.linkedin.com/company/unthink-inc/'
							target='_blank'>
							<Image src={linkdn_icon} alt='linkdn_icon' width={24} height={24} />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
