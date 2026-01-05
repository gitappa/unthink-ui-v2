const path = require("path");

module.exports = {
	entry: "/aura_collections/unthink_aura_collections_dev.js",
	output: {
		filename: "unthink_aura_collections.js",
		path: path.resolve(__dirname, "../aura_collections"),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
};
