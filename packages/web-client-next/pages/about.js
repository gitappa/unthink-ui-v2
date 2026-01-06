import React from "react";
import About from "../src/pageComponents/staticHomePage/About";
import Footer from "../src/pageComponents/staticHomePage/Footer";
import Header from "../src/pageComponents/staticHomePage/Header";
import { ROUTES } from "../src/constants/codes";
import static_page_bg from '../src/style/index.module.scss'

// export { getServerData } from "../src/helper/serverUtils";

const AboutPageContainer = ({ path }) => {
		console.log(static_page_bg);
	return (
	<div className= {`${'' }`}>
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

