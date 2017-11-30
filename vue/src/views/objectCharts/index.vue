<template>
  <div>
    <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>

    <PageHeader title-content="对象分析" main-content="包括基本信息、交易记录、已知拥有地址、关联对象等信息。"></PageHeader>

    <div class="panel panel-deepGray">
      <div class="panel-body">
        <!--基本信息begin-->
        <h2 class="margin-t-0">
          分析报告
          &nbsp;<a href="javascript:void(0)" @click='delConfirm' class="f-size-18" data-toggle="tooltip"
                   data-placement="top" title="" data-original-title="删除报告"><i class="fa fa-trash-o"></i></a>
        </h2>
        <div class="addressBasic row border-b-color">
          <div class="col-md-8 f-bold">
            <div class="margin-b-5">
              <span class="color1">分析详情：</span>
              <span>对象 : {{analysisData.title}}</span>
            </div>
            <div class="margin-b-5">
              <span class="color1">任务状态：</span>
              <span>{{analysisData.state | taskStatusFilter}}</span>
            </div>
            <div class="margin-b-5">
              <span class="color1">创建时间：</span>
              <span>{{pageData.addTime
                }}</span>
            </div>
            <div class="margin-b-5">
              <span class="color1">分析结果：</span>
              <span>{{pageData.remark}}</span>
            </div>
          </div>
        </div>
        <!--基本信息end-->
        <!--简单统计begin-->
        <div class="row">
          <div class="col-md-2 text-center">
            <label class="color4">交易次数</label><br/>
            <span class="color1 f-bold">{{pageData.txTotal}}次</span>
          </div>
          <div class="col-md-2 text-center">
            <label class="color4">转入次数</label><br/>
            <span class="color1 f-bold">{{pageData.txIntotal | nullFilter}}次<span>（{{pageData.txInPer}}%)</span></span>
          </div>
          <div class="col-md-2 text-center">
            <label class="color4">转出次数</label><br/>
            <span class="color1 f-bold">{{pageData.txOutTotal | nullFilter}}次（{{pageData.txOutInPer}}%）</span>
          </div>
          <div class="col-md-2 text-center">
            <label class="color4">已知地址</label><br/>
            <span class="color1 f-bold">{{pageData.addressTotal}}个</span>
          </div>
          <div class="col-md-2 text-center">
            <label class="color4">已知余额</label><br/>
            <span class="color1 f-bold">{{pageData.balance | feeFilter }} BTC</span>
          </div>
          <div class="col-md-2 text-center">
            <label class="color4">关联对象</label><br/>
            <span class="color1 f-bold">{{pageData.targetRelationTotal}}个</span>
          </div>
        </div>
        <!--简单统计end-->
      </div>
    </div>

    <div class="containers">
      <div class="row" style="margin:0; padding: 50px 0 ;">
        <div class="col-xs-12 col-md-8">
          <div class="col-xs-0 col-md-1"></div>
          <div ref="container_visjs" id="container_visjs" class="col-xs-12 col-md-10 "
               style="padding:0; background-color: #eee"></div>
          <div class="col-xs-0 col-md-1"></div>
        </div>
        <div class="col-xs-12 col-md-4" style="padding: 0 30px;">
          <table class="table" style="table-layout: fixed;border-left: 1px solid #ddd ">
            <tbody>
            <tr class="">
              <td class="col-xs-3 col-md-3"><strong><span>标签</span></strong></td>
              <td class="col-xs-9 col-md-9 text-muted">{{checkData.tag=='未知'?checkData.targetName:checkData.tag}}</td>
            </tr>
            <tr v-if="checkData.addresses&&checkData.addresses.length">
              <td class="col-xs-3 col-md-3"><strong><span>拥有地址</span></strong></td>
              <td class="col-xs-9 col-md-9 text-muted">{{checkData.addresses?checkData.addresses[0]:''}}<a href="javascript:;"
                                                                                    @click="openSelectAddress"
                                                                                    style="margin-left: 10px; ">[显示全部]</a>
              </td>
            </tr>
            <tr>
              <td class="col-xs-3 col-md-3"><strong><span>交易次数</span></strong></td>
              <td class="col-xs-9 col-md-9 text-muted">{{checkData.txTimes}}次</td>
            </tr>
            <tr>
              <td class="col-xs-3 col-md-3"><strong><span>交易金额</span></strong></td>
              <td class="col-xs-9 col-md-9 text-muted">{{checkData.txTotalAmount}}BTC</td>
            </tr>
            <tr>
              <td class="col-xs-3 col-md-3" style=""><strong><span></span></strong></td>
              <td class="col-xs-9 col-md-9 text-muted" style=""></td>
            </tr>
            <tr>
              <td colspan="2" class="col-xs-12 col-md-12">
                <a class="btn btn-default" href="javascript:;"
                   @click="openSelectAddress">
                  <small>对象详情</small>
                </a>
                <a class="btn btn-default" href="javascript:;" v-if="canAdd"
                   @click="addData" style="margin-left: 10px">
                  <small>手动扩线</small>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!--地址集选择列表begin-->
    <selectAddress v-if="checkData.addresses"  id="myModalE" :selectAddress="checkData.addresses" @addData="addData" source="object"></selectAddress>
  </div>
