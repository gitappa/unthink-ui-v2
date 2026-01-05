const path = require("path");

module.exports = {
	entry: "/bt_carousel/bt_carousel_dev.js",
	output: {
		filename: "bt_carousel.js",
		path: path.resolve(__dirname, "../bt_carousel"),
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
