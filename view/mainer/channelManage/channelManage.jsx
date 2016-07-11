import React from 'react';
import ReactDOM from 'react-dom';
import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon, 
		 Modal ,
		 message ,
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
const confirm = Modal.confirm;

var FilterForm = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
    	console.log('收到表单值：', this.props.form.getFieldsValue());
    	console.log(ReactDOM.findDOMNode(this.refs.status))
    	//通知table组件
    	this.props.filterParam(this.props.form.getFieldsValue());
	},
	render:function (){
		const { getFieldProps } = this.props.form;

		return (
			<Form inline onSubmit={this.handleSubmit} style={{ marginLeft:'1%',marginBottom:'1%' }}>
		        <FormItem label="第三方状态">
		          <Select  style={{ width: 100 }} {...getFieldProps('status')} placeholder='启用' >
		            <Option value='use'>启用</Option>
		            <Option value='deleted'>已删除</Option>
		            <Option value='locked'>已锁定</Option>
		            <Option value='all'>全部</Option>
		          </Select>
		        </FormItem>
		        <FormItem label="第三方渠道/ID">
		          <Input type="text" {...getFieldProps('name')} placeholder="请填写第三方渠道/ID"/>
		        </FormItem>
		        <Button type="primary" htmlType="submit" id="query">查询</Button>
		        <Button type="primary" style={{ marginLeft:20 }}>导出</Button>
	        </Form>
		)
	}
})

FilterForm = Form.create()(FilterForm)


