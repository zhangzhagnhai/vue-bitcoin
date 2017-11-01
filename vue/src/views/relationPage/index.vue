<template>
  <div>
    <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
    <MainHeader title='关联分析' sub-title='可查看关联分析任务进度和分析结果，对地址和对象进行综合分析' btn-title='添加分析任务'  target="myModalD"></MainHeader>

    <Panelwrap title="分析任务"
               sortBtnType='relationPage'
               placeholder='请输入地址或身份证号'
               :sortShow="true"
               :screen="true"
               v-on:searchClick='searchName'
               v-on:sortItem='sortItem'
               v-on:dataSelect='dataChange'
               style="padding-top: 20px;"
    >
      <div class="panel-body table-responsive">
        <p class="f-size-12 color4">
          显示最近的分析任务，点击&nbsp;
          <code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据地址或对象进行快速查询； 点击&nbsp;
          <code>&nbsp;<i class="fa fa-sort-amount-asc fa color4"></i>&nbsp;</code>&nbsp;可根据任务创建时间排序； 点击&nbsp;
          <code>&nbsp;<i class="fa fa-filter"></i>&nbsp;</code>&nbsp;可按照任务状态筛选。
        </p>
        <table class="table table-striped addressBasic_table">
          <thead>
          <tr>
            <td>任务编号</td>
            <td>任务详情</td>
            <td>任务进度</td>
            <td>任务状态</td>
            <td>创建时间</td>
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
            <td v-if="index%2==0" style="color: #399bff"><i class="fa fa-check" aria-hidden="true"></i>&nbsp;已完成</td>
            <td v-if="index%2==1" ><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbsp;正在分析中</td>

            <td>{{item.balance | feeFilter }} BTC</td>
            <td>
              <div v-if="index%2==0">
                <router-link :to="{ name: 'objectdetails', query:{ id: item.target_id } }" class="btn btn-default btn-sm f-size-12">查看详情</router-link>
                <router-link :to="{ name: 'objectdetails', query:{ id: item.target_id } }" class="btn btn-default btn-sm f-size-12">删除</router-link>
              </div>
              <div v-if="index%2==1">
                <router-link :to="{ name: 'objectdetails', query:{ id: item.target_id } }" class="btn btn-default btn-sm f-size-12">取消分析</router-link>
              </div>
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
    <!--添加分析任务弹窗-->
    <addTask id="myModalD"></addTask>
  </div>
</template>
<script>
  import Panelwrap from'../../components/PanelWrap/'
  import MainHeader from'../../components/MainHeader/'
  import addTask from'../../components/addTask/'
    export default {
        data(){
            return {
              loading: false,
              totalData: '',
              lists: '',
              defaultPage: 1,
              acceptType: '',
              sortType: '',
              startTime: '',
              endTime: ''
            }
        },
        methods: {
          getList(params){
            this.loading = true;
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
          searchName(value){
            console.log("search")
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
          initialize(){
            this.$http.all([this.getList()])
          },
        },
        components: {
          MainHeader,
          Panelwrap,
          addTask
        },
        mounted(){
          //this.initialize()
        }
    }
</script>
