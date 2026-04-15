// old : used Brands as a home page
// new : using RootStatic as a home page

import React from "react";
import dynamic from "next/dynamic";

import { aura_header_theme, is_store_instance } from "../constants/config";

// Dynamically import StorePage to avoid SSR issues
const SharedPage = dynamic(() => import("../pageComponents/storePage"), {
	ssr: false,
	loading: () => <div>Loading...</div>
});
import Footer from "../pageComponents/staticHomePage/Footer";
import Header from "../pageComponents/staticHomePage/Header";
import RootStatic from "../pageComponents/staticHomePage/RootStatic";
import { ROUTES } from "../constants/codes";

const Index = ({ ...props }) => {
	return (
		<>
			{is_store_instance ? ( // for store home page
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
			) : (
				<div className='static_page_bg' style={{ overflow: 'hidden' }}>
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
