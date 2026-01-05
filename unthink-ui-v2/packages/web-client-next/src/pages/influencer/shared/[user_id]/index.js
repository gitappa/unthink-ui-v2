// old url : /store/shared/userId
import React from "react";

import StorePage from "../../../../pageComponents/storePage";
import { aura_header_theme } from "../../../../constants/config";

// export { getServerData } from "../../../../helper/serverUtils";

const StorePageContainer = (props) => {
	return (
		<StorePage
			isSharedPage
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
