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
          name:[], //联动的计费名
          channel:{} //渠道
      };
  },
  handleSubmit(e) {
    e.preventDefault();
   
    var reciveData = this.props.form.getFieldsValue();
    var formatData = {
      channel:reciveData.channel,
      status:reciveData.status,
      name:reciveData.name?reciveData.name[0]:"",
      child:reciveData.name?reciveData.name[1]:""
    }
    this.props.filterParam(formatData);
    console.log('处理后的表单值：', formatData);
  },
  fetch:function(url,callbackone,callbacktwo){
    reqwest({
        url:url,
        method: 'get',
        type: 'json',
    }).then(result =>{
      //设置state
      if(this.isMounted()){
        callbackone(result.data);
      }
    },function(){
      callbacktwo();
      console.log("失败")
    })
  },
  componentDidMount() {
    const _this = this;

    //拉子计费名数据
    //@params id
    this.fetch('http://localhost:90/business/BaiduSearch/billingnameLink',function(data){
       _this.setState({
          name:data
       })
    },function(){
        alert("ERROR");
    });

    //拉当前子渠道数据 
    //@params id
    this.fetch('http://localhost:90/business/BaiduSearch/channel',function(data){
       _this.setState({
          channel:data
       })
    },function(){
        alert("ERROR");
    });
  },
  render:function(){
     const { getFieldProps } = this.props.form;

     //设置options
     let channel = [];
     for (let i = 0; i < this.state.channel.length; i++) {
        channel.push(<Option key={this.state.channel[i].value}>{this.state.channel[i].label}</Option>);
     }


     return (
      <Form inline onSubmit={this.handleSubmit} style={{ marginLeft:'1%',marginBottom:'1%' }}>
        <FormItem label="计费名">
          <Cascader style={{ width: 200 }} options={ this.state.name } {...getFieldProps('name')} placeholder="请选择计费名" />
        </FormItem>
         <FormItem label="计费名状态">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('status')} placeholder="请选择状态" >
           <Option key='启用'>启用</Option>
           <Option key='删除'>删除</Option>
          </Select>
        </FormItem>
        <FormItem label="当前渠道">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('channel')} placeholder="请选择渠道" >
           { channel }
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
      url:'http://bnm.stnts.dev/billing-name/children?id=' + this.props.location.state.parentId //获取parentId=1的子计费名
    };
  },
  filterParam:function(params){
   console.log("触发筛选",params)
   filParam = params;
   this.setState({
    url:'http://bnm.stnts.dev/billing-name/children?id=' + this.props.location.state.parentId
   })

  },
  handleClick(){
    alert("删除")
  },
  componentDidMount() {
      console.log("componentDidMount")  
  },
  render() {

   var ID = this.props.location.query.id ,//计费名ID
       parentname = this.props.location.state.name ,//父计费名
       _this = this;
   
    var columns = [{
          title: '子计费名',
          dataIndex: 'billingname_children'
        }, {
          title: '当前所属渠道',
          dataIndex: 'channel'
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
          title: '操作',
          dataIndex: 'operations',
          render: function(text, record, index){

            return (
                <div>
                  <Link to={{ 
                              pathname: 'business/BaiduSearch/childupdate',
                              query: { id: record.id } , 
                              state:{ adtype : '百度搜索' ,
                                      type:"update",
                                      name : record.name ,
                                      platform : record.platform ,
                                      ID : ID ,
                                      parent : parentname
                                     }  
                            }} style={{ textDecoration:'underline' }}> 修改 </Link>
                  &nbsp;
                  <Link to={{  pathname:"business/BaiduSearch/history",state:{ type:1,id:record.id } }} style={{ textDecoration:'underline' }} > 关联历史 </Link>
                  &nbsp;
                  <a target="_self" href="http://192.168.2.6:8091/login.do" style={{ textDecoration:'underline' }}> 广告代码 </a>
                  &nbsp;
                  <a  onClick={ _this.handleClick } style={{ textDecoration:'underline' }}> 删除 </a>
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
      <div style={{ display:'inline-block',width:'100%' }}>
      	<h3 style={{ marginLeft:'1%',display:'inline-block' }}> 业务 > 百度搜索 > 子计费名</h3>
        <Button type="primary"  style={{ margin:'1% 0 1% 80%' }}>
          <Link to={{
            pathname : "/business/BaiduSearch/childupdate" ,
            state:{ 
              type:'add' ,
              adtype:'百度搜索',
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