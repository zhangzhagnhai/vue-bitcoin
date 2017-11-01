<template>
<div>
 <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
 <MainHeader title='地址管理' sub-title='可管理地址，包括新增地址、编辑地址和删除地址' btn-title='添加新地址'></MainHeader>
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
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header text-center">
				<button @click="resetForm('ruleAddress')" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">添加新地址</h4>
			</div>
			<div class="modal-body">
				<el-form class="form-horizontal" :model="ruleAddress" :rules="addrules" ref='ruleAddress'>
					<!--输入地址-->
					<div class="form-group">
						<label  class="col-sm-2 control-label form-label">地址</label>
						<div class="col-sm-10">
						 <el-form-item prop='add'>
						  <el-input type="text" placeholder="请输入地址，必填" v-model='ruleAddress.add'>
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
								<el-input type="textarea" :rows='5' v-model='ruleAddress.remark'  placeholder="可输入更多地址备注信息，选填。(最大长度不能超过100汉字)"></el-input>
							</el-form-item>
						</div>
					</div>
					<!--更多信息begin-->
					<div>
						<a class="clearfix" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
            	<span class="float-r">更多&nbsp;<i class="fa fa-angle-down"></i></span>
         		</a>
         		<div class="collapse margin-t-10" id="collapseExample">
         			<!--拥有者-->
							<div class="form-group">
								<label class="col-sm-2 control-label form-label" >拥有者</label>
								<div class="col-sm-6">
									<el-select class="selectpicker" filterable v-model='ruleAddress.objectValue'>
										<el-option data-icon="fa fa-user color5" v-for="(item, index) in objectData" :value="item.target_id" :key="item.concat" :label='item.concat'></el-option>
									</el-select>
								</div>
								<div class="col-sm-4">
									<input type="button" value='添加新对象' @click='openObject' class="btn btn-default pull-right">
								</div>
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
				<button type="button" class="btn btn-white" data-dismiss="modal" @click="resetForm('ruleAddress')">取消</button>
				<button type="button" class="btn btn-default" @click="submitForm('ruleAddress')">添加</button>
			</div>
		</div>
	</div>
</div>

		<div class="modal fade" id="objectModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<button  @click="resetForm('ruleForm')" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">添加新对象</h4>
					</div>
					<div class="modal-body">
						<el-form class="form-horizontal" :model='ruleForm' :rules='objectRules' ref="ruleForm">
							<!--输入对象姓名-->
							<div class="form-group">
								<label  class="col-sm-2 control-label form-label">对象姓名</label>
								<div class="col-sm-10">
									<el-form-item prop='name'>
											<el-input v-model='ruleForm.name' type="text"  placeholder="请输入对象姓名，必填">
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
											<el-input v-model='ruleForm.code' type="text" placeholder="请输入身份证号，必填">
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
										<el-input v-model='ruleForm.phone' type="text" placeholder="可输入联系方式，选填">
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
										<el-input type='textarea' :rows='5' v-model='ruleForm.remark' placeholder="可输入更多对象备注信息，选填。(最大长度不能超过100汉字)"></el-input>
									</el-form-item>

								</div>
							</div>
							<!--更多信息begin-->
							<div>

							</div>
		          <!--更多信息end-->
						</el-form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-white" data-dismiss="modal" @click="resetForm('ruleForm')">取消</button>
						<button type="button" class="btn btn-default" @click="submitForm1('ruleForm')">添加</button>
					</div>
				</div>
			</div>
		</div>
</div>
</template>
<script>
import Panelwrap from'../../components/PanelWrap/'
import MainHeader from'../../components/MainHeader/'

export default {
	components:{
		Panelwrap,
		MainHeader,
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
    var checkCode = (rule, value, callback) =>{
    	var ID = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
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
    	if (value != '' && !reg.test(value)) {
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
    	items: '',
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
			endTime: '',
			ruleAddress: {
				add: '',
				remark: '',
				objectValue: '',
			},
			ruleForm: {
				name: '',
				code: '',
				phone: '',
				remark: '',
			},

			addrules:{
				add:[
					{ validator: checkAddress, trigger: 'blur' }
				],
				remark:[
					{ validator: checkTextArea, trigger: 'blur' }
				],
			},
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
  methods: {
  	resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addAddress()
        } else {
          return false;
        }
      });
    },
    submitForm1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addObject()
        } else {
          return false;
        }
      });
    },
		getData(){
			this.$http.get('/api/address/index')
				.then(res =>{
				this.items = res.data.data
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
			this.$http.post('/api/address/page',params)
				.then(res =>{
					this.loading = false
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
						this.$message({
							message: '登录失效,请重新登录',
							type: 'warning',
						})
						setTimeout(()=>{this.$router.push('/loginpage')},3000)
					}
				})
		},
		getObjectData(params){
			this.loading = true
			this.$http.post('/api/target/targetList',params)
				.then(res =>{
					this.loading = false
					this.objectData = res.data.data;
					// /api/target/targetList
			})
		},
		addAddress(){
				let params = {
					address: this.ruleAddress.add,
					remark: this.ruleAddress.remark,
					targetId:this.ruleAddress.objectValue,
					addup : 'a',
				}
				this.loading = true
				this.$http.post('/api/address/insertupdate',params)
					.then(res =>{
						if (res.data.success) {
							$("#myModal").modal("hide");
							this.$message({
								message: '添加成功',
								type: 'success'
							})
							this.loading = false
							this.ruleAddress = ''
							this.getList()
						}else{
							this.loading = false
							this.$message({
								message: res.data.message,
								type: 'error'
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
			this.$http.all([this.getData(),this.getList(),this.getObjectData()])
		},
		openObject(){
			$("#objectModal").modal("show")
		},
		addObject(){
			let param = {
				name : this.ruleForm.name,
				code : this.ruleForm.code,
				phone : this.ruleForm.phone,
				remark : this.ruleForm.remark,
				//addresses : this.ruleForm.addresses
			}
			this.loading = true
			this.$http.post('/api/target/insertupdate',param)
				.then(res =>{
					if (res.data.success) {
						$("#objectModal").modal("hide")
						this.$message({
							message: '添加成功',
							type: 'success'
						})
						this.loading = false
						this.ruleForm = ''
						this.getObjectData()
					} else if(!res.data.success){
						this.$message({
							message: res.data.message,
							type: 'error'
						})
					 this.loading = false
					}
				})
		},
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
