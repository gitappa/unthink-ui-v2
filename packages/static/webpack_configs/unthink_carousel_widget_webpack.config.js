const path = require("path");

module.exports = {
    entry: "/unthink_carousel_widget/unthink_carousel_widget_dev.js",
    output: {
        filename: "unthink_carousel_widget.js",
        path: path.resolve(__dirname, "../unthink_carousel_widget"),
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
