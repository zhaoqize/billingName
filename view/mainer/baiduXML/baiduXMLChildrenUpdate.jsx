import React from 'react';
import { Select, Form, Input , Button, Icon, DatePicker} from 'antd';
import reqwest from 'reqwest';
import {Link} from 'react-router';
import $ from 'jquery';

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
	fetch:function(){
		//获取平台数据
		reqwest({
			url:'http://localhost:90/business/BaiduSearch/platform',
			method: 'get',
      		type: 'json'
		}).then(result => {
			this.setState({
				platform : result.data
			})
		})

	},
	componentDidMount:function(){
		this.fetch();
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
					<Form horizontal  style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
				        <FormItem label="所属广告类型" {...formItemLayout}>
				          { this.props.localState.adtype }
				        </FormItem>
				        <FormItem label="投放平台" {...formItemLayout} >
				          <Select style={{ width: 200 }} >
				           	{ platform }
				          </Select>
				        </FormItem>
				        <FormItem label="计费名"  {...formItemLayout}>
				          { this.props.localState.parent }
				        </FormItem>
				        <FormItem label="子计费名" {...formItemLayout}>
				          <Input type="text"/>
				        </FormItem>
				        <FormItem label="备注" {...formItemLayout}>
				        	<Input type="textarea"  autoComplete="off" />
				        </FormItem>
			      	</Form>
		      	</div>
			)
		}

		if(this.props.localState.type === "update"){
			return (
				<div>
					<h2>计费名信息</h2>
					<Form horizontal style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
				        <FormItem label="所属广告类型" {...formItemLayout}>
				          { this.props.localState.adtype }
				        </FormItem>
				        <FormItem label="投放平台" {...formItemLayout} >
				          <Select style={{ width: 200 }} defaultValue={ this.props.localState.platform } >
				           	{ platform }
				          </Select>
				        </FormItem>
				        <FormItem label="计费名" {...formItemLayout}>
				          { this.props.localState.parent }
				        </FormItem>
				        <FormItem label="子计费名" {...formItemLayout}>
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

let uuid = 0;

var AddChannel = React.createClass({
	getInitialState() {
	    return {
	        channel : {},
	        connectdata : []
	    };
	},
	remove(e) {
		console.log($(e.target).data("index"))
	    var data = this.state.connectdata;
	    data.splice($(e.target).data("index"),1);
	    console.log(data)
	    this.setState({
	    	connectdata : data
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

	   console.log()
	},
	submit(e) {
	    e.preventDefault();
	    document.getElementById('billingNameinfoBtn').click();
	    console.log(this.props.form.getFieldsValue());
    },
    fetch:function(){
    	//获取渠道数据
    	reqwest({
			url:'http://localhost:90/business/BaiduSearch/channel',
			method: 'get',
      		type: 'json'
		}).then(result => {
			this.setState({
				channel : result.data
			})
		})

		//获取计费名下相关联渠道数据 
		if(this.props.localState.type === 'update'){
			reqwest({
				url:'http://localhost:90/business/BaiduSearch/connectChannel',
				method: 'get',
	      		type: 'json'
			}).then(result => {
				this.setState({
					connectdata : result.data
				})
			})
		}else{
			this.setState({
					connectdata : [{
						channel : '',
				   	 	comment : '',
				   	 	endTime : '',
				   	 	statrTime : ''
					}]
			})
		}
    	
    },
    //提交
    submitData:function(){
    	var allData,
    		flag,
    		$channelRangeSel,
    		$channelRangeCal,
    		$channelRangeTex,
    		channels;


    	//构造计费名信息结果集
    	allData = {
    		adtype:"百度搜索",
    		platform:'',
    		name:'',
    		comment:''
    	}
    	allData.platform = $("#billingnameInfo .ant-select-selection-selected-value").text();
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
    			channels.channel.push($channelRangeSel.eq(i).text())
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

    	console.log(allData)
    	
    },
    updateData(formdata) {
	    reqwest({
	      //url: 'http://bnm.stnts.dev/billing-name/store?business_id=1&name='+ formdata.name +'&comment=' + formdata.comment,
	      url:'http://bnm.stnts.dev/billing-name/store/',
	      data:{
	        business_id:1,
	        name:formdata.name,
	        comment:formdata.comment,
	        _token:window._TOKEN
	      },
	      method: 'post',
	      type: 'json',
	    }).then(result => {

	      Modal.success({
	        title: '',
	        content: result.data,
	      });

	      setTimeout(function(){
	        document.getElementsByClassName('ant-confirm-btns')[0].firstChild.click()
	      },1500);

	    }, function (err, msg) {
	      if(err.status == 422){
	        var i,
	            ele,
	            msg = '',
	            msgObj = JSON.parse(err.responseText).info;
	        for(i = 0;i < msgObj.length; i++){
	           for(var ele in msgObj[i]){
	             msg += msgObj[i][ele]+'\n\n'
	           }
	        }
	        message.error(msg);
	      }

	    })
    },
    componentDidMount:function(){
		this.fetch();
	},
	goBack:function(){
		window.history.go(-1)
	},
	render:function(){
		 

	    let channel = [];
	    for (let i = 0; i < this.state.channel.length; i++) {
	        channel.push(<Option key={ this.state.channel[i].label }>{this.state.channel[i].label}</Option>);
	    }

	    //生产类似表格
	    //
	    console.log("render",this.state.connectdata)
	    var stateconnectdata = this.state.connectdata;
	    var genTr = [];

	    for(var i=0;i<stateconnectdata.length;i++){
	    	
    		genTr.push(
    			<tr key={ i+1 } style={{ borderBottom: '1px solid #E9E9E9' }}>
					<td>{i+1}</td>
					<td>
						<Select  style={{ width: 100 }} defaultValue={ stateconnectdata[i].channel }>{ channel }</Select></td>
					<td>
						<DatePicker defaultValue={ stateconnectdata[i].statrTime }  format="yyyy/MM/dd" style={{ width: 100}} /></td>
					<td>
						<DatePicker defaultValue={ stateconnectdata[i].endTime }  format="yyyy/MM/dd" style={{ width: 100}} /></td>
					<td>
						<Input type="textarea"  style={{ width: 100}} defaultValue={ stateconnectdata[i].comment } /></td>
					<td>
						<a onClick={ this.remove } data-index={ i }>删除</a></td>
				</tr>
    		);
	    }
	    

		return (
			<div>
				<div style={{ marginBottom:20 }}>
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
				<Button type="primary" onClick={ this.submitData} style={{ marginLeft:40+'%' }}>确定</Button>
				<Button type="primary" onClick={ this.goBack } style={{ marginLeft:1+'%' }}>取消</Button>
			</div>
		)
	}
})

AddChannel = Form.create()(AddChannel);




var BillingNameChildUpdate = React.createClass({

	render(){
		console.log(this.props.location.state)
		return(
			<div>
				<h3 style={{ margin:'15px 0 20px 20px' }}>业务 > 百度XML > { this.props.location.state.type === "add"?"新增计费名":"修改计费名" }</h3>
				<BillingNameInfo localState={ this.props.location.state } />
				<AddChannel localState={ this.props.location.state }/>
			</div>
		)
	}
})



export default BillingNameChildUpdate;