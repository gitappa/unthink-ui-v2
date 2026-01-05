import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from 'next/link';
import { CloseOutlined } from "@ant-design/icons";

import { MenuItems } from "./MenuItems";
import useWindowSize from "../../helper/useWindowSize";
import { useNavigate } from "../../helper/useNavigate";
import { PATH_BLOG, ROUTES } from "../../constants/codes";

import unthink_ai_logo_white from "../../images/newStaticPageImages/unthink_ai_logo_white.svg";
import menu_icon from "../../images/newStaticPageImages/menu_icon.svg";

import styles from '../../style/staticPages/headers.module.scss';

const Header = ({
	setHeight,
	showSignIn = true,
	showScheduleDemo = true,
	currentPath,
	signInRedirectPath = ROUTES.SIGN_IN_PAGE,
}) => {
	const { width } = useWindowSize();
	const navigate = useNavigate();
	const ref = useRef();

	const [showMenu, setShowMenu] = useState(false);
	const [headerBgColor, setHeaderBgColor] = useState(true);

	const onScroll = () => {
		if (typeof window === "undefined") return;
		if (window.scrollY >= 72) {
			setHeaderBgColor(false);
		} else {
			setHeaderBgColor(true);
		}
	};

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.addEventListener("scroll", onScroll);

		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	useEffect(() => {
		if (width > 425) {
			setShowMenu(false);
		}
	}, [width]);

	useEffect(() => {
		if (ref?.current) setHeight && setHeight(ref.current?.offsetHeight);
	}, [ref.current]);

	const getMenuItemActiveClassName = (paths) =>
		paths.includes(currentPath)
			? "text-blue-107 font-extrabold border-b-2 border-solid border-current"
			: "";

	const getSubMenuItemActiveClassName = (paths) =>
		paths.includes(currentPath) ? "text-blue-107 font-extrabold" : "";

	return (
		<div className='h-72 font-firaSans'>
			<nav
				className={`h-72 z-40 transform transition duration-300 ${
					headerBgColor
						? "bg-blue-105 bg-opacity-80"
						: "bg-blue-105 bg-opacity-80 backdrop-filter backdrop-blur"
				} fixed w-full top-0`}
				ref={ref}>
				<div
					className={`max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto px-5 md:px-0 h-full flex justify-between items-center`}>
					<div className='flex items-center text-white h-full'>
						<img
							src={unthink_ai_logo_white}
							alt='unthink_ai_logo_white'
							height={28}
							className='cursor-pointer'
							onClick={() => navigate("/")}
						/>
						<div className='pl-11 font-medium text-lightgray-103 hidden lg:flex items-center gap-4 xl:gap-6'>
							<Link
								className={`text-current p-0 ${getMenuItemActiveClassName([
									"/brands/",
								])}`}
								href='/brands'>
								For Brands
							</Link>
							{/* <Link
								className={`text-current p-0 ${getMenuItemActiveClassName(
									["/publishers/"]
								)}`}
								href='/publishers'>
								For Publishers
							</Link> */}
							<div className='relative dropdown group'>
								<Link
									className={`text-current p-0 ${getMenuItemActiveClassName([
										"/publishers/",
										"/influencers/",
									])}`}
									href='/publishers'>
									Creators ▼
								</Link>
								<div className='dropdown_content rounded-md hidden absolute -right-7 pt-1 group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 border border-slate-700 shadow-lg z-50 min-w-40'>
									<Link
										className={`text-base block px-4 py-2 hover:bg-slate-800 ${getSubMenuItemActiveClassName([
											"/publishers/",
										])}`}
										href='/publishers'>
										Publishers
									</Link>
									<hr className='my-1 border-slate-700' />
									<Link
										className={`text-base block px-4 py-2 hover:bg-slate-800 ${getSubMenuItemActiveClassName([
											"/influencers/",
										])}`}
										href='/influencers'>
										Influencers
									</Link>
								</div>
							</div>
							<Link
								className={`text-current p-0 ${getMenuItemActiveClassName([
									"/pop-up-store/",
								])}`}
								href='/pop-up-store'>
								Pop-up Store
							</Link>
							{/* <div className='relative dropdown'>
								<Link
									className={`text-current p-0 ${getMenuItemActiveClassName(
										["/products/pop-up-store/", "/products/shop-widget/"]
									)}`}
									href='/products/pop-up-store'>
									Products ▼
								</Link>
								<div className='dropdown_content rounded-md hidden absolute -right-7 pt-1'>
									<Link
										className={`text-base ${getSubMenuItemActiveClassName([
											"/products/pop-up-store/",
										])}`}
										href='/products/pop-up-store'>
										Pop-up Store
									</Link>
									<hr />
									<Link
										className={`text-base ${getSubMenuItemActiveClassName([
											"/products/shop-widget/",
										])}`}
										href='/products/shop-widget'>
										Shop Widget
									</Link>
								</div>
							</div> */}
							{/* <div className='relative dropdown'> */}
							<Link
								className={`text-current p-0 ${getMenuItemActiveClassName([
									"/about/",
								])}`}
								href='/about'>
								About Us
							</Link>
							{/* <div className='dropdown_content rounded-md hidden absolute -right-7 pt-1'>
									<Link
										className={`text-base ${getSubMenuItemActiveClassName([
											"/about/",
										])}`}
										href='/about'>
										Who we are
									</Link>
									<hr />
									<a className={`text-base`} href={PATH_BLOG}>
										Blog
									</a>
								</div>
							</div> */}
							<a className={`text-current p-0`} href={PATH_BLOG}>
								Blog
							</a>
						</div>
					</div>
					<div className='pl-8 hidden lg:flex items-center font-semibold text-lightgray-103'>
						{/* <Link
							className={`text-current mx-2 p-0 xl:mx-3 ${getMenuItemActiveClassName(
								["/about/"]
							)}`}
							href='/about'>
							About
						</Link>
						<a className='text-current mx-2 p-0 xl:mx-3' href={PATH_BLOG}>
							Blog
						</a> */}
						{showSignIn && (
							<button
								className='mx-2 xl:mx-3 text-current font-semibold text-sm'
								onClick={() => navigate(signInRedirectPath)}>
								Sign in
							</button>
						)}
						{showScheduleDemo && (
							<button
								className='mx-2 xl:mx-3 px-3.5 py-2 text-current border-2 border-current rounded-3xl font-semibold text-sm'
								onClick={() => navigate("/schedule-demo")}>
								Schedule a Demo
							</button>
						)}

						{/* <button
							onClick={() => navigate("/try-for-free")}
							className='mx-2 xl:mx-3 px-3.5 py-1.s text-white rounded-md bg-indigo-600 border-none text-sm font-semibold py-1.5'>
							Try for Free
						</button> */}
					</div>
					<div
						className='px-3 lg:hidden cursor-pointer flex items-center h-full'
						onClick={() => setShowMenu(true)}>
					<Image src={menu_icon} alt='menu_icon' width={24} height={24} />
				</div>

				{showMenu && (
					<div className='fixed top-0 left-0 flex flex-col w-full h-screen p-5 overflow-hidden bg-blue-105 text-white z-40'>
							<div className='text-2xl'>
								<CloseOutlined
									className='float-right'
									onClick={() => setShowMenu((prevState) => !prevState)}
								/>
							</div>
							<div className='flex flex-col w-full items-center justify-center p-5'>
								{MenuItems.map((item, index) =>
									item && item.url ? (
										item.url === PATH_BLOG ? (
											<a
												onClick={() => setShowMenu(false)}
												className='my-2.5'
												href={item.url}
												key={index}>
												{item.title}
											</a>
										) : (
											<Link
												onClick={() => setShowMenu(false)}
												className='my-2.5'
												href={item.url}
												key={index}>
												{item.title}
											</Link>
										)
									) : null
								)}
								{showSignIn && (
									<button
										className='mx-2 xl:mx-3 px-3.5 py-0.75 my-2.5 text-current border-2 border-current rounded-3xl font-semibold text-sm'
										onClick={() => navigate(signInRedirectPath)}>
										Sign in
									</button>
								)}
								{showScheduleDemo && (
									<button
										className='mx-2 xl:mx-3 px-3.5 py-2 my-2.5 text-current border-2 border-current rounded-3xl font-semibold text-sm'
										onClick={() => navigate("/schedule-demo")}>
										Schedule a Demo
									</button>
								)}
								{/* <button
									onClick={() => navigate("/try-for-free")}
									className='mx-2 xl:mx-3 px-3.5 py-1.s my-2.5 text-white rounded-md bg-indigo-600 border-none text-sm font-semibold py-1.5'>
									Try for Free
								</button> */}
							</div>
						</div>
					)}
				</div>
			</nav>
		</div>
	);
};

export default Header;
