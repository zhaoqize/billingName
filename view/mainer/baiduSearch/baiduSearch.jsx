import React from 'react';
import { Modal, 
         Button, 
         Table, 
         Icon, 
         Input, 
         Form,
         Select,
         message,
         Alert
       } from 'antd';
import reqwest from 'reqwest';
import {Link} from 'react-router';
import $ from 'jquery';
import ReactDOM from 'react-dom';

import Paging from '../../component/table.jsx';
import modaltSuccess from '../../component/modalSuccess.jsx';
import modaltError from '../../component/modalError.jsx';

import '../../../resources/css/antd.css';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;


var FilterForm = React.createClass({
  getInitialState() {
      return {
          allFilter : {}, //
          channel:{}, //渠道
          name:{} //计费名
      };
  },
  handleSubmit(e) {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
    this.props.filterParam(this.props.form.getFieldsValue());
  },
  fetch:function(url,callbackone,callbacktwo){
      var _this = this;

      reqwest({
        url:url,
        method: 'get',
        type: 'json',
      }).then(result =>{
        //设置state
        if(_this.isMounted()){
          callbackone(result.data);
        }
      },function(){
        callbacktwo();
        console.log("失败")
      })
  },
  componentDidMount() {
    const _this = this;

    //拉计费名数据
    this.fetch('',function(data){
         _this.setState({
            name:data
         })
    },function(){
        modaltError('提示','拉取计费名数据失败!');
    });

    //拉当前渠道数据
    this.fetch('http://bnm.stnts.dev/channel/simple',function(data){
         _this.setState({
            channel:data
         })
    },function(){
        modaltError('提示','拉取渠道数据失败!');
    });
  },
  render:function(){
     const { getFieldProps } = this.props.form;

     //设置options
     let channel = [];
     let name = [];
     for (let i = 0; i < this.state.channel.length; i++) {
        channel.push(<Option key={this.state.channel[i].id}>{this.state.channel[i].name}</Option>);
     }
     for (let i = 0; i < this.state.name.length; i++) {
        name.push(<Option key={this.state.name[i].id}>{this.state.name[i].name}</Option>);
     }


     return (
      <Form inline onSubmit={this.handleSubmit} style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
        
         <FormItem label="计费名">
          <Select showSearch style={{ width: 150 }} {...getFieldProps('name')} placeholder="请选择计费名" >
              { name }
          </Select>
        </FormItem>
        <FormItem label="计费名状态">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('status')} placeholder="请选择状态" >
            <Option key='0'>启用</Option>
            <Option key='deleted'>已删除</Option>
            <Option key='locked'>已锁定</Option>
            <Option key='all'>全部</Option>
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

var Business = React.createClass({
  getInitialState() {
    return { 
      url:'http://bnm.stnts.dev/business/BaiduSearch/index',
      allFilter:{}
    };
  }, 
  filterParam:function(params){
   this.setState({
    allFilter : params
   })
  },
  delete:function(e,id,index){
      return () =>{
          this.fetch('http://bnm.stnts.dev/business/BaiduSearch/destroy/'+ id,'post',function(){
              var antdTable = document.getElementsByClassName('ant-table-tbody')[0];
              var trIndex = antdTable.childNodes[index];
              antdTable.remove(trIndex);

              modaltSuccess('提示','删除成功!');
          },function(){
              modaltError('提示','删除失败!');
          })
      }
  },
  fetch:function(url,method,callbackone,callbacktwo){
      reqwest({
        url:url,
        method: method,
        type: 'json'
      }).then(result => {
          callbackone();
        },function(){
          callbacktwo();
          console.log("失败")
        }
      )
  },
  render() {
    var _this = this ;
    var columns = [{
          title: '计费名',
          dataIndex: 'name'
        }, {
          title: '子计费名数量',
          dataIndex: 'counter',
          render: function(text, record, index){
            return <Link to={{
                        pathname:'business/BaiduSearch/children',
                        state:{
                          parentId:record.id,
                          name:record.name //计费名
                        }
                        
                    }} style={{ textDecoration:'underline' }}> { text } </Link>
          }
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
          title: '渠道结束时间',
          dataIndex: 'channel_time'
        }, {
          title: '状态',
          dataIndex: 'status'
        },{
          title: '备注',
          dataIndex: 'comment',
          className:'antd-hidden'
        }, {
          title: '操作',
          dataIndex: 'operations',
          render: function(text, record, index){

            //控制'删除'的显示
            var cssStyle = '';
            if(_this.state.allFilter.status == "删除"){
                cssStyle  = 'none';
            }else{
                cssStyle  = 'inline-block';
            }

            //[修改]:传递至下个路由的参数
            var routesParams = {
                type:'update' ,
                adtype : '百度搜索' ,
                name : record.name ,
                platform : record.platform ,
                channel : record.channel ,
                comment : record.comment,
                create_time : record.create_time ,
                channel_time : record.channel_time 
            }

            return (
                <div>
                  <Link to={{ 
                              pathname: 'business/BaiduSearch/update',
                              query: { id: record.id } , 
                              state: routesParams
                            }} style={{ textDecoration:'underline' }}> 修改 </Link>
                  &nbsp;
                  <Link to={{  pathname:"business/BaiduSearch/history",state:{ type:0,id:record.id } }} style={{ textDecoration:'underline' }} > 关联历史 </Link>
                  &nbsp;
                  <a target="_self" href="http://192.168.2.6:8091/login.do" style={{ textDecoration:'underline' }}> 广告代码 </a>
                  &nbsp;
                  <a ref='del' onClick={ _this.delete(event,record.id,index) } style={{ textDecoration:'underline',display:cssStyle  }} > 删除 </a>
                   &nbsp;
                  <a ref='del' onClick={ _this.delete(event,record.id,index) } style={{ textDecoration:'underline',display:cssStyle  }} > 恢复 </a>
                </div>
            )

          }
        }
    ];

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    console.log("this.state.allFilter=",this.state.allFilter)
    return (
      <div style={{ display:'inline-block',width:100+'%' }}>
      	<h3 style={{ marginLeft:1+'%',display:'inline-block' }}> 业务 > 百度搜索</h3>
        <Button type="primary" onClick={ this.showModal } style={{ margin:'1% 0 1% 75%' }}>
          <Link to={{
            pathname : "/business/BaiduSearch/update" ,
            state:{ type:'add' ,adtype:'百度搜索' }
          }} >
          <Icon type="plus" />&nbsp;添加父计费名
          </Link>
        </Button>
        <FilterForm filterParam={ this.filterParam }/>
        <Paging url={this.state.url} columns={columns} params={ this.state.allFilter }/>
      </div>
    );
  },
});


export default Business;
