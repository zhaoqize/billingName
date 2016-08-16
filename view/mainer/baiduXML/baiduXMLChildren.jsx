
import { Modal, 
         Button, 
         Table, 
         Icon, 
         Input, 
         Form,
         Select,
         message,
         Cascader,
         Spin
       } from 'antd';
import reqwest from 'reqwest';
import {Link} from 'react-router';

import { PlatformMap } from '../../commentMap/index';

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
          allFilter : {} ,
          name:[], 
          channel:{} 
      };
  },
  handleReset:function(e){
    e.preventDefault();
    this.props.form.resetFields();
    this.props.filterParam(this.props.form.getFieldsValue())
  },
  handleSubmit(e) {
    e.preventDefault();
   
    console.log("表单值 = ",this.props.form.getFieldsValue())
    
    this.props.filterParam(this.props.form.getFieldsValue())
  },
  fetch:function(url,callbackone,callbacktwo){
    reqwest({
        url:url,
        method: 'get',
        type: 'json',
    }).then(result =>{
      if(this.isMounted()){
        callbackone(result.data);
      }
    },function(){
      callbacktwo();
    })
  },
  componentDidMount() {
    const _this = this;

    //拉子计费名数据
    _this.fetch(rootURL + '/business/BaiduXML/parents',function(data){
      if(_this.isMounted()){
         _this.setState({
            name:data
          })
      }
    },function(){
        console.log("拉取父子计费名数据失败");
    });

    //拉当前子渠道数据 
    _this.fetch(rootURL + '/channel/simple',function(data){
       _this.setState({
          channel:data
       })
    },function(){
        console.log("拉取渠道数据 ");
    });
  },
  render:function(){
     const { getFieldProps } = this.props.form;

     //设置options
     let name =[], 
         channel = [<Option key value =''>全部</Option>];

     for (let i = 0; i < this.state.name.length; i++) {
        name.push(<Option key={this.state.name[i].id} title={this.state.name[i].name}>
                    {this.state.name[i].name}
                  </Option>);
     }

     for (let i = 0; i < this.state.channel.length; i++) {
        channel.push(<Option key={this.state.channel[i].id} title={this.state.channel[i].name}>
                        {this.state.channel[i].name}
                     </Option>);
     }

     return (
      <Form inline onSubmit={this.handleSubmit} style={{ margin:'20px 0 20px 20px' }}>
        <FormItem label="计费名">
          <Select showSearch 
                  notFoundContent="无法找到"
                  optionFilterProp="children" style={{ width: 150 }} {...getFieldProps('name',{ initialValue:this.props.locationState.parentId + '' })} placeholder="请选择计费名">
            { name }
          </Select>
        </FormItem>
         <FormItem label="计费名状态">
          <Select  style={{ width: 100 }} {...getFieldProps('status',{ initialValue:'all' })} placeholder="启用" >
           <Option key='all'>全部</Option>
           <Option key='use'>启用</Option>
           <Option key='deleted'>删除</Option>
          </Select>
        </FormItem>
        <FormItem label="投放平台">
          <Select  style={{ width: 100 }} {...getFieldProps('line')} placeholder="请选择平台" >
           <Option key value =''>全部</Option>
           <Option key='online'>淘金</Option>
           <Option key='offline'>线下</Option>
          </Select>
        </FormItem>
        <FormItem label="当前渠道">
          <Select showSearch 
                  optionFilterProp="children"
                  notFoundContent="无法找到" style={{ width: 150 }} {...getFieldProps('channel')} placeholder="请选择渠道" >
           { channel }
          </Select>
        </FormItem>
        <Button type="primary" htmlType="submit"  style={{ marginLeft:20 }} id="query">查询</Button>
        <Button type="default" onClick={ this.handleReset } style={{ marginLeft:20 }} >重置</Button>
      </Form>
     )
  }
})

FilterForm = Form.create()(FilterForm)

var hasOper = false;

var filParam = {};

