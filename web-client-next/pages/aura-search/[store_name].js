import React from "react";

import AuraChat from "../../src/pageComponents/auraChatPage";
import { aura_header_theme } from "../../src/constants/config";

const AuraChatPage = (props) => {
	return (
		<AuraChat
			isAuraChatPage
			serverData={{
				config: {
					aura_header_theme: aura_header_theme,
				},
			}}
		/>
	);
};

export default AuraChatPage;

export const getServerSideProps = () => ({
  props: {},});