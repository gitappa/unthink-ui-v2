// blog theme collections list page for theme specific store
import React, { useEffect } from "react";

import StorePage from "../../src/pageComponents/storePage";
import { aura_header_theme } from "../../src/constants/config";
import useTheme from "../../src/hooks/chat/useTheme";
import { useRouter } from "next/router";

const StorePageContainer = (props) => {
	const { setTheme } = useTheme();
	const router = useRouter();

	useEffect(() => {
		const collectionTheme = router.query.collection_theme;
		if (collectionTheme) {
			setTheme(collectionTheme);
		}
	}, [router.query.collection_theme, setTheme]);

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

