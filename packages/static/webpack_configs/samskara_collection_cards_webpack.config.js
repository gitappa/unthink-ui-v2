const path = require("path");

module.exports = {
	entry: "/samskara/samskara_collection_cards_dev.js",
	output: {
		filename: "samskara_collection_cards.js",
		path: path.resolve(__dirname, "../samskara"),
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