var TableContent = React.createClass({
  getInitialState() {
    return { 
      url:rootURL + '/business/BaiduXML/billing-name/' + this.props.locationQuery.state.parentId + '/index' ,
      params:{ //给分页点击使用 保存筛选数据
            status: 'all',
            line: '',
            channel: '',
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
          per_page: 10,
          page: 1
      }
      var url = rootURL + '/business/BaiduXML/billing-name/' + params.name + '/index';
      var pager = _this.state.pagination;
      pager.current = 1 ;
      pager.pageSize = 10 ;


      _this.fetch(url,function(result){
        
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
         per_page: pagination.pageSize,
         page: pagination.current
      },
      'get')
  },
  delete:function(channelId){
    return () =>{

      const _this = this;

       confirm({
            title: '警告',
            content: '确定删除？',
            onOk() {
              del();
            }
          });

       var del = function(){
            _this.fetch(rootURL + '/business/BaiduXML/destroy/' + channelId,function(result){
             if(result.status === 'success'){
               ModalSuccess('提示','删除成功!');

               hasOper = true;
               document.getElementById('query').click();
               hasOper = false;

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
      this.fetch(rootURL + '/business/BaiduXML/restore/' + channelId,function(result){
         if(result.status === 'success'){
           ModalSuccess('提示','恢复成功!');

           hasOper = true;
           document.getElementById('query').click();
           hasOper = false;

         }else{
           ModalError('提示',result.info);
         }
       },function(){
          ModalError('提示','请求失败!');
       },{},'post')
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
  setLoading:function(params){
      this.props.loadingTo(params);
  },
  render() {

    var  _this = this,
        ID = this.props.locationQuery.query.id ,
        parentname = this.props.locationQuery.state.name ;

    var updateStyle = 'inline-block',
        adStyle = 'inline-block',
        deleteStyle = 'inline-block',
        recoverStyle = 'none';
   
    var columns = [{
          title: '子计费名',
          dataIndex: 'name'
        }, {
          title: '当前所属渠道',
          dataIndex: 'channel_name',
          render:function(text, record, index){
            return record.relation?record.relation.channel.name:'';
          }
        }, {
          title: '投放平台',
          dataIndex: 'relation',
           render:function(text, record, index){
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
          title: '备注',
          dataIndex: 'comment',
          className:'my-commentmax-width'
        }, {
          title: 'deleted_at',
          dataIndex: 'deleted_at',
          className:'antd-hidden'
        }, {
          title: '状态',
          dataIndex: 'states',
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
                                      comment : record.comment ,
                                      ID : ID ,
                                      id: record.id,
                                      parent : parentname,
                                      parentId : _this.props.locationQuery.state.parentId
                                     }  
                            }} style={{ textDecoration:'underline',display:updateStyle,marginRight:'5%' }}> 修改 </Link>
                 
                  <a  onClick={ _this.delete(record.id) } style={{ textDecoration:'underline',display:deleteStyle,marginRight:'5%' }}> 删除 </a>
                  
                  <a ref='del' onClick={ _this.recover(record.id) } style={{ textDecoration:'underline',display:recoverStyle,marginRight:'5%'  }} > 恢复 </a>
                  
                  <Link to={{  pathname:"business/BaiduXML/history",state:{ type:1,id:record.id,name:parentname,child_name:record.name } }} style={{ textDecoration:'underline',marginRight:'5%' }} > 关联历史 </Link>
                  
                  <a target="_self" href="javascript:alert('暂无功能!')" style={{ textDecoration:'underline',display:adStyle }}> 广告代码 </a>
                </div>
            )

          }
        }
    ];

   
    return (
      <div>
        <FilterForm filterParam={ this.fromFilter } locationState={ this.props.locationQuery.state }/>
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


var Billingname = React.createClass({
  getInitialState() {
      return {
          filterParams : {} ,
          loading : true
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
            title: '业务 > 百度XML > 子计费名',
            operTitle: '添加子计费名',
            route:{
              pathname : "/business/BaiduXML/childupdate" ,
              state:{ type:'add' ,
                      adtype:'百度XML',
                      ID:this.props.location.query.id ,
                      parent :this.props.location.state.name,
                      parentId: this.props.location.state.parentId
                    }
            }
           }}/>
           <TableContent locationQuery={ this.props.location } parentToTable={ this.state.filterParams } loadingTo={ this.setLoading }/>
        </Spin>
      </div>
    )
  }
})


export default Billingname;