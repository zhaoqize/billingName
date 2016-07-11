import React from 'react';
import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon, 
		 Modal ,
		 message,	 
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
	render:function (){
		const { getFieldProps } = this.props.form;

		return (
			<Form inline onSubmit={this.handleSubmit} style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
		        <FormItem label="代理商状态">
		          <Select showSearch style={{ width: 100 }} {...getFieldProps('status')} placeholder="启用" >
		            <Option key='use'>启用</Option>
		            <Option key='deleted'>已删除</Option>
		            <Option key='locked'>已锁定</Option>
		            <Option key='all'>全部</Option>
		          </Select>
		        </FormItem>
		        <FormItem label="第三方名称/ID">
		          <Input type="text" {...getFieldProps('third')} placeholder="请填写第三方名称/ID"/>
		        </FormItem>
		        <FormItem label="代理商名称/ID">
		          <Input type="text" {...getFieldProps('agency')} placeholder="请填写代理商名称/ID"/>
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
		const _this = this;
		const formData = this.props.form.getFieldsValue();

		//获取表单数据
		var fieldVal = {
			channel_id: formData.add_third,
			name : formData.add_name,
			comment : formData.add_comment
		}

		if(fieldVal.third !== '' && fieldVal.name !== ''){

			//新增代理商
			this.fetch('http://bnm.stnts.dev/agent/store',function(){
				if(_this.isMounted()){
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
			  		document.getElementById('query').click();
				}
			},function(){

				message.error('添加失败!');

			},fieldVal,'post');
		}else{
			message.error(' *(星) 号项必须填写!');
		}
		
	},
	fetch:function(url,callbackone,callbacktwo,fieldObj,method){
		reqwest({
			url:url,
			data:fieldObj ,
			method:method,
			type:'json'
		}).then(result =>{
			callbackone(result.data);

		},function(){
			callbacktwo();
		})
	},
	componentDidMount:function(){
		const _this = this;

		//拉第三方
		this.fetch('http://bnm.stnts.dev/channel/simple',function(data){
			if(_this.isMounted()){
				_this.setState({
	    			thirdData : data
	    		})
			}
		},function(){
			modalError('提示','拉第三方(渠道)失败!');
		},{},'get')
	},
	render:function() {
		const { getFieldProps } = this.props.form;

		//获取第三方
		let thirdData = [];
	    for (let i = 0; i < this.state.thirdData.length; i++) {
	        thirdData.push(<Option key={ this.state.thirdData[i].id }>{this.state.thirdData[i].name}</Option>);
	    }

		return (
			<div>
				<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}>淘金渠道管理 > 代理商渠道管理</h3>
		        <Button type="primary" onClick={ this.alertModel } style={{ margin:'1% 0 1% 75%' }}>
			        <Icon type="plus" /> 新增代理商
		        </Button>
		        <Modal ref="modal"
			           visible={this.state.visible}
			           title="新增代理商" onOk={this.handleOk} onCancel={this.handleCancel}
			           footer={[
			            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
			            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
			              提 交
			            </Button>,
			          ]}
			        >
			          <Form horizontal>
			          	<FormItem label="所属第三方" required>
				          <Select placeholder="请选择所属第三方" {...getFieldProps('add_third')} >
				          	{thirdData}
				          </Select>
				        </FormItem>
				        <FormItem label="渠道名称" 
				        		  required 
				        		  hasFeedback>
				          <Input type="text" placeholder="请输入渠道名称" {...getFieldProps('add_name')} />
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

var channelMap=[];

var TableContent = React.createClass({
	getInitialState() {
	    return {
	        url:'http://bnm.stnts.dev/agent/index'  ,
	        selectedRowKeys: [] ,// 这里配置默认勾选列 
	        visible :false ,
	        thirdData : [] ,
	        update_third : ''
	        
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
    		update_third : value
    	})
    },
    update:function(obj){
    	const _this = this;

    	return () =>{
    		this.setState({
    			visible :true ,
    			update_third:obj.channel_name
    		},function(){
    			setTimeout(function(){
    				//设置update值
    				document.getElementById('update_id').value = obj.id;
		    		document.getElementById('update_name').value = obj.name;
					document.getElementById('update_comment').value = obj.comment;
    			},500)
    		})

    		console.log("obj",obj)
    	}
    },
    //锁定
    lock:function(channelId,lock,index){
    	const _this = this;
    	return () =>{
    		
    		if(lock === '锁定'){
    			this.fetch('http://bnm.stnts.dev/agent/lock/'+channelId,function(){
	    			modalSuccess('提示','锁定成功!');
	    			lock = '解锁';

	    			//通知table组件
    				document.getElementById('query').click();
	    		},function(){
	    			modalError('提示','锁定失败!')
	    		})
    		}else{
    			this.fetch('http://bnm.stnts.dev/agent/unlock/'+channelId,function(){
    				
	    			modalSuccess('提示','解锁成功!');
	    			lock = '锁定';

	    			//通知table组件
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
    		this.fetch('http://bnm.stnts.dev/agent/destroy/'+channelId,function(){
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
    		this.fetch('http://bnm.stnts.dev/agent/destroy',function(){
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
    		this.fetch('http://bnm.stnts.dev/agent/lock',function(){
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
    //修改提交
    handleOk:function(){
    	const _this = this;

    	var fieldVal = {
    		third : channelMap[this.state.update_third],
			name : document.getElementById('update_name').value,
			comment : document.getElementById('update_comment').value
		}

		console.log(fieldVal)

		if(fieldVal.third === '' || fieldVal.name.replace(/(^\s*)|(\s*$)/g, "") === ''){
			message.error('*(星) 号项必填!');

			return;
		}

		this.fetch('http://bnm.stnts.dev/agent/update/' + document.getElementById('update_id').value,function(){
			_this.setState({
	    		visible : false
	    	})
			modaltSuccess('提示','修改成功!');

  			//模拟点击，触发table更新
  			document.getElementById('query').click();

		},function(){
			message.error('添加失败!');

		},fieldVal,'post');
    },
    fetch:function(url,callbackone,callbacktwo,fieldObj,method){
		reqwest({
			url:url,
			data:fieldObj ,
			method:method,
			type:'json'
		}).then(result =>{
			callbackone(result.data);
		},function(){
			callbacktwo();
		})
	},
    componentDidMount:function(){
    	const _this = this;

    	//获取第三方
		this.fetch('http://bnm.stnts.dev/channel/simple',function(data){
			if(_this.isMounted()){
				_this.setState({
	    			thirdData : data
	    		})

	    		//设置channelMap
				for(var i = 0;i < data.length;i++){
					channelMap[data[i].name] = data[i].id;
				}
			}
		},function(){
			modalError('提示','拉取第三方(渠道)数据失败')
		},{},'get')
    },

	render:function() {
		const _this = this;
		const { loading, selectedRowKeys } = this.state;
		const { getFieldProps } = this.props.form;

		let thirdData = [];
	    for (let i = 0; i < this.state.thirdData.length; i++) {
	        thirdData.push(<Option key={ this.state.thirdData[i].id }>{this.state.thirdData[i].name}</Option>);
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
			  }, {
			  	  title: '所属第三方',
				  dataIndex: 'channel',
				  render:function(text, record, index){
				  	 return <span>{text?text.name:''}</span>
				  }
			  },{
			  	  title: '所属第三方ID',
				  dataIndex: 'channel_id'
			  },{
				  title: '下属网吧数量',
				  dataIndex: 'children_number'
			  }, {
			      title: '创建时间',
			      dataIndex: 'created_at'
			  }, {
			      title: '状态',
			      dataIndex: 'status',
			  }, {
			      title: '备注',
			      dataIndex: 'comment',
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
		                  								channel_id:record.channel_id,
		                  								channel_name:record.channel?record.channel.name:'',
		                  								name:record.name,
		                  								comment:record.comment
		                  						    }) } style={{ textDecoration:'underline' }}> 修改 </a>
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
			           title="修改第三方" onOk={this.handleOk} onCancel={this.handleCancel}
			           footer={[
			            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
			            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
			              提 交
			            </Button>,
			          ]}
			        >
			          <Form horizontal>
			            <FormItem label="所属第三方" required>
				          <Select placeholder="请选择第三方" id='update_third' value={ this.state.update_third } onChange={ this.selectChange }>
				          	{ thirdData }
				          </Select>
				          <input placeholder="渠道ID" id='update_id' style={{ display:'none' }}/>
				        </FormItem>
				        <FormItem label="渠道名称" required>
				          <Input placeholder="请输入渠道名称" id='update_name'/>
				        </FormItem>
				        <FormItem label="备注">
				          <Input type="textarea" placeholder="请填写备注" id='update_comment' />
				        </FormItem>
				      </Form>
			    </Modal>
			</div>
		)
	}
})


TableContent = Form.create()(TableContent);

var agencyManage = React.createClass({
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
				<Banner noticeTable={ this.filterParam }/>
				<FilterForm filterParam={ this.filterParam } />
				<TableContent params={ this.state.filterparams }/>
			</div>
			
		)
	}
})



export default agencyManage;
