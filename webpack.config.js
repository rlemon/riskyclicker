const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
	template: './src/client/index.html',
	filename: './index.html'
})

module.exports = {
	mode: 'development', 
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader', 
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'file-loader',
					'img-loader'
				]
			}
		]
	},
	plugins: [
		htmlPlugin
	],
	output: {
		publicPath: '/'
	},
	devtool: 'source-map'
};