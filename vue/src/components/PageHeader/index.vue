<template>
	<div class="page-header wrapper-content">
		<div class="row">
			<div class="col-md-8">
				<h1 class="title">{{titleContent}}</h1>
				<small class="color4">{{mainContent}}</small>
			</div>
			<div class="col-md-4">
				<!-- 页面标题右侧部分begin -->
				<div class="right">
					<div class="btn-group" role="group" aria-label="...">
						<a @click='routerBack' class="btn btn-light"><i class="fa fa-angle-left f-bold"></i>返回</a>
						<a @click='reload' class="btn btn-light"><i class="fa fa-refresh"></i>刷新</a>
						<!--<a href="#" class="btn btn-light"><i class="fa fa-search"></i></a>-->
					<!--	<router-link :to="{name: 'homepage'}" class="btn btn-light" id="topstats"><i class="fa fa-home"></i>首页</router-link>-->
            <a href="javascript:void(0)" class="btn btn-light" id="topstats"><i class="fa fa-home"></i>首页</a>
					</div>
				</div>
				<!-- 页面标题右侧部分end -->
			</div>
		</div>
	</div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  props:{
		titleContent:{
			type: String,
			required: true
		},
		mainContent:{
			type: String,
			require:true
		}
  },
  methods:{
    routerBack(){
      this.$router.go(-1);
    },
    reload(){
      this.$router.go(0);
    },
  }
}
</script>
<style lang="stylus" scoped>
</style>
