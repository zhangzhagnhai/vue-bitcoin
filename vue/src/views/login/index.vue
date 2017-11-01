<template>
  <div class="login-form">
    <el-form :model="loginForm" :rules="rules" ref="loginForm">
      <div class="top">
        <img src="" alt="icon" class="icon">
        <h1>区块链</h1>
<!--         <h4>Bootstrap Admin Template</h4>
 -->      </div>
      <div class="form-area">
        <div class="group">
        	<el-form-item prop='username'>
	          <el-input loading='false' type="text"  placeholder="Username" v-model="loginForm.username" @keyup.enter.native="enterLogin($event,'loginForm')" auto-complete="off">
	          	<template slot="prepend"><i class="fa fa-user"></i></template>
	        	</el-input>
        	</el-form-item>
        </div>
        <div class="group">
					<el-form-item prop='password'>
	          <el-input loading='false' type="password" placeholder="Password" v-model="loginForm.password" @keyup.enter.native="enterLogin($event,'loginForm')" auto-complete="off">
	          <template  slot="prepend"><i style="width: 11px; text-align: center" class="fa fa-lock"></i></template>
	          </el-input>
					</el-form-item>
        </div>
        <div class="checkbox checkbox-primary">
          <input id="checkbox101" type="checkbox" checked>
          <label for="checkbox101"> Remember Me</label>
        </div>
        <input type="button"  @click="submitForm('loginForm')" class="btn btn-default btn-block" value="LOGIN">
      </div>
    </el-form>
    <div class="footer-links row">
      <div class="col-xs-6"><a href="#"><i class="fa fa-external-link"></i> Register Now</a></div>
      <div class="col-xs-6 text-right"><a href="javascript:void(0);"><i class="fa fa-lock"></i> Forgot password</a></div>
    </div>
  </div>
</template>
<script>
import crypto from 'crypto';
import { LOGIN } from '../../store/types.js'
document.body.style.background="#F5F5F5"

export default {
  data() {
		var checkUser = (rule, value, callback) =>{
			if (value === '') {
        callback(new Error('用户名不能为空'));
			}else if ( value.length < 6 ){
        callback(new Error('用户名不能少于6位'));
			}else {
				callback()
			}
		}

		var checkPwd = (rule, value, callback) =>{
			if (value === '') {
         callback(new Error('密码不能为空'));
			}else if( value.length < 6 ){
         callback(new Error('密码不能少于6位'));
			}else {
				callback()
			}
		}
    return {
		loginForm: {
			username:'',




			password:'',
		},
		rules: {
			username:[
        { validator: checkUser, trigger: 'blur' }
			],
			password: [
        { validator: checkPwd, trigger: 'blur' }
			]
		}
   }
  },
  methods:{
  	enterLogin(e,formName){
			if (e.keyCode == 13) {
	      this.$refs[formName].validate((valid) => {
	        if (valid) {
	          this.login()
	        } else {
	          return false;
	        }
	      });
     	}
  	},
		md5(input){
			return crypto.createHash('md5').update(input).digest('hex');
		},
		submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login()
        } else {
          return false;
        }
      });
    },
		login(){
			let account = this.loginForm.username
			let password = this.md5(this.loginForm.password)
			this.$http.get(`/login?account=${account}&password=${password}`)
				.then(res =>{
					if (res.data.success) {
							this.$store.commit(LOGIN, res.data.data.account)
							this.$message({
							showClose:true,
							type:'success',
							message:'登录成功'
						})
							setTimeout(this.$router.push('/address'),3000)
					 }else{
						this.$message({
							 showClose:true,
							 message:res.data.message,
							 type:'error'
						})
						this.$refs['loginForm'].resetFields();

					 }
				})
				.catch(err =>{
					if (err) {
						console.warn(err)
					 	this.$message({
						  showClose:true,
							message:'维护中...',
							type:'error'
						})
					}
				})
		},
  }
}
</script>
<style lang="stylus" scoped>
</style>
