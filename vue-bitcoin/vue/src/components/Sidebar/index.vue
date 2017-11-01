<template>
	<!-- START SIDEBAR -->
	<div class="sidebar clearfix">
		<ul class="sidebar-panel nav">
			<li class="sidetitle">MAIN</li>
			<li>
				<a href="index.html"><span class="icon color5"><i class="fa fa-home"></i></span>首页</a>
			</li>
			<li>
				<a href="#"><span class="icon color6"><i class="fa fa-globe"></i></span>案件管理</a>
			</li>
			<li>
				<router-link :to="{ name: 'object' }"><span class="icon color7"><i class="fa fa-user"></i></span>对象管理
					<!--<span class="caret"></span>--></router-link>
				<!--<ul>
	      <li><a href="icons.html">Icons</a></li>
	      <li><a href="tabs.html">Tabs</a></li>
	      <li><a href="buttons.html">Buttons</a></li>
	      <li><a href="panels.html">Panels</a></li>
	      <li><a href="notifications.html">Notifications</a></li>
	      <li><a href="modal-boxes.html">Modal Boxes</a></li>
	      <li><a href="progress-bars.html">Progress Bars</a></li>
	      <li><a href="others.html">Others<span class="label label-danger">NEW</span></a></li>
	    </ul>-->
			</li>
			<li>
				<router-link :to="{ name: 'address' }"><span class="icon color8"><i class="fa fa-map-marker"></i></span>地址管理</router-link>
			</li>
			<li>
				<a href="charts.html"><span class="icon color8"><i class="fa fa-lightbulb-o"></i></span>关联分析</a>
			</li>
			<li>
				<a href="charts.html"><span class="icon color8"><i class="fa fa-flash"></i></span>实时预警<span class="label label-default">2</span></a>
			</li>

		</ul>

		<ul class="sidebar-panel nav">
			<li class="sidetitle">MORE</li>
			<li>
				<a href="javascript:void(0)"><span class="icon color10"><i class="fa fa-archive"></i></span>辅助工具<span class="caret"></span></a>
        <transition name="slide-show">
  				<ul>
  					<li>
  						<a href="form-elements.html">虚拟币保管箱</a>
  					</li>
  					<li>
  						<a href="layouts.html">取证镜像管理工具</a>
  					</li>
  					<li>
  						<a href="text-editors.html">协查函生成工具</a>
  					</li>
  				</ul>
        </transition>
			</li>
			<li>
				<a href="widgets.html"><span class="icon color11"><i class="fa fa-diamond"></i></span>信息帮助</a>
			</li>
		</ul>

	<!--<div class="sidebar-plan">
	  Pro Plan<a href="#" class="link">Upgrade</a>
	  <div class="progress">
	  <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
	  </div>
	</div>
	<span class="space">42 GB / 100 GB</span>
	</div>-->

	</div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  mounted() {
    $('.nav > li > a').click(function () {
      $(this).next().slideToggle()
    })
  },

}
</script>
<style lang="stylus" scoped>
  .slide-show-enter-active, .slide-show-leave-active
    transition: all .5s ease;

  .slide-show-enter, .slide-show-leave-to
    transform translateY(-10px);
    opacity 0;
</style>
