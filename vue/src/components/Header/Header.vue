<template>
  <!-- START TOP -->
  <div id="top" class="clearfix">
  	<!-- Start App Logo -->
  	<div class="applogo">
  		<router-link :to="{ name : 'homepage'}" class="logo">区块链</router-link>
  	</div>
  	<!-- End App Logo -->

    <!-- Start Sidebar Show Hide Button -->
    <a href="javascript:void(0)" class="sidebar-open-button"><i class="fa fa-bars"></i></a>
    <a href="javascript:void(0)" class="sidebar-open-button-mobile"><i class="fa fa-bars"></i></a>
    <!-- End Sidebar Show Hide Button -->

    <!-- Start Searchbox -->
    <!--<form class="searchform ">
      <input type="text" class="searchbox" id="searchbox" placeholder="Search">
      <span class="searchbutton"><i class="fa fa-search"></i></span>
    </form>-->
    <form  class="searchform ">
      <el-input v-model="searchValue" :placeholder="optionValue==1?'请输入地址':'请输入名称或身份证号'"  class="input-with-select">
        <el-select v-model="optionValue" slot="prepend" placeholder="请选择">
          <el-option v-for="(item,index) in options" :key=index :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button slot="append" icon="search" @click="toSearch"></el-button>
      </el-input>
    </form>
<!--    <div class="searchbox">
      <el-select v-model="value2"  placeholder="请选择" style="border: none" >
        <el-option  :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in options2"></el-option>
      </el-select>
    </div>-->
    <!-- End Searchbox -->

    <!-- Start Top Menu -->
    <!--<ul class="topmenu">
      <li><a href="#">Files</a></li>
      <li><a href="#">Authors</a></li>
      <li class="dropdown">
        <a href="#" data-toggle="dropdown" class="dropdown-toggle">My Files <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li><a href="#">Videos</a></li>
          <li><a href="#">Pictures</a></li>
          <li><a href="#">Blog Posts</a></li>
        </ul>
      </li>
    </ul>-->
    <!-- End Top Menu -->

    <!-- Start Sidepanel Show-Hide Button -->
    <a v-if="false" href="javascript:void(0)" class="sidepanel-open-button"><i class="fa fa-outdent"></i></a>
    <!-- End Sidepanel Show-Hide Button -->
    <!-- Start Top Right -->
		<ul class="top-right">
			<li class="dropdown link">
				<a href="#" data-toggle="dropdown" class="dropdown-toggle hdbutton">添加一个新的 <span class="caret"></span></a>
				<ul class="dropdown-menu dropdown-menu-list">
					<li>
						<a href="#"  data-toggle="modal" data-target="#myModalA"><i class="fa falist fa-globe"></i>案件</a>
					</li>
					<li>
						<a href="#" data-toggle="modal" data-target="#myModalB"><i class="fa falist fa-map-marker"></i>地址</a>
					</li>
					<li>
						<a href="#" data-toggle="modal" data-target="#myModalA"><i class="fa falist fa-user"></i>对象</a>
					</li>
				</ul>
			</li>
			<!--<li class="link">
				<a href="javascript:void(0)" class="notifications">您有6个新消息</a>
			</li>-->
			<li class="dropdown link">
				<a href="javascript:void(0)" data-toggle="dropdown" class="dropdown-toggle profilebox"><img src="../../assets/images/profileimg.png" alt="img"><b>{{account}}</b><span class="caret"></span></a>
				<ul class="dropdown-menu dropdown-menu-list dropdown-menu-right">
					<li role="presentation" class="dropdown-header">账户管理</li>
					<li>
						<a href="#" data-toggle="modal" data-target="#changePassword"><i class="fa falist fa-key"></i>修改密码</a>
					</li>
          <!--<li>
                        <a href="javascript:void(0)"><i class="fa falist fa-wrench"></i>设置</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="javascript:void(0)"><i class="fa falist fa-lock"></i>锁屏</a>
                    </li>-->
					<li @click='loginOut'>
						<a href="javascript:void(0)"><i class="fa falist fa-power-off"></i>退出登录</a>
					</li>
				</ul>
			</li>
		</ul>
		<!-- End Top Right -->
    <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
    <addAddress @loading="objectLoading" @addSuccess="addressSuccess"></addAddress>
    <addObject  @loading="objectLoading" @addSuccess="objectSuccess"></addObject>
    <changePwd></changePwd>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { LOGINOUT } from '../../store/types'
import addObject from'../../components/addObject/'
import addAddress from'../../components/addAddress/'
import changePwd from'../../components/changePwd/'
export default {
  components: {
    addObject,
    addAddress,
    changePwd
  },
  data() {
    return {
      loading:false,
      options: [{
        value: 1,
        label: '地址'
      },{
        value: 2,
        label: '对象'
      }],
      optionValue: 1,
      searchValue:''
    }
  },
  computed: mapState({
      account: state => state.login.account
  }),
  methods: {
    loginOut() {
      //console.log(this.account)
      this.$http.get('/admin/loginOut',{'account': this.account})
      .then(res => {
        if (res.data.success) {
          this.$store.commit(LOGINOUT)
          this.$router.push({
            path: '/loginpage'
          })
        }
      }).catch(err =>{
        this.$store.commit(LOGINOUT)
        this.$router.push({
          path: '/loginpage'
        })
      })
    },

    objectLoading(e){
      console.log(e)
      this.loading=e;
    },
    addressSuccess(){
      this.$emit('addressSuccess');
    },
    objectSuccess(){
      this.$emit('objectSuccess');
    },
    toSearch(){
      if(this.optionValue === 1){
        this.$router.push({name:'address',query:{search: this.searchValue}})
      }else{
        this.$router.push({name:'object',query:{search: this.searchValue}})
      }
    }
  },
  mounted() {
    $('.sidebar-open-button , .sidebar-open-button-mobile').on('click', function () {
      if ($('.sidebar').hasClass('active')) {
        $('.sidebar').removeClass('active')
        $('.content').css({ 'marginLeft': 250, 'transition': 'all 0.4s ease-in-out' })
        $('.sidebar').css({ 'marginLeft': 0, 'transition': 'all 0.4s ease-in-out','display':'block'})
	    } else {
        $('.sidebar').addClass('active')
        $('.content').css({ 'marginLeft': 0, 'transition': 'all 0.4s ease-in-out' })
        $('.sidebar').css({ 'marginLeft': -250, 'transition': 'all 0.4s ease-in-out','display':'none'})

      }
    })
  },
}
</script>
<style scoped>
  .searchform{
    width: 440px;
  }
  .el-select{
    width: 90px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
