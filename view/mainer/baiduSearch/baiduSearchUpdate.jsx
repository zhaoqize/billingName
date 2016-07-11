import React from 'react';
import { Select, Form, Input , Button, Icon, DatePicker} from 'antd';
import reqwest from 'reqwest';
import {Link} from 'react-router';
import $ from 'jquery';

import modaltSuccess from '../../component/modalSuccess.jsx';
import modaltError from '../../component/modalError.jsx';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;


//计费名信息
var BillingNameInfo = React.createClass({
	getInitialState() {
	    return {
	        platform : {} 
	    };
	},
	fetch:function(url,method,callbackone,callbacktwo,data){
		reqwest({
			url:url,
			method: method,
	    	type: 'json'
		}).then(result => {
			callbackone(result.data);
		},function(){
			callbacktwo();
			console.log('ERROR');
		})
	},
	componentDidMount:function(){
		const _this = this;

    	//拉平台数据
		// this.fetch('','get',function(data){
		// 	if(_this.isMounted()){
		// 		_this.setState({
		// 			platform : data
		// 		})
		// 	}
		// },function(){
		// 	modaltError('提示','拉取平台数据失败!');
		// });
	},
	render:function () {
		const { getFieldProps } = this.props.form;
		const formItemLayout = {
	      labelCol: { span: 2 },
	      wrapperCol: { span: 2 },
	    };

	    let platform = [];
	    for (let i = 0; i < this.state.platform.length; i++) {
	        platform.push(<Option key={ this.state.platform[i].label }>{this.state.platform[i].label}</Option>);
	    }
	    
		if(this.props.localState.type === "add"){
			return (
				<div id="billingnameInfo">
					<h2>计费名信息</h2>
					<Form horizontal  style={{ marginLeft:'1%',marginBottom:'1%' }}>
				        <FormItem label="所属广告类型" {...formItemLayout} >
				          { this.props.localState.adtype }
				        </FormItem>
				        <FormItem label="投放平台" {...formItemLayout} >
				          <Select style={{ width: 200 }} placeholder="请选择平台" >
				           	<Option key='online'>淘金</Option>
				           	<Option key='offline'>线下</Option>
				          </Select>
				        </FormItem>
				        <FormItem label="计费名"  {...formItemLayout}>
				          <Input type="text" />
				        </FormItem>
				        <FormItem label="备注" {...formItemLayout}>
				        	<Input type="textarea"  autoComplete="off" placeholder="请填写备注" />
				        </FormItem>
			      	</Form>
		      	</div>
			)
		}

		if(this.props.localState.type === "update"){
			return (
				<div>
					<h2>计费名信息</h2>
					<Form horizontal  style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
				        <FormItem label="所属广告类型" {...formItemLayout} >
				          { this.props.localState.adtype }
				        </FormItem>
				        <FormItem label="投放平台" {...formItemLayout} >
				          <Select style={{ width: 200 }} defaultValue={ this.props.localState.platform } >
				           	<Option key='online'>淘金</Option>
				           	<Option key='offline'>线下</Option>
				          </Select>
				        </FormItem>
				        <FormItem label="计费名" {...formItemLayout}>
				          { this.props.localState.name }
				        </FormItem>
				        <FormItem label="备注" {...formItemLayout}>
				        	<Input type="textarea"  autoComplete="off" defaultValue={ this.props.localState.comment }/>
				        </FormItem>
			      	</Form>
		      	</div>
			)
		}
	}
})

BillingNameInfo = Form.create()(BillingNameInfo)


//表格自定义组件

//渠道map
var channelMap=[];

