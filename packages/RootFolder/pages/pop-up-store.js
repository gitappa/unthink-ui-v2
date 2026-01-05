// old file location : pages/products/pop-up-store.js
// new file location : pages/pop-up-store.js

// old route : /products/pop-up-store
// new route : /pop-up-store

import React from "react";

import Footer from "../src/pageComponents/staticHomePage/Footer";
import Header from "../src/pageComponents/staticHomePage/Header";
import PopupStore from "../src/pageComponents/staticHomePage/products/PopupStore";
import { ROUTES } from "../src/constants/codes";

const PopupStoreContainer = ({ path }) => {
	return (
		<div className='static_page_bg'>
			<Header
				currentPath={path}
				signInRedirectPath={ROUTES.TRY_FOR_FREE_PAGE}
			/>
			<PopupStore />
			<Footer />
		</div>
	);
};

export default PopupStoreContainer;

