
import {Menu, Icon} from 'antd';
import {Link,hashHistory} from 'react-router';

import '../../resources/css/antd.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

var Sider = React.createClass({
  getInitialState() {
    return {
      current: '',
      openKeys: []
    };
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
   
    var splitHrefJoin = splitHref.join('/');
    if(splitHrefJoin.indexOf('business/BaiduSearch') > -1){
        splitHrefJoin = 'business/BaiduSearch';
     }else if(splitHrefJoin.indexOf('business/BaiduXML') > -1){
        splitHrefJoin = 'business/BaiduXML';
     }else if(splitHrefJoin.indexOf('channel/account') > -1){ 
         splitHrefJoin = 'channel/accountManage';
     }

    this.setState({
      current: splitHrefJoin
    })

  },
  componentDidMount: function() {
    this.openItems();
  },
  componentWillReceiveProps(next) {
     
     var splitHref = location.hash.substring(2,location.hash.indexOf('?'));
     if(splitHref.indexOf('business/BaiduSearch') > -1){
        splitHref = 'business/BaiduSearch';
     }else if(splitHref.indexOf('business/BaiduXML') > -1){
        splitHref = 'business/BaiduXML';
     }else if(splitHref.indexOf('channel/account') > -1){ 
         splitHref = 'channel/accountManage';
     }
     
    this.setState({
      current: splitHref
    })
  },
  render() {

    return (
      <div style={{ height:'100%' }}>
          <Menu theme="dark"
            onClick={this.handleClick}
            style={{ height:'100%' }}
            onOpen={this.onToggle}
            onClose={this.onToggle}
            openKeys={['business','channel','ad']}
            selectedKeys={[this.state.current]}
            mode="inline"
          >
            <SubMenu key="business" title={<span><Icon type="appstore" /><span>业务</span></span>}>
              <Menu.Item key='business/BaiduSearch'>
                <Link to="business/BaiduSearch">百度搜索</Link>
              </Menu.Item>
              <Menu.Item key='business/BaiduXML'>
                <Link to="business/BaiduXML">百度XML</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="channel" title={<span><Icon type="appstore" /><span>渠道</span></span>}> 
              <Menu.Item key="channel/channelManage">
                <Link to="channel/channelManage">第三方渠道管理</Link>
              </Menu.Item>
              <Menu.Item key="channel/agencyManage">
                <Link to="channel/agencyManage">代理商渠道管理</Link>
              </Menu.Item>
              <Menu.Item key="channel/barManage">
                <Link to="channel/barManage">网吧渠道管理</Link>
              </Menu.Item>
              <Menu.Item key='channel/accountManage'> 
                <Link to="channel/accountManage">账号管理</Link> 
              </Menu.Item>
            </SubMenu>
            <SubMenu key="ad" title={<span><Icon type="appstore" /><span>广告</span></span>}>
              <Menu.Item key='ad/codeManage'> 广告代码管理 </Menu.Item>
              <Menu.Item key='ad/adsenseManage'> 广告位管理 </Menu.Item>
            </SubMenu>
          </Menu>
      </div>
    );
  }
})

// ReactDOM.render(
//     <Sider />,
//     document.getElementById('sider')

// );



module.exports = Sider;