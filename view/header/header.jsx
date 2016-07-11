import React  from 'react';
import {Menu, Badge, Icon, Dropdown} from 'antd';
import { hashHistory } from 'react-router';
import reqwest from 'reqwest';

import '../../resources/css/antd.css';

var Header = React.createClass({
  getInitialState: function() {
    return {value: 'Hello!'};
  },
  handleClick: function(event) {
    hashHistory.push('/');
  },
  render: function () {
    var value = this.state.value;
    return (
        <div style={{ position:'absolute',width:100+'%',top:13 }}>
            <a style={{ color:'white' }} onClick={ this.handleClick }>
              <h2 style={{ display:'inline-block',color:'white',marginLeft:2+'%' }}>计费名管理中心</h2>
            </a>
            <LoginUser />
            <LoginNoc />
        </div>
    );
  }
});

var LoginNoc = React.createClass({
	render: function(){
		return (
			<div style={{ color:'white',display:'inline-block',marginRight:1+'%',float:'right' }}>
				<Badge dot>
	    			<Icon type="notification" />
	  			</Badge>
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
    reqwest({
      url: 'http://bnm.stnts.dev/user',
      method: 'get',
      type: 'json'
    }).then(result => {
      this.setState({
        user : result.data
      });
    });
    
  },
  toUserInfo:function(){
    hashHistory.push('/business/userInfo');
  },
  render:function(){
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a target="_self" href="/#/user/userInfo">个人资料</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a target="_self" href="http://192.168.2.6:8091/login.do">退出登陆</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <span>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="#" style={{ float:'right',marginRight:2+'%',color:'white'}}>
            <Icon type="down" />
          </a>
        </Dropdown>
        <span style={{ color:'white',float:'right' }}>{ this.state.user.true_name }</span>
        &nbsp;&nbsp;
      </span>
       
    )
  }
})


module.exports = Header;