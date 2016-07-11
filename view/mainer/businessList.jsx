import React from 'react';
import {Modal, Table, Icon} from 'antd';
import {Link} from 'react-router';
import jQuery from 'jquery';

import Paging from '../component/table.jsx';
import '../../resources/css/antd.css';

const confirm = Modal.confirm;

var BusinessHeader = React.createClass({
	getInitialState() {
	    return {
	          
	    };
	},
	render(){
		return (
			<div style={{ width:100+'%',minHeight:40,lineHeight:40+'px' }}>
				<h2 style={{ marginLeft:20 }}>业务列表</h2>
			</div>
		)
	}
})


var columns = [{
	  title: '业务名称',
	  dataIndex: 'name'
	}, {
	  title: '业务代号',
	  dataIndex: 'code'
	}, {
	  title: '计费名数量',
	  dataIndex: 'counter',
	  render: function(text, record, index){
	  	return <Link to={'/business/'+record.code} data-code={record.code}  onClick={  changeSide } style={{ textDecoration:'underline' }}>{text}</Link>
	  } 
	}
];

function changeSide(e){
	var $antMenu = jQuery('.ant-menu');
	for(var i = 0;i < $antMenu.children().length;i++){
		if($antMenu.children().eq(i).hasClass("ant-menu-submenu-open")){
			var $antMenuchild = $antMenu.children().eq(i);
			var $antu = $antMenuchild.children('ul').children('li')
			for(var y = 0;y<$antu.length;y++){
				if($antu.eq(y).children('span').text() == jQuery(e.currentTarget).data('code')){
					$antu.eq(y).click();
				}
			}
		}
	}
}

var BusinessList = React.createClass({
	render:function(){
		return (
			<div style={{ display:'inline-block',width:100+'%' }}>
				<BusinessHeader />
				<Paging url='http://bnm.stnts.dev/business/index' columns={columns} />
			</div>
		)
	}
})

module.exports = BusinessList;
