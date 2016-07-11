import React from 'react';
import { Modal, 
         Button, 
         Table, 
         Icon, 
         Input, 
         Form,
         Select,
         message,
         Cascader
       } from 'antd';
import reqwest from 'reqwest';
import {Link} from 'react-router';

import Paging from '../../component/table.jsx';

import '../../../resources/css/antd.css';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;


var FilterForm = React.createClass({
  getInitialState() {
      return {
          allFilter : {} ,
          name:[],
          channel:{} ,
          ad:{},
          platform:{},
          current_ad:{}
      };
  },
  handleSubmit(e) {
    e.preventDefault();
   
    var reciveData = this.props.form.getFieldsValue();
    var formatData = {
      channel:reciveData.channel,
      status:reciveData.status,
      name:reciveData.name[0],
      child:reciveData.name[1]
    }
    this.props.filterParam(formatData);
    console.log('处理后的表单值：', formatData);
  },
  fetch:function(url, callbackone, callbacktwo){
    var _this = this;

    reqwest({
      url:url,
      method: 'get',
      type: 'json',
    }).then(result =>{
      if(_this.isMounted()){
        callbackone(result.data);
      }
    },function(){
      callbacktwo();
      console.log("失败")
    })
  },
  componentDidMount() {
    var _this = this;
    //拉计费名
    this.fetch('http://localhost:90/business/BaiduXML/ad',function(data){
        _this.setState({
          name : data
        })
    },function(){
        alert('ERROR');
    });

    //拉渠道
    this.fetch('http://localhost:90/business/BaiduXML/ad',function(data){
        _this.setState({
          channel : data
        })
    },function(){
      alert('ERROR');
    });

    //拉广告位
    this.fetch('http://localhost:90/business/BaiduXML/ad',function(data){
        _this.setState({
          ad : data
        })
    },function(){
      alert('ERROR');
    });

    //拉平台
    this.fetch('http://localhost:90/business/BaiduXML/ad',function(data){
        _this.setState({
          platform : data
        })
    },function(){
      alert('ERROR');
    });

    //拉当前广告位
    this.fetch('http://localhost:90/business/BaiduXML/ad',function(data){
        _this.setState({
          current_ad : data
        })
    },function(){
      alert('ERROR');
    });
    
  },
  render:function(){
     const { getFieldProps } = this.props.form;

     //设置options
     let name = [],
         channel = [],
         ad = [],
         platform = [],
         current_ad = [];

     for (let i = 0; i < this.state.name.length; i++) {
        name.push(<Option key={this.state.name[i].value}>{this.state.name[i].label}</Option>);
     }
     for (let i = 0; i < this.state.channel.length; i++) {
        channel.push(<Option key={this.state.channel[i].value}>{this.state.channel[i].label}</Option>);
     }
     for (let i = 0; i < this.state.ad.length; i++) {
        ad.push(<Option key={this.state.ad[i].value}>{this.state.ad[i].label}</Option>);
     }
     for (let i = 0; i < this.state.platform.length; i++) {
        platform.push(<Option key={this.state.platform[i].value}>{this.state.platform[i].label}</Option>);
     }
     for (let i = 0; i < this.state.current_ad.length; i++) {
        current_ad.push(<Option key={this.state.current_ad[i].value}>{this.state.current_ad[i].label}</Option>);
     }

     return (
      <Form inline onSubmit={this.handleSubmit} style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
        <FormItem label="计费名">
          <Cascader style={{ width: 200 }} options={ this.state.name } {...getFieldProps('name')} placeholder='请选择计费名'/>
        </FormItem>
         <FormItem label="计费名状态">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('status')} placeholder='请选择状态'>
           <Option key='启用'>启用</Option>
           <Option key='删除'>删除</Option>
          </Select>
        </FormItem>
        <FormItem label="当前渠道">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('channel')} placeholder='请选择渠道'>
           { channel }
          </Select>
        </FormItem>
        <FormItem label="所属广告位">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('ad')} placeholder='请选择广告位'>
           { ad }
          </Select>
        </FormItem>
        <FormItem label="投放平台">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('platform')} placeholder='请选择平台'>
           { platform }
          </Select>
        </FormItem>
        <FormItem label="当前广告位">
          <Select showSearch style={{ width: 130 }} {...getFieldProps('ad')} placeholder='请选择当前广告位'>
           { current_ad }
          </Select>
        </FormItem>
        <Button type="primary" htmlType="submit">查询</Button>
      </Form>
     )
  }
})

FilterForm = Form.create()(FilterForm)

