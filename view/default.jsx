import React from 'react';
import MenuList from './sider/side.jsx';



var Default = React.createClass({
	getInitialState() {
	    return {
	        menuChange:false  
	    };
	},
	render:function(){
		
		return (
			<div style={{ height:'100%' }}>
				<div id="sider">
					<MenuList/>
				</div>
				<div id="mainer">
					{this.props.children}
				</div>
				
			</div>
		)
	}
})



module.exports = Default;