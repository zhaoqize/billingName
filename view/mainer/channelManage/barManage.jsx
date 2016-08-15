
import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon, 
		 Modal ,
		 Spin,
		 Table,
		 DatePicker} from 'antd';
import {Link} from 'react-router';
import reqwest from 'reqwest';

import { ModalSuccess,
		 ModalError,
		 ModalWarn} from '../../component/index';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

var batchOperStyle = {
	del : 'none'
};


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
		ReactDOM.findDOMNode(this.refs.export_agent).value = forms.agent?forms.agent:'';
		ReactDOM.findDOMNode(this.refs.export_netbar).value = forms.netbar?forms.netbar:'';
		ReactDOM.findDOMNode(this.refs.export_ip).value = forms.ip?forms.ip:'';
		ReactDOM.findDOMNode(this.refs.export_yileyoo_id).value = forms.yileyoo_id?forms.yileyoo_id:'';
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
	       			  </Option>
	       			  );
	    }

		return (
			<div>
				<Form inline onSubmit={this.handleSubmit} style={{ margin:'20px 0 20px 20px ',display:'inline-block' }}>
			        <FormItem label="网吧状态">
			          <Select showSearch style={{ width: 100 }} {...getFieldProps('status',{ initialValue:this.props.locaState?'all':'use' })} placeholder="启用" >
			            <Option key='all'>全部</Option>
			            <Option key='use'>启用</Option>
			            <Option key='deleted'>已删除</Option>
			          </Select>
			        </FormItem>
			        <FormItem label="第三方名称">
			          <Select showSearch 
	                  		  notFoundContent="无法找到"
	                  		  optionFilterProp="children" style={{ width: 120 }} {...getFieldProps('channel',{ initialValue: this.props.locaState?this.props.locaState.id + '':'' })} placeholder="请填写第三方名称" >
			            { third }
			          </Select>
			        </FormItem>
			        <FormItem label="代理商名称">
			          <Select showSearch 
	                  		  notFoundContent="无法找到"
	                  		  optionFilterProp="children" style={{ width: 120 }} {...getFieldProps('agent',{ initialValue: this.props.locaState?this.props.locaState.channel_id + '':'' })} placeholder="代理商名称" >
			           { agent }
			          </Select>
			        </FormItem>
			        <FormItem label="网吧名称/ID">
			          <Input style={{ width: 100 }} type="text" {...getFieldProps('netbar')} placeholder="请填写网吧名称/ID"/>
			        </FormItem>
			        <FormItem label="注册IP">
			          <Input style={{ width: 100 }} type="text" {...getFieldProps('ip')} placeholder="请填写注册IP"/>
			        </FormItem>
			        <FormItem label="易乐游ID">
			          <Input style={{ width: 100 }} type="text" {...getFieldProps('yileyoo_id')} placeholder="请填写易乐游ID"/>
			        </FormItem>
			        <Button type="primary" htmlType="submit" style={{ marginLeft:20 }} id="query">查询</Button>
			        <Button type="default" onClick={this.handleReset} style={{ marginLeft:20 }} >重置</Button>
		        </Form>
		        <form style={{ display:'inline-block' }} action={ rootURL + "/netbar/export"}  method="get">
				    <input type="text" name="status" ref='export_status' className='antd-hidden'/>
				    <input type="text" name="channel" ref='export_channel' className='antd-hidden'/>
		  			<input type="text" name="agent" ref='export_agent' className='antd-hidden'/>
		  			<input type="text" name="netbar" ref='export_netbar' className='antd-hidden'/>
		  			<input type="text" name="ip" ref='export_ip' className='antd-hidden'/>
		  			<input type="text" name="yileyoo_id" ref='export_yileyoo_id' className='antd-hidden'/>
				    <Button type="default" htmlType="submit" style={{ marginLeft:20 }} >导出</Button>
				</form>
			</div>
		)
	}
})

FilterForm = Form.create()(FilterForm)


var Banner = React.createClass({
	render:function() {
		return (
			<div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}>
				<h3 style={{ margin:'20px 0 20px 20px',display:'inline-block' }}>渠道 > 网吧渠道管理</h3>
	        </div>
		)
	}
})



