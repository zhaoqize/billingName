//***入口文件****//

import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';

import './resources/css/clearDefault.css'

import Header from './view/header/header.jsx';

import router from './routes/routes.js';

_main();

//outline渲染
function _main() {
    ReactDOM.render(
    	<div>
    		<Header />
    	</div>
    , document.getElementById('header'));
}

//进入路由控制
ReactDOM.render(
    router,
    document.getElementById('bodyer')

);

