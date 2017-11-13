<template>
  <div style="color: #676a6c;">
    <div class="modal fade" id="changePassword" tabindex="-1" role="dialog" aria-hidden="true">
       <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-center">
            <button @click="resetForm('ruleForm')" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">重置密码</h4>
          </div>
          <div class="modal-body">
            <el-form class="form-horizontal" :model='ruleForm' :rules='objectRules' ref="ruleForm" auto-complete="off">
              <!--输入原密码-->
              <div class="form-group" style="margin-top: 10px;">
                <label class="col-sm-2 control-label form-label">原密码</label>
                <div class="col-sm-10">
                  <el-form-item prop='oldPassWord'>
                    <el-input v-model='ruleForm.oldPassWord' type="password"  auto-complete="new-password" spellcheck="false"></el-input>
                  </el-form-item>
                </div>
              </div>
              <!--输入新密码-->
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">新密码</label>
                <div class="col-sm-10">
                  <el-form-item prop='newPassWord'>
                    <el-input v-model='ruleForm.newPassWord' type="password"  auto-complete="new-password" spellcheck="false"></el-input>
                  </el-form-item>
                </div>
              </div>
              <!--输入确认密码-->
              <div class="form-group">
                <label class="col-sm-2 control-label form-label">确认密码</label>
                <div class="col-sm-10">
                  <el-form-item prop='confirmPassWord'>
                    <el-input v-model='ruleForm.confirmPassWord' type="password" auto-complete="new-password" spellcheck="false"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white" data-dismiss="modal" @click="resetForm('ruleForm')">取消</button>
            <button type="button" class="btn btn-default" @click="submitForm('ruleForm')">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import crypto from 'crypto';
    export default {
        data() {
          var checkPwd = (rule, value, callback) =>{
            if (value === '') {
              callback(new Error('请输入老密码'));
            }else {
              callback()
            }
          }
          var checkNewPwd = (rule, value, callback) =>{
            if (value === '') {
              callback(new Error('新密码不能为空'));
            }else if( value.length < 6 ){
              callback(new Error('新密码不能少于6位'));
            }else {
              callback()
            }
          }
          var confirmPassWord= (rule, value, callback) =>{
            if (value !== this.ruleForm.newPassWord) {
              callback(new Error('确认密码与新密码不同'));
            }else {
              callback()
            }
          }
            return {
              ruleForm:{
                oldPassWord:'',
                newPassWord:'',
                confirmPassWord:''
              },
              objectRules:{
                oldPassWord:[
                  { validator: checkPwd, trigger: 'blur' }
                ],
                newPassWord:[
                  { validator: checkNewPwd, trigger: 'blur' }
                ],
                confirmPassWord:[
                  { validator: confirmPassWord, trigger: 'blur' }
                ]
              }
            }
        },
        methods: {
          md5(input){
            return crypto.createHash('md5').update(input).digest('hex');
          },
          resetForm(formName){
            this.$refs[formName].resetFields();
          },
          submitForm(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.changePassword()
              } else {
                return false;
              }
            });
          },
          changePassword(){
            let oldPassWord = this.md5(this.ruleForm.oldPassWord)
            let newPassWord= this.md5(this.ruleForm.newPassWord)
            this.$http.post('/admin/updatePw',{ oldPassWord:oldPassWord,newPassWord:newPassWord})
              .then(res =>{
                if (res.data.success) {
                  $("#changePassword").modal("hide");
                  this.$message({
                    message: '密码修改成功',
                    type: 'success'
                  })
                  this.resetForm('ruleForm');
                  //this.$router.push('/loginpage')
                }else {
                  this.$message({
                    message: res.data.message,
                    type: 'warning'
                  })
                }
              })
          }
        },
        components: {}
    }
</script>