var filParam = {};

var Billingname = React.createClass({
  getInitialState() {
    return { 
      url:'http://bnm.stnts.dev/billing-name/children?id=' + this.props.location.state.parentId 
    };
  },
  filterParam:function(params){
   console.log("触发筛选",params)
   filParam = params;
   this.setState({
    url:'http://bnm.stnts.dev/billing-name/children?id=' + this.props.location.state.parentId 
   })

  },
  // handleSubmit() {
  //   var formdData = {
  //       name:this.refs.billingname.refs.input.value,
  //       comment:this.refs.note.refs.input.value
  //   }
  //   this.fetch(formdData)
  // },
  // fetch(formdata) {
  //   reqwest({
  //     url:'http://bnm.stnts.dev/billing-name/store/',
  //     data:{
  //       business_id:1,
  //       parent: this.props.location.query.id,
  //       name:formdata.name,
  //       comment:formdata.comment,
  //       _token:window._TOKEN
  //     },
  //     method: 'post',
  //     type: 'json',
  //   }).then(result => {
  //     message.info(result.data);
  //     this.setState({
  //       visible: false
  //     });
  //   }, function (err, msg) {
  //     if(err.status == 422){
  //       var i,
  //           ele,
  //           msg = '',
  //           msgObj = JSON.parse(err.responseText).info;
  //       for(i = 0;i < msgObj.length; i++){
  //          for(var ele in msgObj[i]){
  //            msg += msgObj[i][ele]+'\n\n'
  //          }
  //       }
  //       message.error(msg);
  //     }
  //   })
  // },
  fetch:function(url,callbackone,callbacktwo){
      reqwest({
        url:url,
        method: 'get',
        type: 'json'
      }).then(result => {
          callbackone();
        },function(){
          callbacktwo();
          console.log("失败")
        }
      )
  },
  delete:function(id){
      return () =>{
          this.fetch('',function(){
              $(e.target).eq(0).closest('tr').remove();
          },function(){
              alert('ERROR')
          })
      }
  },
  render() {

   var ID = this.props.location.query.id ,
       parentname = this.props.location.state.name ,
       _this = this;
    console.log('parentname',parentname)
    var columns = [{
          title: '子计费名',
          dataIndex: 'billingname_children'
        }, {
          title: '当前所属渠道',
          dataIndex: 'channel'
        }, {
          title: '所属广告位',
          dataIndex: 'ad'
        }, {
          title: '投放平台',
          dataIndex: 'platform'
        }, {
          title: '创建时间',
          dataIndex: 'create_time'
        }, {
          title: '渠道有效时间',
          dataIndex: 'channel_time'
        }, {
          title: '状态',
          dataIndex: 'states'
        }, {
          title: '备注',
          dataIndex: 'comment',
          className:'antd-hidden'
        }, {
          title: '操作',
          dataIndex: 'operations',
          render: function(text, record, index){

            return (
                <div>
                  <Link to={{ 
                              pathname: 'business/BaiduXML/childupdate',
                              query: { id: record.id } , 
                              state:{ adtype : '百度XML' ,
                                      type:"update",
                                      name : record.name ,
                                      platform : record.platform ,
                                      ID : ID ,
                                      parent : parentname ,
                                      comment : record.comment
                                     }  
                            }} style={{ textDecoration:'underline' }}> 修改 </Link>
                  &nbsp;
                  <Link to={{  pathname:"business/BaiduXML/history",state:{ type:1,id:record.id } }} style={{ textDecoration:'underline' }} > 关联历史 </Link>
                  &nbsp;
                  <a target="_self" href="http://192.168.2.6:8091/login.do" style={{ textDecoration:'underline' }}> 广告代码 </a>
                  &nbsp;
                  <a  onClick={ _this.delete(record.id) } style={{ textDecoration:'underline' }}> 删除 </a>
                </div>
            )

          }
        }
    ];

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <div style={{ display:'inline-block',width:100+'%' }}>
      	<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}>业务 > 百度XML > 子计费名</h3>
        <Button type="primary"  style={{ margin:'1% 0 1% 80%' }}>
          <Link to={{
            pathname : "/business/BaiduXML/childupdate" ,
            state:{ 
              type:'add' ,
              adtype:'百度XML',
              ID:ID ,
              parent :parentname
             }
          }} ><Icon type="plus" />添加子计费名</Link>
        </Button>
        <FilterForm filterParam={ this.filterParam }/>
        <Paging url={this.state.url} columns={columns} params={ filParam }/>
      </div>
    );
  },
});


export default Billingname;