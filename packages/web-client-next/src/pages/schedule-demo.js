// new added : /schedule-demo

import React from "react";

import Footer from "../pageComponents/staticHomePage/Footer";
import Header from "../pageComponents/staticHomePage/Header";
import { ScheduleDemo } from "../pageComponents/staticHomePage/ScheduleDemo";
import { ROUTES } from "../constants/codes";

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
