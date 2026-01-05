import React, { useMemo, useState } from "react";
import Image from "next/image";

import content_site_icon from "../../images/newStaticPageImages/brands/content_site_icon.svg";
import influencer_icon from "../../images/newStaticPageImages/brands/influencer_icon.svg";
import games_icon from "../../images/newStaticPageImages/brands/games_icon.svg";
import ellips_arrow from "../../images/newStaticPageImages/brands/ellips_arrow.svg";
import Link from 'next/link';
import { useNavigate } from "../../helper/useNavigate";

const TabSection1 = () => {
	const navigate = useNavigate();
	return (
		<>
			<div className='flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start'>
				<div className='max-w-xs ml-9 xl:ml-12 mt-4 lg:mt-0'>
					{/* <h2 className='text-xl lg:text-xl-1.5 text-black-104 font-bold'>
						Pop-up Store
					</h2> */}
					<ol className='list-decimal text-lg lg:text-xl ml-5'>
						<li>
							<p className='mb-2'>
								Make your text or video content shoppable by adding products{" "}
								<span className='font-bold'>matched by AI</span>
							</p>
						<Image
							className='ml-12 md:ml-20 h-12 md:h-auto'
							src={ellips_arrow}
							alt='ellips_arrow'
							width={60}
							height={24}
							/>
						</li>
						<li>
							<p className='mb-2'>
								Come up with fresh{" "}
								<span className='font-bold'>collections assisted by AI</span>{" "}
								and keep up with daily themes
							</p>
							<Image
								className='h-12 md:h-auto ml-24 md:ml-32 flip_ellips_arrow'
								src={ellips_arrow}
								alt='ellips_arrow'
								width={60}
								height={24}
							/>
						</li>
						<li>
							<p className='mb-2'>
								Invite anyone to create collections and content and publish on
								your site. <span className='font-bold'>More people</span> add{" "}
								<span className='font-bold'>more variety</span>
							</p>
						</li>
					</ol>
					{/* <p className='text-xl mt-11'>
						Create pop-up store pages within your website too!{" "}
						<Link
							href='/products/pop-up-store'
							className='underline p-0 hover:text-current text-xl'>
							Know More
						</Link>
					</p> */}
					{/* <button
						className='bg-indigo-600 text-white border-none rounded-md px-9 py-3 font-bold my-11'
						type='primary'
						onClick={() => navigate("/products/pop-up-store")}>
						Learn More
					</button> */}
				</div>
				<div className='lg:p-5 pt-8 lg:pt-16'>
					<iframe
						className='rounded-2xl lg:rounded-32 w-80 md:w-504 xl:w-695 h-56 md:h-340 xl:h-456'
						width='100%'
						height='100%'
						src='https://www.youtube.com/embed/gxaO2NhRrjQ'
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen='allowFullScreen'></iframe>
				</div>
			</div>

			{/* <hr className='border-white border-t-2 border-opacity-10 max-w-5xl mx-auto' /> */}

			{/* <div className='py-9 lg:py-16 flex flex-col-reverse lg:flex-row justify-between items-center'>
				<div className='max-w-xs ml-9 xl:ml-12 mt-4 lg:mt-0'>
					<h2 className='text-xl lg:text-xl-1.5 text-black-104 font-bold'>
						Shop Widget
					</h2>
					<ol className='list-decimal text-lg lg:text-xl ml-5'>
						<li>
							<p className='mb-2'>
								Content sites & Blogs registered with unthink.ai now{" "}
								<span className='font-bold'>become your channel partners</span>
							</p>
							<img
								className='h-12 md:h-auto ml-12 md:ml-20'
								src={ellips_arrow}
								alt='ellips_arrow'
							/>
						</li>
						<li>
							<p className='mb-2'>
								These sites{" "}
								<span className='font-bold'>embed products sections</span>{" "}
								(widget) within their content, containing your products
							</p>
						</li>
					</ol>
					// commented
					<button
						className='bg-indigo-600 text-white border-none rounded-md px-9 py-3 font-bold my-11'
						type='primary'>
						Learn More
					</button>
					// commented
				</div>
				<div className='lg:p-5 pt-8 lg:pt-16'>
					<iframe
						className='rounded-2xl lg:rounded-32 w-80 md:w-504 xl:w-695 h-56 md:h-340 xl:h-456'
						width='100%'
						height='100%'
						src='https://www.youtube.com/embed/16JVROeHEQM'
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen='allowFullScreen'></iframe>
					<h5 className='text-black-200 text-center pt-6'>
						A demo widget.{" "}
						<a
							target='_blank'
							href='https://shop.budgettravel.com/'
							className='text-sm underline p-0'>
							See a widget live on a site
						</a>
					</h5>
				</div>
			</div> */}
		</>
	);
};

