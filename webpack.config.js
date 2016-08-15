//开发环境的配置
'use strict';

var webpack = require('webpack');

module.exports = {
	entry : ['./app.js'],
	output : {
		path : './build/',
		filename : 'bundle.js'
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
          }
	    },{
	      test: /\.css$/, 
	      loader: 'style!css' ,
	    }

	    ]
  	},
  	plugins:[
  		new webpack.ProvidePlugin({
		    "React": "react",
		    "ReactDOM": "react-dom"
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress : {
				warnings: false
			}
		}),
		new webpack.BannerPlugin((new Date).toLocaleDateString() + ' 打包;接口地址:http:// + window.location.host'),
  	]
}