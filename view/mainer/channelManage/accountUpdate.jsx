import React from 'react';
import { Button, Form, Input } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

let accountUpdate = React.createClass({

  render() {
    return (
      <div>
        <div className='h2bgc'>
          <h3 style={{ margin:'15px 0 20px 20px',display:'inline-block' }}>账号管理 > 修改账号</h3>
        </div>
        <table>
          <tbody>
          <tr style={{ height:40 }}>
            <td className='trodd' >渠道名称:</td>
            <td><Input className='treven' type="text" placeholder="请选择渠道名称"/></td>
            <td className='trodd' >代理渠道商名称/ID:</td>
            <td><Input className='treven' type="text" placeholder="请填写代理渠道商名称/ID"/></td>
          </tr>
          <tr style={{ height:40 }}>
            <td className='trodd' ><span className='ant-form-item-required'>用户名:</span></td>
            <td><Input className='treven' type="text" placeholder="请填写用户名"/></td>
          </tr>
          <tr style={{ height:40 }}>
            <td className='trodd' ><span className='ant-form-item-required'>密码:</span></td>
            <td><Input className='treven' type="text" placeholder="请填写密码"/></td>
          </tr>
          <tr style={{ height:40 }}>
            <td className='trodd' ><span className='ant-form-item-required'>联系人:</span></td>
            <td><Input className='treven' type="text" placeholder="请填写联系人"/></td>
          </tr>
          <tr style={{ height:40 }}>
            <td className='trodd' ><span className='ant-form-item-required'>联系电话:</span></td>
            <td><Input className='treven' type="text" placeholder="请填写联系电话"/></td>
          </tr>
          <tr style={{ height:40 }}>
            <td className='trodd' >QQ号码:</td>
            <td><Input className='treven' type="text" placeholder="请填写QQ号码"/></td>
          </tr>
          <tr style={{ height:40 }}>
            <td className='trodd' >电子邮箱:</td>
            <td><Input className='treven' type="text" placeholder="请填写电子邮箱"/></td>
          </tr>
          <tr style={{ height:40 }}>
            <td className='trodd' >联系地址</td>
            <td><Input className='treven' type="text" placeholder="请填写联系地址"/></td>
          </tr>
              
          </tbody>
        </table>
        <div>
          <Button type="primary" onClick={ this.handleSubmit } style={{ marginLeft:150 }}>提交</Button>
          <Button type="primary" onClick={ this.handleCancel } style={{ marginLeft:50 }}>取消</Button>
        </div>
      </div>
      
    );
  },
});


export default accountUpdate;