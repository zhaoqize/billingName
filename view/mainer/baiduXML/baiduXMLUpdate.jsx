import { Select, 
		 Form, 
		 Input , 
		 Button, 
		 Icon, 
		 DatePicker,
		 Row, 
		 Col} from 'antd';
import reqwest from 'reqwest';
import {Link} from 'react-router';

import { ModalSuccess, 
         ModalError} from '../../component/index';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;


//计费名信息

var BillingNameInfo = React.createClass({
	getInitialState() {
	    return {
	        guess_channel:''  
	    };
	},
	fetch:function(url,callbackone,callbacktwo){
      reqwest({
        url:url,
        method: 'get',
        type: 'json'
      }).then(result => {
          callbackone(result);
        },function(){
          callbacktwo();
        }
      )
  	},
	componentDidMount:function(){
		const  _this = this;
		this.fetch(rootURL + '/business/BaiduXML/guess-next-parent',function(result){
			if(result.status === 'success'){
				_this.setState({
					guess_channel:result.data
				})
			}
		},function(){

		})
	},
	render:function () {
		const { getFieldProps } = this.props.localForm;

		const formItemLayout = {
	      labelCol: { span: 5 },
	      wrapperCol: { span: 8 },
	    };

	    const nameProps = getFieldProps('info_name',{
	      rules: [
	        { required: true, whitespace: true, message: '请填写计费名' }
	      ],
	      initialValue:this.state.guess_channel
	    }
	    );

	    //新增
		if(this.props.localState.type === "add"){
			return (
				<div id="billingnameInfo">
					<h2 style={{ marginTop:20,marginLeft:20 }}>计费名信息</h2>
					<Row>
						<Col lg={{ span:9 }} sm={{ span:16 }}>
							<Form horizontal  style={{ margin:'10px 0 20px 20px' }} form={this.props.localForm}>
						        <FormItem label="所属广告类型" {...formItemLayout} >
						          { this.props.localState.adtype }

						          <Input type="text" style={{ display:'none' }} value='BaiduXML' {...getFieldProps('info_adtype',{ initialValue:'BaiduXML' })}/>
						        </FormItem>
						        <FormItem label="计费名"  {...formItemLayout}>
						          <Input type="text" {...nameProps} placeholder="请填写计费名"/>
						        </FormItem>
						        <FormItem label="备注" labelCol={ {span: 5} } wrapperCol={ {span: 15} }>
						        	<Input type="textarea"  autoComplete="off" placeholder="请填写备注" {...getFieldProps('info_comment')} style={{ height:100 }}/>
						        </FormItem>
					      	</Form>
					    </Col>
					</Row>
		      	</div>
			)
			return;
		}

		//修改
		if(this.props.localState.type === "update"){
			return (
				<div>
					<h2 style={{ marginTop:20,marginLeft:20 }}>计费名信息</h2>
					<Row>
						<Col lg={{ span:9 }} sm={{ span:16 }}>
							<Form horizontal  style={{ margin:'10px 0 20px 20px' }}>
						        <FormItem label="所属广告类型" {...formItemLayout} >
						          { this.props.localState.adtype }

						          <Input type="text" style={{ display:'none' }} {...getFieldProps('info_adtype',{ initialValue:'BaiduXML' })}/>
						        </FormItem>
						        <FormItem  label="计费名" {...formItemLayout}>
						          { this.props.localState.name }

						          <Input type='text'  style={{ display:'none' }} {...getFieldProps('info_name',{ initialValue:this.props.localState.name })} />
						        </FormItem>
						        <FormItem label="备注" labelCol={ {span: 5} } wrapperCol={ {span: 15} }>
						        	<Input type="textarea"   placeholder="请填写备注" {...getFieldProps('info_comment',{ initialValue:this.props.localState.comment })} style={{ height:100 }}/>
						        </FormItem>
						        
					      	</Form>
					     </Col>
					</Row>
		      	</div>
			)
			return;
		}
	}
})



