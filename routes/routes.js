import { Router, 
         Route, 
         hashHistory, 
         IndexRoute } from 'react-router';

//global
import Index from '../view/index/index';
import Sider from '../view/sider/side';
import Default from '../view/default';
import UserInfo from '../view/mainer/userInfo';

//baiduSearch
import { BaiduSearch,
         Billingname,
         BillingNameUpdate,
         BillingNameChildrenUpdate,
         BillingNameHistory   } from '../view/mainer/baiduSearch/index';

//baiduXML
import { BaiduXML,
         BaiduXMLUpdate,
         BaiduXMLChildren,
         BaiduXMLChildrenUpdate,
         BaiduXMLHistory   } from '../view/mainer/baiduXMl/index';

//渠道管理
import { ChannelManage,
         AgencyManage,
         BarManage,
         AccountManage,
         accountModified   } from '../view/mainer/channelManage/index';

//动态路由onEnter
var router = (
    <Router history={hashHistory}>
    	<Route path="/" component={Default}>
    		<IndexRoute component={Index} />
    		<Route path="/user/userInfo" component={UserInfo}/>
            
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
            <Route path="/channel/accountManage" component={AccountManage}/>
            <Route path="/channel/accountModified" component={accountModified}/>
            

    	</Route>
    </Router>

);

module.exports = router;