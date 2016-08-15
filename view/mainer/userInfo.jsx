import { Button, 
		 Form, 
		 Input,
		 Select,
		 Row,
		 Col,
		 Icon  } from 'antd';
import reqwest from 'reqwest';
const createForm = Form.create;
const FormItem = Form.Item;

var Header = React.createClass({
	render:function(){
		return (
			<div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}>
	          <h3 style={{ margin: '20px 0px 20px 20px',display:'inline-block' }}> 个人资料 </h3>
	        </div>
		)
	}
})

var InfoFrom = React.createClass({
	render:function(){
		const formItemLayout = {
	      labelCol: { span: 1 },
	      wrapperCol: { span: 3 },
	    };

		return (
			<Form horizontal style={{ marginTop:20 }}>
	            <FormItem label="工号ID"  {...formItemLayout}>
	            	{ this.props.localState ? this.props.localState.uams_user_id : '' }
	            </FormItem>
	            <FormItem label="姓名"  {...formItemLayout}>
	             	{ this.props.localState ? this.props.localState.true_name : ''}
	            </FormItem>
	            <FormItem label="邮箱"  {...formItemLayout}>
	              	{ this.props.localState ? this.props.localState.email : ''}
	            </FormItem>
            </Form>
		)
	}
})

var Index = React.createClass({
	render:function(){
		return (
			<div>
				<Header />
				<InfoFrom localState={ this.props.location.state } />
			</div>
		)
	}
})

module.exports = Index;