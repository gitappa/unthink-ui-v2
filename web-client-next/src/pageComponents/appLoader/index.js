import React from "react";
import { useSelector } from "react-redux";

import Loader from "../../components/Loader";

const AppLoaderComponent = () => {
	const [isAppLoaderActive] = useSelector((state) => [
		!!state.appState.appLoader.list.length,
	]);

	return (
		<div>
			{isAppLoaderActive && (
				<div className='fixed z-40 top-0 left-0 flex justify-center items-center w-full h-full bg-white/40 backdrop-blur-md'>
					<Loader />
				</div>
			)}
		</div>
	);
};

export default AppLoaderComponent;
