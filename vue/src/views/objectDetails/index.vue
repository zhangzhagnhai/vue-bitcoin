<template>
	<div>
	 <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
		<PageHeader title-content='对象信息' main-content='包括基本信息、交易记录、已知拥有地址、关联对象等信息。返回刷新首页'></PageHeader>
		<!-- 基本信息+简单统计begin-->
		<div class="panel panel-deepGray">
			<div class="panel-body">
				<!--基本信息begin-->
				<h2 class="margin-t-0">
				基本信息
				&nbsp;<a href="javascript:void(0)" class="f-size-18" data-toggle="tooltip" data-placement="top" title="" data-original-title="收藏对象"><i class="fa fa-heart-o"></i></a><!--未收藏-->
				<!--<a href="#" class="f-size-18" data-toggle="tooltip"  data-placement="top" title="" data-original-title="取消收藏"><i class="fa fa-heart-o color10"></i></a>--><!--已收藏-->
				&nbsp;<a href="javascript:void(0)" class="f-size-18" data-toggle="tooltip"  data-placement="top" title="" data-original-title="编辑对象" @click='edit'><i class="fa fa-edit"></i></a>
				&nbsp;<a href="javascript:void(0)" @click='delConfirm' class="f-size-18" data-toggle="tooltip"  data-placement="top" title="" data-original-title="删除对象"><i class="fa fa-trash-o"></i></a>
			</h2>
				<div class="addressBasic row border-b-color">
					<div class="col-md-8 f-bold">
						<div class="margin-b-5">
							<span class="color1">对象：</span>
							<span>{{data.name}}</span>
							<small>&nbsp;&nbsp;<i class="fa fa-newspaper-o"></i>&nbsp;{{data.code}}&nbsp;&nbsp;</small>
							<small>&nbsp;&nbsp;<i class="fa fa-phone"></i>
								<span v-if='flag'>&nbsp;{{data.phone}}&nbsp;&nbsp;</span>
								<div v-else style="width:15%; display: inline-block">
									<el-input type="text"  size="mini" ref='phone' @keyup.enter.native='confirmEdit(data.name,data.code)' v-model="data.phone" @blur='confirmEdit(data.name,data.code)'></el-input>
								</div>
							</small>
						</div>
						<div class="margin-b-5">
							<span class="color1">来源：</span>
							<span>{{data.sourceFrom | sourceFilter}}</span>
						</div>
						<div class="margin-b-5">
							<span class="color1">收录时间：</span>
							<span>{{data.addTime}}</span>
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
						<a href="javascript:void(0)" @click="openObjectCharts"  class="btn btn-default pull-right">对象分析</a>
					</div>
				</div>
				<!--基本信息end-->
				<!--简单统计begin-->
				<div class="row">
					<div class="col-md-2 text-center">
						<label class="color4">交易次数</label><br />
						<span class="color1 f-bold">{{data.txTotal|nullFilter}}次</span>
					</div>
					<div class="col-md-2 text-center">
						<label class="color4">转入次数</label><br />
						<span class="color1 f-bold">{{data.txIntotal|nullFilter}}次<span>
						（{{data.txInPer}}%）
						</span>
					</span>
					</div>
					<div class="col-md-2 text-center">
						<label class="color4">转出次数</label><br />
						<span class="color1 f-bold">{{data.txOutTotal}}次<span>（{{data.txOutInPer}}%）</span></span>
					</div>
					<div class="col-md-2 text-center">
						<label class="color4">已知地址</label><br />
						<span class="color1 f-bold">{{data.addressTotal}}个</span>
					</div>
					<div class="col-md-2 text-center">
						<label class="color4">已知余额</label><br />
						<span class="color1 f-bold">{{data.balance}} BTC</span>
					</div>

					<div class="col-md-2 text-center">
						<label class="color4">关联对象</label><br />
						<span class="color1 f-bold">{{data.targetRelationTotal}}个</span>
					</div>
				</div>
				<!--简单统计end-->
			</div>
		</div>
		<!-- 基本信息+简单统计end-->
		<Panelwrap
			title="交易记录"
			sortBtnType='addressDetails'
			placeholder='请输入地址'
			:sortShow="true"
			:screen="true"
			@sortItem='sortItem'
			@searchClick='searchAddress'
			@dataSelect='dataChange'
			@exchange='exchangeData'
			@txStatus='txStatusData'
			>
		 <div class="panel-body table-responsive">
				<p class="f-size-12 color4">
					显示该对象最近的交易记录。 点击&nbsp;
					<code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据交易地址查询； 点击&nbsp;
					<code>&nbsp;<i class="fa fa-sort-amount-asc fa color4"></i>&nbsp;</code>&nbsp;可根据交易时间、交易数量排序； 点击&nbsp;
					<code>&nbsp;<i class="fa fa-filter"></i>&nbsp;</code>&nbsp;可按照交易时间段、转入/转出、交易状态筛选。
				</p>
				<table class="table table-striped addressBasic_table">
					<thead>
						<tr>
							<td>交易号</td>
							<td>接收时间</td>
							<td>交易细节</td>
