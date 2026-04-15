import React from "react";
import Footer from "../pageComponents/staticHomePage/Footer";
import Header from "../pageComponents/staticHomePage/Header";
import Publishers from "../pageComponents/staticHomePage/Publishers";
import { ROUTES } from "../constants/codes";

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
