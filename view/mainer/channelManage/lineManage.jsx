import React from 'react';
import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon, 
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
		        <FormItem label="线下渠道状态">
		          <Select showSearch style={{ width: 100 }} {...getFieldProps('status')} placeholder="请选择状态" >
		            <Option key='已注册'>已注册</Option>
		            <Option key='未注册'>未注册</Option>
		            <Option key='删除'>删除</Option>
		            <Option key='全部'>全部</Option>
		          </Select>
		        </FormItem>
		        <FormItem label="线下渠道名称">
		          <Input style={{ width: 100 }} type="text" {...getFieldProps('name')} placeholder="请填写渠道名称"/>
		        </FormItem>
		        <Button type="primary" htmlType="submit">查询</Button>
		        <Button type="primary" style={{ marginLeft:20 }}>导出</Button>
	        </Form>
		)
	}
})

FilterForm = Form.create()(FilterForm)


var Banner = React.createClass({
	getInitialState() {
	    return {
	        visible : false  ,
	        thirdData : []
	    };
	},
	alertModel:function(){
		this.setState({
			visible : true
		})
	},
	handleCancel:function(){
		this.setState({
	    	visible : false
	    })
	},
	handleOk:function(){
		var fieldVal = {
			third : document.getElementById('third').value,
			name : document.getElementById('name').value,
			comment : document.getElementById('comment').value
		}
		this.fetch(fieldVal);
	},
	fetch:function(fieldObj){
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
		const { getFieldProps } = this.props.form;

		let thirdData = [];
	    for (let i = 0; i < this.state.thirdData.length; i++) {
	        thirdData.push(<Option key={ this.state.thirdData[i].label }>{this.state.thirdData[i].value}</Option>);
	    }

		return (
			<div>
				<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}>淘金渠道管理 > 线下渠道管理</h3>
		        <Button type="primary" onClick={ this.alertModel } style={{ margin:'1% 0 1% 80%' }}>
			        <Icon type="plus" /> 新增线下渠道
		        </Button>
		        <Modal ref="modal"
			           visible={this.state.visible}
			           title="新增账户" onOk={this.handleOk} onCancel={this.handleCancel}
			           footer={[
			            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
			            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
			              提 交
			            </Button>,
			          ]}
			        >
			          <Form horizontal  onSubmit={this.handleSubmit}>
			           <FormItem label="所属第三方">
				          <Select placeholder="请选择第三方" {...getFieldProps('third')}>
				          	{ thirdData }
				          </Select>
				        </FormItem>
				        <FormItem label="渠道名称">
				          <Input placeholder="请输入渠道名称" {...getFieldProps('name')}/>
				        </FormItem>
				        <FormItem label="备注">
				          <Input type="textarea" placeholder="请填写备注" {...getFieldProps('comment')}/>
				        </FormItem>
				      </Form>
			    </Modal>
	        </div>
		)
	}
})

Banner = Form.create()(Banner);



var TableContent = React.createClass({
	getInitialState() {
	    return {
	        url:'http://localhost:90/channel/lineList'  ,
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
    update:function(){

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
    batchLock:function(){
    	this.fetchOpera({
    		channel_id : this.state.selectedKeys
    	})
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
			url:'http://localhost:90/channel/bar',
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
				  title: '渠道名称',
				  dataIndex: 'name',
			  },{
			      title: '创建时间',
			      dataIndex: 'create_time',
			  },{
			      title: '状态',
			      dataIndex: 'status',
			  },{
			      title: '备注',
			      dataIndex: 'comment',
			  },{
			      title: '操作',
			      dataIndex: 'operations',
			      render:function(text, record, index){
			      	return (
			      		<div>
		                  <a  onClick={ _this.update(record.third, record.name, record.comment) } style={{ textDecoration:'underline' }}> 修改 </a>
		                  &nbsp;
		                  <a style={{ textDecoration:'underline' }} > 查看账号 </a>
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
			           title="修改第三方" onOk={this.handleOk} onCancel={this.handleCancel}
			           footer={[
			            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
			            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
			              提 交
			            </Button>,
			          ]}
			        >
			          <Form horizontal  onSubmit={this.handleSubmit}>
			            <FormItem label="所属第三方">
				          <Select placeholder="请选择第三方" id="third" value={ this.state.third } onChange={ this.selectChange }>
				          	{ thirdData }
				          </Select>
				        </FormItem>
				        <FormItem label="渠道名称">
				          <Input placeholder="请输入渠道名称" id="name"/>
				        </FormItem>
				        <FormItem label="备注">
				          <Input type="textarea" placeholder="请填写备注" id="comment"/>
				        </FormItem>
				      </Form>
			    </Modal>
			</div>
		)
	}
})



var lineManage = React.createClass({
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



export default lineManage;
