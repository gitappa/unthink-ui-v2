// blog theme collection page for theme specific store
import React from "react";

import StorePage from "../../../../pageComponents/storePage";
import { aura_header_theme } from "../../../../constants/config";
import useTheme from "../../../../hooks/chat/useTheme";

const StorePageContainer = (props) => {
	const { theme, setTheme } = useTheme();

	if (
		props.params?.collection_theme &&
		theme !== props.params?.collection_theme
	) {
		setTheme(props.params?.collection_theme);
	}

	return (
		<StorePage
			isCollectionPage
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
