import { Menu, 
         Badge, 
         Icon, 
         Dropdown} from 'antd';
import { Link,
         hashHistory,
         Router,
         Route } from 'react-router';
import reqwest from 'reqwest';


import { ModalWarn,
         ModalError } from '../component/index';

var HearderTitle = React.createClass({
  handleClick: function(event) {
    hashHistory.push('/');
  },
  render: function(){
    return (
        <a style={{ color:'white' }} onClick={ this.handleClick }>
              <h2 style={{ display:'inline-block',color:'white',marginLeft:20 }}>计费名管理中心</h2>
        </a>
    )
  }
})

var LoginNoc = React.createClass({
  help:function(){
    alert("暂无帮助或说明文档!");
  },
	render: function(){
		return (
			<div style={{ color:'white',display:'inline-block',marginRight:'1%',float:'right' }} onClick={ this.help }>
	    			<Icon type="question-circle-o" />
			</div>
		)
	}
})


var LoginUser = React.createClass({
  getInitialState() {
    return {
      user: ''
    };
  },
  componentDidMount: function() {
    const _this = this;

    //请求user
    this.fetch({
      url:'/user',
      callbackone:function(result){
        if(result.status === 'success'){
          _this.setState({
            user : result.data
          });
        }
      },
      callbacktwo:function(res){
        if(res.status === 401){
          ModalWarn('警告',res.response + '! 将跳转到登陆界面...')
          setTimeout(function(){
            window.location="http://192.168.2.6:8091";
          },1500)
        }
      }
    })
    
  },
  signOff:function(){
    this.fetch({
      url:'/sign-off',
      callbackone:function(result){
        if(result.status === 200 ){
          window.location="http://192.168.2.6:8091";
        }else{
          ModalError('警告','请求异常!');
        }
      },
      callbacktwo:function(res){
        ModalError('警告','请求异常!');
      }
    })
  },
  fetch:function(obj){
    reqwest({
      url: rootURL + obj.url,
      method: 'get',
      type: 'json'
    }).then( (result) => {
      obj.callbackone(result);
    },function(res){
      obj.callbacktwo(res);
    });
  },
  render:function(){
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Link to={{ pathname:'/user/userInfo',state:this.state.user }}>个人资料</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
          <a onClick={ this.signOff }>退出登陆</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <span>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link"  style={{ float:'right',marginRight:20,color:'white'}}>
            { this.state.user.true_name }
            <Icon type="down" />
          </a>
        </Dropdown>
        <span style={{ color:'white',float:'right' }}></span>
        &nbsp;&nbsp;
      </span>
       
    )
  }
})

var Header = React.createClass({
  render: function () {
    return (
        <div style={{ position:'absolute',width:'100%',lineHeight:'42px' }}>
            <HearderTitle />
            <LoginUser />
            <LoginNoc />
        </div>
    );
  }
});


var HeaderRoute = (
  <Router history={ hashHistory }>
    <Route path='*' component={ Header }></Route>
  </Router>
)

export default HeaderRoute;


