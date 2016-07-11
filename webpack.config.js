//开发环境的配置

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
          	presets: ['react', 'es2015']
          },
          
	    },{
	      test: /\.css$/, 
	      loader: 'style!css' 
	    }
	    ]
  	}
}