const TabSection2 = () => {
	return (
		<div className='flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start'>
			<div className='max-w-xs ml-9 xl:ml-12 mt-4 lg:mt-0'>
				{/* <h2 className='text-xl lg:text-xl-1.5 text-black-104 font-bold'>
					Content created by influencers
				</h2> */}
				<ol className='list-decimal text-lg lg:text-xl ml-5'>
					<li>
						<p className='mb-2'>
							Offer personalized suggestions- gift ideas, packing essentials,
							fashion tips, etc with the{" "}
							<span className='font-bold'>products that match</span>
						</p>
						<Image
							className='h-12 md:h-auto ml-12 md:ml-20'
							src={ellips_arrow}
							alt='ellips_arrow'
							width={60}
							height={24}
						/>
					</li>
					<li>
						<p className='mb-2'>
							Increase your Average Order by offering products matching{" "}
							<span className='font-bold'>the customer intent</span> in one
							place
						</p>
						<Image
							className='h-12 md:h-auto ml-24 md:ml-32 flip_ellips_arrow'
							src={ellips_arrow}
							alt='ellips_arrow'
							width={60}
							height={24}
						/>
					</li>
					<li>
						<p className='mb-2 pt-6'>
							Combine your <span className='font-bold'>brand expertise</span>{" "}
							with the knowledge of pre-trained Large Language Models
						</p>
						{/* <img
							className='h-12 md:h-auto ml-12 md:ml-20'
							src={ellips_arrow}
							alt='ellips_arrow'
						/> */}
					</li>
					{/* <li>
						<p className='mb-2'>
							You create leaderboards and{" "}
							<span className='font-bold'>offer rewards</span> to keep them
							incentivized!
						</p>
					</li> */}
				</ol>
				{/* <button
					className='bg-indigo-600 text-white border-none rounded-md px-9 py-3 font-bold my-11'
					type='primary'
					onClick={() => navigate("/products/pop-up-store")}>
					Learn More
				</button> */}
			</div>
			<div className='lg:p-5 pt-8 lg:pt-16'>
				<iframe
					className='rounded-2xl lg:rounded-32 w-80 md:w-504 xl:w-695 h-56 md:h-340 xl:h-456'
					width='100%'
					height='100%'
					src='https://www.youtube.com/embed/XfI1oPk-5ek'
					title='YouTube video player'
					frameBorder='0'
					allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen='allowFullScreen'></iframe>
			</div>
		</div>
	);
};

