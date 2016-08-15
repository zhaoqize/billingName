
import { Button,Icon,Table  } from 'antd';
import reqwest from 'reqwest';

import {PlatformMap} from '../../commentMap/index';


var Header = React.createClass({
	
	render:function(){
		return (
			<div>
				<h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}>业务 > 百度搜索 > 计费名关联历史( {this.props.localState.name} {this.props.localState.child_name? ' / ' + this.props.localState.child_name:''} )  </h3> 
			</div>
		)
	}
})


var AllHistory = React.createClass({
	getInitialState() {
	    return {
	        url : rootURL + '/business/BaiduSearch/' + this.props.localState.id + '/relations' ,
	        data:[],
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
	handleTableChange(pagination) {
    
      const pager = this.state.pagination;
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize;

      this.setState({
        pagination: pager,
      });
    },
    componentDidMount() {
    	const _this = this;
         reqwest({
	      url:_this.state.url,
	      method:'get',
	      type:'json'
	    }).then(result =>{
	      if(_this.isMounted()){
	      	_this.setState({
	      		data:result.data
	      	})
	      }
	    },function(){
	      console.log("失败!")
	    })
    },
	render:function(){
		const _this = this;
		var columns=[{
				title: '有效时间',
				dataIndex: 'oktime',
				render:function(text, record, index){
					return (record.start?record.start:'') +' 至 '+ (record.expire?record.expire:'');
				}
			},{
				title: '计费名',
				dataIndex: 'billing_name',
				render:function(text, record, index){
					return text.name?text.name:'';
				}
			},{
				title: '关联渠道',
				dataIndex: 'channel',
				render:function(text, record, index){
					return text?text.name:'';
				}
			},{
				title: '投放平台',
				dataIndex: 'line',
				render:function(text, record, index){
					return _this.props.platformMap[text];
				}
			},{
				title: '操作账户',
				dataIndex: 'user',
				render:function(text, record, index){
					return text.true_name?text.true_name:'';
				}
			},{
				title: '操作时间',
				dataIndex: 'updated_at'
			},{
				title: '备注',
				dataIndex: 'comment',
				className:'my-commentmax-width'
			}]


		return (
			<div>
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
		)
	}
})



var BillingNameHistory = React.createClass({
	goBack:function(){
		window.history.go(-1);
	},
	render:function(){
		return (
			<div>
				<Header localState={ this.props.location.state }/>
				<AllHistory localState={ this.props.location.state }/>
			</div>
		)
	}
})


export default BillingNameHistory;