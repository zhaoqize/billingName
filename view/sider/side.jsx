import React from 'react';
import {Menu, Icon} from 'antd';
import {Link} from 'react-router';
import { hashHistory } from 'react-router';
import reqwest from 'reqwest';

import '../../resources/css/antd.css';

const SubMenu = Menu.SubMenu;

var BUSINESSNAME ='0';

var Sider = React.createClass({
  getInitialState() {

    return {
      current: '',
      openKeys: [],
      result_data : ''
    };
  },
  getDefaultProps() {

      return {
            
      };
  },
  handleClick(e) {
    //更改状态
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1)
    });

    this.urlLink(e.key);

  },
  urlLink:function(key){
    //路由跳转
    if(key){
      hashHistory.push(key);
    }

  },
  onToggle(info) {
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
    });
  },
  openItems:function(){
    var locationHash = location.hash;
    var splitHref = locationHash.substring(0,locationHash.indexOf('?')).split('/');
    splitHref.shift();
    this.setState({
      current: splitHref.join('/'),
      openKeys: splitHref
    })
  },
  componentDidMount: function() {
    this.openItems();
  },
  componentWillReceiveProps(next) {
    this.setState({
      current:location.hash.substring(2,location.hash.indexOf('?'))
    })
  },
  render() {
  	console.log("菜单渲染了")
    return (
      <div style={{ height:100+'%' }}>
          <Menu onClick={this.handleClick}
            openKeys={this.state.openKeys}
            onOpen={this.onToggle}
            onClose={this.onToggle}
            style={{ height:100+'%' }}
            selectedKeys={[this.state.current]}
            mode="inline"
          >
            <SubMenu key="business" title={<span><Icon type="setting" /><span>业务</span></span>}>
              <Menu.Item key='business/BaiduSearch'> 百度搜索 </Menu.Item>
              <Menu.Item key='business/BaiduXML'> 百度XML </Menu.Item>
            </SubMenu>
            <SubMenu key="channel" title={<span><Icon type="setting" /><span>渠道</span></span>}>
              <SubMenu key="channelManage" title="淘金渠道管理">
                <Menu.Item key="channel/channelManage">第三方渠道管理</Menu.Item>
                <Menu.Item key="channel/agencyManage">代理商渠道管理</Menu.Item>
                <Menu.Item key="channel/barManage">网吧渠道管理</Menu.Item>
              </SubMenu>
              <Menu.Item key='channel/accountManage'> 账号管理 </Menu.Item>
            </SubMenu>
            <SubMenu key="ad" title={<span><Icon type="setting" /><span>广告</span></span>}>
              <Menu.Item key='ad/codeManage'> 广告代码管理 </Menu.Item>
              <Menu.Item key='ad/adsenseManage'> 广告位管理 </Menu.Item>
            </SubMenu>
          </Menu>
      </div>
    );
  }
})

module.exports = Sider;