const TabSection3 = () => {
	return (
		<div className='flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start'>
			<div className='max-w-xs ml-9 xl:ml-12 mt-4 lg:mt-0'>
				<h2 className='text-xl lg:text-xl-1.5 text-black-104 font-bold mb-2'>
					Invite brand advocates to showcase your products in their own
					mini-pop-up stores
				</h2>
				<ol className='list-decimal text-black-104 ml-5'>
					<li className='text-lg lg:text-xl'>
						<p className='mb-2'>
							User-generated shopping pages on{" "}
							<span className='font-bold'>your own website</span> will draw
							their social media followers when they share
						</p>
						<Image
							className='h-12 md:h-auto ml-12 md:ml-20'
							src={ellips_arrow}
							alt='ellips_arrow'
							width={60}
							height={24}
						/>
					</li>
					<li className='text-lg lg:text-xl'>
						<p className='mb-2'>
							Spot your top contributors and{" "}
							<span className='font-bold'>incentivize</span> them with{" "}
							<span className='font-bold'>exclusive rewards</span>
						</p>
						<Image
							className='h-12 md:h-auto ml-24 md:ml-32 flip_ellips_arrow'
							src={ellips_arrow}
							alt='ellips_arrow'
							width={60}
							height={24}
						/>
					</li>
					<li className='text-lg lg:text-xl'>
						<p className='mb-2'>
							Create brand collaborations with{" "}
							<span className='font-bold'>game and metaverse</span> partners
						</p>
					</li>
				</ol>
				{/* <button
					className='bg-indigo-600 text-white border-none rounded-md px-9 py-3 font-bold my-11'
					type='primary'
					onClick={() => navigate("/products/pop-up-store")}>
					Learn More
				</button> */}
			</div>
			<div className='lg:p-5 pt-8 lg:pt-16'>
				<iframe
					className='rounded-2xl lg:rounded-32 w-80 md:w-504 xl:w-695 h-56 md:h-340 xl:h-456'
					width='100%'
					height='100%'
					src='https://www.youtube.com/embed/iAHTKpOx2Us'
					title='YouTube video player'
					frameBorder='0'
					allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen='allowFullScreen'></iframe>
			</div>
		</div>
	);
};

