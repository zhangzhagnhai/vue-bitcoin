<template>
	<div>
		<div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
		<MainHeader title='对象管理' sub-title='可管理对象，包括新增对象、编辑对象和删除对象' btn-title='添加新对象'></MainHeader>
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
		<!-- Modal 添加新对象 -->
		<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header text-center">
						<button @click="resetForm('ruleForm')" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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
										<el-input type='textarea' :rows='5' v-model='ruleForm.remark' placeholder="可输入更多对象备注信息，选填(最大长度不能超过100汉字)"></el-input>
									</el-form-item>
								</div>
							</div>
							<!--更多信息begin-->
							<div>
								<a class="clearfix" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
		            	<span class="float-r">更多&nbsp;<i class="fa fa-angle-down"></i></span>
		         		</a>
		         		<div class="collapse margin-t-10" id="collapseExample">
		         			<!--关联地址-->
									<div class="form-group">
										<label class="col-sm-2 control-label form-label">关联地址</label>
										<div class="col-sm-10">
											<el-select
											:style="{'display':'block'}"
											v-model='ruleForm.addresses'
											filterable
											remote
											class="selectpicker"
											placeholder="请输入地址(支持模糊查询)"
											:remote-method="remoteMethod"
											:loading="loading"
											>
											<el-option
											auto-complete='off'
											v-for="(item, index) in filteradd"
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
						<button type="button" class="btn btn-white" data-dismiss="modal" @click="resetForm('ruleForm')">取消</button>
						<button type="button" class="btn btn-default" @click="submitForm('ruleForm')">添加</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import MainHeader from '../../components/MainHeader/'
import Panelwrap from'../../components/PanelWrap/'

export default {
	components: {
		MainHeader,
		Panelwrap,
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
    	loading: false,
    	totalData: '',
    	lists: '',
    	defaultPage: 1,
    	addlists:[],
    	optionlists: [],
    	filteradd:[],
    	acceptType: '',
			sortType: '',
			startTime: '',
			endTime: '',
			ruleForm: {
				name: '',
				code: '',
				phone: '',
				remark: '',
				addresses: '',
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
    remoteMethod(query) {
        if (query !== '') {
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

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addObject()
        } else {
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
		getData(){
			this.loading = true
			this.$http.get('/api/target/index')
				.then(res =>{
					this.loading = false
					this.totalData = res.data.data;
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
			this.$http.post('/api/target/page',params)
				.then(res =>{
					this.loading = false
					this.lists = res.data.data
					if(this.lists.list.length == 0){
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

  	getAddressList() {
			this.$http.post('/api/address/addressList')
				.then(res => {
					this.addlists = res.data.data
					this.optionlists = this.addlists.map(item => {
		        return { value: item, label: item };
		      });
				})
  	},
		searchName(value){
			this.getList({name:value})
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

		addObject(){
			let param = {
				name : this.ruleForm.name,
				code : this.ruleForm.code,
				phone : this.ruleForm.phone,
				remark : this.ruleForm.remark,
				addresses : this.ruleForm.addresses
			}
			this.loading = true
			this.$http.post('/api/target/insertupdate',param)
				.then(res =>{
					if (res.data.success) {
						$("#myModal").modal("hide");
						this.$message({
							message: '添加成功',
							type: 'success'
						})
						this.loading = false
						this.$refs['ruleForm'].resetFields();
						this.getList()
					} else if(!res.data.success){
						this.$message({
							message: res.data.message,
							type: 'error'
						})
					 this.loading = false
					}
				})
		},

		initialize(){
			this.$http.all([this.getData(),this.getList()])
	  },
  },
  created(){
		this.getAddressList()
  },
  mounted(){
		this.initialize()
		// this.optionlists = this.addlists.map(item => {
  //       return { value: item, label: item };
  //     });
  }
}
</script>
<style lang="stylus">

</style>