var Banner = React.createClass({
	getInitialState() {
	    return {
	        visible : false  
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
		const _this = this;
		if(document.getElementById('add_name').value !== '' && document.getElementById('add_name').value !== ' '){
			var fieldVal = {
				name : document.getElementById('add_name').value,
				company : document.getElementById('add_company').value,
				bank : document.getElementById('add_bank').value,
				bank_account : document.getElementById('add_bank_account').value,
				fapiao : document.getElementById('add_title').value,
				comment : document.getElementById('add_comment').value
			}

			//提交至后台
			this.fetch('http://bnm.stnts.dev/channel/store',function(){
				_this.setState({
	    			visible : false
	    		})
	    		confirm({
				    title: '通知',
				    iconType:'check-circle',
				    content: '添加成功！是否继续添加账户？',
				    onOk() {
				      console.log('跳转至添加账户');
				    }
			  	});

	  			//通知table进行更新
	  			_this.props.noticeTable();
			},function(){

				message.error('添加失败!');

			},fieldVal);

		}else{
			message.error('渠道名称必须填写!');
		}
		
		//console.log("fieldVal = ",fieldVal)
	},
	fetch:function(url,callbackone,callbacktwo,fieldObj){
		reqwest({
			url:url,
			data:fieldObj ,
			method:'post',
			type:'json'
		}).then(result =>{
			callbackone();
		},function(){
			callbacktwo();
		})
	},
	render:function() {
		const { getFieldProps } = this.props.form;

		return (
			<div>
				<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}>淘金渠道管理 > 第三方渠道管理</h3>
		        <Button type="primary" onClick={ this.alertModel } style={{ margin:'1% 0 1% 75%' }}>
			        <Icon type="plus" /> 新增第三方
		        </Button>
		        <Modal ref="modal"
			           visible={this.state.visible}
			           title="新增第三方" onOk={this.handleOk} onCancel={this.handleCancel}
			           footer={[
			            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
			            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
			              提 交
			            </Button>,
			          ]}
			        >
			          <Form horizontal  onSubmit={this.handleSubmit} >
				        <FormItem label="渠道名称" 
				        		  required 
				        		  hasFeedback>
				          <Input type="text" placeholder="请输入渠道名称" {...getFieldProps('add_name')} />
				        </FormItem>
				        <FormItem label="公司名称">
				          <Input type="text" placeholder="请填写公司名称" {...getFieldProps('add_company')}/>
				        </FormItem>
				        <FormItem label="银行">
				          <Input type="text" placeholder="请填写银行" {...getFieldProps('add_bank')}/>
				        </FormItem>
				        <FormItem label="银行账户">
				          <Input type="text" placeholder="请填写银行账户" {...getFieldProps('add_bank_account')}/>
				        </FormItem>
				        <FormItem label="发票抬头">
				          <Input type="text" placeholder="请填写发票抬头" {...getFieldProps('add_title')}/>
				        </FormItem>
				        <FormItem label="备注">
				          <Input type="textarea" placeholder="请填写备注" {...getFieldProps('add_comment')}/>
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
	        url:'http://bnm.stnts.dev/channel/index'  ,
	        selectedRowKeys: [] ,// 这里配置默认勾选列 
	        visible :false
	    };
	},
	onSelectChange(selectedRowKeys, selectedRows) {
	    console.log('selectedRowKeys changed: ', selectedRowKeys);
	    console.log('selectedRows changed: ', selectedRows);
	    this.setState({ selectedRowKeys });
    },
    handleCancel:function(){
    	this.setState({
    		visible :false
    	})
    },
    update:function(obj){
    	return () =>{
    		this.setState({
    			visible :true
    		},function(){
    			setTimeout(function(){
    				document.getElementById('update_id').value = obj.id;
	    			document.getElementById('update_name').value = obj.name;
	    			document.getElementById('update_company').value = obj.company;
	    			document.getElementById('update_bank').value = obj.bank;
	    			document.getElementById('update_bank_account').value = obj.bank_account;
	    			document.getElementById('update_title').value = obj.fapiao;
	    			document.getElementById('update_comment').value = obj.comment;
    			},500)
    		})
    	}
    },
    //锁定
    lock:function(channelId,lock,index){
    	const _this = this;
    	return () =>{
    		
    		if(lock === '锁定'){
    			this.fetch('http://bnm.stnts.dev/channel/lock/'+channelId,function(){
    				//更改行内显示的值
    				//document.getElementsByClassName('locks')[index].text = '解锁';
    				//document.getElementsByClassName('status')[index].innerText = '已锁定';
	    			modalSuccess('提示','锁定成功!');
	    			lock = '解锁';
	    			//通知table组件
    				//_this.props.filterParam();
    				document.getElementById('query').click();
	    		},function(){
	    			modalError('提示','锁定失败!')
	    		})
    		}else{
    			this.fetch('http://bnm.stnts.dev/channel/unlock/'+channelId,function(){
    				//更改行内显示的值
    				//document.getElementsByClassName('locks')[index].text = '锁定';
    				//document.getElementsByClassName('status')[index].innerText = '启用';
	    			modalSuccess('提示','解锁成功!');
	    			lock = '锁定';
	    			//通知table组件
    				//_this.props.filterParam();
    				document.getElementById('query').click();
	    		},function(){
	    			modalError('提示','解锁失败!')
	    		})
    		}
    		
    	}
    },
    //删除
    delete:function(channelId,index){
    	return () =>{
    		this.fetch('http://bnm.stnts.dev/channel/destroy/'+channelId,function(){
    			// var antdTable = document.getElementsByClassName('ant-table-tbody')[0];
       			//var trIndex = antdTable.childNodes[index];
       			//antdTable.remove(trIndex);

    			modalSuccess('提示','删除成功!');

    			document.getElementById('query');
    		},function(){
    			modalError('提示','删除失败!')
    		})
    	}
    },
    //批量删除
    batchDelete:function(){
    	const _this = this;

    	if(this.state.selectedRowKeys.length){
    		this.fetch('http://bnm.stnts.dev/channel/destroy',function(){
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
    //批量锁定
    batchLock:function(){
    	const _this = this;

    	if(this.state.selectedRowKeys.length){
    		this.fetch('http://bnm.stnts.dev/channel/lock',function(){
	    		modalSuccess('提示','批量锁定成功!');
	    		_this.setState({
	    			selectedRowKeys : []
	    		})
	    		//触发查询
	    		document.getElementById('query').click();
	    	 },function(){
	    	 	modalError('提示','批量锁定失败!')
	    	 },{id:this.state.selectedRowKeys.join(',')})
    	}else{
    		modalWarn('提示','请先选择!');
    	}
    	 
    },
    //修改
    handleOk:function(){
    	const _this = this;

    	var fieldVal = {
			name : document.getElementById('update_name').value,
			company : document.getElementById('update_company').value,
			bank : document.getElementById('update_bank').value,
			bank_account : document.getElementById('update_bank_account').value,
			title : document.getElementById('update_title').value,
			comment : document.getElementById('update_comment').value
		}

		if(fieldVal.name.replace(/(^\s*)|(\s*$)/g, "") === ''){
			message.error('渠道名称必须填写!');
			return;
		}

		this.fetch('http://bnm.stnts.dev/channel/update/' + document.getElementById('update_id').value,function(){
			if(_this.isMounted()){
				_this.setState({
					visible :false
				})
				modalSuccess('提示','修改成功!');
			}
		},function(){
			modalError('提示','修改失败');
		},fieldVal);
		
    },
    fetch:function(url,callbackone,callbacktwo,fieldObj){
    	reqwest({
			url:url,
			data:fieldObj ,
			method:'post',
			type:'json'
		}).then(result =>{
	  		callbackone();
		},function(){
			callbacktwo();
		})
    },
    nextClick:function(){
    	console.log("nextClick")
    },
    hidden:function(){
    	this.setState({
			visible :false
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
				  title: '渠道名称',
				  dataIndex: 'name',
			  }, {
				  title: '下属代理商数量',
				  dataIndex: 'children_number',
				  render: (text) => <Link to="/channel/agencyManage" onClick={ _this.nextClick } style={{ textDecoration:'underline' }}>{ text }</Link>
			  }, {
			      title: '创建时间',
			      dataIndex: 'created_at',
			  }, {
			      title: '状态',
			      dataIndex: 'status',
			      render:function(text, record, index){
			      	return <span className='status'>{ text }</span>
			      }
			  }, {
			      title: '备注',
			      dataIndex: 'comment',
			  }, {
			      title: '公司名称',
			      dataIndex: 'company',
			      className:'antd-hidden'
			  },{
			      title: '发票抬头',
			      dataIndex: 'fapiao',
			      className:'antd-hidden'
			  }, {
			      title: '账号所在银行',
			      dataIndex: 'bank',
			      className:'antd-hidden'
			  }, {
			      title: '银行账号',
			      dataIndex: 'bank_account',
			      className:'antd-hidden'
			  }, {
			      title: '锁定',
			      dataIndex: 'lock',
			      className:'antd-hidden'
			  }, {
			      title: '操作',
			      dataIndex: 'operations',
			      render:function(text, record, index){
			      	var saveStatus = record.status;
			      	
			        var updateStyle = '',
			        	lockStyle = '',
			        	deleteStyle = '';

			        var lockOrUnlock = record.status === "已锁定"?'解锁':'锁定' ;

			        if(saveStatus === "启用"){
			            updateStyle  = 'inline-block';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';
			        }else if(saveStatus === "已锁定"){
			            updateStyle  = 'none';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';
			        }else if(saveStatus === "已删除"){
			            updateStyle  = 'none';
			            lockStyle  = 'none';
			            deleteStyle  = 'none';
			        }

			      	return (
			      		<div>
		                  <a  onClick={ _this.update({
		                  						id:record.id,
							                  	name:record.name, 
							                  	company:record.company,
							                  	bank:record.bank,
							                  	bank_account:record.bank_account,
							                  	fapiao:record.fapiao,
							                  	comment:record.comment
							                  }) } style={{ textDecoration:'underline',display:updateStyle }}> 修改 </a>
		                  &nbsp;
		                  <a style={{ textDecoration:'underline' }} > 查看账号 </a>
		                  &nbsp;
		                  <a className='locks' onClick={ _this.lock(record.id,lockOrUnlock,index) } style={{ textDecoration:'underline',display:lockStyle }}> {lockOrUnlock}</a>
		                  &nbsp;
		                  <a onClick={ _this.delete(record.id,index) } style={{ textDecoration:'underline',display:deleteStyle }}> 删除 </a>
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
			           title="修改第三方" 
			           onCancel={this.hidden}
			           footer={[
			            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
			            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
			              提 交
			            </Button>,
			          ]}
			        >
			          <Form horizontal  onSubmit={this.handleSubmit}>
				        <FormItem label="渠道名称">
				          <input style={{ display:'none' }} id="update_id"/>
				          <Input placeholder="请输入渠道名称" id="update_name"/>
				        </FormItem>
				        <FormItem label="公司名称">
				          <Input placeholder="请输入公司名称" id="update_company"/>
				        </FormItem>
				        <FormItem label="银行名称">
				          <Input placeholder="请输入银行名称" id="update_bank"/>
				        </FormItem>
				        <FormItem label="银行账户">
				          <Input placeholder="请输入银行账户" id="update_bank_account"/>
				        </FormItem>
				        <FormItem label="发票抬头">
				          <Input placeholder="请输入发票抬头" id="update_title"/>
				        </FormItem>
				        <FormItem label="备注">
				          <Input type="textarea" placeholder="请填写备注" id="update_comment"/>
				        </FormItem>
				      </Form>
			    </Modal>
			</div>
		)
	}
})



var ChannelManage = React.createClass({
	getInitialState() {
	    return {
	        filterparams : {}  
	    };
	},
	filterParam:function(params){
		console.log("render")
		this.setState({
			filterparams : params
		})
	},
	render:function() {
		return (
			<div>
				<Banner noticeTable = { this.filterParam }/>
				<FilterForm filterParam={ this.filterParam } />
				<TableContent params={ this.state.filterparams } filterParam={ this.filterParam }/>
			</div>
			
		)
	}
})



export default ChannelManage;
