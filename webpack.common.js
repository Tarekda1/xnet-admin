const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		main: './src/index.js'
		//vendor: "./src/vendor.js"
	},
	resolve: {
		mainFiles: [ 'index', 'Index' ],
		extensions: [ '.js', '.jsx' ],
		alias: {
			'@': path.resolve(__dirname, 'src/'),
			'#': path.resolve(__dirname, 'public/')
			// "../../theme.config$": path.join(
			//   __dirname,
			//   "my-semantic-theme/theme.config"
			// ),
		}
	},
	module: {
		rules: [
			// {
			//   test: /\.jsx?$/,
			//   use: {
			//     loader: "babel-loader",
			//   },
			// },
			{
				test: /\.m?(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ],
						plugins: [ '@babel/plugin-transform-runtime' ]
					}
				}
			},
			// {
			//   test: /\.js$/,
			//   exclude: /node_modules/,
			//   use: {
			//     loader: "babel-loader",
			//   },
			// },
			{
				test: /\.html$/,
				use: [ 'html-loader' ]
			},
			{
				test: /\.(svg|png|jpg|gif)$/,
				use: {
					loader: 'url-loader',
					options: {
						name: '[name].[hash].[ext]',
						outputPath: 'imgs',
						useRelativePath: 'true'
					}
				}
			},
			{
				test: [ /\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/ ],
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[hash].[ext]',
						outputPath: 'fonts'
					}
				}
			}
		]
	}
};
