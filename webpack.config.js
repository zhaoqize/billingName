//开发环境的配置
'use strict';

var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry : {
		app:'./app.js',
		vendors:['react','babel-plugin-antd']
	},
	output : {
		path : './assert/',
		filename : 'bundle.[hash].js'
	},
	resolve: {
    	extensions: ['', '.js', '.jsx']
    },
	module: {
	    loaders: [{
	      test: /\.jsx?$/, 
	      loader: 'babel',
	      query: {
          	presets: ['react', 'es2015'],
          	plugins: [["antd", { "style": "css" }]]
          },
          exclude: /node_modules/
	    },{
	      test: /\.css$/, 
	      loader: 'style!css' 
	    },{
	      test: /\.less$/,
	      loader: 'style!css!less'
	    }
	    ]
  	},
  	plugins:[
  		new webpack.ProvidePlugin({
		    "React": "react",
		    "ReactDOM": "react-dom"
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress : {
				warnings: false
			}
		}),
		new webpack.BannerPlugin((new Date).toLocaleDateString() + ' 打包;接口地址:http:// + window.location.host'),
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
		new HtmlwebpackPlugin({
			template:'./temp/index_temp.html',
			filename: 'index.html', 
			inject:'body'
		})
  	]
}