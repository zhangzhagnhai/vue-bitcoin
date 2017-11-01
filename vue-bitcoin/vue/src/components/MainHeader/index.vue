<template>
	<div class="page-header wrapper-content">
		<div class="row">
			<div class="col-md-8">
				<h1 class="title">{{title}}</h1>
				<small class="color4">{{subTitle}}</small>
			</div>
			<div class="col-md-4">
				<!-- 页面标题右侧部分begin -->
				<div class="right">
					<div class="btn-group" role="group" aria-label="...">
						<a href="#" class="btn btn-default" data-toggle="modal" data-target="#myModal">{{btnTitle}}</a>
					</div>
				</div>
				<!-- 页面标题右侧部分end -->
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		subTitle: {
			type: String,
			required: true,
		},
		btnTitle:{
			type: String,
			required: true,
		}

	},
  data() {
    return {
    }
  },
}
</script>
<style lang="stylus" scoped>
</style>
