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
          allFilter : {}  ,
          name:{} ,
          platform:{},
          channel:{} ,
          ad : {}
      };
  },
  handleSubmit(e) {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
    this.props.filterParam(this.props.form.getFieldsValue());
  },
  fetch:function(url,callbackone,callbacktwo){
      reqwest({
        url:url,
        method: 'get',
        type: 'json'
      }).then(result => {
          callbackone(result.data);
        },function(){
          callbacktwo();
          console.log("失败")
        }
      )
  },
  componentDidMount() {
    const _this = this;

    //拉计费名
    this.fetch('http://localhost:90/business/BaiduSearch/channel',function(data){
        if(_this.isMounted()){
          _this.setState({
            name : data
          })
        }
    },function(){
        modaltError('拉取计费名失败!')
    });

    //拉当前渠道
    this.fetch('http://localhost:90/business/BaiduSearch/channel',function(data){
        if(_this.isMounted()){
          _this.setState({
            channel : data
          })
        }
    },function(){
        modaltError('拉取渠道失败!')
    });

    //拉投放平台
    this.fetch('http://localhost:90/business/BaiduSearch/channel',function(data){
        if(_this.isMounted()){
          _this.setState({
            platform : data
          })
        }
    },function(){
        modaltError('拉取投放平台失败!')
    });

    //拉当前广告位
    this.fetch('http://localhost:90/business/BaiduSearch/channel',function(data){
        if(_this.isMounted()){
          _this.setState({
            ad : data
          })
        }
    },function(){
        modaltError('拉取当前广告位失败!')
    });

  },
  render:function(){
     const { getFieldProps } = this.props.form;

     //设置options
     let name = [],
         channel = [],
         platform = [],
         ad = [];

     for (let i = 0; i < this.state.name.length; i++) {
        name.push(<Option key={ this.state.name[i].label }>{this.state.name[i].value}</Option>);
     }

     for (let i = 0; i < this.state.channel.length; i++) {
        channel.push(<Option key={ this.state.channel[i].label }>{this.state.channel[i].value}</Option>);
     }

     for (let i = 0; i < this.state.platform.length; i++) {
        platform.push(<Option key={ this.state.platform[i].label }>{this.state.platform[i].value}</Option>);
     }

     for (let i = 0; i < this.state.ad.length; i++) {
        ad.push(<Option key={ this.state.ad[i].label }>{this.state.ad[i].value}</Option>);
     }


     return (
      <Form inline onSubmit={this.handleSubmit} style={{ marginLeft:1+'%',marginBottom:1+'%' }}>
        
         <FormItem label="计费名">
          <Select showSearch style={{ width: 150 }} {...getFieldProps('name')} placeholder="请选择计费名">
           { name }
          </Select>
        </FormItem>
        <FormItem label="计费名状态">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('status')} placeholder="请选择状态">
            <Option key='启用'>启用</Option>
           <Option key='删除'>删除</Option>
          </Select>
        </FormItem>
         <FormItem label="当前渠道">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('channel')} placeholder="请选择渠道">
           { channel }
          </Select>
        </FormItem>
         <FormItem label="投放平台">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('platform')} placeholder="请选择平台">
           { platform }
          </Select>
        </FormItem>
        <FormItem label="当前广告位">
          <Select showSearch style={{ width: 100 }} {...getFieldProps('ad')} placeholder="请选择广告位">
           { ad }
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
      url:'http://localhost:90/business/BaiduXML'
    };
  }, 
  filterParam:function(params){

   filParam = params;
   this.setState({
    url:'http://bnm.stnts.dev/business/BaiduXML'
   })

  },
  fetch(formdata) {

  },
  delete:function(){

    return function(){
      this.fetch('',function(){
        //直接操作DOM
         $(e.target).eq(0).closest('tr').remove();
      },function(){   
        alert('ERROR');
      })
    }
  },
  fetch:function(url, callbackone, callbacktwo){
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
                        pathname:'business/BaiduXML/children',
                        state:{
                          parentId:record.id,
                          name:record.name
                        }
                        
                    }} style={{ textDecoration:'underline' }}> { text } </Link>
          }
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
          title: '渠道结束时间',
          dataIndex: 'channel_time'
        }, {
          title: '状态',
          dataIndex: 'states'
        }, {
          title: '备注',
          dataIndex: 'comment',
          className:'antd-hidden'
        },{
          title: '操作',
          dataIndex: 'operations',
          render: function(text, record, index){

            //控制'删除'的显示
            // var cssStyle = '';
            // if(_this.state.allFilter.status == "删除"){
            //     cssStyle  = 'none';
            // }else{
            //     cssStyle  = 'inline-block';
            // }

            //[修改]:传递至下个路由的参数
            var routesParams = {
                type:'update' ,
                adtype : '百度XML' ,
                name : record.name ,
                platform : record.platform ,
                channel : record.channel ,
                comment : record.comment ,
                create_time : record.create_time ,
                channel_time : record.channel_time 
            }

            return (
                <div>
                  <Link to={{ 
                              pathname: 'business/BaiduXML/update',
                              query: { id: record.id } , 
                              state: routesParams
                            }} style={{ textDecoration:'underline' }}> 修改 </Link>
                  &nbsp;
                  <Link to={{  pathname:"business/BaiduXML/history",state:{ type:0 , id:record.id} }} style={{ textDecoration:'underline' }} > 关联历史 </Link>
                  &nbsp;
                  <a target="_self" href="http://192.168.2.6:8091/login.do" style={{ textDecoration:'underline' }}> 广告代码 </a>
                  &nbsp;
                  <a  onClick={ _this.delete(record.id) } style={{ textDecoration:'underline'}}> 删除 </a>
                </div>
            )

          }
        }
    ];

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    console.log("百度XML渲染")

    return (
      <div style={{ display:'inline-block',width:100+'%' }}>
      	<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}> 业务 > 百度XML</h3>
        <Button type="primary" onClick={ this.showModal } style={{ margin:'1% 0 1% 75%' }}>
          <Link to={{
            pathname : "/business/BaiduXML/update" ,
            state:{ type:'add' ,adtype:'百度XML' }
          }} >
          <Icon type="plus" />&nbsp;添加父计费名
          </Link>
        </Button>
        <FilterForm filterParam={ this.filterParam }/>
        <Paging url={this.state.url} columns={columns} params={ filParam }/>
      </div>
    );
  },
});


export default Business;
