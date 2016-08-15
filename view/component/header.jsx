import {Button,
		Icon } from 'antd';
import {Link} from 'react-router';

let HeardComponent = React.createClass({
	render:function(){
		const { params } = this.props;
		
		return (
			<div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px' }}>
	          <h3 style={{ margin: '20px 0px 20px 20px',display:'inline-block' }}> {params.title} </h3>
	          <Button type="primary" style={{ position:'absolute',right:50,marginTop:20 }}>
	            <Link to={ params.route } >
	            	<Icon type="plus"  />&nbsp;{params.operTitle}
	            </Link>
	          </Button>
	        </div>
		)
	}
})
	
module.exports = HeardComponent;