</template>
<script>
  import PageHeader from '../../components/PageHeader/'
  import MainHeader from '../../components/MainHeader/'
  import selectAddress from '../../components/selectAddress/'

  export default {
    data() {
      /*1是终点，2是起点，3是过渡*/
      return {
        nodesData: [],
        nodesDataAdd: [],
        edgesData: [],
        edgesDataAdd: [],
        /*选中的id*/
        selectId: '',
        hasCheckAddress: {},
        /*点选中的地址集*/
        selectAddress: [],
        /*列表选中的地址*/
        checkAddress: "",
        checkData: {
          addresses: []
        },
        data: {},
        pageData: {},
        analysisData: {},
        canAdd: true,
        loading: false,
        defaultAddress: ''
      }
    },
    methods: {
      getData(analysisId, isInit) {
        this.loading = true;
        var params = {};
        if (isInit) {
          this.$http.get('/api/view/detail/' + analysisId)
            .then(res => {
              this.loading = false;
              this.pageData = res.data.data.data;
              this.analysisData = res.data.data.analysis;
              this.analysisData.resdata = this.strToJson(res.data.data.analysis.resdata);
              this.initData(this.analysisData.resdata)
            }).catch(err => {
            this.loading=false
            this.$message({
              message: '数据返回异常，请尝试刷新或者重新登录',
              type: 'warning',
            })
          })
        } else {
          params = {address: this.checkData.addresses.join(',')};
          this.$http.post('/api/view/target', params)
            .then(res => {
              this.loading = false;
              this.updateData(res.data.data)
            }).catch(err => {
            this.loading=false
            this.$message({
              message: '数据返回异常，请尝试刷新或者重新登录',
              type: 'warning',
            })
          })
        }
      },
      initData(data) {
        /*生成一级起始点*/
        var beginData = {
          addresses:data.addresses,
          txTimes: data.txTimes,
          txTotalAmount: data.txTotalAmount,
          targetName:data.targetName,
          tag:data.tag
        };
        this.nodesData = [{
          id:data.unique,
          group: 'type_2',
          title: '0',
          data: beginData
        }];
        this.checkData = beginData;
        this.edgesData = [];

        console.log(data)
        for (var i = 0; i < data.txtargetAddList.length; i++) {
          var toId = this.addNode(data.unique, data.txtargetAddList[i].unique, data.txtargetAddList[i]);
          var oneAddress = data.txtargetAddList[i].txtargetAddList;
          if(oneAddress){
            for (var j = 0; j < oneAddress.length; j++) {
              this.addNode(toId, oneAddress[j].unique, oneAddress[j]);
            }
          }
        }
        this.initVis();
      },
      updateData(data){
        /*当前地址已经查询过*/
        for (var i=0;i<data.length; i++) {
          var toId = this.addNode(this.selectId, data[i].unique, data[i]);
          var oneAddress = data[i].txtargetAddList;
          if(oneAddress){
            for (var j=0;j<oneAddress.length; j++) {
              this.addNode(toId, oneAddress[j].unique,oneAddress[j]);
            }
          }
        }
        //更新关系图
        this.nodes.update(this.nodesData);
        this.edges.update(this.edgesData);
        this.data = {
          nodes: this.nodes,
          edges: this.edges
        };
        //network.setData(data);
        //重置设置
        this.network.setOptions(this.options);
      },
      initVis() {
        var nodes = new vis.DataSet(this.nodesData);
        var edges = new vis.DataSet(this.edgesData);
        this.data = {
          nodes: nodes,
          edges: edges
        };
        var options = this.$store.state.vis;
        var container = document.getElementById('container_visjs');
        var network = new vis.Network(container, this.data, options);
        network.setOptions(options);
        var _this = this;
        network.on("selectNode", function (params) {//单击事件
          if (params.nodes.length > 0) {
            //点击的时候获取点的ID
            _this.selectId = params.nodes[0];
            _this.checkData = _this.getCheckData(params.nodes[0])
            _this.selectAddress = _this.checkData.addresses;
          }
        });

        this.nodes = nodes;
        this.edges = edges;
        this.options = options;
        this.network = network;
      },
      addNode(fromId, obj, data) {
        var type = data.isFind ? "type_1" : "type_3";
        if (type == "type_1") {
          this.canAdd = false;
        }
        this.edgesData.push({from: data.unique, to: fromId});
        for (var i = 0; i < this.nodesData.length; i++) {
          /*是否记录过当前的点*/
          if (this.nodesData[i].id == data.unique)
            return data.unique;
        }
        this.nodesData.push({
          id: data.unique,
          group: type,
          title: data.unique,
          data: data
        });
        return data.unique;
      },
      getAddress(id) {
        for (var i = 0; i < this.nodesData.length; i++) {
          if (this.nodesData[i].id == id) {
            return this.nodesData[i].addresses;
          }
        }
      },
      getCheckData(id) {
        for (var i = 0; i < this.nodesData.length; i++) {
          if (this.nodesData[i].id == id) {
            return this.nodesData[i].data;
          }
        }
      },
      delConfirm() {
        this.$confirm('是否删除该报告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              this.delAddress().then(res => {
                if (res.data.success) {
                  this.loading = true
                  instance.confirmButtonLoading = false;
                  done();
                  this.$message({
                    type: 'success',
                    duration: 2000,
                    message: res.data.message
                  })
                  setTimeout(() => {
                    this.$router.push('/relation')
                  }, 2000)
                } else {
                  instance.confirmButtonLoading = false;
                  this.$message.error(res.data.message)
                  done()
                }
              })
            } else {
              done()
            }
          }
        })
      },
      addData() {
        /*是否找到终点了*/
        if (!this.canAdd) {
          return;
        }
        this.getData();
      },
      openSelectAddress() {
        $("#myModalE").modal("show")
      },
      initialize() {
        let id = parseInt(this.$route.query.id);
        let analysisId = this.$route.query.analysisId;
        this.analysisId = analysisId;
        this.$http.all([this.getData( analysisId, true)])
      },
      strToJson(str) {
        var json = (new Function("return " + str))();
        return json;
      }
    },
    mounted() {
      this.initialize();
    },
    components: {
      PageHeader,
      MainHeader,
      selectAddress
    }
  }
</script>
