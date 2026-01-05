// blog theme collections list page for theme specific store
import React from "react";

import StorePage from "../../pageComponents/storePage";
import { aura_header_theme } from "../../constants/config";

const StorePageContainer = (props) => {
	return (
		<StorePage
			isThemePage
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
