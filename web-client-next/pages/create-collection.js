import React from "react";

import StorePage from "../src/pageComponents/storePage";
import { aura_header_theme } from "../src/constants/config";

// export { getServerData } from "../src/helper/serverUtils";

const StorePageContainer = (props) => {
	return (
		<StorePage
			isCreateFreeCollectionPage
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

// import CreateFreeCollection from "../src/pageComponents/tryForFree/CreateFreeCollection";
// export default CreateFreeCollection;

