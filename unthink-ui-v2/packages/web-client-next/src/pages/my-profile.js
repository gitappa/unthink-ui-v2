import React from "react";
import dynamic from "next/dynamic";

import { aura_header_theme } from "../constants/config";

// Dynamically import StorePage to avoid SSR issues
const StorePage = dynamic(() => import("../pageComponents/storePage"), {
	ssr: false,
	loading: () => <div>Loading...</div>
});

// export { getServerData } from "../helper/serverUtils";

const StorePageContainer = (props) => {
	return (
		<StorePage
			isMyProfilePage
			{...props}
			serverData={{
				config: {
					aura_header_theme: aura_header_theme,
				},
			}}
		/>
	);
};

export default StorePageContainer;