<!-- 							<td></td>
 -->							<td>转出/转入总额</td>
							<td>交易状态</td>
							<td>其他</td>
						</tr>
					</thead>
					<tbody>
						<tr v-if='txList' v-for="(item,index) in txList.list">
							<td>
								<a class="txid color4" href="javascript:void(0)">{{item.txid}}</a>
							</td>
							<td><small>{{item.acceptTime}}</small></td>
							<td>
							<!-- 	<a class="txid color4 dealAddress" href="javascript:void(0)">{{item.txAddresses}}</a> -->
                <toAddressDetail :address="item.txAddresses" >
                  <a href="javascript:void(0)" class="txid color4 dealAddress">{{item.txAddresses}}</a>
                </toAddressDetail>
						</td>
			<!-- 				<td>
								<i class="fa f-size-16" :class="[ item.inout === '转入' ? ['fa-arrow-left','color7'] : ['fa-arrow-right','color10']]" ></i>
							</td> -->
							<td><small :class="[item.inout === '转入' ? 'color7' : 'color10']">{{item.inout}}{{item.totalAmount}}BTC</small></td>
							<td><span  :class="[item.txstatus === '已确认' ? 'color5' : 'color4']"><i class="fa" :class="[item.txstatus === '已确认' ? 'fa-check' : 'fa-close']"></i>&nbsp;{{item.txstatus}}</span></td>
							<td>
								<router-link :to="{ name: 'tradedetails', query:{ txid: item.txid} }" class="btn btn-default btn-sm f-size-12">交易详情</router-link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<el-pagination
			small layout="prev, pager, next"
			:total='txList.totalRow'
			:current-page.sync = 'defaultPage1'
			style="text-align: center"
			@current-change='handlePageChange1'
			>
	    </el-pagination>
		</Panelwrap>
		<div class="wrapper-content clearfix">
			<!--已知地址begin-->
			<div class="col-md-6 padding-l-0">
				<div class="panel panel-default">
					<div class="panel-title">
						已知地址
						<!-- <ul class="panel-tools">
							<li v-if="show1" style="font-weight:normal; width: 300px;" class="color4">
							<transition name="el-fade-in-linear">
								<el-input   v-model='input1'  icon="search" size="mini" :on-icon-click="searchaddress1"  style='font-size:12px' placeholder='请输入地址'></el-input>
							</transition>
							</li>
							<li>
								<a class="icon search-tool" @click="show1 = !show1">
									<i class="fa fa-search"></i>查询
								</a>
							</li>
						</ul> -->
					</div>
					<div class="panel-body table-responsive">
						<!-- <p class="f-size-12 color4">
							显示该对象已知拥有的地址。 点击&nbsp;
							<code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据地址快速查询。
						</p> -->
						<table class="table table-striped addressBasic_table">
							<thead>
								<tr>
									<td>地址</td>
									<td>收录时间</td>
									<td>最终余额</td>
								</tr>
							</thead>
							<tbody>
								<tr v-if='addList' v-for ="(item, index) in addList.list">
									<td>
									<!-- 	<a class="txid color5 dealAddress" href="javascript:void(0)">{{item.address}}</a> -->
									  <toAddressDetail :address="item.address" >
                      <a href="javascript:void(0)" target = _blank class="txid color5 dealAddress">{{item.address}}</a>
                    </toAddressDetail>
                  </td>
									<td><small>{{item.addTime}}</small></td>
									<td><small>{{item.balance | feeFilter}}BTC</small></td>
								</tr>
							</tbody>
						</table>
					</div>
				<el-pagination
				small layout="prev, pager, next"
				:total='addList.totalRow'
				:current-page.sync = 'defaultPage2'
				style="text-align: center"
				@current-change='handlePageChange2'
				>
		    </el-pagination>
				</div>
			</div>
			<div class="col-md-6 padding-r-0">
				<div class="panel panel-default">
					<div class="panel-title">
						关联对象
						<!-- <ul class="panel-tools">
							<li v-if="show2" style="font-weight:normal; width: 300px;" class="color4">
							<transition name="el-fade-in-linear">
								<el-input   v-model='input2'  icon="search" size="mini" :on-icon-click="searchObject2"  style='font-size:12px' placeholder='请输入地址'></el-input>
							</transition>
							</li>
							<li>
								<a class="icon search-tool" @click="show2 = !show2">
									<i class="fa fa-search"></i>查询
								</a>
							</li>
						</ul> -->
					</div>
					<div class="panel-body table-responsive">
						<!-- <p class="f-size-12 color4">
							显示与该对象有交易记录的地址集。 点击&nbsp;
							<code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据地址快速查询。
						</p> -->
						<table class="table table-striped addressBasic_table">
							<thead>
								<tr>
									<td>地址集</td>
									<td>拥有者信息</td>
									<td>交易次数</td>
									<td>交易总额</td>
								</tr>
							</thead>
							<tbody>
								<tr v-if='targetList' v-for="(item, index) in targetList.list">
									<td style="position: relative">
										<div class="addresset" :class="{ showed : showNodes[index]}">
                      <toAddressDetail :address="item.addresses[index]" :key = 'index'  v-for="(x, index) in item.addresses">
                        <a href="javascript:void(0)" :style="{overflow:'visible'}"  target = _blank class="txid color5">{{x}}</a>
                      </toAddressDetail>
									  	<i @click="showNodes.splice(index, 1, !showNodes[index])" class="show-more fa" :class="[showNodes[index] ? 'fa-angle-double-up' : 'fa-angle-double-down']" v-if='item.addresses.length > 1 '></i>
										</div>
									</td>
									<td>
										<a class="txid color4 dealAddress" href="javascript:void(0)">{{item.targetName}}</a>
									</td>
									<td>{{item.txTimes}}次</td>
									<td><small>{{item.txTotalAmount | feeFilter }}BTC</small></td>
								</tr>
							</tbody>
						</table>
					</div>
					<el-pagination
					small layout="prev, pager, next"
					:total='targetList.totalRow'
					:current-page.sync = 'defaultPage3'
					style="text-align: center"
					@current-change='handlePageChange3'
					>
			    </el-pagination>
				</div>
			</div>
		</div>
				<!-- Modal 添加新对象 -->
		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<button  type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">编辑对象</h4>
					</div>
					<div class="modal-body">
						<el-form class="form-horizontal" :model='data' :rules='objectRules' ref="data">
							<!--输入对象姓名-->
							<div class="form-group">
								<label  class="col-sm-2 control-label form-label">对象姓名</label>
								<div class="col-sm-10">
									<el-form-item prop='name'>
											<el-input v-model='data.name' type="text"  placeholder="请输入对象姓名，必填">
												<template slot="prepend"><i style="width: 16px; text-align: center" class="fa fa-user color5"></i></template>
											</el-input>
									</el-form-item>
								</div>
							</div>
							<!--输入对象身份证号-->
							<div class="form-group">
								<label class="col-sm-2 control-label form-label">身份证号</label>
								<div class="col-sm-10">
								  <el-form-item prop='code'>
											<el-input v-model='data.code' type="text" placeholder="请输入身份证号，必填">
												<template slot="prepend"><i class="fa fa-newspaper-o color5"></i></template>
											</el-input>
									</el-form-item>
								</div>
							</div>
							<!--输入对象联系方式-->
							<div class="form-group">
								<label class="col-sm-2 control-label form-label">联系方式</label>
								<div class="col-sm-10">
									<el-form-item prop='phone'>
										<el-input v-model='data.phone' type="text" placeholder="可输入联系方式，选填">
										  <template slot="prepend"><i style="width: 16px; text-align: center" class="fa fa-phone color5"></i></template>
										</el-input>
								  </el-form-item>
								</div>
							</div>
							<!--对象备注-->
							<div class="form-group">
								<label class="col-sm-2 control-label form-label">备注</label>
								<div class="col-sm-10">
									<el-form-item prop='remark'>
										<el-input type='textarea' :rows='5' v-model='data.remark' placeholder="可输入更多对象备注信息，选填(最大长度不能超过100汉字)"></el-input>
									</el-form-item>
								</div>
							</div>
							<!--更多信息begin-->
							<div>
								<a class="clearfix" data-toggle="collapse" href="#collapseExamples" aria-expanded="false" aria-controls="collapseExamples">
		            	<span class="float-r">更多&nbsp;<i class="fa fa-angle-down"></i></span>
		         		</a>
		         		<div class="collapse margin-t-10" id="collapseExamples">
		         			<!--关联地址-->
									<div class="form-group">
										<label class="col-sm-2 control-label form-label">关联地址</label>
										<div class="col-sm-10">
											<el-select
											:clearable='true'
											v-model='changeAddresses'
											filterable
											remote
											class="selectpicker"
											placeholder="请输入地址(支持模糊查询)"
											:remote-method="remoteMethod"
											:loading="loading"
											>
											<el-option
											auto-complete='off'
											v-for="(item,index) in filteradd"
											:key="item.index" :label="item.label" :value="item.value"
											></el-option>
											</el-select>
										</div>
							<!-- 			<div class="col-sm-2">
											<a href="#" class="btn btn-default pull-right">添加新地址</a>
										</div> -->
									</div>
									<!--涉及案件-->
