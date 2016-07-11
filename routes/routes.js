import React from 'react';
import jQuery from 'jquery';
import {Router, Route, hashHistory, IndexRoute } from 'react-router';

//全局
import Index from '../view/index/index.jsx';
import Sider from '../view/sider/side.jsx';
import Default from '../view/default.jsx';
import UserInfo from '../view/mainer/userInfo.jsx';

//业务列表
import BusinessList from '../view/mainer/businessList.jsx';

//baiduSearch
import BaiduSearch from '../view/mainer/baiduSearch/baiduSearch.jsx';
import Billingname from '../view/mainer/baiduSearch/baiduSearchChildren.jsx';
import BillingNameUpdate from '../view/mainer/baiduSearch/baiduSearchUpdate.jsx'
import BillingNameChildrenUpdate from '../view/mainer/baiduSearch/baiduSearchChildrenUpdate.jsx'
import BillingNameHistory from '../view/mainer/baiduSearch/baiduSearchHistory.jsx'

//baiduXML
import BaiduXML from '../view/mainer/baiduXMl/baiduXML.jsx';
import BaiduXMLUpdate from '../view/mainer/baiduXMl/baiduXMLUpdate.jsx';
import BaiduXMLChildren from '../view/mainer/baiduXMl/baiduXMLChildren.jsx';
import BaiduXMLChildrenUpdate from '../view/mainer/baiduXMl/baiduXMLChildrenUpdate.jsx';
import BaiduXMLHistory from '../view/mainer/baiduXMl/baiduXMLHistory.jsx';

//渠道管理
import ChannelManage from '../view/mainer/channelManage/channelManage.jsx';
import AgencyManage from '../view/mainer/channelManage/agencyManage.jsx';
import BarManage from '../view/mainer/channelManage/barManage.jsx';
import LineManage from '../view/mainer/channelManage/lineManage.jsx';
import AccountManage from '../view/mainer/channelManage/accountManage.jsx';
import AccountAdd from '../view/mainer/channelManage/accountAdd.jsx';
import AccountUpdate from '../view/mainer/channelManage/accountUpdate.jsx';

//动态路由onEnter
var router = (
    <Router history={hashHistory}>
    	<Route path="/" component={Default}>
    		<IndexRoute component={Index} />
    		<Route path="/user/userInfo" component={UserInfo}/>
			<Route path="/businessList/:name" component={BusinessList} />
            
            //业务
			<Route path="/business/BaiduSearch" component={BaiduSearch}/>
			<Route path="/business/BaiduSearch/children" component={Billingname}/>
            <Route path="/business/BaiduSearch/update" component={BillingNameUpdate}/>
            <Route path="/business/BaiduSearch/childupdate" component={BillingNameChildrenUpdate}/>
            <Route path="/business/BaiduSearch/history" component={BillingNameHistory}/>
            
            <Route path="/business/BaiduXML" component={BaiduXML}/>
            <Route path="/business/BaiduXML/update" component={BaiduXMLUpdate}/>
            <Route path="/business/BaiduXML/children" component={BaiduXMLChildren}/>
            <Route path="/business/BaiduXML/childupdate" component={BaiduXMLChildrenUpdate}/>
            <Route path="/business/BaiduXML/history" component={BaiduXMLHistory}/>
            
            //渠道
            <Route path="/channel/channelManage" component={ChannelManage}/>
            <Route path="/channel/agencyManage" component={AgencyManage}/>
            <Route path="/channel/barManage" component={BarManage}/>
            <Route path="/channel/lineManage" component={LineManage}/>
            <Route path="/channel/accountManage" component={AccountManage}/>
            <Route path="/channel/accountAdd" component={AccountAdd}/>
            <Route path="/channel/accountUpdate" component={AccountUpdate}/>

    	</Route>
    </Router>

);


module.exports = router;