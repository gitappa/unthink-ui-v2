const path = require("path");

module.exports = {
	entry: "/aura_inspiration_modal/aura_inspiration_modal_dev.js",
	output: {
		filename: "aura_inspiration_modal.js",
		path: path.resolve(__dirname, "../aura_inspiration_modal"),
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
