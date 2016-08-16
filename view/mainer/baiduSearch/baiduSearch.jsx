import { Modal, 
         Button, 
         Table, 
         Icon, 
         Input, 
         Form,
         Select,
         message,
         Alert,
         Spin 
       } from 'antd';
import reqwest from 'reqwest';
import {Link} from 'react-router';

import {PlatformMap} from '../../commentMap/index';

import { ModalSuccess, 
         ModalError, 
         Header } from '../../component/index';


const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;



var FilterForm = React.createClass({
  getInitialState() {
      return {
          allFilter : {}, 
          channel:{}, 
          name:{}
          
      };
  },
  handleReset:function(e){
    e.preventDefault();
    
    this.props.form.resetFields();
    this.props.filterToParent(this.props.form.getFieldsValue());
  },
  handleSubmit(e) {
    e.preventDefault();

    //通知父
    this.props.filterToParent(this.props.form.getFieldsValue());
  },
  fetch:function(url,callbackone,callbacktwo){
      var _this = this;

      reqwest({
        url:url,
        method: 'get',
        type: 'json',
      }).then(result =>{
        if(_this.isMounted()){
          callbackone(result);
        }
      },function(){
        callbacktwo();
      })
  },
  componentDidMount() {
    const _this = this;

    //拉计费名数据
    _this.fetch(rootURL + '/business/BaiduSearch/parents',function(result){
        _this.setState({
         name:result.data
        })
    },function(){
        console.log('提示','拉取计费名数据失败!');
    });

    //拉当前渠道数据
    _this.fetch(rootURL + '/channel/simple',function(result){
         _this.setState({
            channel:result.data
         })
    },function(){
        console.log('提示','拉取渠道数据失败!');
    });
  },
  render:function(){
     const { getFieldProps } = this.props.form;

     //设置options
     let channel = [<Option key value =''>全部</Option>];
     let name = [<Option key value =''>全部</Option>];
     for (let i = 0; i < this.state.channel.length; i++) {
        channel.push(<Option key={this.state.channel[i].id} title={this.state.channel[i].name}>
                       {this.state.channel[i].name}
                     </Option>);
     }
     for (let i = 0; i < this.state.name.length; i++) {
        name.push(<Option key={this.state.name[i].id} title={this.state.name[i].name}>
                    {this.state.name[i].name}
                  </Option>);
     }


     return (
      <Form inline onSubmit={this.handleSubmit} style={{ margin:'20px 0 20px 20px' }}>
        
         <FormItem label="计费名">
          <Select showSearch 
                  notFoundContent="无法找到"
                  optionFilterProp="children" style={{ width: 150 }} {...getFieldProps('name')} placeholder="请选择计费名" >
              { name }
          </Select>
        </FormItem>
        <FormItem label="计费名状态">
          <Select  style={{ width: 100 }} {...getFieldProps('status',{ initialValue:'use' })} placeholder="启用" >
            <Option key='all'>全部</Option>
            <Option key='use'>启用</Option>
            <Option key='deleted'>已删除</Option>
          </Select>
        </FormItem>
        <FormItem label="投放平台">
          <Select  style={{ width: 100 }} {...getFieldProps('line')} placeholder="请选择平台" >
            <Option key value=''>全部</Option>
            <Option key='online'>淘金</Option>
            <Option key='offline'>线下</Option>
          </Select>
        </FormItem>
         <FormItem label="当前渠道">
          <Select showSearch 
                  notFoundContent="无法找到"
                  optionFilterProp="children"
                  style={{ width: 150 }} {...getFieldProps('channel')} 
                  placeholder="请选择渠道" >
           { channel }
          </Select>
        </FormItem>
        <Button type="primary" htmlType="submit" style={{ marginLeft:20 }} id="query">查询</Button>
        <Button type="default" onClick={ this.handleReset } style={{ marginLeft:20 }} >重置</Button>
      </Form>
     )
  }
})

FilterForm = Form.create()(FilterForm)


