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
import modalSuccess from '../../component/modalSuccess.jsx';
import modalError from '../../component/modalError.jsx';
import modalWarn from '../../component/modalWarn.jsx';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

var FilterForm = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
    	console.log('收到表单值：', this.props.form.getFieldsValue());
    	this.props.filterParam(this.props.form.getFieldsValue());
	},
	render:function (){
		const { getFieldProps } = this.props.form;

		return (
			<Form inline onSubmit={this.handleSubmit} style={{ marginLeft:'1%',marginBottom:'1%' }}>
		        <FormItem label="网吧状态">
		          <Select showSearch style={{ width: 100 }} {...getFieldProps('status')} placeholder="已注册" >
		            <Option key='已注册'>已注册</Option>
		            <Option key='未注册'>未注册</Option>
		            <Option key='deleted'>删除</Option>
		            <Option key='all'>全部</Option>
		          </Select>
		        </FormItem>
		        <FormItem label="第三方名称/ID">
		          <Input style={{ width: 100 }} type="text" {...getFieldProps('third')} placeholder="请填写第三方名称/ID"/>
		        </FormItem>
		        <FormItem label="代理商名称/ID">
		          <Input style={{ width: 100 }} type="text" {...getFieldProps('agency')} placeholder="请填写代理商名称/ID"/>
		        </FormItem>
		        <FormItem label="网吧名称/ID">
		          <Input style={{ width: 100 }} type="text" {...getFieldProps('bar_name')} placeholder="请填写网吧名称/ID"/>
		        </FormItem>
		        <FormItem label="注册IP">
		          <Input style={{ width: 100 }} type="text" {...getFieldProps('IP')} placeholder="请填写注册IP"/>
		        </FormItem>
		        <FormItem label="易乐游ID">
		          <Input style={{ width: 100 }} type="text" {...getFieldProps('ylyID')} placeholder="请填写易乐游ID"/>
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
				<h3 style={{ margin:'20px 0 20px 20px',display:'inline-block' }}>淘金渠道管理 > 网吧渠道管理</h3>
	        </div>
		)
	}
})



var TableContent = React.createClass({
	getInitialState() {
	    return {
	        url:'http://bnm.stnts.dev/bar/index'  ,
	        selectedRowKeys: [] ,// 这里配置默认勾选列 
	        visible :false 
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
    //删除
    delete:function(channelId, index){
    	return () =>{
    		this.fetch('http://bnm.stnts.dev/bar/destroy/'+channelId,function(){
    			// var antdTable = document.getElementsByClassName('ant-table-tbody')[0];
       			//var trIndex = antdTable.childNodes[index];
       			//antdTable.remove(trIndex);

    			modalSuccess('提示','删除成功!');

    			document.getElementById('query').click();
    		},function(){
    			modalError('提示','删除失败!')
    		})
    	}
    },
    //批量删除
    batchDelete:function(){
    	const _this = this;

    	if(this.state.selectedRowKeys.length){
    		this.fetch('http://bnm.stnts.dev/bar/destroy',function(){
	    		modalSuccess('提示','批量删除成功!');
	    		_this.setState({
	    			selectedRowKeys : []
	    		})
	    		//触发查询
	    		document.getElementById('query').click();
	    	},function(){
	    	 	modalError('提示','批量删除失败!');
	    	},{id:this.state.selectedRowKeys.join(',')})
    	}else{
    		modalWarn('提示','请先选择!');
    	}
    	
    },
    fetch:function(url,callbackone,callbacktwo,fieldObj){
		reqwest({
			url:url,
			data:fieldObj ,
			method:'post',
			type:'json'
		}).then(result =>{
			callbackone(result.data);
		},function(){
			callbacktwo();
		})
	},
	render:function() {
		const _this = this;
		const { loading, selectedRowKeys } = this.state;
		
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    };
	    const hasSelected = selectedRowKeys.length > 0;

		const columns = [{
				  title: 'ID',
				  dataIndex: 'id',
			  }, {
				  title: '网吧编号',
				  dataIndex: 'num',
			  }, {
			  	  title: '所属代理商',
				  dataIndex: 'agency'
			  },{
				  title: '网吧名称',
				  dataIndex: 'bar_name'
			  }, {
			      title: '58特权ID',
			      dataIndex: '58ID'
			  }, {
			      title: '易乐游ID',
			      dataIndex: 'ylyID',
			  }, {
			      title: '所在地域',
			      dataIndex: 'local',
			  },{
			      title: '注册IP',
			      dataIndex: 'IP',
			  },{
			      title: '最近活跃时间',
			      dataIndex: 'active_time',
			  },{
			      title: '创建时间',
			      dataIndex: 'create_time',
			  },{
			      title: '状态',
			      dataIndex: 'status',
			  },{
			  	  title:'操作',
			  	  dataIndex: 'operations',
			  	  render:function (text, record, index) {
			  	  	 //判断是否已注册
			  	  	 if(record === "启用"){
			            deleteStyle  = 'inline-block';
			         }else{
			         	deleteStyle  = 'none';
			         }
			  	  	 return <a onClick={ this.delete(record.id,index) } style={{ textDecoration:'underline',display:deleteStyle }}>删除</a>
			  	  }
			  }];

		return (
			<div>
				<Paging  rowSelection={rowSelection} url={this.state.url} columns={columns} params={ this.props.params }/>
				<div style={{ marginTop:-45 }}>
					<Button onClick={ this.batchDelete } key="delete" type="primary" style={{ marginLeft:10 }}>批量删除</Button>
				</div>
			</div>
		)
	}
})



var barManage = React.createClass({
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



export default barManage;
