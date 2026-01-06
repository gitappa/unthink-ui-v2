const path = require("path");

module.exports = {
    entry: "/new_aura_collection/new_aura_collection.js",
    output: {
        filename: "aura_inspiration_modal_convert.js",
        path: path.resolve(__dirname, "../new_aura_collection"),
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
