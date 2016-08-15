var InforError ={
	getDefaultProps() {
	    return {
	        infoError:function(infoArray){
	        	var errorArray = [];
	        	for(var  i=0; i<infoArray.length; i++){
	        		for(var da in infoArray[i]){
	        			errorArray.push(infoArray[i][da])
	        		}
	        	}

	        	return errorArray.join(',')
	        }
	    };
	},
}

export default InforError;