var TableContent = React.createClass({
  getInitialState() {
    return { 
      url: rootURL + '/business/BaiduSearch/index',
      params:{ //给分页点击使用 保存筛选数据
            status: '',
            line: '',
            channel: '',
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
  mixins: [PlatformMap],
  fromFilter:function(params){
    
      const _this = this;

      var filters = {
          status: params.status,
          line: params.line,
          channel: params.channel,
          name: params.name,
          per_page: 10,
          page: 1
      }

      var pager = _this.state.pagination;
      pager.current = 1 ;
      pager.pageSize = 10 ;


      _this.fetch(_this.state.url,function(result){
        
        const pagination = _this.state.pagination;
              pagination.total = result.data.total;

        if(_this.isMounted()){
          _this.setState({
            data:result.data.data,
            selectedRowKeys : [],
            params:params,
            pagination:pager
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
         line:_this.state.params.line,
         channel: _this.state.params.channel,
         name:_this.state.params.name,
         per_page: pagination.pageSize,
         page: pagination.current
      },
      'get')
  },
  delete:function(id, children){
      return () =>{
        const _this = this;
        
        confirm({
            title: '警告',
            content:<p>该父计费名下有 <span style={{ color:'red' }}>{children}</span> 个子计费名,确定删除?<br/>(注意:子计费名也将被删除)</p>,
            onOk() {
              del();
            }
          });

        var del = function(){
           _this.fetch(rootURL + '/business/BaiduSearch/destroy/'+ id,function(result){
            if(result.status === 'success'){
              ModalSuccess('提示','删除成功!');

              document.getElementById('query').click();

            }else{
               ModalError('提示',result.info);
            }

          },function(){
              ModalError('提示','请求失败!');
          },{},'post')
        }
         
      }
  },
  recover:function(channelId){
    return () =>{
      this.fetch(rootURL + '/business/BaiduSearch/restore/' + channelId,function(result){
         if(result.status === 'success'){
           ModalSuccess('提示','恢复成功!');

           document.getElementById('query').click();
         }else{
           ModalError('提示',result.data);
         }
       },function(){
          ModalError('提示','请求失败!');
       },{},'post')
    }
  },
  componentDidMount:function(){
      const _this = this;
      _this.fetch(_this.state.url,function(result){
        const pagination = _this.state.pagination;
              pagination.total = result.data.total;

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
  render() {

    var _this = this ;

    var updateStyle = 'inline-block',
        adStyle = 'inline-block',
        deleteStyle = 'inline-block',
        recoverStyle = 'none';
        
    var columns = [{
          title: 'id',
          dataIndex: 'id',
          className:'antd-hidden'
        },{
          title: '计费名',
          dataIndex: 'name'
        }, {
          title: '子计费名数量',
          dataIndex: 'children',
          render: function(text, record, index){

           return <Link to={{pathname:'business/BaiduSearch/children',
                             query:{id : record.id},
                             state:{
                             parentId:record.id,
                             name:record.name }}} 
                        style={{ textDecoration:'underline' }}> { text } </Link>
          }
        }, {
          title: '当前所属渠道',
          dataIndex: 'channel_name',
          render:function(text, record, index){
            return record.relation?record.relation.channel.name:'';
          }
        }, {
          title: '投放平台',
          dataIndex: 'relation',
          render:function(text, record, inline){
            return _this.props.platformMap[text?text.line:''];
          }
        }, {
          title: '创建时间',
          dataIndex: 'created_at'
        }, {
          title: '渠道有效时间',
          dataIndex: 'oktime',
          render:function(text, record, index){
            if(record.relation){
              return (record.relation.start ? record.relation.start : '') + ' 至 ' + (record.relation.expire ? record.relation.expire : '');
            }else{
              return '';
            }
          }
        }, {
          title: '状态',
          dataIndex: 'status',
          render:function(text, record, index){

             if(record.deleted_at){

              updateStyle = 'none',
              adStyle = 'none',
              deleteStyle = 'none',
              recoverStyle = 'inline-block';

              return '已删除';
             }else{
              
              updateStyle = 'inline-block',
              adStyle = 'inline-block',
              deleteStyle = 'inline-block',
              recoverStyle = 'none';

              return '启用';
             }
          }
        },{
          title: '备注',
          dataIndex: 'comment',
          className:'antd-hidden'
        },{
          title: 'deleted_at',
          dataIndex: 'deleted_at',
          className:'antd-hidden'
        }, {
          title: '操作',
          dataIndex: 'operations',
          render: function(text, record, index){

            //控制'删除'的显示
            var cssStyle = '';
            if(_this.state.params.status == "删除"){
                cssStyle  = 'none';
            }else{
                cssStyle  = 'inline-block';
            }

            //[修改]:传递至下个路由的参数
            var routesParams = {
                type:'update' ,
                id:record.id,
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
                            }} style={{ textDecoration:'underline',display:updateStyle,marginRight:'5%'  }}> 修改 </Link>
                  
                  <a ref='del' onClick={ _this.delete(record.id,record.children) } style={{ textDecoration:'underline',display:deleteStyle,marginRight:'5%'  }} > 删除 </a>
                  
                  <a ref='del' onClick={ _this.recover(record.id) } style={{ textDecoration:'underline',display:recoverStyle,marginRight:'5%'  }} > 恢复 </a>
                
                  <Link to={{  pathname:"business/BaiduSearch/history",state:{ type:0,id:record.id,name:record.name } }} style={{ textDecoration:'underline',marginRight:'5%'}} > 关联历史 </Link>
                 
                  <a target="_self" href="javascript:alert('暂无功能!')" style={{ textDecoration:'underline',display:adStyle }}> 广告代码 </a>
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
        <FilterForm filterToParent={ this.fromFilter }/>
        <Table  columns={columns}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                onChange={this.handleTableChange}
                rowKey={ function(record){
                  return record.id || record.start
              } }
              style={{ width:'98%',marginLeft:20 }}
            />
      </div>
    );
  },
});


var BaiduSearch = React.createClass({
  getInitialState() {
      return {
          filterParams : {} ,
          loading:true
      };
  },
  setLoading:function(params){
    this.setState({ 
      loading:params.loading
    })
  },
  render:function(){
    return (
      <div>
        <Spin spinning={ this.state.loading }>
          <Header params={{
            title: '业务 > 百度搜索',
            operTitle: '添加父计费名',
            route:{
              pathname : "/business/BaiduSearch/update" ,
              state:{ type:'add' ,adtype:'百度搜索' }
            }
          }}/>
          <TableContent parentToTable={ this.state.filterParams } loadingTo={ this.setLoading }/>
        </Spin>
      </div>
    )
  }
})

export default BaiduSearch;
