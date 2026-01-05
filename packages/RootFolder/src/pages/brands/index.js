import React from "react";

import Brands from "../../pageComponents/staticHomePage/Brands";
import Footer from "../../pageComponents/staticHomePage/Footer";
import Header from "../../pageComponents/staticHomePage/Header";
import { ROUTES } from "../../constants/codes";

const BrandsV2Container = ({ path }) => {
	return (
		<div className='static_page_bg'>
			<Header
				// showSignIn={false}
				currentPath={path}
				signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
			/>
			<Brands />
			<Footer />
		</div>
	);
};

export default BrandsV2Container;