var PlatForm = React.createClass({
	getInitialState() {
	    return {
	        connectdata : [] 
	    };
	},
	getDefaultProps() {
      return {
      	 today:(new Date()).toLocaleDateString().replace(/\//g,'-')
      };
  	},
  	remove(e) {
	    var data = this.state.connectdata;
	    data.splice(e.target.getAttribute('data-index'),1);
	    
	    this.setState({
	    	connectdata :  data
	    })

	    
  	},
	add() {
	   var newdata = this.state.connectdata.concat({
	   		line : '',
	   	 	comment : '',
	   	 	endTime : this.props.today,
	   	 	startTime : this.props.today
	   })

	   this.setState({
	   	 connectdata : newdata
	   })
	   
	},
    fetch:function(url,method,callbackone,callbacktwo,data){
		reqwest({
			url:url,
			method: method,
			data:data,
	    	type: 'json'
		}).then(result => {
			callbackone(result);
		},function(){
			callbacktwo();
		})
    	
    },
    componentDidMount:function(){
    	const _this = this;

		//[添加] 
		if(_this.props.localState.type === 'add'){
			_this.setState({
				connectdata : [{
					line : '',
			   	 	startTime : _this.props.today,
			   	 	endTime : _this.props.today,
			   	 	comment :''
				}]
			})
		}

		//[修改]需拉取计费名下已经关联的平台 http://bnm.stnts.dev/business/BaiduXML/6/line-records
		if(_this.props.localState.type === 'update'){
			_this.fetch(rootURL + '/business/BaiduXML/' + _this.props.localState.id + '/line-records','get',function(result){
				
				if(result.status === 'success'){

					if(result.data.length){
						var newData = [];

						for(var i=0;i<result.data.length;i++){
							newData.push({
								line:result.data[i].line,
								startTime:result.data[i].start,
								endTime:result.data[i].expire,
								comment:result.data[i].comment,
							})
						}

						_this.setState({
							connectdata : newData
						})

					}else{
						_this.setState({
							connectdata:[{
								line:'',
								startTime:_this.props.today,
								endTime:_this.props.today,
								comment:''
							}]
						})
					}

				}else{
					console.log('提示','拉取改计费名下已经关联的平台失败!');
				}

			},function(){
				console.log('提示','拉取改计费名下已经关联的平台失败!');
			})
		}
	},
	render:function(){
		const { getFieldProps } = this.props.localForm;

		var stateconnectdata  = this.state.connectdata,
			genTr = [],
			i;
	    	
	    //生产表格

	    for(i = 0;i < stateconnectdata.length;i ++){
	    	
    		genTr.push(
    			<tr key={ i+1 } style={{ borderBottom: '1px solid #E9E9E9' }}>
					<td>{i+1}</td>
					<td>
						<Select style={{ width: 130 }}  {...getFieldProps('line_name_' + i,{ initialValue:stateconnectdata[i].line })}>
							<Option key="online">淘金</Option>
							<Option key="offline">线下</Option>
						</Select></td>
					<td>
						<DatePicker  format="yyyy-MM-dd" style={{ width: 130}} {...getFieldProps('line_start_' + i,{ initialValue: stateconnectdata[i].startTime })} /></td>
					<td>
						<DatePicker   format="yyyy-MM-dd" style={{ width: 130}} {...getFieldProps('line_expire_' + i,{ initialValue: stateconnectdata[i].endTime })} /></td>
					<td>
						<Input type="textarea"   placeholder="请填写备注" {...getFieldProps('line_comment_' + i,{ initialValue: stateconnectdata[i].comment })} /></td>
					<td>
						<a onClick={ this.remove } data-index={ i } style={{ textDecoration: 'underline' }}>删除</a></td>
				</tr>
			);
	    }

		return (
			<div style={{ border:'1px solid #E9E9E9',borderWidth:'1px 0 0 0' }}>
				<div style={{ marginBottom:20 }}>
					<h2 style={{ display:'inline-block',marginTop:20,marginLeft:20 }}>选择投放平台</h2>
					<Button type="ghost" onClick={this.add} style={{ marginLeft:20 }}><Icon type="plus" />添加投放平台</Button>
				</div>
				<table style={{ marginLeft:20,width:'98%',textAlign:'center',marginBottom:20,borderCollapse:'collapse' }} >
						<thead>
							<tr style={{ height:40,backgroundColor:'#F7F7F7' }}>
								<td style={{ width:'5%' }}>序号</td>
								<td style={{ width:'16%' }}>选择投放平台</td>
								<td style={{ width:'17%' }}>有效期开始时间</td>
								<td style={{ width:'17%' }}>有效期结束时间</td>
								<td style={{ width:'17%' }}>备注</td>
								<td style={{ width:'17%' }}>操作</td>
							</tr>
						</thead>
						<tbody>
							{ genTr }
						</tbody>
				</table>
				
			</div>
		)
	}
})



//渠道添加

var AddChannel = React.createClass({
	getInitialState() {
	    return {
	        channel : [],
	        connectdata : [] 
	    };
	},
	getDefaultProps() {
      return {
      	 today:(new Date()).toLocaleDateString().replace(/\//g,'-')
      };
  	},
	remove(e) {
	    var data = this.state.connectdata;
	    data.splice(e.target.getAttribute('data-index'),1);
	    
	    this.setState({
	    	connectdata :  data
	    })
  	},
	add() {
	   var newdata = this.state.connectdata.concat({
	   		channel : '',
	   		line : '',
	   	 	comment : '',
	   	 	endTime : this.props.today,
	   	 	startTime : this.props.today
	   })

	   this.setState({
	   	 connectdata : newdata
	   })

	},
    fetch:function(url,method,callbackone,callbacktwo,data){
    	if(data){
    		reqwest({
				url:url,
				method: method,
				data:data,
		    	type: 'json'
			}).then(result => {
				callbackone(result);
			},function(){
				callbacktwo();
			})
    	}else{
    		reqwest({
				url:url,
				method: method,
		    	type: 'json'
			}).then(result => {
				callbackone(result);
			},function(){
				callbacktwo();
			})
    	}
    	
    },   
    componentDidMount:function(){
    	const _this = this;
		//拉渠道数据
		this.fetch(rootURL + '/channel/simple','get',function(result){

			if(_this.isMounted()){
				_this.setState({
					channel : result.data
				})
			}
		},function(){
			ModalError('提示','拉取渠道数据失败!');
		});

		//[添加]
		if(this.props.localState.type === 'add'){
			this.setState({
				connectdata : [{
					channel : '',
					line : '',
			   	 	comment : '',
			   	 	endTime : this.props.today,
			   	 	startTime : this.props.today
				}]
			})
		}

		//[修改]需拉取计费名下已经关联的数据 http://bnm.stnts.dev/business/BaiduXML/6/relations
		if(this.props.localState.type === 'update'){
			this.fetch(rootURL + '/business/BaiduXML/' + this.props.localState.id + '/relations','get',function(result){

				if(result.status === 'success'){

					if(result.data.length){
						var newData = [];

						for(var i=0; i<result.data.length;i++){
							newData.push({
								channel : result.data[i].channel_id,
								line : result.data[i].line,
						   	 	comment : result.data[i].comment,
						   	 	endTime : result.data[i].expire,
						   	 	startTime : result.data[i].start,
							})
						}

						if(_this.isMounted()){
							_this.setState({
								connectdata : newData
							})
						}
					}else{

						_this.setState({
							connectdata:[{
								channel : '',
								line : '',
						   	 	comment : '',
						   	 	endTime : _this.props.today,
						   	 	startTime : _this.props.today
							}]
						})
					}

				}else{
					console.log("拉关联失败!")
				}

			},function(){
				console.log('提示','拉取改计费名下已经关联的渠道失败!');
			})
		}
	},
	render:function(){
		
		const { getFieldProps } = this.props.localForm;

		var stateconnectdata = this.state.connectdata ,
			genTr = [],
			i,
	    	channel = [];

	    for (i = 0; i < this.state.channel.length; i ++) {
	    	
	        channel.push(<Option key={ this.state.channel[i].id } title={this.state.channel[i].name}>
	        				{this.state.channel[i].name}</Option>);
	    }

	    //生产表格
	    for(i = 0;i < stateconnectdata.length;i ++){
	    	
    		genTr.push(
    			<tr key={ i+1 } style={{ borderBottom: '1px solid #E9E9E9' }}>
					<td>{i+1}</td>
					<td>
						<Select showSearch 
                  				optionFilterProp="children"
                  				notFoundContent="无法找到" style={{ width: 130 }}  {...getFieldProps('channel_channel_' + i,{ initialValue: this.state.connectdata[i].channel })}  >
							{ channel }
						</Select></td>
					 <td>
			            <Select  style={{ width: 130 }}  {...getFieldProps('channel_line_' + i,{ initialValue: this.state.connectdata[i].line+'' })}  >
			              <Option key="online">淘金</Option>
			              <Option key="offline">线下</Option>
			            </Select></td>
					<td>
						<DatePicker  format="yyyy-MM-dd" style={{ width: 130}}  {...getFieldProps('channel_startTime_' + i,{ initialValue: this.state.connectdata[i].startTime })}  /></td>
					<td>
						<DatePicker  format="yyyy-MM-dd" style={{ width: 130}}  {...getFieldProps('channel_endTime_' + i,{ initialValue: this.state.connectdata[i].endTime })} /></td>
					<td>
						<Input type="textarea" ref={'comment'+i}  placeholder="请填写备注"  {...getFieldProps('channel_comment_' + i,{ initialValue: this.state.connectdata[i].comment })} /></td>
					<td>
						<a onClick={ this.remove } data-index={ i } style={{ textDecoration: 'underline' }}>删除</a></td>
				</tr>
			);
	    }

		return (
			<div style={{ border:'1px solid #E9E9E9',borderWidth:'1px 0 0 0' }}>
				<div style={{ marginBottom:20 }}>
					<h2 style={{ display:'inline-block',marginTop:20,marginLeft:20 }}>新增关联渠道</h2>
					<Button type="ghost" onClick={this.add} style={{ marginLeft:20 }}><Icon type="plus" />添加渠道</Button>
				</div>
				<table style={{ marginLeft:20,width:'98%',textAlign:'center',marginBottom:20,borderCollapse:'collapse' }} >
						<thead>
							<tr style={{ height:40,backgroundColor:'#F7F7F7' }}>
								<td style={{ width:'5%' }}>序号</td>
								<td style={{ width:'16%' }}>选择关联渠道</td>
								<td style={{ width:'17%' }}>选择投放平台</td>
								<td style={{ width:'17%' }}>有效期开始时间</td>
								<td style={{ width:'17%' }}>有效期结束时间</td>
								<td style={{ width:'17%' }}>备注</td>
								<td style={{ width:'17%' }}>操作</td>
							</tr>
						</thead>
						<tbody>
							{ genTr }
						</tbody>
				</table>
				
			</div>
		)
	}
})



var BillingNameUpdate = React.createClass({
	formatData:function(obj){

		var allObj = {
			relation : [],
			//line : []
		};
		var info = [],
			relation = [];
			//line = [];

		for(var ele in obj){
			if(ele.indexOf('info') > -1){
				info.push(ele)
			}else

			if(ele.indexOf('channel') > -1){
				relation.push(ele)
			}
			// else

			// if(ele.indexOf('line') > -1){
			// 	line.push(ele)
			// }
		}
		
		for(var i = 0; i < info.length; i++){

			if(info[i].indexOf('name') > -1){
				allObj.name = obj[info[i]];
			}

			if(info[i].indexOf('comment') > -1){
				allObj.comment = obj[info[i]];
			}
		}
		

		// for(var i = 0; i < line.length; i++){

		// 	var index = line[i].substring(line[i].lastIndexOf('_')+1,line[i].length);
			
		// 	if(line[i].indexOf('name_'+index) > -1){
		// 		allObj.line[index] = {line : obj[line[i]]}
		// 	}
			
		// 	if(line[i].indexOf('start_'+index) > -1){
		// 		if(allObj.line[index]){
		// 			allObj.line[index].start = toString.call(obj[line[i]]) === '[object String]'?obj[line[i]]:obj[line[i]].toLocaleDateString();
		// 		}
		// 	}

		// 	if(line[i].indexOf('expire_'+index) > -1){
		// 		if(allObj.line[index]){
		// 			allObj.line[index].expire = toString.call(obj[line[i]]) === '[object String]'?obj[line[i]]:obj[line[i]].toLocaleDateString();
		// 		}
		// 	}

		// 	if(line[i].indexOf('comment_'+index) > -1){
		// 		if(allObj.line[index]){
		// 			allObj.line[index].comment = obj[line[i]];
		// 		}
		// 	}
			
			
		// }


		for(var i = 0; i < relation.length; i++){

			var index = relation[i].substring(relation[i].lastIndexOf('_')+1,relation[i].length);
			
			if(relation[i].indexOf('channel_'+index) > -1){
				allObj.relation[index] = {channel_id : obj[relation[i]]};
				continue;
			}

			if(relation[i].indexOf('line_'+index) > -1){
				if(allObj.relation[index]){
					allObj.relation[index].line = obj[relation[i]];
					continue;
				}
      		}
			
			if(relation[i].indexOf('startTime_'+index) > -1){
				if(allObj.relation[index]){
					allObj.relation[index].start = toString.call(obj[relation[i]]) === '[object String]'?obj[relation[i]]:obj[relation[i]].toLocaleDateString();
					continue;
				}
			}

			if(relation[i].indexOf('endTime_'+index) > -1){
				if(allObj.relation[index]){
					allObj.relation[index].expire = toString.call(obj[relation[i]]) === '[object String]'?obj[relation[i]]:obj[relation[i]].toLocaleDateString();
					continue;
				}
			}

			if(relation[i].indexOf('comment_'+index) > -1){
				if(allObj.relation[index]){
					allObj.relation[index].comment = obj[relation[i]];
					continue;
				}
			}
			
			
		}

		if(this.props.location.state.type === 'update'){
			allObj.id = this.props.location.state.id;
		}

		console.log(allObj);

		return allObj;


	},
	store:function(e){
		const _this = this;

		var allObj = _this.formatData(_this.props.form.getFieldsValue());

		var url = _this.props.location.state.type === 'add'? '/business/BaiduXML/store' : '/business/BaiduXML/update/' + _this.props.location.state.id ;

		_this.fetch(rootURL + url,function(result){
			if(result.status === 'success'){

				if(_this.props.location.state.type === 'add'){
					ModalSuccess('提示','添加成功!');
				}else{
					ModalSuccess('提示','修改成功!');
				}

				window.history.go(-1);
			}else{

				if(_this.props.location.state.type === 'add'){
					ModalError('提示',result.info[0].name || result.info);
				}else{
					ModalError('提示',result.info[0].name || result.info);
				}
			}
		},function(){
			if(_this.props.location.state.type === 'add'){
					ModalError('提示','请求失败!');
				}else{
					ModalError('提示','请求失败!');
				}
		},allObj)
	},
	goBack:function(){
		window.history.go(-1);
	},
	fetch:function(url,callbackone,callbacktwo,obj){
		reqwest({
			url:url,
			method: 'post',
			data:obj,
	    	type: 'json'
		}).then(result => {
			callbackone(result);
		},function(){
			callbacktwo();
		})
	},
	render(){
		return(
			<div>
				<div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}>
					<h3 style={{ margin:'20px 0 20px 20px' }}>业务 > 百度XML { this.props.location.state.type === "add"?"> 新增计费名":"> 修改计费名" }</h3>
				</div>
				<BillingNameInfo localState={ this.props.location.state } localForm={ this.props.form }/>
				
				<AddChannel localState={ this.props.location.state } localForm={ this.props.form }/>
				<Button type="primary" onClick={ this.store } style={{ marginLeft:20 }}>确定</Button>
				<Button type="ghost" onClick={ this.goBack } style={{ marginLeft:20 }}>取消</Button>
			</div>
		)
	}
})

BillingNameUpdate = Form.create()(BillingNameUpdate)

export default BillingNameUpdate;
