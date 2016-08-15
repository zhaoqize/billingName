import {Modal, Button} from 'antd';

let modalSuccess = function(title,content){
	Modal.success({
	    title: title,
	    content: content,
	});

	setTimeout(function(){
		var btnClose = document.getElementsByClassName('ant-confirm-btns')[0];
		if(btnClose){
			btnClose.firstChild.click();
		}
	},1500);
}

module.exports = modalSuccess;
