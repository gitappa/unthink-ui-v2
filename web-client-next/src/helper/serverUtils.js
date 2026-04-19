export async function getServerData(props) {
	const host = props.headers.get("host");
	const config = { aura_header_theme: "" };

	if ("shop.unthink.shop" === host) {
		config.aura_header_theme = "dark";
	} else {
		config.aura_header_theme = "light";
	}
	return {
		props: { config },
	};
}
