import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon,
		 message,
		 Modal ,
		 Spin ,
		 Table,
		 DatePicker} from 'antd';
import {Link} from 'react-router';
import reqwest from 'reqwest';

import { ModalSuccess,
         ModalError,
         ModalWarn } from '../../component/index';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

//配置全局message
message.config({
  top: 100,
  duration: 3,
});

var batchOperStyle = {
	del : 'none',
	lock : 'none'
};


var FilterForm = React.createClass({
	getInitialState() {
	    return {
	        channel : [] ,
	        agent : []
	    };
	},
	handleReset:function(e){
		e.preventDefault();
		this.props.form.resetFields();
		this.handleSubmit(event);
	},
	handleSubmit:function(e){
		e.preventDefault();

		var forms = this.props.form.getFieldsValue();

    	this.props.filterParam(forms);
	},
	fetch:function(url,callbackone,callbacktwo){
      reqwest({
        url: rootURL + url,
        method: 'get',
        type: 'json',
      }).then(result =>{
        callbackone(result);
      },function(){
        callbacktwo();
      })
  	},
  	componentDidMount:function(){
  		const _this = this;

  		_this.fetch('/channel/simple',function(result){
			if(result.status ==='success'){
				if(_this.isMounted()){
					_this.setState({
						channel : result.data
					})
				}
			}else{
				console.log("请求失败!");
			}
		},function(){
			console.log("请求失败!");
		})

		_this.fetch('/agent/simple',function(result){
			if(result.status ==='success'){
				if(_this.isMounted()){
					_this.setState({
						agent : result.data
					})
				}
			}else{
				console.log("请求失败!");
			}
		},function(){
			console.log("请求失败!");
		})

  	},
	render:function (){
		const { getFieldProps } = this.props.form;

		let channel = [<Option key value =''>全部</Option>],
			agent = [<Option key value =''>全部</Option>];
	    for (let i = 0; i < this.state.channel.length; i++) {
	       channel.push(<Option key={this.state.channel[i].id} title={this.state.channel[i].name}>
	       				  {this.state.channel[i].name}</Option>);
	    }
	    for (let i = 0; i < this.state.agent.length; i++) {
	       agent.push(<Option key={this.state.agent[i].id} title={this.state.agent[i].name}>
	       				{this.state.agent[i].name}
	       			  </Option>);
	    }

		return (
				<Form inline onSubmit={this.handleSubmit} style={{ marginLeft:20,marginBottom:20,display:'inline-block' }}>
					<FormItem label="账号状态">
			          <Select style={{ width: 100 }}  {...getFieldProps('status',{ initialValue: this.props.locaQuery?this.props.locaQuery.status + '':'use' })} placeholder="请选择状态" >
			            <Option value='all'>全部</Option>
			            <Option value='use'>启用</Option>
			            <Option value='deleted'>已删除</Option>
			            <Option value='locked'>已锁定</Option>
			          </Select>
			        </FormItem>
			        <FormItem label="用户名/ID">
			          <Input type="text" {...getFieldProps('name')} placeholder="请填写用户名/ID"/>
			        </FormItem>
			        <FormItem label="渠道名称">
			          <Select showSearch 
	                  		  notFoundContent="无法找到"
	                  		  optionFilterProp="children" style={{ width: 150 }} {...getFieldProps('channel',{ initialValue: this.props.locaQuery?this.props.locaQuery.channel_id + '':'' })} placeholder="请填写渠道名称" >
			            { channel }
			          </Select>
			        </FormItem>
			        <FormItem label="代理商渠道">
			          <Select showSearch 
	                  		  notFoundContent="无法找到"
	                  		  optionFilterProp="children" style={{ width: 150 }} {...getFieldProps('agent',{ initialValue: this.props.locaQuery?(this.props.locaQuery.id?this.props.locaQuery.id + '':''):'' })} placeholder="请填写代理商渠道" >
			            { agent }
			          </Select>
			        </FormItem>
			        <Button type="primary" htmlType="submit" style={{ marginLeft:20 }} id="query">查询</Button>
			        <Button type="default" onClick={this.handleReset} style={{ marginLeft:20 }} >重置</Button>
		        </Form>
		)
	}
})

