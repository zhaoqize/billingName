//***入口文件****//
//import "babel-polyfill";

import {Router} from 'react-router';

import Header from './view/header/header';

import router from './routes/routes';

import './resources/css/default.css';

import './resources/css/main.css';

import './resources/css/antd.css';




window.rootURL = 'http://' + window.location.host;


//outline渲染

ReactDOM.render(
	Header
, document.getElementById('header'));


//进入路由控制
ReactDOM.render(
    router,
    document.getElementById('bodyer')

);


