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
    <form class="searchform">
      <input type="text" class="searchbox" id="searchbox" placeholder="Search">
      <span class="searchbutton"><i class="fa fa-search"></i></span>
    </form>
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
    <a href="#sidepanel" class="sidepanel-open-button"><i class="fa fa-outdent"></i></a>
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
    <addAddress id="myModalB" @loading="objectLoading" @addSuccess="objectSuccess"></addAddress>
    <addObject id="myModalA" @loading="objectLoading" @addSuccess="objectSuccess"></addObject>
    <changePassword></changePassword>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LOGINOUT } from '../../store/types'
import addObject from'../../components/addObject/'
import addAddress from'../../components/addAddress/'
import changePassword from'../../components/changePassword/'
export default {
  components: {
    addObject,
    addAddress,
    changePassword
  },
  data() {
    return {
      loading:false
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
      })
    },

    objectLoading(e){
      console.log(e)
      this.loading=e;
    },
    objectSuccess(){
      this.$emit('objectSuccess');
    },
  },
  mounted() {
    $('.sidebar-open-button , .sidebar-open-button-mobile').on('click', function () {
      if ($('.sidebar').hasClass('active')) {
        $('.sidebar').removeClass('active')
        $('.content').css({ 'marginLeft': 250, 'transition': 'all 0.4s ease-in-out' })
        $('.sidebar').css({ 'marginLeft': 0, 'transition': 'all 0.4s ease-in-out'})
	    } else {
        $('.sidebar').addClass('active')
        $('.content').css({ 'marginLeft': 0, 'transition': 'all 0.4s ease-in-out' })
        $('.sidebar').css({ 'marginLeft': -250, 'transition': 'all 0.4s ease-in-out'})

      }
    })
  },
}
</script>
