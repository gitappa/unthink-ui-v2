import React from "react";
import Footer from "../src/pageComponents/staticHomePage/Footer";
import Header from "../src/pageComponents/staticHomePage/Header";
import Publishers from "../src/pageComponents/staticHomePage/Publishers";
import { ROUTES } from "../src/constants/codes";

const PublishersContainer = ({ path }) => {
	return (
		<div className='static_page_bg'>
			<Header
				currentPath={path}
				signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
			/>
			<Publishers />
			<Footer />
		</div>
	);
};

export default PublishersContainer;

