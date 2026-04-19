// new added : /schedule-demo

import React from "react";

import Footer from "../src/pageComponents/staticHomePage/Footer";
import Header from "../src/pageComponents/staticHomePage/Header";
import { ScheduleDemo } from "../src/pageComponents/staticHomePage/ScheduleDemo";
import { ROUTES } from "../src/constants/codes";

const PopupStoreContainer = ({ path }) => {
	return (
		<div className='static_page_bg'>
			<Header
				showScheduleDemo={false}
				currentPath={path}
				signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
			/>
			<ScheduleDemo />
			<Footer />
		</div>
	);
};

export default PopupStoreContainer;

