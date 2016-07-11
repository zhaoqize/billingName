import {Modal, Button} from 'antd';

let modalError = function(title,content){
	Modal.error({
	    title: title,
	    content: content,
	});

	setTimeout(function(){
	  document.getElementsByClassName('ant-confirm-btns')[0].firstChild.click()
	},1500);
}

module.exports = modalError;