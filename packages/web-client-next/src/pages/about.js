import React from "react";
import About from "../pageComponents/staticHomePage/About";
import Footer from "../pageComponents/staticHomePage/Footer";
import Header from "../pageComponents/staticHomePage/Header";
import { ROUTES } from "../constants/codes";
import static_page_bg from '../../style/index.module.scss'
 
// export { getServerData } from "../helper/serverUtils";

const AboutPageContainer = ({ path }) => {
	console.log(static_page_bg);
	
	return (
		<div className= {`${static_page_bg }`}>
			<Header
				currentPath={path}
				signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
			/>
			<About />
			<Footer />
		</div>
	);
};

export default AboutPageContainer;
