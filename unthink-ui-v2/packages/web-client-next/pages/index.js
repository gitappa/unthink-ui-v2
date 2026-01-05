// old : used Brands as a home page
// new : using RootStatic as a home page

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { aura_header_theme, is_store_instance } from "../src/constants/config";
import Footer from "../src/pageComponents/staticHomePage/Footer";
import Header from "../src/pageComponents/staticHomePage/Header";
import RootStatic from "../src/pageComponents/staticHomePage/RootStatic";
import { ROUTES } from "../src/constants/codes";

// Dynamically import StorePage to avoid hydration issues
const SharedPage = dynamic(() => import("../src/pageComponents/storePage"), {
	ssr: false,
	loading: () => <div>Loading...</div>
});

const Index = ({ ...props }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (is_store_instance && !mounted) {
		return null; // Don't render anything until mounted on client
	}

	return (
		<>
			{is_store_instance ? ( // for store home page
				mounted && (
					<SharedPage
						isRootPage
						isSharedPage
						{...props}
						serverData={{
							config: {
								aura_header_theme: aura_header_theme,
							},
						}}
					/>
				)
			) : (
				<div className='overflow-hidden static_page_bg'>
					<Header
						// showSignIn={false}
						signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
						currentPath={props.path}
					/>
					<RootStatic />
					<Footer />
				</div>
			)}
		</>
	);
};

export default Index;

// Use server-side rendering to avoid Redux SSR issues
export const getServerSideProps = () => {
	return { props: {} };
};