var TableContent = React.createClass({
	getInitialState() {
		
	    return {
	        url:rootURL + '/netbar/index'  ,
	        selectedRowKeys: [] , 
	        params:{ //给分页点击使用 保存筛选数据
	        	status:this.props.locaState?'all':'',
	        	channel:this.props.locaState?this.props.locaState.id:'',
	        	agent:this.props.locaState?this.props.locaState.channel_id:'',
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
	filterParam:function(params){
    	const _this = this;

    	var filters = {
    		status:params.status,
    		channel:params.channel,
    		ip:params.ip,
    		netbar:params.netbar,
    		yileyoo_id:params.yileyoo_id,
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
    	 channel:_this.state.params.channel,
		 ip:_this.state.params.ip,
		 netbar:_this.state.params.netbar,
		 yileyoo_id:_this.state.params.yileyoo_id,
    	 name:_this.state.params.name,
    	 per_page: pagination.pageSize,
      	 page: pagination.current
    	},
    	'get')
    },
	onSelectChange(selectedRowKeys) {
	    this.setState({ selectedRowKeys });
    },
    //删除
    deleted:function(channelId, index){
    	const _this = this;
    	return () =>{

    		confirm({
				    title: '警告',
				    content: '确认要删除？',
				    onOk() {
				       del();
				    }
			  	});

	    	var del = function(){
	    		_this.fetch(rootURL + '/netbar/destroy/' + channelId,function(result){
	    			if(result.status === 'success'){
	    				ModalSucces('提示','删除成功!');

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

    	if(_this.state.selectedRowKeys.length){
    		confirm({
				    title: '警告',
				    content: '确认要批量删除？',
				    onOk() {
				       del();
				    }
			  	});
    	}else{
    		ModalWarn('提示','请先选择!');
    		return;
    	}

    	var del = function(){
	    	_this.fetch(rootURL + '/netbar/destroy',function(result){
				if(result.status === 'success'){
					ModalSucces('提示','批量删除成功!');
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

    	if(total < 1 ){
    		refs_del.style.cssText = 'display:none;margin-left:20px';
    	}else if(this.state.params.status === 'deleted'){
    		refs_del.style.cssText = 'display:none;margin-left:20px';
    	}else{
    		refs_del.style.cssText = 'display:inline-block;margin-left:20px';
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
		
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	      getCheckboxProps:function(record){
			  	if((record.channel_deleted_at || record.agent_deleted_at || record.deleted_at)){
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

		const columns = [{
				  title: '网吧编号',
				  dataIndex: 'id',
			  }, {
			  	  title: '所属代理商',
				  dataIndex: 'agent_name'
			  }, {
			  	  title: '所属第三方渠道',
				  dataIndex: 'channel_name'
			  },{
				  title: '网吧名称',
				  dataIndex: 'name'
			  }, {
			      title: '58特权ID',
			      dataIndex: 'privilege_id'
			  }, {
			      title: '易乐游ID',
			      dataIndex: 'yileyoo_id',
			  }, {
			      title: '所在地域',
			      dataIndex: 'city_id',
			  },{
			      title: '注册IP',
			      dataIndex: 'ip',
			  },{
			      title: '最近活跃时间',
			      dataIndex: 'active_time',
			  },{
			      title: '创建时间',
			      dataIndex: 'created_at',
			  },{
			      title: '状态',
			      dataIndex: 'status',
			      render:function(text, record, index){
			      	if(record.channel_deleted_at || record.agent_deleted_at || record.deleted_at){
			      		return  '已删除';
			      	}else{
			      		return  '启用';
			      	}
			      	
			      }
			  },{
			      title: 'channel_deleted_at',
			      dataIndex: 'channel_deleted_at',
			      className: 'antd-hidden'
			  },{
			      title: 'agent_deleted_at',
			      dataIndex: 'agent_deleted_at',
			      className: 'antd-hidden'
			  },{
			      title: 'deleted_at',
			      dataIndex: 'deleted_at',
			      className: 'antd-hidden'
			  },{
			  	  title:'操作',
			  	  dataIndex: 'operations',
			  	  render:function (text, record, index) {
			  	  	 var deleteStyle = '';
			  	  	 if(record.channel_deleted_at || record.agent_deleted_at || record.deleted_at){
			            deleteStyle  = 'none';
			         }else{
			         	deleteStyle  = 'inline-block';
			         }

			  	  	 return <a onClick={ _this.deleted(record.id,index) } style={{ textDecoration:'underline',display:deleteStyle }}>删除</a>
			  	  }
			  }];

		return (
			<div>
				<FilterForm filterParam={ this.filterParam } locaState={ this.props.locaState }/>
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
					<Button onClick={ this.batchDelete } ref="del" key="delete" type="primary"  style={{ marginLeft:20,display:batchOperStyle.del }}>批量删除</Button>
				</div>
			</div>
		)
	}
})



var barManage = React.createClass({
	getInitialState() {
	    return {
	        filterparams : {} ,
	        loading:true
	    };
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
					<TableContent params={ this.state.filterparams } locaState={ this.props.location.state } loadingTo={ this.setLoading }/>
				</Spin>
			</div>
			
		)
	}
})



export default barManage;
