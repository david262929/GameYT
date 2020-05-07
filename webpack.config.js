const EXPORT_PATH = './dist';
const EXPORT_FILE_NAME = 'app.min.js';
const TEMPLATE_HTML = "./public/index.html";

const MODE = process.env.NODE_ENV || 'development';
const PATH = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');


let config = {
    mode: MODE,
    entry: PATH.resolve(__dirname, './src/index.js'),
    output: {
        filename: EXPORT_FILE_NAME,
        path: PATH.resolve(__dirname, EXPORT_PATH),
    },
    resolve: {
        extensions: ['.js', '.scss', '.css'],
        alias: {
            '@assets': PATH.resolve(__dirname, 'src/assets'),
            '@style': PATH.resolve(__dirname, 'src/assets/style'),
            '@img': PATH.resolve(__dirname, 'src/assets/img'),
            '@': PATH.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devServer: {
        port: 4202,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: TEMPLATE_HTML,
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_module/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.(sc|sa|c)ss$/i,
                exclude: /node_module/,
                use: [
                    'style-loader', // Inject Styles into DOM
                    'css-loader', // Turn css into js
                    {
                        loader: 'sass-loader', // Turn scss to css
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
        ]
    }
};

if (MODE === 'development') {
    config.devtool = 'source-map';
}

module.exports = config;