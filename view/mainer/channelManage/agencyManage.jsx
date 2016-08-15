import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon, 
		 Modal ,
		 message,
		 Spin,
		 Table,	 
		 DatePicker} from 'antd';
import {Link,hashHistory} from 'react-router';
import reqwest from 'reqwest';

import { ModalSuccess,
		 ModalError,
		 ModalWarn} from '../../component/index';

import {InfoError} from '../../commentMap/index';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

message.config({
  top: 100,
  duration: 3,
});

var batchOperStyle = {};

var FilterForm = React.createClass({
	getInitialState() {
	    return {
	        third : [],
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

    	this.setExportVal(forms);

    	this.props.filterParam(forms);
	},
	setExportVal:function(forms){
		ReactDOM.findDOMNode(this.refs.export_status).value = forms.status?forms.status:'';
		ReactDOM.findDOMNode(this.refs.export_channel).value = forms.channel?forms.channel:'';
		ReactDOM.findDOMNode(this.refs.export_name).value = forms.name?forms.name:'';
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
						third : result.data
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

		let third = [<Option key value =''>全部</Option>],
			agent = [<Option key value =''>全部</Option>];
	    for (let i = 0; i < this.state.third.length; i++) {
	       third.push(<Option key={this.state.third[i].id} title={this.state.third[i].name}>
	       				{this.state.third[i].name}
	       			  </Option>);
	    }
	    for (let i = 0; i < this.state.agent.length; i++) {
	       agent.push(<Option key={this.state.agent[i].id} title={this.state.agent[i].name}>
	       				{this.state.agent[i].name}
	       			  </Option>);
	    }

		return (
			<div>
				<Form inline onSubmit={this.handleSubmit} style={{ margin:'20px 0 20px 20px',display:'inline-block' }}>
			        <FormItem label="代理商状态">
			          <Select  style={{ width: 100 }} {...getFieldProps('status',{ initialValue:this.props.urlData ? 'all' : 'use' })} placeholder="启用" >
			            <Option key='all'>全部</Option>
			            <Option key='use'>启用</Option>
			            <Option key='deleted'>已删除</Option>
			            <Option key='locked'>已锁定</Option>
			          </Select>
			        </FormItem>
			        <FormItem label="第三方名称">
			          <Select showSearch 
	                  notFoundContent="无法找到"
	                  optionFilterProp="children" style={{ width: 150 }} {...getFieldProps('channel',{ initialValue:this.props.urlData ? this.props.urlData.id + '' : '' })} placeholder="第三方名称" >
			            { third }
			          </Select>
			        </FormItem>
			        <FormItem label="代理商名称">
			          <Select showSearch 
	                  notFoundContent="无法找到"
	                  optionFilterProp="children" style={{ width: 150 }} {...getFieldProps('name')} placeholder="请选择代理商名称" >
			           { agent }
			          </Select>
			        </FormItem>
			        <Button type="primary" htmlType="submit" id="query" style={{ marginLeft:20 }}>查询</Button>
			        <Button type="default" onClick={this.handleReset} style={{ marginLeft:20 }} >重置</Button>
		        </Form>
		        <form style={{ display:'inline-block' }} action={ rootURL + "/agent/export"}  method="get">
			        	<input type="text" name="status" ref='export_status' className='antd-hidden'/>
			        	<input type="text" name="channel" ref='export_channel' className='antd-hidden'/>
	  				    <input type="text" name="name" ref='export_name' className='antd-hidden'/>
			        	<Button type="default" htmlType="submit" style={{ marginLeft:20 }} >导出</Button>
			    </form>
		    </div>
		)
	}
})

FilterForm = Form.create()(FilterForm)


var Banner = React.createClass({
	getInitialState() {
	    return {
	        visible : false  ,
	        thirdData : [],
	        maskClosable:false
	    };
	},
	mixins: [InfoError],
	alertModel:function(){
		this.setState({
			visible : true
		})
	},
	handleCancel:function(){
		this.setState({
	    	visible : false
	    })
	    this.props.form.resetFields();
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
			this.fetch(rootURL + '/agent/store',function(result){
				if(result.status === 'success' && _this.isMounted()){

					_this.props.form.resetFields();

					_this.setState({
			    		visible : false
			    	})

			    	confirm({
					    title: '通知',
					    iconType:'check-circle',
					    content: '添加成功！是否继续添加账户？',
					    onOk() {
					      hashHistory.push({ pathname:'/channel/accountModified',
					  						 state:{
					  						 	from:'agent',
					  						 	name :result.data,
					  						 	channel_id:fieldVal.channel_id,
					  						 	type : 'add'
					  						 } 
					  						});
					    }
					  });

			  		//通知table进行更新
			  		document.getElementById('query').click();
				}else{
					
					var str = _this.props.InfoError(result.info);

                    message.error(str);
				}
			},function(){

				message.error('请求失败!');

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
			callbackone(result);

		},function(){
			callbacktwo();
		})
	},
	componentDidMount:function(){
		const _this = this;

		//拉第三方
		this.fetch(rootURL + '/channel/simple/enabled',function(result){
			if(_this.isMounted()){
				_this.setState({
	    			thirdData : result.data
	    		})
			}
		},function(){
			ModalError('提示','拉第三方(渠道)失败!');
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
				<div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}>
					<h3 style={{ margin:'20px 0 20px 20px',display:'inline-block' }}>渠道 > 代理商渠道管理</h3>
			        <Button type="primary" onClick={ this.alertModel } style={{ position:'absolute',right:50,marginTop:20 }}>
				        <Icon type="plus" /> 新增代理商
			        </Button>
				</div>
		        <Modal ref="modal"
			           visible={this.state.visible}
			           maskClosable={this.state.maskClosable}
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
				          <Select showSearch 
				                  optionFilterProp="children"
				                  notFoundContent="无法找到" placeholder="请选择所属第三方" {...getFieldProps('add_third')} >
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


var TableContent = React.createClass({
	getInitialState() {
	    return {
	        url:rootURL + '/agent/index'  ,
	        selectedRowKeys: [] ,
	        params:{ //给分页点击使用 保存筛选数据
	        	channel: this.props.urlData?this.props.urlData.id:'',
	        	status: this.props.urlData?'all':'',
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
    	 channel : _this.state.params.channel,
    	 name:_this.state.params.name,
    	 per_page: pagination.pageSize,
      	 page: pagination.current
    	},
    	'get')
    },
    filterParam:function(params){
    	const _this = this;

    	var filters = {
    		status:params.status,
    		channel : params.channel,
    		name:params.name,
    		per_page: 10,
      	 	page: 1
    	}

    	var pager = _this.state.pagination;
			pager.current = 1 ;
			pager.pageSize = 10 ;

    	_this.fetch(_this.state.url,function(result){
    		
    		const pagination = _this.state.pagination;
        		  pagination.total = result.data.total;

    		_this.setDisptchStyle(result.data.total);
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
	onSelectChange(selectedRowKeys) {
	    this.setState({ selectedRowKeys });
    },
    handleCancel:function(){
    	this.setState({
    		visible :false
    	})
    },
    update:function(obj){
    	const _this = this;

    	return () =>{
    		this.props.modalToParent(obj);
    	}
    },
    //锁定
    lock:function(channelId,lock,index){
    	const _this = this;
    	return () =>{
    		
    		if(lock === '锁定'){
    			this.fetch(rootURL + '/agent/lock/'+channelId,function(result){
    				if(result.status === 'success'){
    					ModalSuccess('提示','锁定成功!');
		    			lock = '解锁';

	    				document.getElementById('query').click();
    				}else{
    					ModalError('提示',result.info);
    				}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!');
	    		})
    		}else{
    			this.fetch(rootURL + '/agent/unlock/'+channelId,function(result){
    				if(result.status === 'success'){
    					ModalSuccess('提示','解锁成功!');
		    			lock = '锁定';

	    				document.getElementById('query').click();
    				}else{
    					ModalError('提示',result.info);
    				}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!');
	    		})
    		}
    		
    	}
    },
    //删除
    delete:function(channelId,index,children_number){
    	return () =>{

    		var _this = this;

    		confirm({
			    title: '警告',
			    content: <p>该渠道下有 <span style={{ color:'red' }}>{children_number}</span> 个下属网吧,确定删除?<br/>(注意:下属网吧也将被删除)</p>,
			    onOk() {
			      del();
			    }
			  });

    	    var del = function(){
    	    	_this.fetch(rootURL + '/agent/destroy/'+channelId,function(result){
    	    		if(result.status === 'success'){
    	    			ModalSuccess('提示','删除成功!');

	    				document.getElementById('query').click();
    	    		}else{
    	    			ModalError('提示',result.info);
    	    		}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!');
	    		})
    	    }
    		
    	}
    },
    //批量删除
    batchDelete:function(){
    	const _this = this;

    	if(this.state.selectedRowKeys.length){

    		confirm({
			    title: '警告',
			    content: '确定要批量删除？',
			    onOk() {
			      del();
			    }
			  });
    		
    	}else{
    		ModalWarn('提示','请先选择!');
    		return;
    	}

    	var del = function(){
    		_this.fetch(rootURL + '/agent/destroy',function(result){

    			if(result.status === 'status'){
    				ModalSuccess('提示','批量删除成功!');
		    		_this.setState({
		    			selectedRowKeys : []
		    		})
		    		//触发查询
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

    	if(this.state.selectedRowKeys.length){
    		this.fetch(rootURL + '/agent/lock',function(result){
    			if(result.status === 'success'){
    				ModalSuccess('提示','批量锁定成功!');
		    		_this.setState({
		    			selectedRowKeys : []
		    		})
		    		
		    		document.getElementById('query').click();
    			}else{
    				ModalError('提示',status.info)
    			}
	    		
	    	 },function(){
	    	 	ModalError('提示','请求失败!')
	    	 },{id:this.state.selectedRowKeys.join(',')})
    	}else{
    		ModalWarn('提示','请先选择!');
    		return;
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
		
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	      getCheckboxProps:function(record){
			  	if((record.channel_deleted_at || record.deleted_at)){
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
        	lockStyle = '',
        	deleteStyle = '',
        	status = '';

    	var statusMap = {
					'全部':'all',
					'启用':'use',
					'已删除':'deleted',
					'已锁定':'locked',

				}

		const columns = [{
				  title: 'ID',
				  dataIndex: 'id',
			  }, {
				  title: '渠道名称',
				  dataIndex: 'name',
			  }, {
			  	  title: '所属第三方',
				  dataIndex: 'channel_name'
			  },{
			  	  title: '所属第三方ID',
				  dataIndex: 'channel_id',
				  className:'antd-hidden'
			  },{
				  title: '下属网吧数量',
				  dataIndex: 'children_number',
				  render:function(text, record, index){
				  	if(text !== 0){
				  		return <Link to={{ pathname:"/channel/barManage",
				  						   state:{
				  						   	  from:'jump',
				  						   	  id:record.channel_id,
				  						   	  name:record.channel_name,
				  						   	  channel_id:record.id
				  						   } }} style={{ textDecoration:'underline' }}>{ text }</Link>
				  	}else{
				  		return text ;
				  	}
				  }
			  }, {
			      title: '创建时间',
			      dataIndex: 'created_at'
			  }, {
			      title: '状态',
			      dataIndex: 'status',
			      render:function(text, record, index){
			      	status = '';

			      	if(record.channel_deleted_at || record.deleted_at){
			      		status = '已删除';

			      		updateStyle  = 'none';
			      		lockStyle  = 'none';
			      		deleteStyle  = 'none';
			      	}else if(record.channel_locked_at || record.locked_at){
			      		status = '已锁定';

			      		updateStyle  = 'none';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';
			      	}else{
			      		status = '启用';

			      		updateStyle  = 'inline-block';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';
			      	}

			      	return <span className='status'>{ status }</span>
			      }
			  }, {
			      title: '备注',
			      dataIndex: 'comment',
			      className:'my-commentmax-width'
			  },{
			      title: 'locked_at',
			      dataIndex: 'locked_at',
			      className:'antd-hidden'
			  }, {
			      title: 'channel_at',
			      dataIndex: 'channel_at',
			      className:'antd-hidden'
			  }, {
			      title: '操作',
			      dataIndex: 'operations',
			      render:function(text, record, index){
			      	
			      	var text = '';
			      	if(record.channel_locked_at || record.locked_at){
                  		text = '解锁';
                  	}else{
                  		text = '锁定';
                  	}



			      	return (
			      		<div>
		                  <a  onClick={ _this.update({
		                  								id:record.id,
		                  								channel_id:record.channel_id,
		                  								channel_name:record.channel_name,
		                  								name:record.name,
		                  								comment:record.comment
		                  						    }) } style={{ textDecoration:'underline',display:updateStyle,marginRight:'5%' }}> 修改 </a>
		                  
		                  <a className='locks' onClick={ _this.lock(record.id,text,index) } style={{ textDecoration:'underline',display:lockStyle,marginRight:'5%' }}> {text}</a>
		                  <a onClick={ _this.delete(record.id,index,record.children_number) } style={{ textDecoration:'underline',display:deleteStyle,marginRight:'5%' }}> 删除 </a>
		                  <Link style={{ textDecoration:'underline',marginRight:'5%' }} to={{ pathname:'/channel/accountManage',state:{ id:record.id,channel_id:record.channel_id,status:statusMap[status] } }}> 查看账号 </Link>
		                </div>
			      	)
			      }
			  }];

		return (
			<div>
				<FilterForm filterParam={ this.filterParam } urlData={ this.props.urlData }/>
				<Table   columns={columns}
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


TableContent = Form.create()(TableContent);

var CHANNEL_ID ;

var ModalUpdate = React.createClass({
	getInitialState() {
	    return {
	        params:{} ,
	        thirdData:[],
	        maskClosable : false
	    };
	},
	mixins:[InfoError],
	handleOk:function(){
		const _this = this;

		var fieldVal = this.props.form.getFieldsValue();
		fieldVal.id = document.getElementById('id').value;
		fieldVal.channel_id = CHANNEL_ID;
		fieldVal.name = document.getElementById('name').value;
		fieldVal.comment = document.getElementById('comment').value;

		if(fieldVal.channel_id === '' || fieldVal.name.replace(/(^\s*)|(\s*$)/g, "") === ''){
			message.error('*(星) 号项必填!');
			return;
		}

		_this.fetch(rootURL + '/agent/update/' + fieldVal.id,function(result){
			if(result.status === 'success'){

				_this.setState({
	    			visible : false
		    	})
				
				ModalSuccess('提示','修改成功!');

	  			document.getElementById('query').click();

		    	_this.props.init()
			}else{
				
				var str = _this.props.InfoError(result.info);

                    ModalError('提示',str);
			}
			
		},function(){
			message.error('请求失败!');

		},fieldVal,'post');

	},
	handleCancel:function(){
		this.props.form.resetFields();
		this.props.init()
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
    channel_idChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			channel_id : e ,
         		name : _this.state.params.name,
         		comment :  _this.state.params.comment,
    		}
    			
    	})

    	CHANNEL_ID = e;
    },
    nameChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			channel_id : _this.state.params.channel_id,
         		name : e.target.value,
         		comment :  _this.state.params.comment,
    		}
    			
    	})

    },
    commentChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			channel_id : _this.state.params.channel_id ,
         		name : _this.state.params.name,
         		comment :  e.target.value,
    		}
    			
    	})
    },
    componentDidMount:function(){
    	const _this = this;

    	//获取第三方
		_this.fetch(rootURL + '/channel/simple/enabled',function(data){
			
			if(_this.isMounted()){
				_this.setState({
	    			thirdData : data
	    		})
			}
		},function(){
			ModalError('提示','拉取第三方(渠道)数据失败')
		},{},'get')
    },
	componentWillReceiveProps(nextProps) {
		CHANNEL_ID = nextProps.tableToModal.channel_id;

	    this.setState({
         	params :{
         		id:nextProps.tableToModal.id,
    			channel_id :nextProps.tableToModal.channel_name ,
         		name : nextProps.tableToModal.name,
         		comment :  nextProps.tableToModal.comment,
         	} 
         }) 

	},
	render:function(){
		const { getFieldProps } = this.props.form;

		let thirdData = [];
		if(this.state.thirdData.data){
			for (let i = 0; i < this.state.thirdData.data.length; i++) {
		        thirdData.push(<Option key={ this.state.thirdData.data[i].id }>{this.state.thirdData.data[i].name}</Option>);
		    }
		}

		return (
		    <Modal ref="modal"
		           visible={this.props.visible}
		           maskClosable={this.state.maskClosable}
		           title="修改代理商" onOk={this.handleOk} onCancel={this.handleCancel}
		           footer={[
		            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
		            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
		              提 交
		            </Button>,
		          ]}
		        >
		          <Form horizontal>
		            <FormItem label="所属第三方" required>
		            <FormItem style={{ display:'none' }}>
			        	<input placeholder="渠道ID"   {...getFieldProps('id')} value={this.state.params.id}/>
			        </FormItem>
			        <Select showSearch 
			                  optionFilterProp="children"
			                  notFoundContent="无法找到" placeholder="请选择第三方"  {...getFieldProps('channel_id')} value={ this.state.params.channel_id } onChange={this.channel_idChange}>
			          	{ thirdData }
			          </Select>
			        </FormItem>
			        <FormItem label="渠道名称" required>
			          <Input placeholder="请输入渠道名称"  {...getFieldProps('name')} value={ this.state.params.name } onChange={this.nameChange}/>
			        </FormItem>
			        <FormItem label="备注">
			          <Input type="textarea" placeholder="请填写备注" {...getFieldProps('comment')} value={ this.state.params.comment } onChange={this.commentChange}/>
			        </FormItem>
			      </Form>
		    </Modal>
		)
	}
})

ModalUpdate = Form.create()(ModalUpdate)


var agencyManage = React.createClass({
	getInitialState() {
	    return {
	        filterparams : {} ,
	        updateParams : {} ,
	        loading:true ,
	        visible:false
	    };
	},
	filterParam:function(params){
		this.setState({
			filterparams : params
		})
	},
	fromModal:function(params){
		//debugger
		this.setState({
			updateParams:params,
			visible:true
		})
	},
	init:function(){
		this.setState({
			visible:false
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
					<Banner noticeTable={ this.filterParam }/>
					<TableContent params={ this.state.filterparams } urlData={ this.props.location.state } filterParam={ this.filterParam } modalToParent={ this.fromModal } loadingTo={ this.setLoading }/>
					<ModalUpdate visible={ this.state.visible } tableToModal={ this.state.updateParams } init={ this.init }/>
				</Spin>
			</div>
			
		)
	}
})

export default agencyManage;
