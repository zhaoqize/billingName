import {Modal, Button} from 'antd';

let modalWarn = function(title,content){
	Modal.warning({
	    title: title,
	    content: content,
	});

	//设置自动关闭时间
	setTimeout(function(){
	  var btnClose = document.getElementsByClassName('ant-confirm-btns')[0].firstChild;
	  if(btnClose){
	  	btnClose.click();
	  }
	},1500);
}

module.exports = modalWarn;