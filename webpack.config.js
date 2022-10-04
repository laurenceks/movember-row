const path = require("path");
const glob = require("glob-all");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
        liveReload: true,
        hot: false,
    },
    plugins: [
        new PurgecssPlugin({
            paths: glob.sync([`${path.join(__dirname, "src")}/**/*`,`${path.join(__dirname, "dist")}/**/*`,`${path.join(__dirname, "public")}/**/*`], {nodir: true}),
        }),
        new HtmlWebpackPlugin({template: "public/index.html"}),
        new MiniCssExtractPlugin({filename: "[name].css"}),
    ],
    mode: "development",
    module: {
        rules: [{
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
        }, {
            test: /\.s[ac]ss$/i,
            exclude: /node_modules/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        }],
    },

};
