const path = require("path");
const glob = require("glob-all");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "[name].bundle.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "",
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
        new CopyPlugin({
            patterns: [
                {
                    from: "public/img/",
                    to: "img/",
                },
            ],
        }),
        new PurgecssPlugin({
            paths: glob.sync(
                [
                    `${path.join(__dirname, "src")}/**/*`,
                    `${path.join(__dirname, "dist")}/**/*`,
                    `${path.join(__dirname, "public")}/**/*`,
                ],
                { nodir: true }
            ),
            safelist: [/map-progress-marker-icon-\w+/, /btn-map-zoom-icon-\d+/],
        }),
        new HtmlWebpackPlugin({ template: "public/index.html" }),
        new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    ],
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: "asset",
                generator: {
                    filename: "fonts/[hash][ext][query]",
                },
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
        runtimeChunk: "single",
    },
};
