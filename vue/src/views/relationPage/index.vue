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
               v-on:filterClick="filterClick"
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
              <!--<router-link v-if="item.type==1" :to="{ name: 'addressCharts', query:{ address: item.title,analysisId:item.analysis_id } }"class="txid color4" style="line-height:normal; width: auto">{{item.analysis_id}}</router-link>
              <router-link v-if="item.type==2" :to="{ name: 'objectCharts', query:{ analysisId:item.analysis_id } }"class="txid color4" style="line-height:normal; width: auto">{{item.analysis_id}}</router-link>
              --><a href="javascript:void(0)" class="txid color4" style="width: auto">{{item.analysis_id}}</a>
            </td>
            <td><small>{{(item.type==1?"地址:":"对象:")+item.title}}</small></td>
            <td><span :class="[item.source_from === 'manual' ? 'color10' : 'color5']">{{item.schedule}}</span></td>
            <td v-if="item.state==0" >未开始</td>
            <td v-if="item.state==1" style="color: #399bff"><i class="fa fa-check" aria-hidden="true"></i>&nbsp;已完成</td>
            <td v-if="item.state==2" ><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbsp;正在分析中</td>

            <td>{{item.time | feeFilter }}</td>
            <td>
              <div v-if="item.state==0">
                 <button @click="delConfirm(item,1)" class="btn btn-default btn-sm f-size-12">删除</button>
              </div>
              <div v-if="item.state==1">
                <router-link :to="{ name: item.type==1?'addressCharts':'objectCharts', query:{analysisId:item.analysis_id } }" class="btn btn-default btn-sm f-size-12">查看详情</router-link>
                  <button @click="delConfirm(item,1)" class="btn btn-default btn-sm f-size-12">删除</button>
              </div>
              <div v-if="item.state==2">
                <button @click="delConfirm(item,2)" class="btn btn-default btn-sm f-size-12">取消分析</button>
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
    <addTask id="myModalD" @addTask="addTask"></addTask>
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
              state:'',
              startTime: '',
              endTime: '',
              searchVal:'',
              getListTimer:'',
              scheduleTimer:''
            }
        },
        methods: {
          getList(params){
            clearInterval(this.getListTimer);
            this.getListData(params)
            /*定时获取任务分析列表*/
            this.getListTimer=setInterval(()=>{
              this.getListData(params,true)
            },30*1000)
          },
          getListData(params,isUpdate){
            if (!isUpdate)
              this.loading = true;
            this.$http.post('/api/view/page',params)
              .then(res =>{
                this.loading = false
                if( res.data.data&&res.data.data.list.length>0){
                  this.lists = res.data.data
                //  this.autoSchedule();
                }else{
                  this.lists=[];
                  this.$message({
                    message: '暂无记录',
                    type: 'warning',
                  })
                }
              }).catch(err =>{
              if (!isUpdate) {
                this.loading=false
                this.$message({
                  message: '数据返回异常，请尝试刷新或者重新登录',
                  type: 'warning',
                })
              }
            })
          },
          autoSchedule(){
            /*前端计算任务进度*/
            clearInterval(this.scheduleTimer);
            this.scheduleTimer=setInterval(()=>{
              for(var i=0;i<this.lists.list.length;i++){
               // this.lists.list[i].schedule=parseInt(this.lists.list[i].schedule)+1+"%"
              }
            },1*1000)

          },
          addTask(){
            this.getList();
          },
          searchName(value){
            this.searchVal=value;
            this.handleCurrentChange()
            //this.getList({message:value})
          },
          sortItem(arg1,arg2){
            this.acceptType = arg1
            this.sortType = arg2
            this.defaultPage = 1
            this.handleCurrentChange()
          },
          filterClick(state){
            this.state=state;
            this.handleCurrentChange()
          },
          dataChange(val){
            this.startTime = val.substring(0,10)
            this.endTime = val.substring(13)
            this.defaultPage = 1
            this.handleCurrentChange()
          },
          handleCurrentChange(value){
            this.getList({ pageNumber:value,message: this.searchVal, desc : this.sortType, orderType: this.acceptType, states:this.state})
          },
          initialize(){
            this.$http.all([this.getList()])
          },
          delTarget(type,analysisId){
            if(type-0==1){
              return this.$http.post('/api/view/delete/'+analysisId)
            }else{
              return this.$http.post('/api/view/closeAnalysisMq/'+analysisId)
            }
          },
          delConfirm(item,type){
            var typeString=type==1?"删除":"取消";
            this.$confirm('是否'+typeString+'该报告?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) =>{
                if (action === 'confirm'){
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = typeString+'中...';
                    this.delTarget(type,item.analysis_id).then(res =>{
                      if (res.data.success)
                      {
                          instance.confirmButtonLoading = false;
                          this.loading = false;
                          this.getList();
                          done();
                          this.$message({
                              type: 'success',
                              duration: 2000,
                              message:res.data.message
                            })
                     }else{
                        instance.confirmButtonLoading = false;
                        this.loading = false
                        this.$message.error("")
                        done()
                      }})
                }else{
                  done()
                }}
            })
          },
        },
        components: {
          MainHeader,
          Panelwrap,
          addTask
        },
        mounted(){
          this.initialize()
        },
        destroyed(){
          clearInterval(this.getListTimer);
        }
    }
</script>
