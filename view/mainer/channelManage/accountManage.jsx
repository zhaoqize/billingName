import React from 'react';
import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon,
		 message,
		 Modal ,
		 DatePicker} from 'antd';
import {Link} from 'react-router';
import reqwest from 'reqwest';

import Paging from '../../component/table.jsx';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

var FilterForm = React.createClass({
	getInitialState() {
	    return {
	        channelData : [] 
	    };
	},
	handleSubmit:function(e){
		e.preventDefault();
    	console.log('收到表单值：', this.props.form.getFieldsValue());
    	this.props.filterParam(this.props.form.getFieldsValue());
	},
	fetch:function(){
		//获取渠道类型
		reqwest({
			url:'http://localhost:90/channel/channeltype',
			method: 'get',
      		type: 'json'
		}).then(result =>{
			this.setState({
				channelData : result.data
			})
		},function(){
			console.log("请求失败")
		})
	},
	componentDidMount() {
	    this.fetch();  
	},
	render:function (){
		const { getFieldProps } = this.props.form;

		let type = [];
		for (let i = 0; i < this.state.channelData.length; i++) {
        	type.push(<Option key={this.state.channelData[i].value}>{this.state.channelData[i].label}</Option>);
     	}

		return (
			<Form inline onSubmit={this.handleSubmit} style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
		        <FormItem label="账号状态">
		          <Select showSearch style={{ width: 120 }} {...getFieldProps('type')} placeholder="请第三方渠道" >
		             <Option key='启用'>启用</Option>
		             <Option key='删除'>删除</Option>
		             <Option key='待审核'>待审核</Option>
		             <Option key='锁定'>锁定</Option>
		             <Option key='全部'>全部</Option>
		          </Select>
		        </FormItem>
		        <FormItem label="用户名/ID">
		          <Input type="text" {...getFieldProps('third')} placeholder="请填写用户名/ID"/>
		        </FormItem>
		        <FormItem label="渠道名称/ID">
		          <Input type="text" {...getFieldProps('agency')} placeholder="请填写渠道名称/ID"/>
		        </FormItem>
		        <Button type="primary" htmlType="submit">查询</Button>
		        <Button type="primary" style={{ marginLeft:20 }}>导出</Button>
	        </Form>
		)
	}
})

FilterForm = Form.create()(FilterForm)


var Banner = React.createClass({
	render:function() {
		return (
			<div>
				<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}>渠道 > 账号管理</h3>
		        <Button type="primary" style={{ margin:'1% 0 1% 80%' }}>
			        <Link to="/channel/accountAdd"><Icon type="plus" /> 新增账户</Link>
		        </Button>
	        </div>
		)
	}
})