const AudienceTab = () => {
	const [selectedTab, setSelectedTab] = useState(1);

	const isFirstTabSelected = useMemo(() => selectedTab === 1, [selectedTab]);
	const isSecondTabSelected = useMemo(() => selectedTab === 2, [selectedTab]);
	const isThirdTabSelected = useMemo(() => selectedTab === 3, [selectedTab]);

	return (
		<div className='w-full xl:mt-16'>
			<div className='w-full hidden xl:block'>
				<div className='hidden xl:flex justify-between w-full'>
					{/* first tab */}
					<div
						onClick={() => !isFirstTabSelected && setSelectedTab(1)}
						className={`relative w-404 h-148 ${
							isFirstTabSelected
								? "tooltip_box bg-gray-104 flex-col items-center"
								: "border-2 border-slat-103 cursor-pointer"
						} rounded-md flex justify-center px-6 py-6`}>
						<div>
										<Image src={content_site_icon} alt='content_site_icon' width={40} height={40} />
						</div>
						<div className='pl-6'>
							<h3
								className={`text-xl-1.5 ${
									isFirstTabSelected
										? "text-black-104 text-center"
										: "text-lightgray-101"
								}`}>
								Within expert e-commerce content
							</h3>
							{/* <p
								className={`${
									isFirstTabSelected ? "hidden" : "block"
								} text-xl text-lightgray-104 max-w-287 m-0`}>
								These sites target their audience with your products
							</p> */}
						</div>
					</div>

					{/* second tab */}
					<div
						onClick={() => !isSecondTabSelected && setSelectedTab(2)}
						className={`relative w-404 h-148 ${
							isSecondTabSelected
								? "tooltip_box bg-gray-104 flex-col items-center"
								: "border-2 border-slat-103 cursor-pointer"
						} rounded-md flex px-6 py-6`}>
						<div>
										<Image src={influencer_icon} alt='influencer_icon' width={40} height={40} />
						</div>
						<div className='pl-6'>
							<h3
								className={`text-xl-1.5 ${
									isSecondTabSelected
										? "text-black-104 text-center"
										: "text-lightgray-101"
								}`}>
								AI powered shopping assistant
							</h3>
							{/* <p
								className={`${
									isSecondTabSelected ? "hidden" : "block"
								} text-xl text-lightgray-104 max-w-287 m-0`}>
								Influencers showcase your products to their followers
							</p> */}
						</div>
					</div>

					{/* third tab */}
					<div
						onClick={() => !isThirdTabSelected && setSelectedTab(3)}
						className={`relative w-404 h-148 ${
							isThirdTabSelected
								? "tooltip_box bg-gray-104 flex-col items-center"
								: "border-2 border-slat-103 cursor-pointer"
						} rounded-md flex px-6 py-6`}>
						<div>
							<img src={games_icon} alt='games_icon' />
						</div>
						<div className='pl-6'>
							<h3
								className={`text-xl-1.5 ${
									isThirdTabSelected
										? "text-black-104 text-center"
										: "text-lightgray-101"
								}`}>
								Pop-up stores created by brand advocates
							</h3>
							{/* <p
								className={`${
									isThirdTabSelected ? "hidden" : "block"
								} text-xl text-lightgray-104 max-w-287 m-0`}>
								Sell where the the next-gen audience is
							</p> */}
						</div>
					</div>
				</div>

				{/* tab 1 section */}
				<div
					className={`${
						isFirstTabSelected ? "block" : "hidden"
					} mt-6 pt-9 lg:pt-16 bg-gray-104 text-black-104 border-2 border-white rounded-md`}>
					<TabSection1 />
				</div>

				{/* tab 2 section */}
				<div
					className={`${
						isSecondTabSelected ? "block" : "hidden"
					} mt-6 pt-9 lg:pt-16 bg-gray-104 text-black-104 border-2 border-white rounded-md`}>
					<TabSection2 />
				</div>

				{/* tab 3 section */}
				<div
					className={`${
						isThirdTabSelected ? "block" : "hidden"
					} mt-6 pt-9 lg:pt-16 bg-gray-104 text-black-104 border-2 border-white rounded-md`}>
					<TabSection3 />
				</div>
			</div>

			{/* mobile UI */}
			<div className='w-full block xl:hidden'>
				{/* tab 1 section */}
				<div
					className={`mt-12 relative tooltip_box border-2 border-white bg-gray-104 flex-row lg:flex-col items-center justify-center rounded-md flex xl:hidden p-4 lg:p-6`}>
					<div>
						<img
							className='w-6 md:w-10'
							src={content_site_icon}
							alt='content_site_icon'
						/>
					</div>
					<div className='pl-3 lg:pl-6'>
						<h3 className={`m-0 text-xl lg:text-xl-1.5 text-black-104`}>
							Within expert e-commerce content
						</h3>
					</div>
				</div>
				<div
					className={`mt-2 pt-9 lg:pt-16 bg-gray-104 text-black-104 border-2 border-white rounded-md`}>
					<TabSection1 />
				</div>

				{/* tab 2 section */}
				<div
					className={`mt-12 relative tooltip_box border-2 border-white bg-gray-104 flex-row lg:flex-col items-center justify-center rounded-md flex xl:hidden p-4 lg:p-6`}>
					<div>
						<img
							className='w-6 md:w-10'
							src={influencer_icon}
							alt='influencer_icon'
						/>
					</div>
					<div className='pl-3 lg:pl-6'>
						<h3 className={`m-0 text-xl lg:text-xl-1.5 text-black-104`}>
							AI powered shopping assistant
						</h3>
					</div>
				</div>

				<div
					className={`mt-2 pt-9 lg:pt-16 bg-gray-104 text-black-104 border-2 border-white rounded-md`}>
					<TabSection2 />
				</div>

				{/* tab 3 section */}
				<div
					className={`mt-12 relative tooltip_box border-2 border-white bg-gray-104 flex-row lg:flex-col items-center justify-center rounded-md flex xl:hidden p-4 lg:p-6`}>
					<div>
								<Image className='w-6 md:w-10' src={games_icon} alt='games_icon' width={40} height={40} />
					</div>
					<div className='pl-3 lg:pl-6'>
						<h3 className={`m-0 text-xl lg:text-xl-1.5 text-black-104`}>
							Pop-up stores created by brand advocates
						</h3>
					</div>
				</div>
				<div
					className={`mt-2 pt-9 lg:pt-16 bg-gray-104 text-black-104 border-2 border-white rounded-md`}>
					<TabSection3 />
				</div>
			</div>
		</div>
	);
};

export default AudienceTab;
