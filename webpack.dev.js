const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'development',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/template.html'
		})
	],
	devServer: {
		publicPath: '/',
		historyApiFallback: true
	},
	externals: {
		// global app config object
		config: JSON.stringify({
			apiUrl: //"https://europe-west1-xnet-68e82.cloudfunctions.net/api"
			'http://localhost:5000/xnet-68e82/europe-west1/api'
		})
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
			},
			{
				test: /\.less$/,
				use: [
					{ loader: 'style-loader' }, //3. Inject styles into DOM
					{ loader: 'css-loader' }, //2. Turns css into commonjs
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								paths: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')]
							}
						}
					} //1. Turns less into css
				]
			}
		]
	}
});