<!-- 									<div class="form-group">
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
import PageHeader from '../../components/PageHeader/'
import Panelwrap from'../../components/PanelWrap/'
import toAddressDetail from'../../components/toAddressDetail/'

export default {
	components: {
		PageHeader,
		Panelwrap,
    toAddressDetail
	},
  data() {
  	var checkName = (rule, value, callback) =>{
			if (value==='') {
         return callback(new Error('姓名不能为空'));
			} else {
  		  callback()
  	  }
    }

    var checkCode = (rule, value, callback) =>{
    	var ID = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
			if (!value) {
         return callback(new Error('身份证号码不能为空'));
			} else if (!ID.test(value)) {
         return callback(new Error('身份证号码输入有误'));
			} else {
				callback()
			}
    }

    var checkPhone = (rule, value, callback) =>{
    	var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      console.log(value)
    	if (value && !reg.test(value)) {
        return callback(new Error('手机号码输入有误'));
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
         return callback(new Error('最大长度不能超过200字节'));
			} else{
				callback()
			}
		}
    return {
    	loading: false,
    	data: {
    		name:'',
    		code:'',
    		phone:'',
    		remark:'',
    	},
      id:'',
    	changeAddresses:'',
    	txList: '',
    	input1: '',
    	input2: '',
    	show1: false,
    	show2: false,
    	defaultPage1: 1,
    	defaultPage2: 1,
    	defaultPage3: 1,
    	addList: '',
    	targetList: '',
    	flag: true,
    	acceptType: '',
			sortType: '',
			startTime: '',
			endTime: '',
			sortValue:'',
      searchVal:'',
    	exchangValue: '',
    	txStatusValue: '',
    	showNodes:'',
    	addlists:[],
    	optionlists: [],
    	filteradd:[],
    	objectRules: {
				name: [
          { validator: checkName, trigger: 'blur' }
				],
				code: [
          { validator: checkCode, trigger: 'blur' }
				],
				phone: [
          { validator: checkPhone, trigger: 'blur' }
				],
				remark:[
					{ validator: checkTextArea, trigger: 'blur' }
				],
			},
    }
  },
  mounted(){
    this.id = this.$route.query.id
    //this.getAddressList()
		this.initialize(this.id)
  },
  created(){
		this.getAddressList()
  },
  methods:{
    openObjectCharts(){
      //this.$router.push({name:'objectCharts',query:{analysisId: this.data.analysisId}})
      if (this.data.analysis ===0) {
        this.addTask();
      }else if(this.data.analysis ===1&&this.data.analysisId !=0){
        this.$router.push({name:'objectCharts',query:{analysisId: this.data.analysisId}})
      }else{
        this.$message({
          message: '已经开启对象分析任务，请到关联分析页面查看进度',
          type: 'warning',
        })
      }
    },
    addTask(){
      this.$http.post('/api/view/addAnalysisTx',{message:this.data.name+"("+this.data.code+")"})
        .then(res =>{
          if (res.data.success) {
            this.loading = false;
            this.$message({
              message: '开启对象分析任务，请到关联分析页面查看进度',
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
		initialize(id){
			this.$http.all([this.getData(id),this.getTxList(),this.getAddList(),this.getTxTarget()])
		},
		getData(id){
			this.loading = true
			this.$http.get(`/api/target/detail/${id}`)
				.then(res =>{
					if (res.data.success) {
						this.loading = false
						this.data = res.data.data
						this.changeAddresses = res.data.data.address

					}
				})
				.catch(err =>{
					if (err) {
            this.loading=false
            this.$message({
              message: '数据返回异常，请尝试刷新或者重新登录',
              type: 'warning',
            })
            //setTimeout(()=>{this.$router.push('/loginpage')},3000)
					}
				})
		},
		delTarget(){
			return this.$http.post('/api/target/delete',{targetCode : this.data.code})
		},
		delConfirm(){
      if (this.data.sourcefrom == 'unknown') {
        this.$message({
          message: '未知对象，暂不支持删除',
          type: 'warning',
        })
      }else{
        this.$confirm('是否删除该对象?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) =>{
            if (action === 'confirm'){
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              this.delTarget().then(res =>{
                if (res.data.success) {
                  instance.confirmButtonLoading = false;
                  this.loading = true
                  done();
                  this.$message({
                    type: 'success',
                    duration: 2000,
                    message:res.data.message
                  })
                  setTimeout(()=>{
                    this.$router.push('/object')
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
		getTxList(params){
			this.loading = true
			let defaultData = {'targetId': this.$route.query.id}
			let data = Object.assign (defaultData, params)
			this.$http.post('/api/target/txrecords',data)
				.then(res =>{
					if (res.data.success) {
						this.loading = false
						this.txList = res.data.data
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
		// searchObject2(){ //暂时区掉
		// 	this.getTxTarget({address: this.input2})
		// },
		searchAddress(val){
		  this.searchVal=val;
      this.handlePageChange1()
			//this.getTxList({txaddress:val})
		},
		searchaddress1(){
			this.getAddList({address: this.input1})
		},
		exchangeData(val){
			this.exchangValue = val
			this.handlePageChange1()
		},
		txStatusData(val){
			this.txStatusValue = val
			this.handlePageChange1()
		},
		sortItem(arg1,arg2){
			this.acceptType = arg1
			this.sortType = arg2
			this.defaultPage1 = 1
			this.handlePageChange1()
		},
		dataChange(val){
			this.startTime = val.substring(0,10)
			this.endTime = val.substring(13)
			this.defaultPage1 = 1
			this.handlePageChange1()
		},
		handlePageChange1(value){//分页查询
			this.getTxList({pageNumber:value,txaddress:this.searchVal, desc : this.sortType, orderType: this.acceptType, startTime: this.startTime, endTime: this.endTime, inout: this.exchangValue, txStatus: this.txStatusValue})
		},
		handlePageChange2(value){//已知地址分页查询
			this.getAddList({pageNumber: value})

		},
		handlePageChange3(value){//关联对象分页查询
			this.getTxTarget({pageNumber: value})
		},
		getAddList(params){//已知地址列表
			this.loading = true
			let defaultData = {'targetId': this.$route.query.id, 'pageSize': 5 }
			let data = Object.assign (defaultData, params)
			this.$http.post('/api/target/addressList',data)
				.then(res =>{
					if (res.data.success) {
						this.loading = false
						this.addList = res.data.data
						if (this.addList.totalRow == 0) {
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
					}
				})
		},
		getTxTarget(params){//获取关联对象
			this.loading = true
			let defaultData = {'targetId': this.$route.query.id, 'pageSize': 5 }
			let data = Object.assign (defaultData, params)
			this.$http.post('/api/target/txtarget',data)
				.then(res =>{
					this.loading = false
					this.targetList = res.data.data
					this.showNodes = new Array(this.targetList.list.length).fill(0)
					if (this.targetList.totalRow == 0) {
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
		edit(){
      if (this.data.sourcefrom == 'unknown') {
        this.$message({
          message: '未知对象，暂不支持修改',
          type: 'warning',
        })
      }else{
        $("#myModal").modal("show")
      }
		},
		confirmEdit(){
			let param = {
				name: this.data.name,
				code: this.data.code,
				phone: this.data.phone,
				remark: this.data.remark,
				addresses: this.changeAddresses,
				targetId: this.$route.query.id,
			}
			this.loading = true
			this.$http.post('/api/target/insertupdate',param)
				.then(res =>{
					if (res.data.success) {
						this.flag = true
						this.loading = false
						$("#myModal").modal("hide")
						this.$message({
							message: res.data.message,
							type: 'success'
						})
					}else{
						$("#myModal").modal("hide")
						this.loading = false
						this.$message({
							message: res.data.message,
							type: 'error'
						})
					}
					this.initialize(this.$route.query.id)
				})
		},
		getAddressList() {
			this.$http.post('/api/address/addressList')
				.then(res => {
					this.addlists = res.data.data
					this.optionlists = this.addlists.map(item => {
		        return { value: item, label: item };
		      });
				})
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
  	remoteMethod(query) {
        if (query) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.filteradd = this.optionlists.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.filteradd = [];
        }
      },
  },
}
</script>
<style lang="stylus" >
.el-select
	display block
</style>
