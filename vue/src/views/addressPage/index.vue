<template>
<div>
 <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
 <MainHeader title='地址管理' sub-title='可管理地址，包括新增地址、编辑地址和删除地址' btn-title='添加新地址' target="myModalB"></MainHeader>
<!-- Start Top Stats -->
<div class="wrapper-content margin-t-15">
	<ul class="topstats clearfix border-color1">
		<li class="col-md-2">
			<span class="title"><i class="fa fa-map-marker"></i>地址总数</span>
			<h3 class="color5">{{items.addressTotal}}</h3>
		</li>
		<li class="col-md-2">
			<span class="title"><i class="fa fa-hand-o-up"></i>手动添加</span>
			<h3>{{items.manualTotal}}</h3>
		</li>
		<li class="col-md-2">
			<span class="title"><i class="fa fa-lightbulb-o"></i>关联分析</span>
			<h3 class="color-down">{{items.anaylseTotal}}</h3>
		</li>
		<li class="col-md-2">
			<span class="title"><i class="fa fa-users"></i>涉及对象</span>
			<h3>{{items.targetTotal}}</h3>
		</li>
		<li class="col-md-2">
			<span class="title"><i class="fa fa-globe"></i>涉及案件</span>
			<h3>暂无</h3>
		</li>
		<li class="col-md-2">
			<span class="title"><i class="fa fa-plus"></i>本月新增</span>
			<h3 class="color-down">{{items.monthTotal}}</h3>
		</li>
	</ul>
</div>
	<Panelwrap title="地址列表"
	sortBtnType='addressPage'
	placeholder='请输入地址'
	:sortShow="true"
	:screen="true"
	v-on:searchClick='searchAddress'
	v-on:sortItem='sortItem'
	v-on:dataSelect='dataChange'
	>
		<div class="panel-body table-responsive">
			<p class="f-size-12 color4">
				显示您添加的地址、关联分析后收藏的地址。 点击&nbsp;
				<code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据地址号查询； 点击&nbsp;
				<code>&nbsp;<i class="fa fa-sort-amount-asc fa color4"></i>&nbsp;</code>&nbsp;可根据交易次数、最终余额排序； 点击&nbsp;
				<code>&nbsp;<i class="fa fa-filter"></i>&nbsp;</code>&nbsp;可按照收录时间段筛选。
			</p>
			<table class="table table-striped addressBasic_table">
				<thead>
					<tr>
						<td>地址</td>
						<td>收录时间</td>
						<td>来源</td>
						<td>交易次数</td>
						<td>最终余额</td>
						<td>交易地址数</td>
						<td>其他</td>
					</tr>
				</thead>
				<tbody v-if='lists'>
					<tr v-for='(item,index) in lists.list' :key="index">
						<td>
							<router-link :to="{ name: 'addressdetails',query:{ address: item.address }}" class="txid color4">{{item.address}}</router-link>
						</td>
						<td><small>{{item.time}}</small></td>
						<td><span :class="[item.source_from === 'manual' ? 'color10' : 'color5']">{{item.source_from | sourceFilter}}</span></td>
						<td>{{item.tx_num}}</td>
						<td>{{item.balance | feeFilter}} BTC</td>
						<td>{{item.r_address_num}}</td>
						<td>
							<router-link :to="{ name: 'addressdetails',query:{ address: item.address }}" class="btn btn-default btn-sm f-size-12">地址详情</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<el-pagination
		small layout="prev, pager, next"
		:total='lists.totalRow'
		:current-page.sync = 'defaultPage'
		style="text-align: center"
		@current-change='handleCurrentChange'
		>
    </el-pagination>
	</Panelwrap>
</div>
</template>
<script>
import Panelwrap from'../../components/PanelWrap/'
import MainHeader from'../../components/MainHeader/'
import { addressUpdate } from '../../store/types.js'

export default {
	components:{
		Panelwrap,
		MainHeader
	},
  data() {
    return {
    	items: {},
    	lists:[],
    	loading:false,
    	desc:true,
    	sortValue:'',
    	inputValue: '',
			defaultPage: 1,
			objectData: '',
			acceptType: '',
			sortType: '',
			startTime: '',
			endTime: ''
    }
  },
  methods: {
		getData(){
			this.$http.get('/api/address/index')
				.then(res =>{
				  if(res.data.data){
            this.items = res.data.data
          }
			})
				.catch(err =>{
					if (err) {
						this.$message({
							message: '登录失效,请重新登录',
							type: 'warning',
						})
						setTimeout(()=>{this.$router.push('/loginpage')},3000)
					}
				})

		},
		getList(params){
			this.loading = true
      this.$store.commit(addressUpdate,false)
			this.$http.post('/api/address/page',params)
				.then(res =>{
					this.loading = false
          if(res.data.data)
				  	this.lists = res.data.data
					if (this.lists.list.length==0) {
						this.$message({
							message: '暂无记录',
							type: 'warning',
						})
					}
				})
				.catch(err =>{
					if (err) {
					  this.loading=false
            this.$message({
              message: '数据返回异常，请尝试刷新或者重新登录',
              type: 'warning',
            })
					}
				})
		},
		searchAddress(value){
			this.getList({address:value})
		},
		sortItem(arg1,arg2){
			this.acceptType = arg1
			this.sortType = arg2
			this.defaultPage = 1
			this.handleCurrentChange()
		},
		dataChange(val){
			this.startTime = val.substring(0,10)
			this.endTime = val.substring(13)
			this.defaultPage = 1
			this.handleCurrentChange()
		},
		handleCurrentChange(value){
			this.getList({ pageNumber:value, desc : this.sortType, orderType: this.acceptType, startTime: this.startTime, endTime: this.endTime})
		},
		initialize(){
			this.$http.all([this.getData(),this.getList()])
		}
	},
  computed: {
    updateState () {
      //13uEiASd7VyfE7qWGYzZtanMiYguZM5c53
      return this.$store.state.address.update
    }
  },
  watch: {
    updateState(val) {
      console.log(val)
      if(val==true){
        this.getList();
      }
    }
  },
	mounted(){
  	this.initialize()
	},
}
</script>
<style lang="stylus">
.el-textarea__inner, .el-input-group__prepend, .el-input__inner
	border-color #BDC4C9
.el-select
	display block
</style>
