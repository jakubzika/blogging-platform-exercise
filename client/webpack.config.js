const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const YAML = require('yaml')
const fs = require('fs')

var config = {}
function loadConfig() {
    config = YAML.parse(fs.readFileSync('../config.yml','utf8'))
}

loadConfig()

module.exports = {
    mode: 'none',
    entry: {
        app: path.join(__dirname, 'src', 'index.tsx')
    },
    devtool: 'inline-source-map',
    target: 'web',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.scss$/i,
                use: [
                  "style-loader",
                  "@teamsupercell/typings-for-css-modules-loader",
                  {
                    loader: "css-loader",
                    options: { modules: true }
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      implementation: require('sass'),
                    },
                  },
                ]
            },
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'file-loader',
              ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.ya?ml$/,
                type: 'json',
                use: 'yaml-loader'
            }
        ],
    },
    devServer: {
        contentBase: path.join('../dist/dist'),
        port: 9000,
        historyApiFallback: true,
        // publicPath: '/assets/'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist/'),
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.API_URL': JSON.stringify(config.client.apiUrl)
        })
    ]
}
