
const path = require("path");

// webpack plugins
const { CheckerPlugin } = require("awesome-typescript-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");

const { getPackageName } = require("./utils");

// globals
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const DEV_PORT = process.env.PORT || 9000;
const PACKAGE_NAME = getPackageName();

/**
 * Configure plugins loaded based on environment.
 */
const plugins = [
    // Used for async error reporting
    // Can remove after https://github.com/webpack/webpack/issues/3460 resolved
    new CheckerPlugin(),

    // CSS extraction is only enabled in production (see scssLoaders below).
    new MiniCssExtractPlugin({ filename: "[name].css" }),
];

if (!IS_PRODUCTION) {
    plugins.push(
        // Trigger an OS notification when the build succeeds in dev mode.
        new WebpackNotifierPlugin({ title: PACKAGE_NAME }),
    );
}

const extractPlugin = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        esModule: true,
    },
};

// Module loaders for .scss files, used in reverse order:
// compile Sass, apply PostCSS, interpret CSS as modules.
const scssLoaders = [
    // Only extract CSS to separate file in production mode.
    IS_PRODUCTION ? extractPlugin : require.resolve("style-loader"),
    {
        loader: require.resolve("css-loader"),
        options: {
            // necessary to minify @import-ed files using cssnano
            importLoaders: 1,
        },
    },
    {
        loader: require.resolve("postcss-loader"),
        options: {
            postcssOptions: {
                plugins: [require("autoprefixer"), require("cssnano")({ preset: "default" })],
            },
        },
    },
    require.resolve("sass-loader"),
];

module.exports = {
    devtool: IS_PRODUCTION ? false : "inline-source-map",

    devServer: {
        contentBase: "./src",
        disableHostCheck: true,
        historyApiFallback: true,
        https: false,
        hot: true,
        index: path.resolve(__dirname, "src/index.html"),
        inline: true,
        stats: "errors-only",
        open: false,
        overlay: {
            warnings: true,
            errors: true,
        },
        port: DEV_PORT,
    },

    mode: IS_PRODUCTION ? "production" : "development",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: require.resolve("awesome-typescript-loader"),
                options: {
                    configFileName: "./src/tsconfig.json",
                },
            },
            {
                test: /\.scss$/,
                use: scssLoaders,
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                loader: require.resolve("file-loader"),
                options: {
                    name: "[name].[ext]?[hash]",
                    outputPath: "assets/",
                },
            },
        ],
    },

    plugins,

    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
    },
};