<template>
<div>
 <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
 <PageHeader title-content="交易详情" main-content="可查看该笔交易详细信息"></PageHeader>
		<!-- 基本信息+简单统计begin-->
	<div class="panel panel-deepGray">
		<div class="panel-body">
			<!--基本信息begin-->
			<h2 class="margin-t-0">
			基本信息
		</h2>
			<div class="addressBasic row">
				<div class="col-md-8 f-bold">
					<div class="margin-b-5">
						<span class="color1">交易号&nbsp;&nbsp;&nbsp;&nbsp;</span>
						<span>{{data.txid}}</span>
					</div>
					<div class="margin-b-5">
						<span class="color1">转出总额&nbsp;</span>
						<span>{{data.totalAmount}} BTC</span>
					</div>
					<div class="margin-b-5">
						<span class="color1">手续费&nbsp;&nbsp;&nbsp;&nbsp;</span>
						<span>{{data.fee | feeFilter}} BTC</span>
					</div>
					<div class="margin-b-5">
						<span class="color1">包含区块&nbsp;</span>
						<span>{{data.block}}</span>
					</div>
					<div class="margin-b-5">
						<span class="color1">接收时间&nbsp;</span>
						<span>{{data.acceptTime}}</span>
					</div>
				</div>
				<div class="col-md-4">
					<span><i class="fa fa-check color5"></i>&nbsp;<b class="color1">{{data.status}}</b></span><br />
					<span><i class="fa fa-check color5"></i>&nbsp;<b class="color1">确认次数：{{data.confirmTimes}}</b></span>
				</div>
			</div>
			<!--基本信息end-->
		</div>
	</div>
		<!--交易细节begin-->
	<div class="wrapper-content">
		<div class="panel panel-default">
			<div class="panel-title">
				交易细节
			</div>
			<div class="panel-body table-responsive">
				<p class="f-size-12 color4">
					左侧为转出地址集，右侧为转入地址集。
				</p>
				<!--转出地址和转入地址集合begin-->
				<div class="tradeDetailList clearfix">
					<!--转出地址集合begin-->
					<div class="col-md-5 rollout">
						<!--转出地址1-->
						<div v-if='data' v-for="(item, index) in data.inputAddresses" class="tradeDetailList_box border-color1">
							<div class="float-r color1">
								{{item.amount}}BTC
							</div>
							<div class="address">
                <toAddressDetail :address="item.address">
                  <a href="javascript:void(0)" class="address">{{item.address}}</a>
                </toAddressDetail>
							</div>
						</div>
					</div>
					<!--转出地址集合end-->
					<div class="col-md-1">
						<div class="text-center margin-t-5">
							<i class="fa fa-arrow-right f-size-24 color7"></i>
						</div>
					</div>
					<!--转入地址集合begin-->
					<div class="col-md-6 rollint">
						<!--转入地址1-->
						<div v-if='data' v-for="(item, index) in data.outputAddresses" class="tradeDetailList_box border-color1">
							<div class="float-r color1">
								{{item.amount}} BTC
							</div>
							<div class="address">
                <toAddressDetail :address="item.address">
                  <a href="javascript:void(0)" class="address">{{item.address}}</a>
                </toAddressDetail>
							</div>
						</div>
					</div>
					<!--转入地址集合end-->
				</div>
				<!--转出地址和转入地址集合end-->
				<!--交易总量begin-->
				<div class="clearfix tradeDetailBalance">
					<span class="color7-bg float-r colorWhite"> {{data.totalAmount}} BTC</span>
					<span class="color5-bg float-r margin-r-10 colorWhite">{{data.confirmTimes}}次确认</span>
					<span class="color4-bg float-l">手续费：{{ data.fee | feeFilter }}</span>
				</div>
				<!--交易总量end-->
			</div>
		</div>
	</div>
	<!--交易记录end-->
</div>
</template>
<script>
import PageHeader from '../../components/PageHeader/'
import toAddressDetail from'../../components/toAddressDetail/'

export default {
	components:{
		PageHeader,
    toAddressDetail
	},
  data() {
    return {
    	loading:false,

    	data:'',
    }
  },
  created(){
  },
  mounted(){
		let txid = this.$route.query.txid
		this.getData(txid)
  },
  methods:{
		getData(txid){
			this.loading = true
			this.$http.get('/api/tx/detail?txid=' + txid)
				.then( res =>{
				this.loading = false
				this.data = res.data.data
			}).catch(err =>{
          this.loading=false
          this.$message({
            message: '数据返回异常，请尝试刷新或者重新登录',
            type: 'warning',
          })
			})
		}
  },

}
</script>
<style lang="stylus" scoped>
</style>
