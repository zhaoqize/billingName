import MenuList from './sider/side';
import { Row, 
		 Col } from 'antd';


var Default = React.createClass({
	render:function(){
		return (
			<div style={{ height:'100%' }}>
				<Row style={{ height:'100%' }}>
			      <Col lg={{ span:3 }} sm={{ span:5 }} style={{ height:'100%' }}><MenuList/></Col>
			      <Col lg={{ span:21 }} sm={{ span:19 }} style={{ overflowY: 'auto',height: '100%' }}>{this.props.children}</Col>
			    </Row>
			</div>
		)
	}
})



module.exports = Default;






















