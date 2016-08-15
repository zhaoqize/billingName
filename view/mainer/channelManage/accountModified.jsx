import { Button, Form, Input,Select,Row,Col  } from 'antd';
import reqwest from 'reqwest';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

import { ModalSuccess,
         ModalError,
         ModalWarn } from '../../component/index';

import { InfoError } from '../../commentMap/index';

let accountAdd = React.createClass({
  getInitialState() {
    return {
      options: [],
      channel: [],
      agent : []
    };
  },
  mixins: [InfoError],
  handleSubmit:function(e){
      e.preventDefault();
      const _this = this;
      
      if(_this.props.location.state.type === 'add'){
          this.props.form.validateFields((errors, values) => {
            if (!!errors) {
              console.log('Errors in form!!!');
              return;
            }

            var newData = this.props.form.getFieldsValue(); 
            
            _this.fetch(rootURL + '/account/store',function(result){
               if(result.status === 'success'){
                    ModalSucces('提示','添加成功!');

                    window.history.go(-1);
                 }else{
                    var str = _this.props.InfoError(result.info);

                    ModalError('提示',str);
                 }
              },function(){
                ModalError('提示','请求失败!');
              },newData,'post')
            

          });
      }else{
          this.props.form.validateFields(['channel_id','user_name','contacts','phone'],(errors, values) => {
            if (!!errors) {
              console.log('Errors in form!!!');
              return;
            }

            var newData = this.props.form.getFieldsValue(); 
            
            _this.fetch(rootURL + '/account/update/' + _this.props.location.state.id,function(result){
               if(result.status === 'success'){
                    ModalSucces('提示','修改成功!');

                    window.history.go(-1);
                 }else{

                    var str = _this.props.InfoError(result.info);

                    ModalError('提示',str);
                 }
              },function(){
                ModalError('提示','请求失败!');
              },newData,'post')
            

          });
      }

      
  },
  handleCancel:function(){
    window.history.go(-1);
  },
  selectChange:function(value,option){
    const _this = this;
    const { setFieldsValue } = this.props.form;
    _this.fetch(rootURL + '/channel/'+ value +'/children',function(result){
      if(result.status === 'success'){
        if(_this.isMounted()){
          _this.setState({
            agent:result.data
          })

          //清空代理商名称
          setFieldsValue({
            agent_id:''
          })
        }
      }
    },function(){
      console.log("拉关联失败!")
    },'','get')
  },
  componentDidMount:function(){
    const _this = this;
    
    
    _this.fetch(rootURL + '/channel/simple/enabled',function(result){
      if(result.status === 'success'){
        if(_this.isMounted()){
          _this.setState({
            channel:result.data
          })

          
        }
      }
    },function(){
      console.log("拉渠道失败!")
    },'','get')

     _this.fetch(rootURL + '/channel/'+ this.props.location.state.channel_id +'/children',function(result){
      if(result.status === 'success'){
        if(_this.isMounted()){
          _this.setState({
            agent:result.data
          })
        }
      }
    },function(){
      console.log("拉关联失败!")
    },'','get')

  },
  fetch:function(url,callbackone,callbacktwo,fieldObj,method){
    reqwest({
      url:url,
      data:fieldObj ,
      method:method,
      type:'json'
    }).then(result =>{
      callbackone(result);
    },function(){
      callbacktwo();
    })
  },
  noop:function(){
    return false;
  },
  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['rePassword'], { force: true });
      if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,255}$/.test(value)){
        callback(new Error('至少6位,且必须包含数字与字母'));
      }
    }
    callback();
  },

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  },
  noop:function(rule, value, callback){
    return false;
  },
  isNumber:function(rule, value, callback){
    if (value && !/^[0-9]*$/.test(value)) {
      callback(new Error('请填写数字'));
    } else {
      callback();
    }
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const routerData = this.props.location.state;
    let channel = [],
        agent = [],
        flag = routerData?(routerData.type === "add" ? true : false):'add';

     //设置options
     for (let i = 0; i < this.state.channel.length; i++) {
        channel.push(<Option key={this.state.channel[i].id} title={this.state.channel[i].name}>
                        {this.state.channel[i].name}</Option>);
     }
     for (let i = 0; i < this.state.agent.length; i++) {
        agent.push(<Option key={this.state.agent[i].id} title={this.state.agent[i].name}>
                      {this.state.agent[i].name}</Option>);
     }

     //校验区 
     var channel_idProps ;
    if(routerData.from && routerData.from === 'third'){
      channel_idProps = getFieldProps('channel_id',{ 
        rules: [
          { required: true, whitespace: true, message: '渠道名称必填' }
        ],
        initialValue:routerData.name? routerData.name + '':''
      });
    }else if(routerData.from && routerData.from === 'agent'){
      channel_idProps = getFieldProps('channel_id',{ 
        rules: [
          { required: true, whitespace: true, message: '渠道名称必填' }
        ],
        initialValue:routerData.channel_id? routerData.channel_id + '':''
      });
    }else{
      channel_idProps = getFieldProps('channel_id',{ 
        rules: [
          { required: true, whitespace: true, message: '渠道名称必填' }
        ],
        initialValue:routerData.channel_id? routerData.channel_id + '':''
      });
    }

     

     
     const user_nameProps = getFieldProps('user_name',{
      rules: [
        { required: true, whitespace: true, message: '请填写用户名' }
      ],
      initialValue:flag ? '' : routerData.user_name
    }
    );

    const passwdProps = getFieldProps('password',{
      rules: [
        { required: true, whitespace: true, message: '请填写密码' },
        { validator: this.checkPass },
      ],
      initialValue:flag ? '' : routerData.password
    }
    );

    const rePasswdProps = getFieldProps('rePassword', {
      rules: [{
        required: true,
        whitespace: true,
        message: '请再次输入密码',
      }, {
        validator: this.checkPass2,
      }],
    });

    const contactsProps = getFieldProps('contacts',{
      rules: [
        { required: true, whitespace: true, message: '请填写联系人' }
      ],
      initialValue:flag ? '' : routerData.contacts
    }
    );

    const phoneProps = getFieldProps('phone',{
      rules: [
        { required: true, whitespace: true, message: '请填写电话' },
        { validator: this.isNumber, }
      ],
      initialValue:flag ? '' : routerData.phone
    }
    );

    const qqProps = getFieldProps('qq',{
      rules: [
        { required: false, whitespace: true, message: '请填写QQ' },
        { validator: this.isNumber, }
      ],
      initialValue:flag ? '' : routerData.qq
    }
    );

    const addressProps = getFieldProps('address',{initialValue:flag ? '' : routerData.address});

    var agent_idProps ;
    if(routerData.from && routerData.from === 'third'){
      agent_idProps = getFieldProps('agent_id');
    }else if(routerData.name !== 0 && routerData.name){
      agent_idProps = getFieldProps('agent_id',{initialValue:flag ? (routerData.name?routerData.name + '':'') : routerData.name + ''});
    }else{
      agent_idProps = getFieldProps('agent_id');
    }

    
    

    const emailProps = getFieldProps('email',{
      rules:[
        { type: 'email', message: '请输入正确的邮箱地址' },
      ],
      trigger: ['onBlur', 'onChange'],
      initialValue:flag ? '' : routerData.email
    });

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    
    
    return (
      <div>
        <div style={{ border:'1px solid #E9E9E9',borderWidth:'0px 0px 1px 0px',marginBottom:20 }}>
          <h3 style={{ margin: '20px 0 20px 20px' }}>渠道 > 账号管理 > { flag?'新增账号':'修改账号' }</h3>
        </div>

        <Row>
            <Col span={5}>
              <Form horizontal form={this.props.form}>
                <FormItem label="第三方名称"  {...formItemLayout}>
                   <Select showSearch 
                           onSelect = {this.selectChange}
                           optionFilterProp="children"
                           notFoundContent="无法找到"  {...channel_idProps} placeholder="请选择渠道名称">
                      { channel }
                    </Select>
                   
                </FormItem>
                
                <FormItem label="用户名"  {...formItemLayout}>
                  <Input {...user_nameProps} type="text" placeholder="请输入用户名"/>
                </FormItem>
                <FormItem label="密码"  {...formItemLayout} style={{ display:flag?'':'none' }}>
                  <Input {...passwdProps} type="password" autoComplete="off" placeholder="请输入密码"
                    onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}/>
                </FormItem>
                <FormItem label="确认密码"  {...formItemLayout} style={{ display:flag?'':'none' }}>
                  <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
                    onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}/>
                </FormItem>
                <FormItem label="联系人"  {...formItemLayout}>
                  <Input {...contactsProps} type="text" placeholder="请输入联系人"/>
                </FormItem>
                <FormItem label="联系电话"  {...formItemLayout}>
                  <Input {...phoneProps} type="text" placeholder="请输入联系电话"/>
                </FormItem>
                <FormItem label="QQ号码"  {...formItemLayout}>
                  <Input {...qqProps} type="text" placeholder="请输入QQ号码"/>
                </FormItem>
                <FormItem label="电子邮件"  {...formItemLayout}>
                    <Input  {...emailProps} type="text" placeholder="请输入电子邮件"/>
                </FormItem>
                <FormItem label="联系地址"  {...formItemLayout}>
                  <Input {...addressProps} type="text" placeholder="请输入联系地址"/>
                </FormItem>

                <Button type="primary" onClick={ this.handleSubmit } style={{ marginLeft:115 }}>提交</Button>
                <Button type="ghost" onClick={ this.handleCancel } style={{ marginLeft:20 }}>取消</Button>
              </Form>
            </Col>
            <Col span={5}>
              <Form horizontal>
                <FormItem label="代理商名称"  {...formItemLayout}>
                  <Select showSearch 
                           optionFilterProp="children"
                           notFoundContent="无法找到"  {...agent_idProps}  placeholder="请选择代理渠道名称">
                      { agent }
                  </Select>
                </FormItem>
              </Form>
            </Col>
        </Row>    
      </div>
      
    );
  },
});



accountAdd = Form.create()(accountAdd)

export default accountAdd;