// removed - old route for creators : pages/creators
// added - new route for creators : pages/influencers 

import React from "react";

import Creators from "../../pageComponents/staticHomePage/Creators";
import Footer from "../../pageComponents/staticHomePage/Footer";
import Header from "../../pageComponents/staticHomePage/Header";
import { ROUTES } from "../../constants/codes";

const CreatorsContainer = ({ path }) => {
	return (
		<div className='static_page_bg'>
			<Header
				currentPath={path}
				signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
			/>
			<Creators />
			<Footer />
		</div>
	);
};

export default CreatorsContainer;
