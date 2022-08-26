const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public")
        },
        compress: true,
        port: 9000,
        liveReload: true,
        hot: false,
    },
        plugins: [
        new HtmlWebpackPlugin({ template: "public/index.html" })],
    mode: "development"
}
