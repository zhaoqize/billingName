import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon, 
		 Modal ,
		 message ,
		 Spin,
		 Popover,
		 Table,
		 DatePicker} from 'antd';
import {Link,hashHistory} from 'react-router';
import reqwest from 'reqwest';

import { ModalSuccess,
		 ModalError,
		 ModalWarn} from '../../component/index';


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
	        third : []  
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
		ReactDOM.findDOMNode(this.refs.export_name).value = forms.name?forms.name:'';
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
		},'json')
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
	render:function (){
		const { getFieldProps } = this.props.form;

		let third = [<Option key value =''>全部</Option>];
	    for (let i = 0; i < this.state.third.length; i++) {
	       third.push(<Option key={this.state.third[i].id} title={this.state.third[i].name}>
	       				{this.state.third[i].name}
	       			  </Option>
	       			  );
	    }

		return (
			<div>
				<Form inline onSubmit={this.handleSubmit} style={{ margin:'20px 0 20px 20px',display:'inline-block' }}>
			        <FormItem label="第三方状态">
			          <Select  style={{ width: 100 }} {...getFieldProps('status',{ initialValue:'use' })} placeholder='启用' >
			            <Option value='all'>全部</Option>
			            <Option value='use'>启用</Option>
			            <Option value='deleted'>已删除</Option>
			            <Option value='locked'>已锁定</Option>
			          </Select>
			        </FormItem>
			        <FormItem label="第三方渠道">
			          <Select showSearch 
	                  		  notFoundContent="无法找到"
	                  		  optionFilterProp="children" style={{ width: 150 }} {...getFieldProps('name')} placeholder='请填写第三方渠道' >
			            { third }
			          </Select>
			        </FormItem>
			        <Button type="primary" htmlType="submit" id="query" style={{ marginLeft:20 }}>查询</Button>
			        <Button type="default" onClick={this.handleReset} style={{ marginLeft:20 }} >重置</Button>
		        </Form>
		        <form style={{ display:'inline-block' }} action={ rootURL + "/channel/export"}  method="get">
		        	<input type="text" name="status" ref='export_status' className='antd-hidden'/>
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
	        maskClosable : false
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
	    this.props.form.resetFields();
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
			_this.fetch(rootURL + '/channel/store',function(result){
				if(result.status === 'success'){

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
					  						 	name : result.data,
					  						 	type : 'add',
					  						 	from : 'third'
					  						 } 
					  						});
					    }
				  	});

			  		document.getElementById('query').click();
				}else{
					message.error(result.info[0].name);
				}
				
			},function(){

				message.error('请求失败!');

			},fieldVal);

		}else{
			message.error('渠道名称必须填写!');
		}
		
	},
	fetch:function(url,callbackone,callbacktwo,fieldObj){
		reqwest({
			url:url,
			data:fieldObj ,
			method:'post',
			type:'json'
		}).then(result =>{
			callbackone(result);
		},function(){
			callbacktwo();
		})
	},
	render:function() {
		const { getFieldProps } = this.props.form;

		return (
			<div>
				<div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}>
					<h3 style={{ margin:'20px 0 20px 20px',display:'inline-block' }}>渠道 > 第三方渠道管理</h3>
			        <Button type="primary" onClick={ this.alertModel } style={{ position:'absolute',right:50,marginTop:20 }}>
				        <Icon type="plus" /> 新增第三方
			        </Button>
				</div>
		        <Modal ref="modal"
			           visible={this.state.visible}
			           maskClosable={this.state.maskClosable}
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
	        url:rootURL + '/channel/index'  ,
	        show:false,
	        showdata:{},
	        selectedRowKeys: [] , //checkbox数组
	        params:{ //给分页点击使用 保存筛选数据
	        	status:'',
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
	//分页触发
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
    	 name:_this.state.params.name,
    	 per_page: pagination.pageSize,
      	 page: pagination.current
    	},
    	'get')
    },
	onSelectChange(selectedRowKeys, selectedRows) {
	    this.setState({ selectedRowKeys });
    },
    filterParam:function(params){
    	const _this = this;

    	var filters = {
    		status:params.status,
    		name:params.name,
    		per_page: 10,
      	 	page: 1
    	}

    	var pager = _this.state.pagination;
			pager.current = 1 ;
			pager.pageSize = 10;

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
    update:function(obj){
    	return () =>{
    		console.log(obj)
    		this.props.modalToParent(obj);
    	}
    }, 
     //锁定
    lock:function(channelId,lock,index){
    	const _this = this;
    	return () =>{
    		
    		if(lock == '锁定'){
    			_this.fetch(rootURL + '/channel/lock/'+channelId,function(result){
    				if(result.status === 'success'){
    					ModalSuccess('提示','锁定成功!');
		    			lock = '解锁';

	    				document.getElementById('query').click();
    				}else{
    					ModalError('提示',result.info)
    				}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!')
	    		})
    		}else{
    			_this.fetch(rootURL + '/channel/unlock/'+channelId,function(result){
    				if(result.status === 'success'){
    					ModalSuccess('提示','解锁成功!');
		    			lock = '锁定';
		    			
	    				document.getElementById('query').click();
    				}else{
    					ModalError('提示',result.info)
    				}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!')
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
				    content:<p>该渠道下有 <span style={{ color:'red' }}>{children_number}</span> 个代理商渠道,确定删除?<br/>(注意:代理商渠道也将被删除)</p>,
				    onOk() {
				      del();
				    }
			  	});


 			var del = function(){
 				_this.fetch(rootURL + '/channel/destroy/'+channelId,function(result){

 					if(result.status === 'success'){
 						ModalSuccess('提示','删除成功!');

	    				document.getElementById('query').click();
 					}else{
 						ModalError('提示',result.info);
 					}
	    			
	    		},function(){
	    			ModalError('提示','请求失败!')
	    		})
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
    		_this.fetch(rootURL + '/channel/destroy',function(result){
    			if(result.status === 'success'){
    				ModalSuccess('提示','批量删除成功!');
		    		
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

    	if(_this.state.selectedRowKeys.length){
    		_this.fetch(rootURL + '/channel/lock',function(result){
    			if(result.status === 'success'){
    				ModalSuccess('提示','批量锁定成功!');
		    		
		    		//触发查询
		    		document.getElementById('query').click();
    			}else{
    				ModalError('提示',result.info);
    			}
	    		
	    	 },function(){
	    	 	ModalError('提示','请求失败!')
	    	 },{id:_this.state.selectedRowKeys.join(',')})
    	}else{
    		ModalWarn('提示','请先选择!');

    		return;
    	}
    	 
    },
    showDetail:function(showdata){
    	return ()=>{
    		this.setState({
    			show:true,
    			showdata : showdata
    		})
    	}
    },
    fetch:function(url,callbackone,callbacktwo,fieldObj,method){
    	reqwest({
			url:url,
			data:fieldObj ,
			method:method?method:'post',
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
    showDetailCancle:function(){
		this.setState({
	    	show:false
	    })
    },
    showDetailX:function(){
    	this.setState({
	    	show:false
	    })
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

        var updateStyle = '',
        	lockStyle = '',
        	deleteStyle = '',
        	status = '';
        var statusMap = {
					'全部':'all',
					'启用':'use',
					'已删除':'deleted',
					'已锁定':'locked'}

		const columns = [{
				  title: 'ID',
				  dataIndex: 'id',
			  }, {
				  title: '渠道名称',
				  dataIndex: 'name',
			  }, {
				  title: '下属代理商数量',
				  dataIndex: 'children_number',
				  render: (text, record, index) => {
				  	if(text !== 0){
				  		return <Link to={{ pathname:"/channel/agencyManage",
				  						   state:{
				  						   	  from:'jump',
				  						   	  name:record.name,
				  						   	  id:record.id  
				  							}}} style={{ textDecoration:'underline' }}>{ text }</Link>
				  	}else{
				  		return text ;
				  	}
				  	
				  }
			  }, {
			      title: '创建时间',
			      dataIndex: 'created_at',
			  }, {
			      title: '状态',
			      dataIndex: 'status',
			      render:function(text, record, index){
			      	status = '';

			      	if(!record.locked_at && !record.deleted_at){
			      		status = '启用';
			      		updateStyle  = 'inline-block';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';

			      	}else if(record.deleted_at){
			      		status = '已删除';
			      		updateStyle  = 'none';
			            lockStyle  = 'none';
			            deleteStyle  = 'none'; 

			      	}else if(record.locked_at && !record.deleted_at){
			      		status = '已锁定';
			      		updateStyle  = 'none';
			            lockStyle  = 'inline-block';
			            deleteStyle  = 'inline-block';
			      	}

			      	return <span className='status'>{ status }</span>
			      }
			  }, {
			      title: '备注',
			      dataIndex: 'comment',
			      className:'my-commentmax-width'
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
			      title: 'locked_at',
			      dataIndex: 'locked_at',
			      className:'antd-hidden'
			  }, {
			      title: 'channel_at',
			      dataIndex: 'channel_at',
			      className:'antd-hidden'
			  },{
			      title: '操作',
			      dataIndex: 'operations',
			      render:function(text, record, index){
			      	
			      	var text = '';
			      	if(record.locked_at && !record.deleted_at){
                  		text = '解锁';
                  	}else{
                  		text = '锁定';
                  	}

                  	const content = (
							  <article>
							    <p><a>公司名称</a>: &nbsp;{record.company}</p>
							    <p><a>银行名称</a>: &nbsp;{record.bank}</p>
							    <p><a>银行账户</a>: &nbsp;{record.bank_account}</p>
							    <p><a>发票抬头</a>: &nbsp;{record.fapiao}</p>
							  </article>
							);

			      	return (
			      		<div>
		                  <a onClick={ _this.update({
		                  						id:record.id,
							                  	name:record.name, 
							                  	company:record.company,
							                  	bank:record.bank,
							                  	bank_account:record.bank_account,
							                  	fapiao:record.fapiao,
							                  	comment:record.comment
							                  }) } style={{ textDecoration:'underline',display:updateStyle,marginRight:'5%' }}> 修改 </a>
		                  <a className='locks' onClick={ _this.lock(record.id,text,index) } style={{ textDecoration:'underline',display:lockStyle,marginRight:'5%' }}> 
		                  	{ text }
		                  </a>
		                  <a onClick={ _this.delete(record.id,index,record.children_number) } style={{ textDecoration:'underline',display:deleteStyle,marginRight:'5%' }}> 删除 </a>
		                  <Link style={{ textDecoration:'underline',marginRight:'5%' }} to={{ pathname:'/channel/accountManage',state:{ channel_id:record.id,status:statusMap[status] } }}> 查看账号 </Link>
		                  <Popover content={content}>
						    <a onClick={ _this.showDetail({
						    					name:record.name, 
							                  	company:record.company,
							                  	bank:record.bank,
							                  	bank_account:record.bank_account,
							                  	fapiao:record.fapiao,
							                  	comment:record.comment
						    }) } style={{ textDecoration:'underline'}}>查看详情</a>
						  </Popover>
		                </div>
			      	)
			      }
			  }];


		    const rowSelection = {
		      selectedRowKeys,
		      onChange: this.onSelectChange,
			  getCheckboxProps:function(record){
				  	if(record.deleted_at){
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

		return (
			<div>
				<FilterForm filterParam={ this.filterParam } />
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
					<Button onClick={ this.batchDelete } ref='del' key="delete" type="primary" style={{ marginLeft:20,display:batchOperStyle.del  }}>批量删除</Button>
					<Button onClick={ this.batchLock } ref='lock' key="sub" type="primary" style={{ marginLeft:20,display:batchOperStyle.lock }}>批量锁定</Button>
				</div>
				<Modal ref="modal"
		           visible={this.state.show} 
		           onCancel={this.showDetailX}
		           title="查看详情" 
		           footer={[<Button key="back" type="ghost" size="large" onClick={this.showDetailCancle}>取 消</Button>]}
		        >
		          <dl>
	   				<dt><a>渠道名称:</a></dt>
	   				<dd>{ this.state.showdata.name }</dd>
	   				<hr className='hr-border'/>
	   				<dt><a>公司名称:</a></dt>
	   				<dd>{ this.state.showdata.company }</dd>
	   				<hr className='hr-border'/>
	   				<dt><a>银行名称:</a></dt>
	   				<dd>{ this.state.showdata.bank }</dd>
	   				<hr className='hr-border'/>
	   				<dt><a>银行账户:</a></dt>
	   				<dd>{ this.state.showdata.bank_account }</dd>
	   				<hr className='hr-border'/>
	   				<dt><a>发票抬头:</a></dt>
	   				<dd>{ this.state.showdata.fapiao }</dd>
					<hr className='hr-border'/>
	   				<dt><a>备注:</a></dt>
	   				<dd>{ this.state.showdata.comment }</dd>
				  </dl>
		    	</Modal>
			</div>
		)
	}
})

var ModalUpdate = React.createClass({
	getInitialState() {
	    return {
	        params : {},
	        maskClosable : false
	    };
	},
	handleOk:function(){
		const _this = this;

		var fieldVal = this.props.form.getFieldsValue();
			fieldVal.id = document.getElementById('id').value;
			fieldVal.name = document.getElementById('name').value;
			fieldVal.company = document.getElementById('company').value;
			fieldVal.bank = document.getElementById('bank').value;
			fieldVal.bank_account = document.getElementById('bank_account').value;
			fieldVal.fapiao = document.getElementById('title').value;
			fieldVal.comment = document.getElementById('comment').value;
		if(fieldVal.name.replace(/(^\s*)|(\s*$)/g, "") === ''){
			message.error('渠道名称必须填写!');
			return;
		}

		this.fetch(rootURL + '/channel/update/' + fieldVal.id,function(resp){
			if(resp.status === 'success'){
				if(_this.isMounted()){
					
					ModalSuccess('提示','修改成功!');

					document.getElementById('query').click();
					
					_this.props.init();
				}
			}else{

				message.error(resp.info);
			}
			
		},function(){
			message.error('修改失败');
		},fieldVal);

	},
	handleCancel:function(){
		this.props.form.resetFields();
		this.props.init();
	},
	hidden:function(){
		this.props.init();
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
    nameChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			name : e.target.value ,
         		company : _this.state.params.company,
         		bank : _this.state.params.bank,
         		bank_account : _this.state.params.bank_account,
         		fapiao : _this.state.params.fapiao,
         		comment : _this.state.params.comment
    		}
    	})
    },
    companyChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			name : _this.state.params.name ,
         		company : e.target.value,
         		bank : _this.state.params.bank,
         		bank_account : _this.state.params.bank_account,
         		fapiao : _this.state.params.fapiao,
         		comment : _this.state.params.comment
    		}
    			
    	})
    },
    bankChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			name : _this.state.params.name ,
         		company : _this.state.params.company,
         		bank : e.target.value,
         		bank_account : _this.state.params.bank_account,
         		fapiao : _this.state.params.fapiao,
         		comment : _this.state.params.comment
    		}
    			
    	})
    },
    bank_accountChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			name :_this.state.params.name ,
         		company : _this.state.params.company,
         		bank : _this.state.params.bank,
         		bank_account : e.target.value,
         		fapiao : _this.state.params.fapiao,
         		comment : _this.state.params.comment
    		}
    			
    	})
    },
    titleChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			name : _this.state.params.name ,
         		company : _this.state.params.company,
         		bank : _this.state.params.bank,
         		bank_account : _this.state.params.bank_account,
         		fapiao : e.target.value,
         		comment : _this.state.params.comment
    		}
    			
    	})
    },
    commentChange:function(e){
    	const _this = this;

    	this.setState({
    		params:{
    			id:_this.state.params.id,
    			name : _this.state.params.name ,
         		company : _this.state.params.company,
         		bank : _this.state.params.bank,
         		bank_account : _this.state.params.bank_account,
         		fapiao : _this.state.params.fapiao,
         		comment : e.target.value
    		}
    			
    	})
    },
    componentWillReceiveProps(nextProps) {
         this.setState({
         	params :{
         		id:nextProps.tableToModal.id,
         		name : nextProps.tableToModal.name,
         		company : nextProps.tableToModal.company,
         		bank : nextProps.tableToModal.bank,
         		bank_account : nextProps.tableToModal.bank_account,
         		fapiao : nextProps.tableToModal.fapiao,
         		comment : nextProps.tableToModal.comment
         	} 
         }) 
    },
	render:function(){
		const { getFieldProps } = this.props.form;
		return (
			<Modal ref="modal"
		           visible={this.props.visible} 
		           title="修改第三方" 
		           maskClosable = { this.state.maskClosable }
		           onCancel={this.hidden}
		           footer={[
		            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
		            <Button key="submit" type="primary" size="large"  onClick={this.handleOk}>
		              提 交
		            </Button>,
		          ]}
		        >
		          <Form horizontal  onSubmit={this.handleSubmit}>
			        <FormItem required  
			        		 label="渠道名称">
			          <input style={{ display:'none' }}  {...getFieldProps('id')} value={this.state.params.id} />
			          <Input placeholder="请输入渠道名称" {...getFieldProps('name')} value={this.state.params.name} onChange={this.nameChange}/>
			        </FormItem>
			        <FormItem label="公司名称">
			          <Input placeholder="请输入公司名称"  {...getFieldProps('company')} value={this.state.params.company} onChange={this.companyChange}/>
			        </FormItem>
			        <FormItem label="银行名称">
			          <Input placeholder="请输入银行名称"  {...getFieldProps('bank')} value={this.state.params.bank} onChange={this.bankChange}/>
			        </FormItem>
			        <FormItem label="银行账户">
			          <Input placeholder="请输入银行账户" {...getFieldProps('bank_account')} value={this.state.params.bank_account} onChange={this.bank_accountChange}/>
			        </FormItem>
			        <FormItem label="发票抬头">
			          <Input placeholder="请输入发票抬头" {...getFieldProps('title')} value={this.state.params.fapiao} onChange={this.titleChange}/>
			        </FormItem>
			        <FormItem label="备注">
			          <Input type="textarea" placeholder="请填写备注" {...getFieldProps('comment')} value={this.state.params.comment} onChange={this.commentChange}/>
			        </FormItem>
			      </Form>
		    </Modal>
		)
	}
})

ModalUpdate = Form.create()(ModalUpdate)




var ChannelManage = React.createClass({
	getInitialState() {
	    return {
	        filterparams : {} ,
	        updateParams : {} ,
	        loading:true,
	        visible:false
	    };
	},
	filterParam:function(params){
		this.setState({
			filterparams : params
		})
	},
	fromModal:function(params){
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
	toTable:function(){
		this.setState({
			filterparams : {}
		})
	},
	render:function() {
		return (
			<div>
				<Spin spinning={ this.state.loading }>
					<Banner noticeTable = { this.filterParam }/>
					<TableContent params={ this.state.filterparams } filterParam={ this.filterParam } modalToParent={ this.fromModal } loadingTo={ this.setLoading }/>
					<ModalUpdate visible={ this.state.visible } tableToModal={ this.state.updateParams } init={ this.init } toTable={this.toTable}/>
				</Spin>
			</div>
			
		)
	}
})



export default ChannelManage;
