import React from 'react';
import reqwest from 'reqwest';

var Index = React.createClass({
	render:function(){
		return (
			<h1 style={{ margin:0 }}>主页</h1>
		)
	}
})

reqwest({
      url:'http://bnm.stnts.dev/csrf-token',
      method: 'get',
      type: 'json',
    }).then(result => {
     	window._TOKEN = result.data;
    }, function (err, msg) {
      console.log('请求TOKEN失败');
    })


module.exports = Index;