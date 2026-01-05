import React from "react";
import { useNavigate } from "../../helper/useNavigate";
import { Image } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { home_page_url, instance_logo } from "../../constants/config";
import { btHeaderOptions } from "../../constants/codes";
import my_account_black_icon from "../../images/my_account_black_icon.svg";
import search from "../../images/search.svg";

const exploreSubmenu = [
	{
		title: "Budget Travel Lists",
		href: "https://www.budgettravel.com/topic/budget-travel-lists",
	},
	{
		title: "Adventure",
		href: "https://www.budgettravel.com/topic/adventure",
	},
	{
		title: "Cruises",
		href: "https://www.budgettravel.com/topic/everything-cruise",
	},
	{
		title: "Family",
		href: "https://www.budgettravel.com/topic/family",
	},
	{
		title: "Inspiration",
		href: "https://www.budgettravel.com/topic/get-inspired",
	},
	{
		title: "National Parks",
		href: "https://www.budgettravel.com/topic/national-parks",
	},
	{
		title: "News",
		href: "https://www.budgettravel.com/topic/news",
	},
	{
		title: "Road Trips",
		href: "https://www.budgettravel.com/topic/road-trips",
	},
	{
		title: "Theme Parks",
		href: "https://www.budgettravel.com/topic/theme-parks",
	},
	{
		title: "Travel Tips",
		href: "https://www.budgettravel.com/topic/travel-tips",
	},
];

const getExploreMenuOptions = () => {
	return (
		<ul className='z-10 pt-2 pb-6 px-5 w-52 top-3 shadow rounded-md bg-black-200 text-teal-101'>
			{exploreSubmenu && exploreSubmenu.map((item) => 
				item && item.href ? (
					<li className='mt-4' key={item.title}>
						<a className='hover:text-yellow-101 font-normal' href={item.href}>
							{item.title}
						</a>
					</li>
				) : null
			)}
		</ul>
	);
};

const BudgetTravelHeader = () => {
	const navigate = useNavigate();
	return (
		<div className='bg-black-200 h-12 text-white hidden lg:flex justify-between md:justify-around items-center lg:px-8 lg:py-2'>
			<div className='lg:flex lg:mr-12 2xl:mr-16'>
				<Image
					src={instance_logo}
					width={100}
					preview={false}
					className='max-h-12 object-contain cursor-pointer'
					onClick={() => home_page_url && navigate(home_page_url)}
				/>
			</div>
			<div className='flex justify-between items-center font-lato'>
				{/* // REMOVE // */}
				{/* <div className='pl-3 xl:pl-4 lg:flex'>
					<a
						className='cursor-pointer p-0 uppercase text-xs font-bold hover:text-yellow-101'
						href={btHeaderOptions?.clubdiscounts}>
						Club Discounts
					</a>
				</div> */}
				{btHeaderOptions?.discoverusa && (
					<div className='pl-3 xl:pl-4 lg:flex'>
						<a
							className='cursor-pointer p-0 uppercase text-xs font-bold hover:text-yellow-101'
							href={btHeaderOptions.discoverusa}>
							Discover USA
						</a>
					</div>
				)}
				{btHeaderOptions?.deals && (
					<div className='pl-3 xl:pl-4 lg:flex'>
						<a
							className='cursor-pointer p-0 uppercase text-xs font-bold hover:text-yellow-101'
							href={btHeaderOptions.deals}>
							Real deals
						</a>
					</div>
				)}
				{/* <div className='pl-3 xl:pl-4 lg:flex'>
					<a
						className='cursor-pointer p-0 uppercase text-xs font-bold hover:text-yellow-101'
						href={btHeaderOptions?.sweepstakes}>
						Sweepstakes
					</a>
				</div> */}
				{btHeaderOptions?.shop && (
					<div className='pl-3 xl:pl-4 lg:flex'>
						<a
							className='cursor-pointer p-0 uppercase text-xs font-bold hover:text-yellow-101'
							href={btHeaderOptions.shop}>
							Shop
						</a>
					</div>
				)}
				{btHeaderOptions?.explore && (
					<div className='pl-3 xl:pl-4 text-xs font-bold relative explore_menu'>
						<div className='flex items-center cursor-pointer'>
							<a
								className='p-0 uppercase text-xs hover:text-yellow-101 menu_text'
								href={btHeaderOptions.explore}>
								Explore
							</a>
							<DownOutlined className='ml-2 text-xs leading-none' />
						</div>
						<div className='absolute explore_submenu_container hidden z-30'>
							{getExploreMenuOptions()}
						</div>
					</div>
				)}
				{/* {btHeaderOptions?.search && (
					<a className='pl-3 xl:pl-4 flex' href={btHeaderOptions.search}>
						<Image className='h-4 w-4' src={search} preview={false} />
					</a>
				)} */}
				{btHeaderOptions?.myaccount && (
					<a className='pl-3 xl:pl-4 flex' href={btHeaderOptions.myaccount}>
						<Image src={my_account_black_icon} preview={false} />
					</a>
				)}
			</div>
		</div>
	);
};

export default BudgetTravelHeader;