FilterForm = Form.create()(FilterForm)


var Banner = React.createClass({
	render:function() {
		return (
			<div>
				<h3 style={{ margin:'20px 0 20px 20px',display:'inline-block' }}>渠道 > 账号管理</h3>
		        <Link to={{ pathname:"channel/accountModified",
		        			state:{ type:'add' } }}><Button type="primary" style={{ position:'absolute',right:50,marginTop:20 }}><Icon type="plus" /> 新增账户</Button></Link>
	        </div>
		)
	}
})

var TableContent = React.createClass({
	getInitialState() {
	    return {
	        url:rootURL + '/account/index'  ,
	        selectedRowKeys: [] ,
	        thirdData : [] ,
	        third : '',
	        channelId:'',
	        params:{ //给分页点击使用 保存筛选数据
	        	status: this.props.locaState?(this.props.locaState.status?this.props.locaState.status:''):'',
	    		agent: this.props.locaState?(this.props.locaState.id?this.props.locaState.id:''):'',
	    		channel: this.props.locaState?(this.props.locaState.channel_id?this.props.locaState.channel_id:''):'',
	    		name:'',
	    		per_page: 10,
	      	 	page: 1
	        }, 
	        data: [], //表格数据
	        pagination: { //分页对象
		        showSizeChanger: true,
		        pageSize:10,
		        current:1,
		        showTotal:function(total){
		          return `共 ${total} 条`;
		        }
	      	}
	    };
	},
	getDefaultProps() {
	    return {
	        channelMap:{
	        	0:'第三方渠道',
	        	1:'代理商渠道' 
	        } 
	    };
	},
	filterParam:function(params){
		
    	const _this = this;

    	var filters = {
    		status: params.status,
    		agent: params.agent,
    		channel: params.channel,
    		name: params.name,
    		per_page: 10,
      	 	page: 1
    	}

    	var pager = _this.state.pagination;
			pager.current = 1 ;
			pager.pageSize = 10 ;


    	_this.fetch(_this.state.url,function(result){
    		
    		const pagination = _this.state.pagination;
        		  pagination.total = result.data.total;

    		if(_this.isMounted()){
    			_this.setState({
    				data:result.data.data,
    				selectedRowKeys : [],
    				params:params,
    				pagination:pager
    			},function(){
    				_this.setDisptchStyle(result.data.total);
    			})
    		}

    	},function(){

    	},filters,'get')
    },
	handleTableChange(pagination) {
    
	    const pager = this.state.pagination;
	    pager.current = pagination.current;
	    pager.pageSize = pagination.pageSize;

	    this.setState({
	      pagination: pager,
	    });

	    const _this = this;
    	_this.fetch(_this.state.url,function(result){
    		const pagination = _this.state.pagination;
        		  pagination.total = result.data.total;

    		if(_this.isMounted()){
    			_this.setState({
    				data:result.data.data
    			})
    		}

    	},function(){

    	},{
    	 status:_this.state.params.status,
    	 agent:_this.state.params.agent,
    	 channel: _this.state.params.channel,
    	 name:_this.state.params.name,
    	 per_page: pagination.pageSize,
      	 page: pagination.current
    	},
    	'get')
    },
	onSelectChange(selectedRowKeys) {
	    this.setState({ selectedRowKeys });
    },
    //锁定/解锁
    lock:function(channelId,lock,index,lockJudge){
    	const _this = this;
    	return () =>{
    		
    		if(lock == '锁定'){
    			_this.fetch(rootURL + '/account/lock/'+channelId,function(result){
    				if(result.status === 'success'){
    					ModalSucces('提示','锁定成功!');
		    			lock = '解锁';
		    			
	    				document.getElementById('query').click();
    				}else{
    					ModalError('提示',result.info);
    				}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!')
	    		})
    		}else{
    			//解锁限制 只要所有级是启用的可以解锁 
	    		if(!lockJudge.agent_locked_at && !lockJudge.channel_locked_at){

	    			_this.fetch(rootURL + '/account/unlock/'+channelId,function(result){
	    				if(result.status === 'success'){
	    					ModalSucces('提示','解锁成功!');
			    			lock = '锁定';
			    			
		    				document.getElementById('query').click();
	    				}else{
	    					ModalError('提示',result.info);
	    				}
		    			
		    		},function(){
		    			ModalError('提示','请求失败!')
		    		})

	    			
	    		}else{
	    			ModalWarn('提示',<div><p>该账号归属第三方/代理商为锁定状态.</p><p style={{ color:'red' }}>请先解锁第三方/代理商.</p></div>);
	    		}
    		}
    		
    	}
    },
    //删除
    delete:function(channelId,index){
    	return () =>{
    		var _this = this;

    		confirm({
				    title: '警告',
				    content: '确定删除？',
				    onOk() {
				      del();
				    }
			  	});


 			var del = function(){
 				_this.fetch(rootURL + '/account/destroy/' + channelId,function(result){

 					if(result.status === 'success'){
 						ModalSucces('提示','删除成功!');

	    				document.getElementById('query').click();
 					}else{
 						ModalSucces('提示',result.info);
 					}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!')
	    		},'','post')
 			}

    	}
    },
    //批量删除
    batchDelete:function(){
    	const _this = this;

    	if(_this.state.selectedRowKeys.length){

    		confirm({
				    title: '警告',
				    content: '确定批量删除？',
				    onOk() {
				      del();
				    }
			  	});
    		
    	}else{
    		ModalWarn('提示','请先选择!');
    		return;
    	}

    	var del = function(){
    		_this.fetch(rootURL + '/account/destroy',function(result){
    			if(result.status === 'success'){
    				ModalSucces('提示','批量删除成功!');

		    		document.getElementById('query').click();
    			}else{
    				ModalError('提示',result.info);
    			}
	    		
	    	},function(){
	    	 	ModalError('提示','请求失败!');
	    	},{id:_this.state.selectedRowKeys.join(',')})
    	}
    	
    },
    //批量锁定
    batchLock:function(){
    	const _this = this;

    	if(_this.state.selectedRowKeys.length){
    		_this.fetch(rootURL + '/account/lock',function(result){

    			if(result.status === 'success'){
    				ModalSucces('提示','批量锁定成功!');
		    		
		    		document.getElementById('query').click();
    			}else{
    				ModalSucces('提示',result.info);
    			}
	    		
	    	 },function(){
	    	 	ModalError('提示','请求失败!')
	    	 },{id:_this.state.selectedRowKeys.join(',')})
    	}else{
    		ModalWarn('提示','请先选择!');
    		return;
    	}
    	 
    },
    updatePsw:function(channelId){
    	return () =>{
    		this.props.modalToParent({
    			visible:true,
    			channelId:channelId
    		});
    	}
    },
    fetch:function(url,callbackone,callbacktwo,fieldObj,method){
    	reqwest({
			url:url,
			data:fieldObj ,
			method:method,
			type:'json'
		}).then(result =>{
			callbackone(result);
		},function(){
			callbacktwo();
		})
    },
    setLoading:function(params){
		this.props.loadingTo(params);
	},
	setDisptchStyle:function(total){
    	const refs_del = ReactDOM.findDOMNode(this.refs.del);
    	const refs_lock = ReactDOM.findDOMNode(this.refs.lock);

    	if(total < 1 ){
    		refs_del.style.cssText = 'display:none;margin-left:20px';
			refs_lock.style.cssText = 'display:none;margin-left:20px';
    	}else if(this.state.params.status === 'locked'){
    		refs_del.style.cssText = 'display:inline-block;margin-left:20px';
			refs_lock.style.cssText = 'display:none;margin-left:20px';
    	}else if(this.state.params.status === 'deleted'){
    		refs_del.style.cssText = 'display:none;margin-left:20px';
			refs_lock.style.cssText = 'display:none;margin-left:20px';
    	}else{
    		refs_del.style.cssText = 'display:inline-block;margin-left:20px';
			refs_lock.style.cssText = 'display:inline-block;margin-left:20px';
    	}

    },
    componentDidMount:function(){
    	const _this = this;
    	_this.fetch(_this.state.url,function(result){
    		const pagination = _this.state.pagination;
        		  pagination.total = result.data.total;

        		  _this.setDisptchStyle(result.data.total);

    		if(_this.isMounted()){
    			_this.setState({
    				data:result.data.data
    			},function(){
    			   _this.props.loadingTo({loading:false});
    			})

    		}

    	},function(){

    	},_this.state.params,
    	'get')
    },
	render:function() {

		const _this = this;
		const { loading, selectedRowKeys } = this.state;
		const { getFieldProps } = this.props.form;

		let thirdData = [];
	    for (let i = 0; i < this.state.thirdData.length; i++) {
	        thirdData.push(<Option key={ this.state.thirdData[i].label }>{this.state.thirdData[i].value}</Option>);
	    }
		
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	      getCheckboxProps:function(record){
			  	if((record.deleted_at || record.channel_deleted_at || record.agent_deleted_at)){
			  		return {
			  			disabled: record.id === record.id
			  		}
			  	}else{
			  		return {
			  			disabled: ''
			  		}
			  	}
		  	}
	    };
	    const hasSelected = selectedRowKeys.length > 0;

	    var updateStyle = '',
	    	changeStyle = '',
        	lockStyle = '',
        	deleteStyle = '',
        	locaText = '锁定';

		const columns = [{
				  title: '用户ID',
				  dataIndex: 'id',
			  }, {
			  	  title: '用户名',
				  dataIndex: 'user_name'
			  }, {
			  	  title: '密码',
				  dataIndex: 'password',
				  className:'antd-hidden'
			  }, {
			  	  title: 'channel_id',
				  dataIndex: 'channel_id',
				  className:'antd-hidden'
			  }, {
			  	  title: 'agent_id',
				  dataIndex: 'agent_id',
				  className:'antd-hidden'
			  }, {
			  	  title: 'agent_name',
				  dataIndex: 'agent_name',
				  className:'antd-hidden'
			  },{
				  title: '归属渠道类型',
				  dataIndex: 'channel_type',
				  render:function(text, record, index){
				  	var text = '';
				  	if(record.agent_id === 0){
				  		text = '第三方渠道';
				  	}else{
				  		text = '代理商渠道';
				  	}
				  	return text;
				  }
			  }, {
			      title: '第三方渠道',
			      dataIndex: 'channel_name'
			  }, {
			      title: '代理商渠道',
			      dataIndex: 'agent',
			      render:function(text, record, index){
			      	return record.agent_name ? record.agent_name : ''
			      }
			  }, {
			      title: '联系人',
			      dataIndex: 'contacts',
			  }, {
			      title: '联系电话',
			      dataIndex: 'phone',
			  }, {
			      title: '创建时间',
			      dataIndex: 'created_at',
			  }, {
			      title: '最近登陆时间',
			      dataIndex: 'updated_at',
			  }, {
			      title: '最近登陆IP',
			      dataIndex: 'ip',
			  }, {
			      title: 'agent_locked_at',
			      dataIndex: 'agent_locked_at',
			      className:'antd-hidden'
			  }, {
			      title: 'agent_deleted_at',
			      dataIndex: 'agent_deleted_at',
			      className:'antd-hidden'
			  }, {
			      title: 'channel_locked_at',
			      dataIndex: 'channel_locked_at',
			      className:'antd-hidden'
			  }, {
			      title: 'channel_deleted_at',
			      dataIndex: 'channel_deleted_at',
			      className:'antd-hidden'
			  }, {
			      title: 'locked_at',
			      dataIndex: 'locked_at',
			      className:'antd-hidden'
			  }, {
			      title: 'deleted_at',
			      dataIndex: 'deleted_at',
			      className:'antd-hidden'
			  }, {
			      title: '状态',
			      dataIndex: 'status',
			      render:function(text, record, index){
			      	text = '';

			      	if(record.deleted_at || record.channel_deleted_at || record.agent_deleted_at){
			      		text = '已删除';

			      		updateStyle  = 'none';
			      		changeStyle = 'none';
			            lockStyle  = 'none';
			            deleteStyle  = 'none';

			            locaText = '锁定';
			      	}else if(record.locked_at || record.channel_locked_at || record.agent_locked_at){
			      		text = '已锁定';


			      		updateStyle  = 'none';
			      		changeStyle = '';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';

			            locaText = '解锁';
			      	}else{
			      		text = '启用';

			      		updateStyle  = 'inline-block';
			      		changeStyle = '';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';

			            locaText = '锁定';
			      	}

			      	return text;
			      }
			  }, {
			      title: '操作',
			      dataIndex: 'operations',
			      render:function(text, record, index){

			      	var routesParams = {
			      		type:'update',
			      		id:record.id,
			      		channel_id:record.channel_id,
			      		_name:record.channel_name,
			      		user_name:record.user_name,
			      		password:record.password,
			      		contacts:record.contacts,
			      		phone:record.phone,
			      		qq:record.qq,
			      		email:record.email,
			      		address:record.address,
			      		name:record.agent_id
			      	}

			      	return (
			      		<div>
		                  <Link to={{
		                  		pathname:"/channel/accountModified",
		                  		state:routesParams
		                  }} style={{ textDecoration:'underline',display:updateStyle,marginRight:'5%'  }}> 修改 </Link>
		                  
		                  <a  onClick={ _this.updatePsw(record.id) } style={{ textDecoration:'underline',display:changeStyle,marginRight:'5%'  }} > 修改密码 </a>
		                  
		                  <a  onClick={ _this.lock(record.id,locaText,index,{
		                  	agent_locked_at:record.agent_locked_at,
		                  	channel_locked_at:record.channel_locked_at,
		                  	locked_at:record.locked_at
		                  }) } style={{ textDecoration:'underline',display:lockStyle,marginRight:'5%'  }}> {locaText} </a>
		                  
		                  <a  onClick={ _this.delete(record.id,index) } style={{ textDecoration:'underline',display:deleteStyle }}> 删除 </a>
		                </div>
			      	)
			      }
			  }];

		return (

			<div>
				<FilterForm filterParam={ this.filterParam } locaQuery={ this.props.locaState }/>
				<Table  columns={columns}
				        rowSelection={rowSelection}
				        dataSource={this.state.data}
				        pagination={this.state.pagination}
				        onChange={this.handleTableChange}
				        rowKey={ function(record){
				          return record.id || record.start
			        } }
			        style={{ width:'98%',marginLeft:20 }}
			      />
				<div style={{ marginTop:-45 }}>
					<Button onClick={ this.batchDelete } ref='del' key="delete" type="primary" style={{ marginLeft:20,display:batchOperStyle.del }}>批量删除</Button>
					<Button onClick={ this.batchLock } ref='lock' key="sub" type="primary" style={{ marginLeft:20,display:batchOperStyle.lock }}>批量锁定</Button>
				</div>
			</div>
		)
	}
})

