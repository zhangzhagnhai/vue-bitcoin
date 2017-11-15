<template>
	<div>
		<div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
		<MainHeader title='对象管理' sub-title='可管理对象，包括新增对象、编辑对象和删除对象' btn-title='添加新对象'  target="myModalA"></MainHeader>
		<div class="wrapper-content margin-t-15">
			<ul class="topstats clearfix border-color1">
				<li class="col-md-2">
					<span class="title"><i class="fa fa-users"></i>对象总数</span>
					<h3 class="color5">{{totalData.targetTotal}}</h3>
				</li>
				<li class="col-md-2">
					<span class="title"><i class="fa fa-hand-o-up"></i>手动添加</span>
					<h3>{{totalData.manualTotal}}</h3>
				</li>
				<li class="col-md-2">
					<span class="title"><i class="fa fa-lightbulb-o"></i>关联分析</span>
					<h3 class="color-down">{{totalData.anaylseTotal}}</h3>
				</li>
				<li class="col-md-2">
					<span class="title"><i class="fa fa-map-marker"></i>涉及地址</span>
					<h3>{{totalData.addressTotal}}</h3>
				</li>
				<li class="col-md-2">
					<span class="title"><i class="fa fa-globe"></i>涉及案件</span>
					<h3>暂无</h3>
				</li>
				<li class="col-md-2">
					<span class="title"><i class="fa fa-plus"></i>本月新增</span>
					<h3 class="color-down">{{totalData.monthTotal}}</h3>
				</li>
			</ul>
		</div>
		<!-- End Top Stats -->
		<Panelwrap title="对象列表"
		sortBtnType='objectPage'
		placeholder='请输入姓名或身份证号'
		:sortShow="true"
		:screen="true"
		v-on:searchClick='searchName'
		v-on:sortItem='sortItem'
		v-on:dataSelect='dataChange'
		>
			<div class="panel-body table-responsive">
				<p class="f-size-12 color4">
					显示您添加的对象、关联分析后收藏的对象。 点击&nbsp;
					<code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据对象姓名查询； 点击&nbsp;
					<code>&nbsp;<i class="fa fa-sort-amount-asc fa color4"></i>&nbsp;</code>&nbsp;可根据添加时间、已知拥有余额排序； 点击&nbsp;
					<code>&nbsp;<i class="fa fa-filter"></i>&nbsp;</code>&nbsp;可按照收录时间段筛选。
				</p>
				<table class="table table-striped addressBasic_table">
					<thead>
						<tr>
							<td>对象</td>
							<td>收录时间</td>
							<td>来源</td>
							<td>已知地址</td>
							<td>已知余额</td>
							<td>关联对象</td>
							<td>其他</td>
						</tr>
					</thead>
					<tbody>
						<tr v-if='lists' v-for='(item,index) in lists.list'>
							<td>
								<router-link :to="{ name: 'objectdetails', query:{ id: item.target_id } }"class="txid color4">{{item.name}}&nbsp<small>{{item.code}}</small></router-link>
							</td>
							<td><small>{{item.time}}</small></td>
							<td><span :class="[item.source_from === 'manual' ? 'color10' : 'color5']">{{item.source_from | sourceFilter}}</span></td>
							<td>{{item.addresstotal}}个</td>
							<td>{{item.balance | feeFilter }} BTC</td>
							<td>{{item.relation_num}}个</td>
							<td>
								<router-link :to="{ name: 'objectdetails', query:{ id: item.target_id } }" class="btn btn-default btn-sm f-size-12">对象详情</router-link>
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
   <!-- <addObject id="myModal" @loading="showLoading" @addSuccess="getList"></addObject>-->
	</div>
</template>
<script>
import MainHeader from '../../components/MainHeader/'
import Panelwrap from'../../components/PanelWrap/'
import addObject from'../../components/addObject/'
import { objectUpdate } from '../../store/types.js'

export default {
	components: {
		MainHeader,
		Panelwrap,
    addObject
	},
  data() {
    return {
    	loading: false,
    	totalData: {},
    	lists: '',
    	defaultPage: 1,
    	acceptType: '',
			sortType: '',
			startTime: '',
			endTime: ''
    }
  },
  methods: {
		getData(){
			this.loading = true
			this.$http.get('/api/target/index')
				.then(res =>{
					this.loading = false
          if(res.data.data)
				  	this.totalData = res.data.data;
			})
			  .catch(err =>{
            this.loading=false
            this.$message({
              message: '数据返回异常，请尝试刷新或者重新登录',
              type: 'warning',
            })
				})
		},
    showLoading(e){
      this.loading=e;
    },
		getList(params){
			this.loading = true;
      this.$store.commit(objectUpdate,false)
			this.$http.post('/api/target/page',params)
				.then(res =>{
					this.loading = false
          if( res.data.data)
					  this.lists = res.data.data
					if(this.lists.list.length == 0){
						this.$message({
							message: '暂无记录',
							type: 'warning',
						})
					}
				})
				.catch(err =>{
            this.loading=false
            this.$message({
              message: '数据返回异常，请尝试刷新或者重新登录',
              type: 'warning',
            })
				})
		},
		searchName(value){
			this.getList({name:value})
		},
    searchName2(value){
      let searchKey=this.$route.query.search;
      this.getList({name:searchKey})
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
			this.getList({ pageNumber:value, desc : this.sortType,  startTime: this.startTime, endTime: this.endTime})
		},

		initialize(){
      let searchKey=this.$route.query.search;
      if(searchKey){
        this.$http.all([this.getData(),this.searchName(searchKey)])
      }else{
        this.$http.all([this.getData(),this.getList()])
      }
	  },
  },
  computed: {
    updateState () {
      return this.$store.state.object.update
    }
  },
  watch: {
    updateState(val) {
      console.log(val)
      if(val==true){
        this.getList();
      }
    },
    "$route": "searchName2"
  },
  created(){
		//this.getAddressList()
   // console.log(this.$store.state.object.update)
  },
  mounted(){
    //this.getAddressList()
		this.initialize()
		// this.optionlists = this.addlists.map(item => {
  //       return { value: item, label: item };
  //     });
  }
}
</script>
<style lang="stylus">

</style>
