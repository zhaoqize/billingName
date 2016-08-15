import { QueueAnim,
         Icon } from 'antd';
import reqwest from 'reqwest';

var Header = React.createClass({
  render:function(){
    return (
      <div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}>
            <h3 style={{ margin: '20px 0px 20px 20px',display:'inline-block' }}> 主页 </h3>
          </div>
    )
  }
})

var MyFocus = React.createClass({
  render:function(){
    return (
      <div style={{ marginLeft:20,marginTop:20 }}>
        <h2 style={{ marginRight: 20,border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}><Icon type="star-o" /> 我关注的</h2>
      </div>
    )
  }
})

var MyFavourite = React.createClass({
  render:function(){
    return (
     <div style={{ marginLeft:20,marginTop:20 }}>
        <h2 style={{ marginRight: 20,border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}><Icon type="smile" /> 我感兴趣的</h2>
      </div>
    )
  }
})

var Index = React.createClass({
	render:function(){
		return (
			<div>
        <Header />
        <QueueAnim delay={500} style={{ height: 150 }}>
          <MyFocus />
          <MyFavourite  />
        </QueueAnim>
      </div>
		)
	}
})

// reqwest({
//       url:'http://bnm.stnts.dev/csrf-token',
//       method: 'get',
//       type: 'json',
//     }).then(result => {
//      	window._TOKEN = result.data;
//     }, function (err, msg) {
//       console.log('请求TOKEN失败');
//     })

module.exports = Index;