var TableContent = React.createClass({
	getInitialState() {
	    return {
	        url:'http://localhost:90/channel/accountList'  ,
	        selectedRowKeys: [] ,// 这里配置默认勾选列 
	        visible :false ,
	        thirdData : [] ,
	        third : ''
	    };
	},
	onSelectChange(selectedRowKeys) {
	    console.log('selectedRowKeys changed: ', selectedRowKeys);
	    this.setState({ selectedRowKeys });
    },
    handleCancel:function(){
    	this.setState({
    		visible :false
    	})
    },
    selectChange:function(value){
    	this.setState({
    		third : value
    	})
    },
    //修改密码
    update:function(third, name, comment){

    	//return () =>{
    		this.setState({
    			visible :true 
    		})
    		// setTimeout(function(){
    		// 	document.getElementById('name').value = name;
    		// 	document.getElementById('comment').value = comment;
    		// },200)
    	//}
    },
    //锁定
    lock:function(channelId){
    	return () =>{
    		this.fetchOpera({
    			channelId : channelId
    		})
    	}
    },
    //删除
    delete:function(channelId){
    	return () =>{
    		this.fetchOpera({
    			channel_id : channelId
    		})
    	}
    },
    //批量删除
    batchDelete:function(){
    	this.fetchOpera({
    		channel_id : this.state.selectedKeys
    	})
    },
    //批量锁定
    batchLock:function(){
    	this.fetchOpera({
    		channel_id : this.state.selectedKeys
    	})
    },
    handleOk:function(){
    	var fieldVal = {
			password : document.getElementById('password').value,
			agagin_password : document.getElementById('again_password').value
		}

		if(fieldVal.password === fieldVal.agagin_password){
			this.fetch(fieldVal);
		}else{
			message.warning('两次密码不一致!')
		}
		
    },
    fetch:function(fieldObj){
    	//修改
    	reqwest({
			url:'',
			data:fieldObj ,
			method:'post',
			type:'json'
		}).then(result =>{
			this.setState({
	    		visible : false
	    	})
	    	console.log("成功");
		},function(){
			console.log("失败");
		})
    },
    fetchOpera:function(channelId){
    	//锁定,删除
    	reqwest({
			url:'',
			data:channelId ,
			method:'post',
			type:'json'
		}).then(result =>{
			this.setState({
	    		visible : false
	    	})
	    	console.log("成功");
		},function(){
			console.log("失败");
		})
    },
    componentDidMount:function(){
    	//获取第三方
		reqwest({
			url:'http://localhost:90/channel/third',
			method:'get',
			type:'json'
		}).then(result =>{
	    	console.log("成功");
	    	this.setState({
	    		thirdData : result.data
	    	})
		},function(){
			console.log("失败");
		})
    },

	render:function() {
		const _this = this;
		const { loading, selectedRowKeys } = this.state;

		let thirdData = [];
	    for (let i = 0; i < this.state.thirdData.length; i++) {
	        thirdData.push(<Option key={ this.state.thirdData[i].label }>{this.state.thirdData[i].value}</Option>);
	    }
		
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    };
	    const hasSelected = selectedRowKeys.length > 0;

		const columns = [{
				  title: 'ID',
				  dataIndex: 'id',
			  }, {
				  title: '用户ID',
				  dataIndex: 'ID',
			  }, {
			  	  title: '用户名',
				  dataIndex: 'name'
			  },{
				  title: '归属渠道类型',
				  dataIndex: 'type'
			  }, {
			      title: '归属渠道',
			      dataIndex: 'home_channel'
			  }, {
			      title: '上级渠道',
			      dataIndex: 'top_channel',
			  }, {
			      title: '联系人',
			      dataIndex: 'linkman',
			  }, {
			      title: '联系电话',
			      dataIndex: 'tel',
			  }, {
			      title: '创建时间',
			      dataIndex: 'create_time',
			  }, {
			      title: '最近登陆时间',
			      dataIndex: 'current_time',
			  }, {
			      title: '最近登陆IP',
			      dataIndex: 'IP',
			  }, {
			      title: '状态',
			      dataIndex: 'status',
			  }, {
			      title: '操作',
			      dataIndex: 'operations',
			      render:function(text, record, index){
			      	return (
			      		<div>
		                  <Link to="/channel/accountUpdate" style={{ textDecoration:'underline' }}> 修改 </Link>
		                  &nbsp;
		                  <a onClick={ _this.update } style={{ textDecoration:'underline' }} > 更改密码 </a>
		                  &nbsp;
		                  <a onClick={ _this.lock(record.id) } style={{ textDecoration:'underline' }}> 锁定 </a>
		                  &nbsp;
		                  <a onClick={ _this.delete(record.id) } style={{ textDecoration:'underline' }}> 删除 </a>
		                </div>
			      	)
			      }
			  }];

		return (
			<div>
				<Paging  rowSelection={rowSelection} url={this.state.url} columns={columns} params={ this.props.params }/>
				<div style={{ marginTop:-45 }}>
					<Button onClick={ this.batchDelete } key="delete" type="primary" style={{ marginLeft:10 }}>批量删除</Button>
					<Button onClick={ this.batchLock } key="sub" type="primary" style={{ marginLeft:20 }}>批量锁定</Button>
				</div>
				<Modal ref="modal"
			           visible={this.state.visible}
			           title="修改密码" onOk={this.handleOk} onCancel={this.handleCancel}
			           footer={[
			            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
			            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
			              提 交
			            </Button>,
			          ]}
			        >
		          <Form horizontal >
			        <FormItem label="新密码" >
			          <Input placeholder="请输入新密码" id="password" />
			        </FormItem>
			        <FormItem label="再次输入新密码" >
			          <Input type="password" placeholder="请再次输入新密码" id="again_password" />
			        </FormItem>
			      </Form>
			    </Modal>
			</div>
		)
	}
})



var accountManage = React.createClass({
	getInitialState() {
	    return {
	        filterparams : {}  
	    };
	},
	filterParam:function(params){
		this.setState({
			filterparams : params
		})
	},
	render:function() {
		return (
			<div>
				<Banner />
				<FilterForm filterParam={ this.filterParam } />
				<TableContent params={ this.state.filterparams }/>
			</div>
			
		)
	}
})



export default accountManage;
