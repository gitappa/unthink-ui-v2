import React from "react";

import AuraChatPage from "../../pageComponents/auraChatPage/AuraChatPage";
import { aura_header_theme } from "../../constants/config";

const AuraChatPageContainer = (props) => {
	return (
		<AuraChatPage
			isAuraChatPage
			serverData={{
				config: {
					aura_header_theme: aura_header_theme,
				},
			}}
		/>
	);
};

export default AuraChatPageContainer;
