//***入口文件****//
//import "babel-polyfill";

import {Router} from 'react-router';

import './resources/css/clearDefault.css'

import Header from './view/header/header.jsx';

import router from './routes/routes.js';




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


