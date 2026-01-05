const path = require("path");

module.exports = {
    entry: "/unthink_feature_collection/unthink_feature_collection_dev.js",
    output: {
        filename: "unthink_feature_collection.js",
        path: path.resolve(__dirname, "../unthink_feature_collection"),
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
