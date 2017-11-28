<template>
<div>
 <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
 <PageHeader title-content="地址信息" main-content="对该地址基础信息、交易记录等进行简单分析，地址是给他人发送比特币时的识别码"></PageHeader>
	<!-- 基本信息+简单统计begin-->
	<div class="panel panel-deepGray">
		<div class="panel-body">
			<!--基本信息begin-->
			<h2 class="margin-t-0">
				基本信息
				&nbsp;<a href="javascript:void(0)" class="f-size-18" data-toggle="tooltip" data-placement="top" title="" data-original-title="收藏地址"><i class="fa fa-heart-o"></i></a>
				&nbsp;<a href="javascript:void(0)" @click='openedit' class="f-size-18" data-toggle="tooltip"  data-placement="top" title="" data-original-title="编辑地址"><i class="fa fa-edit"></i></a>
				&nbsp;<a href="javascript:void(0)" @click='delConfirm' class="f-size-18" data-toggle="tooltip"  data-placement="top" title="" data-original-title="删除地址"><i class="fa fa-trash-o"></i></a>
			</h2>
			<div class="addressBasic row border-b-color">
				<div class="col-md-8 f-bold">
					<div class="margin-b-5">
						<span class="color1">地址：</span>
						<span>{{data.address}}</span>
					</div>
					<div class="margin-b-5">
						<span class="color1">来源：</span>
						<span>{{data.sourcefrom | sourceFilter}}</span>
					</div>
					<div class="margin-b-5">
						<span class="color1">收录时间：</span>
						<span>{{data.addtime}}</span>
					</div>
					<div class="margin-b-5">
						<span class="color1">备注：</span>
						<span v-if='flag'>{{data.remark}}</span>
						<div  v-else style="width:30%; display: inline-block">
							<el-input type="text"  size="mini" ref='remark' @keyup.enter.native='confirmEdit' v-model="data.remark" @blur='confirmEdit'></el-input>
						</div>
					</div>
				</div>
				<div class="col-md-4">
				<!--	<router-link :to="{ name: 'addressCharts',query:{ address: data.address }}" class="btn btn-default pull-right">地址分析</router-link>-->
          <a v-if="data.sourcefrom!='unknown'" href="javascript:void(0)" @click="openAddressCharts" class="btn btn-default pull-right">地址分析</a>
				</div>
			</div>
			<!--基本信息end-->
			<!--简单统计begin-->
			<div class="row">
				<div class="col-md-2 text-center">
					<label class="color4">交易次数</label><br />
					<span class="color1 f-bold">{{data.txtotal}}次</span>
				</div>
				<div class="col-md-2 text-center">
					<label class="color4">转入次数</label><br />
					<span class="color1 f-bold">{{data.txintotal | nullFilter}}次<span>（{{data.txInPer}}%)</span></span>
				</div>
				<div class="col-md-2 text-center">
					<label class="color4">转出次数</label><br />
					<span class="color1 f-bold">{{data.txouttotal | nullFilter}}次（{{data.txOutInPer}}%）</span>
				</div>
				<div class="col-md-2 text-center">
					<label class="color4">最终余额</label><br />
					<span class="color1 f-bold">{{data.balance | feeFilter}} BTC</span>
				</div>
				<div class="col-md-2 text-center">
					<label class="color4">关联地址<small>(同一拥有者)</small></label><br />
					<span class="color1 f-bold">{{data.sametargettotal}}个</span>
				</div>
				<div class="col-md-2 text-center">
					<label class="color4">交易地址</label><br />
					<span class="color1 f-bold">{{data.txaddresstotal}}个</span>
				</div>
			</div>
			<!--简单统计end-->
		</div>
	</div>
		<Panelwrap title='交易记录'
		sortBtnType='addressDetails'
		placeholder='请输入地址'
		:sortShow="true"
		:screen="true"
		v-on:searchClick='searchAddress'
		v-on:sortItem='sortItem'
		v-on:dataSelect='dataChange'
		v-on:exchange='exchangeData'
		v-on:txStatus='txStatusData'
		>
			<div class="panel-body table-responsive">
				<p class="f-size-12 color4">
					显示该地址最近的交易记录。 点击&nbsp;
					<code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据交易地址查询； 点击&nbsp;
					<code>&nbsp;<i class="fa fa-sort-amount-asc fa color4"></i>&nbsp;</code>&nbsp;可根据交易时间、交易数量排序； 点击&nbsp;
					<code>&nbsp;<i class="fa fa-filter"></i>&nbsp;</code>&nbsp;可按照交易时间段、转入/转出、交易状态筛选。
				</p>
				<table class="table table-striped addressBasic_table">
					<thead>
						<tr>
							<td>交易号</td>
							<td>接收时间</td>
							<td>转入/转出</td>
							<td>转出/转入总额</td>
							<td>交易地址</td>
							<td>交易状态</td>
							<td>其他</td>
						</tr>
					</thead>
					<tbody>
						<tr v-if='trade' v-for="(item, index) in trade.list">
							<td class="tdb">
								<a class="txid color4" href="javascript:void(0)">{{item.txid}}</a>
							</td>
							<td><small>{{item.acceptTime}}</small></td>
							<td><span v-bind:class="[item.inout === '转出' ? 'color10' : 'color7']">{{item.inout}}</span></td>
							<td><small  v-bind:class="[item.inout === '转出' ? 'color10' : 'color7']">{{item.totalAmount}}</small></td>
							<td class="tdb">
                <toAddressDetail :address="item.txAddresses">
                  <a href="javascript:void(0)"target = _blank class="txid color4">{{item.txAddresses}}</a>
                </toAddressDetail>
							</td>
							<td><span v-bind:class="[item.txstatus === '已确认' ? 'color5' : 'color4']"><i class="fa" v-bind:class="[item.txstatus === '已确认' ? 'fa-check' : 'fa-close']"></i>&nbsp;{{item.txstatus}}</span></td>
							<td>
								<router-link :to="{ name: 'tradedetails', query:{ txid: item.txid} }" class="btn btn-default btn-sm f-size-12">交易详情</router-link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<el-pagination
			small layout="prev, pager, next"
			:total='trade.totalRow'
			:current-page.sync = 'defaultPage1'
			style="text-align: center"
			@current-change='handleTardeChange'
			>
	    </el-pagination>
		</Panelwrap>
		<Panelwrap title='交易地址'
		v-on:searchClick='searchAddress2'
		placeholder='请输入地址'
		>
			<div class="panel-body table-responsive">
				<p class="f-size-12 color4">
					显示与该地址有交易行为的地址。 点击&nbsp;
					<code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据交易地址查询。
				</p>
				<table class="table table-striped addressBasic_table" style="overflow: hidden;">
					<thead>
						<tr>
							<td>地址集</td>
							<td>拥有者信息</td>
							<td>交易次数</td>
							<td>交易总额</td>
						</tr>
					</thead>
					<tbody>
						<tr v-if='tradeAdd' v-for="(item, index) in tradeAdd.list">
							<td style="position: relative">
								<!-- <a class="txid color5" v-for="x in item.addresses">{{x}}</a> -->
								<div class="addresset" :class="{ showed : showNodes[index]}">
                  <toAddressDetail :address="item.addresses[index]" :key = 'index'  v-for="(x, index) in item.addresses">
                    <a href="javascript:void(0)" :style="{overflow:'visible'}"   class="txid color5">{{x}}</a>
                  </toAddressDetail>
						<!--		<router-link :style="{overflow:'visible'}" v-for="(x, index) in item.addresses" :key = 'index' :to = "{ name: 'addressdetails',query:{ address: x }}" target = _blank class="txid color5">{{x}}</router-link>-->
							  	<i @click="showNodes.splice(index, 1, !showNodes[index])" class="show-more fa" :class="[showNodes[index] ? 'fa-angle-double-up' : 'fa-angle-double-down']" v-if='item.addresses.length > 1 '></i>
								</div>
							</td>
							<td>
								<a class="txid color4" href="javascript:void(0)">{{item.targetName}}</a>
							</td>
							<td>{{item.txTimes}}</td>
							<td><small>{{item.txTotalAmount | feeFilter}}</small></td>
						</tr>
					</tbody>
				</table>
			</div>
			<el-pagination
			small layout="prev, pager, next"
			:total='tradeAdd.totalRow'
			style="text-align: center"
			@current-change='handleTradeAddChange'
			>
	    </el-pagination>
		</Panelwrap>
		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<button  type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">编辑地址信息</h4>
					</div>
					<div class="modal-body">
						<el-form class="form-horizontal" :model="data" :rules="addrules" ref='data'>
							<!--输入地址-->
							<div class="form-group">
		  <!-- 						<label for="exampleInputAmount3" class="col-sm-2 control-label form-label">地址</label>
								<div class="col-sm-10">
									<div class="input-group">
										<div class="input-group-addon"><i class="fa fa-map-marker color5"></i></div>
										<input type="text" class="form-control" v-model='address' id="exampleInputAmount3" placeholder="请输入地址，必填">
									</div>
								</div> -->
								<label  class="col-sm-2 control-label form-label">地址</label>
								<div class="col-sm-10">
								 <el-form-item prop='address'>
								  <el-input type="text" placeholder="请输入地址，必填" :disabled='true' v-model='data.address'>
									  <template slot="prepend"><i class="fa fa-map-marker color5"></i></template>
									</el-input>
								</el-form-item>
								</div>
							</div>
							<!--地址备注-->
							<div class="form-group">
								<label class="col-sm-2 control-label form-label">备注</label>
								<div class="col-sm-10">
									<el-form-item prop='remark'>
										<el-input type="textarea" :rows='5' v-model='data.remark'  placeholder="可输入更多地址备注信息，选填。(最大长度不能超过100汉字)"></el-input>
									</el-form-item>
								</div>
							</div>
							<!--更多信息begin-->
							<div>
								<a class="clearfix" data-toggle="collapse" href="#collapseExamples" aria-expanded="false" aria-controls="collapseExamples">
		            	<span class="float-r">更多&nbsp;<i class="fa fa-angle-down"></i></span>
		         		</a>
		         		<div class="collapse margin-t-10" id="collapseExamples">
		         			<!--拥有者-->
									<div class="form-group">
										<label class="col-sm-2 control-label form-label" >拥有者</label>
										<div class="col-sm-10">
											<el-select class="selectpicker" filterable v-model='objectValue'>
												<el-option data-icon="fa fa-user color5" v-for="(item, index) in objectData" :value="item.target_id" :key="item.concat" :label='item.concat'></el-option>
											</el-select>
										</div>
