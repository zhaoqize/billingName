import {Modal, Button} from 'antd';

let modalSuccess = function(title,content){
	Modal.success({
	    title: title,
	    content: content,
	});

	setTimeout(function(){
	  document.getElementsByClassName('ant-confirm-btns')[0].firstChild.click()
	},1500);
}

module.exports = modalSuccess;