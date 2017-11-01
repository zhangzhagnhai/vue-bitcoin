<template>
	<div class="wrapper-content">
		<div class="panel panel-default">
			<div class="panel-title">
				{{title}}
				<ul class="panel-tools">
					<li v-if="show1" style="font-weight:normal;">
						<transition-group name="el-fade-in-linear">
							<el-date-picker
							:key="1"
							@change='dataChange'
				    	style='font-size:12px;'
				    	size='mini'
				      v-model="dataValue"
				      type="daterange"
				      placeholder="选择日期范围">
				    	</el-date-picker>
				    	<div v-if="sortBtnType === 'addressDetails' " :key="2" class="icon search-tool" style="display: inline-block; font-size:12px; margin:0 15px; color:#bfcbd9;" v-on:click='exchange'>
							<i class="fa fa-exchange"></i>{{exchangeValue}}
							</div>
							<div v-if="sortBtnType === 'addressDetails' " :key="3" class="icon search-tool" style="display: inline-block; font-size:12px; margin-right:15px; color:#bfcbd9;" v-on:click='txStatus'>
							<i class="fa "></i>交易状态:{{txStatusValue}}
							</div>
				    </transition-group>
					</li>
					<li v-if="show" style="font-weight:normal; width: 300px;" class="color4">
						<transition name="el-fade-in-linear">
							<el-input  ref="input" v-model='input2'  icon="search" size="mini" :on-icon-click="searchClick"  style='font-size:12px' :placeholder='placeholder'></el-input>
						</transition>
					</li>
					<li>
						<a class="icon search-tool"  @click="show = !show">
							<i class="fa fa-search"></i>查询
						</a>
					</li>
					<li>
						<a class="icon" v-if="screen"  @click="show1 = !show1">
							<i class="fa fa-filter"></i>筛选
						</a>
					</li>
					<li class="sort-tab" v-if="sortShow">
						<a class="icon" v-on:click='sortChange'>
							<i class="fa" :class="[sortState ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc']"></i>排序
						</a>
            <div class="panel-sort" v-if="sortBtnType === 'addressPage' " >
                <ul>
                    <li v-for="(item, index) in sortItems" :class="{ 'selected': isActive === index }" v-on:click="sortChangeItem(item.conditionType,item.sortType,index)">{{item.content}}</li>
                </ul>
            </div>
            <div class="panel-sort" v-if="sortBtnType === 'objectPage' " >
                <ul>
                    <li v-for="(item, index) in objectSortItem" :class="{ 'selected': isActive === index }" v-on:click="sortChangeItem(item.conditionType,item.sortType,index)">{{item.content}}</li>
                </ul>
            </div>
             <div class="panel-sort" v-if="sortBtnType === 'addressDetails' " >
                <ul>
                    <li v-for="(item, index) in addressSortItem" :class="{ 'selected': isActive === index }" v-on:click="sortChangeItem(item.conditionType,item.sortType,index)">{{item.content}}</li>
                </ul>
            </div>
					</li>
				</ul>
				<div>
				</div>
			</div>
			<slot></slot>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'

export default {
  data() {
    return {
    	sortState:true,
    	show: false,
    	show1: false,
    	isActive: -1,
    	exchangeValue: '转入',
    	input2: '',
    	dataValue:'',
    	txStatusValue: '已确认',
			sortItems: [
				{sortType:'desc',conditionType:'tx_num',content:'交易次数降序'},
				{sortType:'asc',conditionType:'tx_num',content:'交易次数升序'},
				{sortType:'desc',conditionType:'balance',content:'最终余额降序'},
				{sortType:'asc',conditionType:'balance',content:'最终余额升序'},
			],
			objectSortItem: [
				{sortType:'desc',conditionType:'time',content:'添加时间降序'},
				{sortType:'asc',conditionType:'time',content:'添加时间升序'},
				{sortType:'desc',conditionType:'balance',content:'交易余额降序'},
				{sortType:'asc',conditionType:'balance',content:'交易余额升序'},
			],
			addressSortItem: [
				{sortType:'desc',conditionType:'acceptTime',content:'交易时间降序'},
				{sortType:'asc',conditionType:'acceptTime',content:'交易时间升序'},
				{sortType:'desc',conditionType:'totalAmount',content:'交易数量降序'},
				{sortType:'asc',conditionType:'totalAmount',content:'交易数量升序'},
			]
    }
  },
  props: {
		title: {
			type: String,
			required: true,
		},
		value: {
      type: String,
    },
		sortShow: {
			type: Boolean,
			default: false,
		},
		screen: {
			type: Boolean,
			default: false,
		},
		sortBtnType: {
      type: String,
		},
		placeholder: {
			type: String,
		}
  },
	methods:{
		exchange(){
			this.exchangeValue ==='转入' ? this.exchangeValue = '转出' : this.exchangeValue = '转入'
			this.$emit('exchange',this.exchangeValue)
		},
		txStatus() {
			this.txStatusValue ==='已确认' ? this.txStatusValue = '未确认' : this.txStatusValue = '已确认'
			this.$emit('txStatus',this.txStatusValue)
		},
		sortChange(){
			this.sortState = !this.sortState
			this.$emit('sortdata')
		},
		searchClick(){
			this.$emit('searchClick',this.input2)
		},
		sortChangeItem(orderType,desc,index){
			this.isActive = index
			this.$emit('sortItem',orderType,desc)
		},
		dataChange(val){
			this.$emit('dataSelect',val)
		}

	},
}
</script>
<style lang="stylus" scoped>
	.searchbox
		border 1px solid #555
	.searchbutton
		position absolute
		top 0
		right 5px
		font-size 10px
	input
		color rgba(0, 0, 0, 0.5)


</style>
