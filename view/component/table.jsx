import React from 'react';
import {Table} from 'antd';
import reqwest from 'reqwest';

//缓存筛选数据
var filter ={};
var pagePer ={};

const Paging = React.createClass({
  getInitialState() {
    return {
      data: [],
      pagination: {
        showSizeChanger: true
        //,
        //showTotal:function(total) {
        //  return '共'+total+'条';
        //}
      }
    };
  },
  handleTableChange(pagination, filters, sorter) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    pagePer ={
      per_page: pagination.pageSize,
      page: pagination.current
    }
    
    this.format(pagePer,filter);
  },
  fetch(params = {}) {
   
      reqwest({
        url: this.props.url,
        method: 'get',
        data:params,
        type: 'json',
      }).then(data => {
        const pagination = this.state.pagination;
        pagination.total = data.data.total;

        if (this.isMounted()){
          this.setState({
            data: data.data.data?data.data.data:data.data,
            pagination,
          });

          //修改_TOKEN值
          window._TOKEN = data._token;
          console.log('修改_TOKEN值 = ', _TOKEN)
        }
    });
    
  },
  //初始化
  componentDidMount() {
    pagePer = {
      per_page: 10,
      page: 1
    }
    this.fetch(pagePer)
  },
  //处理传递的参数
  format:function(pagePer,nextparams){

    var formatData = {};
    for(var temp in  nextparams){
      formatData[temp] = nextparams[temp];
    }

    //对象合并
    var extend=function(o,n,override){
       for(var p in n)if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))o[p]=n[p];
    };
    extend(formatData,pagePer);

    this.fetch(formatData);

  },
  //查询调用
  componentWillReceiveProps:function(next){
    filter = next.params;
    console.log("调用查询的参数值",filter)
    this.format(pagePer,next.params)
  },
  render() {
    console.log("渲染表格")

    return (
      <Table   columns={this.props.columns}
        rowSelection={ this.props.rowSelection }
        dataSource={this.state.data}
        pagination={this.state.pagination}
        onChange={this.handleTableChange}
        rowKey={ record => record.id }
      />
    );
  },
});

module.exports = Paging;