TableContent = Form.create()(TableContent)

var ModalPsw = React.createClass({
	getInitialState() {
	    return {
	        visible: false,
	        channelId:'',
	        maskClosable:false
	    };
	},
	modalOk:function(){
		const _this = this;
		var resData = this.props.form.getFieldsValue();
		if(resData.newPas && resData.newRePas){

			if(resData.newPas.trim() === resData.newRePas.trim()){
				_this.fetch(rootURL + '/account/change-password/' + this.state.channelId,function(result){
					if(result.status === 'success'){
						ModalSucces('提示','修改密码成功!');
						_this.setState({
							visible:false
						})
						_this.props.init({});
					}else{
						message.error(result.info || result.info[0].name);
					}
				},function(){
					message.error('请求失败!');
				},'','post')
			}else{
				message.error('两次密码不一致!');
			}
			
		}else{
			message.error('密码不可为空!');
		}

	},
	modalCancel:function(){
		this.setState({
			visible:false
		})
		this.props.init({});
	},
	fetch:function(url,callbackone,callbacktwo,fieldObj,method){
    	reqwest({
			url:url,
			data:fieldObj ,
			method:method,
			type:'json'
		}).then(result =>{
			callbackone(result);
		},function(){
			callbacktwo();
		})
    },
	componentWillReceiveProps(nextProps) {
	    
	    this.setState({
	    	visible:nextProps.tableToModal.visible,
	    	channelId:nextProps.tableToModal.channelId
	    })
	},
	handleCancel:function(){
		this.setState({
			visible:false
		})
		this.props.init({});
	},
	checkPass(rule, value, callback) {
	    const { validateFields } = this.props.form;
	    if (value) {
	      validateFields(['newRePas'], { force: true });
	      if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(value)){
	        callback(new Error('至少6位,且必须包含数字与字母'));
	      }
	    }
	    callback();
	  },

	  checkPass2(rule, value, callback) {
	    const { getFieldValue } = this.props.form;
	    if (value && value !== getFieldValue('newPas')) {
	      callback('两次输入密码不一致！');
	    } else {
	      callback();
	    }
    },
	render:function(){
		const { getFieldProps } = this.props.form;

		const passwdProps = getFieldProps('newPas',{
	      rules: [
	        { required: true, whitespace: true, message: '请填写密码' },
	        { validator: this.checkPass },
	      ]
	    }
	    );

	    const rePasswdProps = getFieldProps('newRePas', {
	      rules: [{
	        required: true,
	        whitespace: true,
	        message: '请再次输入密码',
	      }, {
	        validator: this.checkPass2,
	      }],
	    });


		return (
			<Modal ref="modal"
	           visible={this.state.visible}
	           maskClosable={this.state.maskClosable}
	           title="修改密码"  onCancel={ this.handleCancel }
	           footer={[
	            <Button key="back" type="ghost" size="large" onClick={this.modalCancel}>取 消</Button>,
	            <Button key="submit" type="primary" size="large"  onClick={this.modalOk}>提 交</Button>,
	          ]}
	        >
          <Form horizontal form={this.props.form}>
          	<FormItem label="id" style={{ display:'none' }}>
	          <Input placeholder="id" {...getFieldProps('id',{ initialValue:this.state.channelId })} />
	        </FormItem>
	        <FormItem label="新密码" >
	          <Input type="password" placeholder="请输入新密码" {...passwdProps}/>
	        </FormItem>
	        <FormItem label="再次输入新密码" >
	          <Input type="password" placeholder="请输入新密码" {...rePasswdProps} />
	        </FormItem>
	      </Form>
	    </Modal>
		)
	}
})

ModalPsw = Form.create()(ModalPsw)

var AccountManage = React.createClass({
	getInitialState() {
	    return {
	        filterparams : {},
	        updPswParams : {},
	        loading:false
	    };
	},
	filterParam:function(params){
		this.setState({
			filterparams : params
		})
	},
	fromModal:function(params){
		this.setState({
			updPswParams:params
		})
	},
	initParams:function(params){
		this.setState({
			updPswParams:params
		})
	},
    setLoading:function(params){
		this.setState({ 
			loading:params.loading
		})
	},
	render:function() {
		
		return (
			<div>
				<Spin spinning={ this.state.loading }>
					<Banner />
					<TableContent locaState={ this.props.location.state } params={ this.state.filterparams } modalToParent={ this.fromModal }  loadingTo={ this.setLoading }/>
					<ModalPsw tableToModal={ this.state.updPswParams } init={ this.initParams}/>
				</Spin>
			</div>
			
		)
	}
})



export default AccountManage;