<!-- 										<div class="col-sm-4">
											<input type="button" value='添加新对象' @click='openObject' class="btn btn-default pull-right">
										</div> -->
									</div>
									<!--涉及案件-->
		               <!--<div class="form-group">
										<label class="col-sm-2 control-label form-label">涉及案件</label>
										<div class="col-sm-6">
											<select class="selectpicker">
												<option data-icon="fa fa-globe color5">&nbsp;案件1</option>
												<option data-icon="fa fa-globe color5">&nbsp;案件2</option>
												<option data-icon="fa fa-globe color5">&nbsp;案件3</option>
											</select>
										</div>
										<div class="col-sm-4">
											<a href="#" class="btn btn-default pull-right">添加新案件</a>
										</div>
									</div> -->
		          </div>
							</div>
		          <!--更多信息end-->
						</el-form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
						<button type="button" class="btn btn-default" @click="submitForm('data')">修改</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import PageHeader from '../../components/PageHeader/'
import Panelwrap from'../../components/PanelWrap/'
import toAddressDetail from'../../components/toAddressDetail/'

export default {
	components:{
		PageHeader,
		Panelwrap,
    toAddressDetail
	},
  data() {
  	var checkAddress = (rule, value, callback) =>{
			if (value === '') {
        return callback(new Error('地址不能为空'));
			}else if( value.length < 26 || value.length >34 ){
        return callback(new Error('地址输入有误'));
			}else {
				callback()
			}
		}
  	var checkName = (rule, value, callback) =>{
			if (value==='') {
         return callback(new Error('姓名不能为空'));
			} else {
  		  callback()
  	  }
    }
    var checkTextArea = (rule, value, callback) =>{
			let _length = 0
			for (var i = 0; i < value.length; i++) {
				if (value[i].charCodeAt(0) > 255) {
					_length += 2
				} else {
					_length += 1
				}
			}
			if (_length > 200) {
         return callback(new Error('最大长度不能超过100汉字'));
			} else{
				callback()
			}
		}
    return {
    	loading: false,
    	desc: true,
    	data: {
    		remark: '',
    		address:'',
    		   },
    	objectValue:'',//selecet value
    	trade: '',
    	tradeAdd: '',
    	acceptType: '',
			sortType: '',
			startTime: '',
			endTime: '',
      searchVal:'',
    	defaultPage1:1,
    	defaultPage2:1,
    	sortValue:'',
    	exchangValue: '',
    	txStatusValue: '',
    	showNodes:'',
    	flag:true,
    	objectData:'',
    	isshowed: false,
    	heightObj:{
				maxHeight:'28px'
    	},
    	addrules:{
				address:[
					{ validator: checkAddress, trigger: 'blur' }
				],
				remark:[
					{ validator: checkTextArea, trigger: 'blur' }
				],
			},
    }
  },
  created() {
  },
  filters:{

  },
  watch:{
    "$route": "initialize"
  },
  mounted(){
  	//let address = this.$route.query.address
		this.initialize()
  },
  methods:{
  	getObjectData(){
			this.loading = true
			this.$http.post('/api/target/targetList')
				.then(res =>{
					this.loading = false
					this.objectData = res.data.data;
			})
		},
  	openedit(){
  		if (this.data.sourcefrom == 'unknown') {
						this.$message({
							message: '未知地址，暂不支持修改',
							type: 'warning',
						})
					} else {
							$("#myModal").modal("show")
							this.objectData.forEach( item => {
							for(var k in item){
								if ( k ==='target_id' && item[k] == this.data.target_id) {
										this.objectValue = item[k]
							   }
						  }
			   	})
			}
		},
    openAddressCharts(){
      //this.$router.push({name:'addressCharts',query:{address: this.data.analysisId}})
      if (this.data.analysis ===0) {
        this.addTask();
      }else if(this.data.analysis ===1&&this.data.analysisId !=0){
        this.$router.push({name:'addressCharts',query:{analysisId: this.data.analysisId}})
      }else{
        this.$message({
          message: '已经开启地址分析任务，请到关联分析页面查看进度',
          type: 'warning',
        })
      }
    },
    addTask(){
      this.$http.post('/api/view/addAnalysisTx',{message:this.data.address})
        .then(res =>{
          if (res.data.success) {
            this.loading = false;
            this.$message({
              message: '开启地址分析任务，请到关联分析页面查看进度',
              type: 'success',
            })
          }
          else{
            this.$message({
              message: res.data.message,
              type: 'warning',
            });
            this.loading = false
          }
        })
    },
  	resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  	getData(address){
  		this.loading = true
  		this.$http.get('/api/address/detail/' + address)
  			.then(res => {
  				if (res.data.success) {
	  				this.loading = false
						this.data = res.data.data
  				}
  			})
				.catch(err =>{
          if (err) {
						this.$message({
							message: '数据返回异常，请尝试刷新或者重新登录',
							type: 'warning',
						})
						//setTimeout(()=>{this.$router.push('/loginpage')},3000)
					}
    		})
    	},
		getTrade(params){
			let defaultData = {'address': this.$route.query.address}
			let data = Object.assign (defaultData, params)
					this.loading = true
			this.$http.post(`/api/address/txrecords`,data)
				.then(res => {
					if (res.data.success) {
						this.trade = res.data.data
						this.loading = false
						if (this.trade.list.length == 0) {
						this.$message({
							message: '暂无记录',
							type: 'warning',
						})
						}
					}
				})
				.catch(err =>{
         if (err) {
                 this.$message({
                   message: '数据返回异常，请尝试刷新或者重新登录',
                   type: 'warning',
                 })
					//	setTimeout(()=>{this.$router.push('/loginpage')},3000)
					}
    		})
		},
		getTradeAdd(params){
			let defaultData = {'address': this.$route.query.address}
			let data = Object.assign (defaultData, params)
					this.loading = true
			this.$http.post(`/api/address/txtarget`,data)
				.then(res => {
					if (res.data.success) {
						this.tradeAdd = res.data.data
						this.loading = false
						this.showNodes = new Array(this.tradeAdd.list.length).fill(0)
					if (this.tradeAdd.list.length==0) {
						this.$message({
							message: '暂无记录',
							type: 'warning',
						})
					}
					}
				})
				.catch(err =>{
          			if (err) {
                  this.loading=false
                  this.$message({
                    message: '数据返回异常，请尝试刷新或者重新登录',
                    type: 'warning',
                  })
					//	setTimeout(()=>{this.$router.push('/loginpage')},3000)
					}
    		})
		},
		initialize(){
      let address = this.$route.query.address
			this.$http.all([this.getData(address),this.getTrade(),this.getTradeAdd(),this.getObjectData()])
		},
		exchangeData(val){
			this.exchangValue = val
			this.handleTardeChange()

		},
		txStatusData(val){
			this.txStatusValue = val
			this.handleTardeChange()
		},
		sortItem(arg1,arg2){
			this.acceptType = arg1
			this.sortType = arg2
			this.defaultPage = 1
			this.handleTardeChange()
		},
		dataChange(val){
			this.startTime = val.substring(0,10)
			this.endTime = val.substring(13)
			this.defaultPage = 1
			this.handleTardeChange()
		},
		searchAddress(value){
			// let address = value
			// if( address == '' ){address = this.$route.query.address}
			//this.getTrade({txAddress:value})
      this.searchVal=value;
      this.handleTardeChange();
			this.defaultPage1 = 1
		},
		searchAddress2(value){
			// let address = value
			// if( address == '' ){address = this.$route.query.address}
			this.getTradeAdd({txaddress:value})
			this.defaultPage2 = 1

		},

		handleTardeChange(value){
			this.getTrade({ pageNumber:value,txAddress:this.searchVal, desc : this.sortType, orderType: this.acceptType, startTime: this.startTime, endTime: this.endTime, inout: this.exchangValue, txStatus: this.txStatusValue})
		},
		handleTradeAddChange(value){
			this.getTradeAdd({pageNumber:value})
		},
		delAddress(){
			return this.$http.post('/api/address/delete/',{address:this.$route.query.address})
		},
		delConfirm(){
      if (this.data.sourcefrom == 'unknown') {
        this.$message({
          message: '未知地址，暂不支持删除',
          type: 'warning',
        })
      }else{
        this.$confirm('是否删除该地址?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) =>{
            if (action === 'confirm'){
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              this.delAddress().then(res =>{
                if (res.data.success) {
                  this.loading = true
                  instance.confirmButtonLoading = false;
                  done();
                  this.$message({
                    type: 'success',
                    duration: 2000,
                    message:res.data.message
                  })
                  setTimeout(()=>{
                    this.$router.push('/address')
                  },2000)
                }else{
                  instance.confirmButtonLoading = false;
                  this.$message.error(res.data.message)
                  done()
                }
              })
            }else{
              done()
            }
          }
        })
      }

		},
		submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmEdit()
        } else {
          return false;
        }
      });
    },
		confirmEdit(){
			let params = {
				address: this.data.address,
				remark: this.data.remark,
				targetId: this.objectValue,
				addup: 'u'
			}
			this.loading = true
			this.$http.post('/api/address/insertupdate',params)
				.then(res =>{
					if (res.data.success) {
							this.flag = true
							this.loading = false
              $("#myModal").modal("hide")
							this.$message({
							message: res.data.message,
							type: 'success'
						})
							this.getData(this.$route.query.address)
					}else{
						this.loading = false
						$("#myModal").modal("hide")
						this.$message({
							message: res.data.message,
							type: 'error'
						})
					}
			})
		},
  },
}
</script>
<style lang="stylus" >
.el-select
	display block
</style>