var AddChannel = React.createClass({
	getInitialState() {
	    return {
	        channel : {},
	        platform : {},
	        connectdata : [] ,
	        channelval : ''
	    };
	},
	getDefaultProps() {
      return {
      	 platformMap:{
      	 	'淘金':'online',
      	 	'线下':'offline'
      	 }
      };
  	},
	remove(e) {
	    var data = this.state.connectdata;
	    data.splice($(e.target).data("index"),1);
	    
	    this.setState({
	    	connectdata :  data
	    })
	    
  	},
	add() {
	   var newdata = this.state.connectdata.concat({
	   		channel : '',
	   	 	comment : '',
	   	 	endTime : '',
	   	 	statrTime : ''
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
				callbackone(result.data);
			},function(){
				callbacktwo();
				console.log('ERROR');
			})
    	}else{
    		reqwest({
				url:url,
				method: method,
		    	type: 'json'
			}).then(result => {
				callbackone(result.data);
			},function(){
				callbacktwo();
				console.log('ERROR');
			})
    	}
    	
    },
    //提交的数据格式化
    formatData:function(){
    	var allData,
    		flag,
    		$channelRangeSel,
    		$channelRangeCal,
    		$channelRangeTex,
    		channels;


    	//构造计费名信息结果集
    	allData = {
    		adtype:"BaiduSearch",
    		platform:'',
    		name:'',
    		comment:''
    	}

    	allData.platform = this.props.platformMap[$("#billingnameInfo .ant-select-selection-selected-value").text()];
    	allData.name = $("#billingnameInfo input").val();
    	allData.comment = $("#billingnameInfo textarea").val();

    	//构造渠道结果集
    	channels = {
    		channel:[],
    		startTime:[],
    		endTime:[],
    		comment:[]
    	};

    	$channelRangeSel = $('#channelRange .ant-select-selection-selected-value');
    	for(var i=0;i<$channelRangeSel.length;i++){ 
    		if($channelRangeSel.eq(i).text() !== ''){
    			channels.channel.push(channelMap[$channelRangeSel.eq(i).text()])
    		}
    	}

    	flag = true;
    	$channelRangeCal = $('#channelRange .ant-calendar-range-picker');
    	for(var i=0;i<$channelRangeCal.length;i++){ //ant-calendar-range-picker
    		
    		if(flag && $channelRangeCal.eq(i).val() !== ''){
    			channels.startTime.push($channelRangeCal.eq(i).val());
    			flag = false;
    		}else if(!flag && $channelRangeCal.eq(i).val() !== ''){
    			channels.endTime.push($channelRangeCal.eq(i).val());
    			flag = true;
    		}
    	}

    	$channelRangeTex = $('#channelRange textarea');
    	for(var i=0;i<$channelRangeTex.length;i++){
    		if($channelRangeTex.eq(i).val() !== ''){
    			channels.comment.push($channelRangeTex.eq(i).val())
    		}
    	}
    	allData.channel = channels;

    	console.log(JSON.stringify(allData));
    	return JSON.stringify(allData);
    },
    store:function(){
    	//增加
    	this.fetch('http://bnm.stnts.dev/business/BaiduSearch/store','post',function(){
    		modaltSuccess('提示','添加成功!');
    	},function(){
    		modaltError('提示','添加失败!');
    	},this.formatData());
    },
    componentDidMount:function(){
    	const _this = this;
		//拉渠道数据
		this.fetch('http://bnm.stnts.dev/channel/simple','get',function(data){
			if(_this.isMounted()){
				_this.setState({
					channel : data
				})

				//设置channelMap
				for(var i = 0;i < data.length;i++){
					channelMap[data[i].name] = data[i].id;
				}
			}
		},function(){
			modaltError('提示','拉取渠道数据失败!');
		});

		//[添加]
		if(this.props.localState.type === 'add'){
			this.setState({
				connectdata : [{
					channel : '',
			   	 	comment : '',
			   	 	endTime : '',
			   	 	statrTime : ''
				}]
			})
		}

		//[修改]需拉取计费名下已经关联的数据条
		if(this.props.localState.type === 'update'){
			this.fetch('','get',function(){
				if(_this.isMounted()){

					if(result.data.length){
						//拉到该计费名下有相关渠道
						_this.setState({
							connectdata : result.data
						})
					}else{
						//拉到该计费名下无相关渠道
						_this.setState({
							connectdata : [{
								channel : '',
						   	 	comment : '',
						   	 	endTime : '',
						   	 	statrTime : ''
							}]
						})
					}
					
				}
			},function(){
				modaltError('提示','拉取改计费名下已经关联的渠道失败!');
			})
		}
	},
	goBack:function(){
		window.history.go(-1);
	},
	render:function(){
		 
		var stateconnectdata,
			genTr,
			i,
	    	channel = [];

	    for (i = 0; i < this.state.channel.length; i ++) {
	        channel.push(<Option key={ this.state.channel[i].id }>{this.state.channel[i].name}</Option>);
	    }

	    //生产表格
	    stateconnectdata = this.state.connectdata;
	    genTr = [];

	    for(i = 0;i < stateconnectdata.length;i ++){
    		genTr.push(
    			<tr key={ i+1 } style={{ borderBottom: '1px solid #E9E9E9' }}>
					<td>{i+1}</td>
					<td>
						<Select style={{ width: 100 }} ref="selectA" defaultValue={ stateconnectdata[i].channel }>{ channel }</Select></td>
					<td>
						<DatePicker defaultValue={ stateconnectdata[i].statrTime }  format="yyyy/MM/dd" style={{ width: 100}} /></td>
					<td>
						<DatePicker defaultValue={ stateconnectdata[i].endTime }  format="yyyy/MM/dd" style={{ width: 100}} /></td>
					<td>
						<Input type="textarea"  style={{ width: 100}} defaultValue={ stateconnectdata[i].comment } placeholder="请填写备注"/></td>
					<td>
						<a onClick={ this.remove } data-index={ i } style={{ textDecoration: 'underline' }}>删除</a></td>
				</tr>
			);
	    }

		return (
			<div style={{ border:'1px solid #E9E9E9',borderWidth:'1px 0 0 0' }}>
				<div style={{ marginBottom:20,marginTop:10 }}>
					<h2 style={{ display:'inline-block' }}>新增关联渠道</h2>
					<Button type="primary" onClick={this.add} style={{ marginLeft:1+'%' }}><Icon type="plus" />添加渠道</Button>
				</div>
				<table style={{ marginLeft:'6%',width:'54%',textAlign:'center',marginBottom:20,borderCollapse:'collapse' }} id="channelRange">
						<thead>
							<tr style={{ height:40,backgroundColor:'#F7F7F7' }}>
								<td style={{ width:'5%' }}>序号</td>
								<td style={{ width:'16%' }}>选择关联渠道</td>
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
				<Button type="primary" onClick={ this.store} style={{ marginLeft:'20%' }}>确定</Button>
				<Button type="primary" onClick={ this.goBack } style={{ marginLeft:'10%' }}>取消</Button>
			</div>
		)
	}
})


var BillingNameUpdate = React.createClass({

	render(){
		console.log(this.props.location.state)
		return(
			<div>
				<h3 style={{ margin:'15px 0 20px 20px' }}>业务 > 百度搜索 { this.props.location.state.type === "add"?"> 新增计费名":"> 修改计费名" }</h3>
				<BillingNameInfo localState={ this.props.location.state } />
				<AddChannel localState={ this.props.location.state }/>
			</div>
		)
	}
})



export default BillingNameUpdate;