import React from 'react';
import Paging from '../../component/table.jsx';
import { Button,Icon } from 'antd';

var BillingNameHistory = React.createClass({
	getInitialState() {
	    return {
	        url:"http://localhost:90/business/BaiduXML/history?id=" + this.props.location.state.id
	    };
	},
	goBack:function(){
		window.history.go(-1);
	},
	render:function () {
		var columns;
		console.log(this.props.location.state.type === 0)
		if(this.props.location.state.type === 0){
			columns=[{
				title: '渠道有效时间',
				dataIndex: 'time'
				},{
					title: '计费名',
					dataIndex: 'name'
				},{
					title: '关联渠道',
					dataIndex: 'channel'
				},{
					title: '关联广告位',
					dataIndex: 'ad'
				},{
					title: '投放平台',
					dataIndex: 'platform'
				},{
					title: '操作账户',
					dataIndex: 'account'
				},{
					title: '操作时间',
					dataIndex: 'optime'
				},{
					title: '备注',
					dataIndex: 'comment'
			}]
		}

		if(this.props.location.state.type === 1){
			columns=[{
				title: '渠道有效时间',
				dataIndex: 'time'
				},{
					title: '计费名',
					dataIndex: 'name'
				},{
					title: '子费名',
					dataIndex: 'child'
				},{
					title: '关联渠道',
					dataIndex: 'channel'
				},{
					title: '关联广告位',
					dataIndex: 'ad'
				},{
					title: '投放平台',
					dataIndex: 'platform'
				},{
					title: '操作账户',
					dataIndex: 'account'
				},{
					title: '操作时间',
					dataIndex: 'optime'
				},{
					title: '备注',
					dataIndex: 'comment'
			}]
		}

		
		return (
			<div>
				<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block',marginLeft:20 }}>业务 > 百度XML > { this.props.location.state.type === 1 ? '子': '' }计费名关联历史</h3> <Button type="primary" style={{ margin:'1% 0 1% 80%' }} onClick={ this.goBack }><Icon type="rollback" />返回</Button>
				<Paging url={this.state.url} columns={columns} />

			</div>
		)
	}
})

export default BillingNameHistory;