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
			? styles.menuLinkActive
			: "";

	const getSubMenuItemActiveClassName = (paths) =>
		paths.includes(currentPath) ? styles.subMenuLinkActive : "";

	return (
		<div className={styles.headerWrapper}>
			<nav
				className={`${styles.nav} ${headerBgColor
						? styles.navDefault
						: styles.navScrolled
					}`}
				ref={ref}>
				<div
					className={styles.navInner}>
					<div className={styles.logoSection}>
						<img
							src={unthink_ai_logo_white}
							alt='unthink_ai_logo_white'
							height={28}
							className={styles.logo}
							onClick={() => navigate("/")}
						/>
						<div className={styles.menuLinks}>
							<Link
								className={`${styles.menuLink} ${getMenuItemActiveClassName([
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
							<div className={styles.dropdown}>
								<Link
									className={`${styles.menuLink} ${getMenuItemActiveClassName([
										"/publishers/",
										"/influencers/",
									])}`}
									href='/publishers'>
									Creators ▼
								</Link>
								<div className={styles.dropdownContent}>
									<Link
										className={`${styles.subMenuLink} ${getSubMenuItemActiveClassName([
											"/publishers/",
										])}`}
										href='/publishers'>
										Publishers
									</Link>
									<hr className={styles.subMenuDivider} />
									<Link
										className={`${styles.subMenuLink} ${getSubMenuItemActiveClassName([
											"/influencers/",
										])}`}
										href='/influencers'>
										Influencers
									</Link>
								</div>
							</div>
							<Link
								className={`${styles.menuLink} ${getMenuItemActiveClassName([
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
								className={`${styles.menuLink} ${getMenuItemActiveClassName([
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
							<a className={styles.menuLink} href={PATH_BLOG}>
								Blog
							</a>
						</div>
					</div>
					<div className={styles.rightSection}>
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
								className={styles.signInButton}
								onClick={() => navigate(signInRedirectPath)}>
								Sign in
							</button>
						)}
						{showScheduleDemo && (
							<button
								className={styles.scheduleDemoButton}
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
						className={styles.mobileMenuButton}
						onClick={() => setShowMenu(true)}>
						<Image src={menu_icon} alt='menu_icon' width={24} height={24} />
					</div>

					{showMenu && (
						<div className={styles.mobileMenu}>
							<div className={styles.mobileMenuClose}>
								<CloseOutlined
									className={styles.mobileMenuCloseIcon}
									onClick={() => setShowMenu((prevState) => !prevState)}
								/>
							</div>
							<div className={styles.mobileMenuContent}>
								{MenuItems.map((item, index) =>
									item && item.url ? (
										item.url === PATH_BLOG ? (
											<a
												onClick={() => setShowMenu(false)}
												className={styles.mobileMenuItem}
												href={item.url}
												key={index}>
												{item.title}
											</a>
										) : (
											<Link
												onClick={() => setShowMenu(false)}
												className={styles.mobileMenuItem}
												href={item.url}
												key={index}>
												{item.title}
											</Link>
										)
									) : null
								)}
								{showSignIn && (
									<button
										className={styles.mobileSignInButton}
										onClick={() => navigate(signInRedirectPath)}>
										Sign in
									</button>
								)}
								{showScheduleDemo && (
									<button
										className={styles.mobileScheduleDemoButton}
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
