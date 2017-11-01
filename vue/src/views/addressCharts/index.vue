<template>
  <div>
    <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>
    <PageHeader title-content="地址分析" main-content="可该地址进行深度分析，获取其与其他地址、对象直接的关联"></PageHeader>
    <div class="panel panel-deepGray">
      <div class="panel-body">
        <!--基本信息begin-->
        <h2 class="margin-t-0">
          分析报告
          &nbsp;<a href="javascript:void(0)" @click='delConfirm' class="f-size-18" data-toggle="tooltip"  data-placement="top" title="" data-original-title="删除报告"><i class="fa fa-trash-o"></i></a>
        </h2>
        <div class="addressBasic row border-b-color">
          <div class="col-md-8 f-bold">
            <div class="margin-b-5">
              <span class="color1">分析详情：</span>
              <span>{{data.address}}</span>
            </div>
            <div class="margin-b-5">
              <span class="color1">任务状态：</span>
              <span>{{data.sourcefrom | sourceFilter}}</span>
            </div>
            <div class="margin-b-5">
              <span class="color1">创建时间：</span>
              <span>{{data.addtime}}</span>
            </div>
            <div class="margin-b-5">
              <span class="color1">分析结果：</span>
              <span>{{data.remark}}</span>
            </div>
          </div>
        </div>
        <!--基本信息end-->
        <!--简单统计begin-->
        <div class="row" >
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
    <div class="containers">
      <div class="row" style="margin:0; padding: 50px 0 ;">
        <div class="col-xs-12 col-md-8">
          <div class="col-xs-0 col-md-1"></div>
          <div ref="container_visjs" id="container_visjs" class="col-xs-12 col-md-10 "  style="padding:0; background-color: #eee"></div>
          <div class="col-xs-0 col-md-1"></div>
        </div>
        <div class="col-xs-12 col-md-4" style="padding: 0 30px;">
          <table v-if="selectId&&selectId!=0" class="table" style="table-layout: fixed;border-left: 1px solid #ddd ">
            <tbody>
             <tr>
               <td class="col-xs-3 col-md-3"><strong><span>地址集</span></strong></td>
               <td class="col-xs-9 col-md-9 text-muted">{{selectAddress[0]}}<a href="javascript:;" @click="openSelectAddress" style="margin-left: 10px; ">[显示全部]</a></td>
             </tr>
             <tr class="">
               <td class="col-xs-3 col-md-3"><strong><span>拥有者</span></strong></td>
               <td class="col-xs-9 col-md-9 text-muted">0.00001690265486725664 BTC per kB</td>
             </tr>
             <tr>
               <td class="col-xs-3 col-md-3"><strong><span>交易次数</span></strong></td>
               <td class="col-xs-9 col-md-9 text-muted">Oct 14, 2017 10:22:28 AM</td>
             </tr>
             <tr>
               <td class="col-xs-3 col-md-3"><strong><span>交易地址</span></strong></td>
               <td class="col-xs-9 col-md-9 text-muted">undefined NaN, NaN NaN:NaN:NaN PM</td>
             </tr>
             <tr>
               <td class="col-xs-3 col-md-3"><strong><span>最终余额</span></strong></td>
               <td class="col-xs-9 col-md-9 text-muted">Unconfirmed</td>
             </tr>
             <tr>
               <td colspan="2" class="col-xs-12 col-md-12">
                 <a class="btn btn-default" href="javascript:;"
                    @click="openSelectAddress"><small>地址详情</small>
                 </a>
                 <a class="btn btn-default" href="javascript:;"
                    @click="openSelectAddress" style="margin-left: 10px"><small>手动扩线</small>
                 </a>
               </td>
             </tr>
               <!-- <tr>
                  <td colspan="2"><strong><span>地址集:</span></strong></td>
                </tr>
                <tr v-for="address in selectAddress">
                  <td class="text-muted text-right" colspan="2" style="text-align: left">
                    <label>
                      <input type="radio" name="inlineRadioOptions" id="" :value="address" v-model="checkAddress" style="float: left"/>
                      <p style="position: relative; line-height: 34px; display: inline-block; float: left; margin: 4px">{{address}}</p>
                    </label>

                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align:center;"><a class="btn btn-primary add_circle" href="javascript:;"
                                                                id="open_more" @click="addData">
                    <small>点击扩线</small>
                  </a></td>
                </tr>-->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Panelwrap title='涉及地址'
               v-on:searchClick='searchAddress2'
               placeholder='请输入地址'
    >
      <div class="panel-body table-responsive">
        <p class="f-size-12 color4">
          显示与该地址有交易行为的地址，或者有间接交易行为的地址。 点击&nbsp;
          <code>&nbsp;<i class="fa-search fa color4"></i>&nbsp;</code>&nbsp;可根据交易地址查询。
        </p>
        <table class="table table-striped addressBasic_table">
          <thead>
          <tr>
            <td>地址集</td>
            <td>拥有者信息</td>
            <td>交易状态</td>
            <td>其他</td>
          </tr>
          </thead>
          <tbody>
          <tr v-if='tradeAdd' v-for="(item, index) in tradeAdd.list">
            <td style="position: relative">
              <!-- <a class="txid color5" v-for="x in item.addresses">{{x}}</a> -->
              <div class="addresset" :class="{ showed : showNodes[index]}">
                <router-link :style="{overflow:'visible'}" v-for="(x, index) in item.addresses" :key = 'index' :to = "{ name: 'addressdetails',query:{ address: x }}" target = _blank class="txid color5">{{x}}</router-link>
                <i @click="showNodes.splice(index, 1, !showNodes[index])" class="show-more fa" :class="[showNodes[index] ? 'fa-angle-double-up' : 'fa-angle-double-down']" v-if='item.addresses.length > 1 '></i>
              </div>
            </td>
            <td>
              <a class="txid color4" href="javascript:void(0)">{{item.targetName}}</a>
            </td>
            <td>{{item.txTimes}}</td>
            <td><a class="btn btn-default" href="javascript:;"
                   @click="addData"><small>查看详情</small></a></td>
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

    <!--地址集选择列表begin-->
    <selectAddress id="myModalE"></selectAddress>
  </div>
</template>
<script>
  import PageHeader from '../../components/PageHeader/'
  import Panelwrap from'../../components/PanelWrap/'
  import selectAddress from'../../components/selectAddress/'
  export default {
    data(){
      /*1是终点，2是起点，3是过渡*/
      return {
        nodesData: [
          {id: '1', group: 'type_3', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '2', group: 'type_2', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '3', group: 'type_3', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '4', group: 'type_3', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '5', group: 'type_3', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '9', group: 'type_1', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '10', group: 'type_1', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'}
        ],
        nodesDataAdd: [
          {id: '6', group: 'type_3', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '7', group: 'type_1', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'},
          {id: '8', group: 'type_1', title: '7ae143cebb52930eda31ee26419708bedd8d3c66f9fd7a8e06862df576ee937e'}],
        edgesData: [
          {from: '1', to: '3'},
          {from: '1', to: '2'},
          {from: '2', to: '4'},
          {from: '2', to: '5'},
          {from: '4', to: '9'},
          {from: '5', to: '10'}
        ],
        edgesDataAdd: [
          {from: '3', to: '6'},
          {from: '6', to: '7'},
          {from: '6', to: '8'}
        ],
        /*选中的id*/
        selectId: '',
        hasCheckAddress:{},
        /*点选中的地址集*/
        selectAddress: [],
        /*列表选中的地址*/
        checkAddress: "",
        data: {},
        canAdd: true,
        loading: false,
        defaultAddress:'',
        relationAddress:{},
        tradeAdd:"",
        showNodes:'',
        testData: {
          "data": {
            "150_未知_0": {
              "targetName": "未知",
              "addresses": ["1F6HRKBprGRrDKxHcmF41WZraQ9bmSasnx"],
              "txTotalAmount": "1.19000000",
              "txtargetAddressMap": {},
              "targetId": 0,
              "txTimes": 10,
              "_key": "8159476"
            },
            "178_未知_1": {
              "targetName": "未知",
              "addresses": ["1A3oc7bZGrGfRKhf6gWiNnWWQwhwHX2X8e", "18f4py3HfS5kLgpfzRej15xcHTZ97TgKd3", "1B4CHXhATbW1p1SajHT1BMp4NpDw4tXuVX", "1Jku8UJ7CwNzLmSawA6rYcDrKV3cErekoj", "163c6YtwNbfVSyVvMQCBcmNX9RdYQdRqqa", "163c6YtwNbfVSyVvMQCBcmNX9RdYQdRqqa", "17cZtkDxdRkyywsNaPhbsexP9kAerUGeiq"],
              "txTotalAmount": "3.57000000",
              "txtargetAddressMap": {
                "278_Gribble IRC Bot_1": {
                  "targetName": "未知",
                  "addresses": ["1MgD6rah5zUgEGYZnNmdpnXMaDR3itKYzU"],
                  "txTotalAmount": "3.57000000",
                  "txtargetAddressMap": null,
                  "targetId": 0,
                  "txTimes": 1,
                  "_key": "8278386"
                }
              },
              "targetId": 0,
              "txTimes": 10,
              "_key": "8278386"
            },
            "101_未知_0": {
              "targetName": "未知",
              "addresses": ["15MyyUgJLebaoJrPPsr9DTmEDDENZdKG2E"],
              "txTotalAmount": "1.95000000",
              "txtargetAddressMap": {},
              "targetId": 0,
              "txTimes": 10,
              "_key": "8308989"
            },
            "183_未知_1": {
              "targetName": "未知",
              "addresses": ["17196vCY2Sg9i99Ueuuj55toxePnatNtft"],
              "txTotalAmount": "360.00000000",
              "txtargetAddressMap": {
                "283_Bitcoin-otc Donations_1": {
                  "targetName": "未知",
                  "addresses": ["12o8Qy2CeMfCWEfRTH3yFgLqcjCE5AznBr", "1MgD6rah5zUgEGYZnNmdpnXMaDR3itKYzU", "1Ex9Lvka7pjNbctgn2r1BACkfuTAFSanzx", "18E2w5XrjvqPvwe3V3F95ysweZ3HnPDxjx", "1MgD6rah5zUgEGYZnNmdpnXMaDR3itKYzU", "1MgD6rah5zUgEGYZnNmdpnXMaDR3itKYzU", "1F1dPZxdxVVigpGdsafnZ3cFBdMGDADFDe", "1F1dPZxdxVVigpGdsafnZ3cFBdMGDADFDe"],
                  "txTotalAmount": "360.00000000",
                  "txtargetAddressMap": null,
                  "targetId": 0,
                  "txTimes": 2,
                  "_key": "8713592"
                }
              },
              "targetId": 0,
              "txTimes": 10,
              "_key": "8713592"
            },
            "142_未知_1": {
              "targetName": "未知",
              "addresses": ["1KDuHZgqfq272wznvQNgbtNk31Fc1SLtK1"],
              "txTotalAmount": "25.00000000",
              "txtargetAddressMap": {
                "242_Bitcoin-otc Donations_1": {
                  "targetName": "未知",
                  "addresses": ["18RV21kra3h5wycwKvxFAePnV1z7kav8ui", "1F1dPZxdxVVigpGdsafnZ3cFBdMGDADFDe", "1MgD6rah5zUgEGYZnNmdpnXMaDR3itKYzU", "1MgD6rah5zUgEGYZnNmdpnXMaDR3itKYzU", "1F1dPZxdxVVigpGdsafnZ3cFBdMGDADFDe", "1F1dPZxdxVVigpGdsafnZ3cFBdMGDADFDe", "18itX6b1wiu5UPdFAJSkyTuw5bxataGQw9"],
                  "txTotalAmount": "25.00000000",
                  "txtargetAddressMap": null,
                  "targetId": 0,
                  "txTimes": 2,
                  "_key": "8351615"
                }
              },
              "targetId": 0,
              "txTimes": 10,
              "_key": "8351615"
            }
          }, "success": true, "message": "查询成功"
        },
        testAddData: {
          "data": {
            "164_未知_0": {
              "targetName": "未知",
              "addresses": ["1C8JWPp2YSM2CEDVtr5YxUq9wFYcvT2aEB", "1L7wRZFBrWGFfuv7rkd6yNv61uRUnyB6Mn"],
              "txTotalAmount": "11.19000000",
              "txtargetAddressMap": {},
              "targetId": 0,
              "txTimes": 2,
              "_key": "8087209"
            },
            "171_未知_0": {
              "targetName": "未知",
              "addresses": ["1MgD6rah5zUgEGYZnNmdpnXMaDR3itKYzU", "1K8gfxxh83XTv5qftL5MmkTSjvSQnToBsS"],
              "txTotalAmount": "1.19000000",
              "txtargetAddressMap": {},
              "targetId": 0,
              "txTimes": 2,
              "_key": "8159476"
            }
          }, "success": true, "message": "查询成功"
        }
      }
    },
    methods: {
      getData(address, isInit)
      {
        this.loading = true;
        var params={};
        if (isInit) {
          if(address){
            params = {address: address};
          }else{
            params = {address: "15gghAxQ3WckS5ei4Q4dAJDKT3K21cVTYZ"};
          }
          //this.initData(this.testData.data);
          this.$http.post('/api/view/address', params)
            .then(res =>{
            this.loading = false;
            this.initData(res.data.data,address)}).catch(err =>{
            this.loading = false;
          })
        } else {
          params = {address: this.checkAddress};
          //this.updateData(this.testAddData.data);
          this.$http.post('/api/view/address', params)
            .then(res =>{
            this.loading = false;
            this.updateData(res.data.data)}).catch(err =>{
            this.loading = false;
          })
        }
      },
      initData(data,address)
      {
        /*生成一级起始点*/
        this.nodesData = [{
          id: '0',
          group: 'type_2',
          title: '0',
          addresses:[address]
        }];
        this.edgesData = [];
        this.hasExpandId={};

        for (var obj in data) {
          var toId = this.addNode("0", obj, data[obj].addresses);
          var oneAddress = data[obj].txtargetAddressMap;
          for (var thirdAddressObj in oneAddress) {
            this.addNode(toId, thirdAddressObj, oneAddress[thirdAddressObj].addresses);
          }
        }
        this.initVis();
      },
      updateData(data){
        /*当前地址已经查询过*/
        //this.hasCheckAddress[this.checkAddress]=true;

        for (var obj in data) {
          var toId = this.addNode(this.selectId, obj, data[obj].addresses);
          var oneAddress = data[obj].txtargetAddressMap;
          for (var thirdAddressObj in oneAddress) {
            this.addNode(toId, thirdAddressObj, oneAddress[thirdAddressObj].addresses);
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
      initVis()
      {
        // this.getData();
        var nodes = new vis.DataSet(this.nodesData);
        var edges = new vis.DataSet(this.edgesData);
        this.data = {
          nodes: nodes,
          edges: edges
        };

        var options = {
          configure: {
            enabled: false,
            filter: 'nodes,edges',
            showButton: true
          },
          interaction: {
            hover: true
          },
          groups: {
            type_1: {
              color: {
                border: '#e4afa9',
                background: '#ef4836',
                highlight: {
                  border: '#fccf7e',
                  background: '#FFA500'
                },
                hover: {
                  border: '#fccf7e',
                  background: '#FFA500'
                }
              }
            },

            type_2: {
              color: {
                border: '#98cafc',
                background: '#399bff',
                highlight: {
                  border: '#fccf7e',
                  background: '#FFA500'
                },
                hover: {
                  border: '#fccf7e',
                  background: '#FFA500'
                }
              }
            },

            type_3: {
              color: {
                border: '#dbedff',
                background: '#81bfff',
                highlight: {
                  border: '#fccf7e',
                  background: '#FFA500'
                },
                hover: {
                  border: '#fccf7e',
                  background: '#FFA500'
                }
              },
              size: 10
            }

          },
          autoResize: true,
          edges: {
            color: {
              color: '#D9D9D9',
              highlight: '#D9D9D9',
              hover: '#D9D9D9',
              opacity: 1.0
            },
            arrows: {from : true }
          },
          layout: {
            randomSeed: 2,//配置每次生成的节点位置都一样，参数为数字1、2等
            hierarchical: {
              direction: 'LR'//UD:上下 DU:下上 LR:左右 RL:右左
            }, //层级结构显示}
          },
          nodes: {
            color: {
              border: '#EC5148',
              background: '#EC5148',
              highlight: {
                border: '#FF8203',
                background: '#FF8203'
              },
              hover: {
                border: '#EC5148',
                background: '#EC5148'
              }
            },
            borderWidth: 3,
            chosen: true,
            font: {
              color: '#000',
              face: 'Microsoft YaHei',
              size: 8
            },
            fixed: {
              x: false,
              y: false
            },
            shape: 'dot',
            size: 15,
            physics: false,     // 将节点移出物理模拟
            scaling: {
              min: 15,
              max: 15
            }

          }
        };

        var container = document.getElementById('container_visjs');
        var network = new vis.Network(container, this.data, options);
        network.setOptions(options);
        var _this = this;
        network.on("selectNode", function (params) {//单击事件
          if (params.nodes.length > 0) {
            //点击的时候获取点的ID
            var nodesId_ = params.nodes[0];
            // var nodesData_ = this.nodesData;
            _this.selectId = params.nodes[0];
            _this.selectAddress = _this.getAddress(params.nodes[0]);
            _this.checkAddress =_this.selectAddress[0];
          }
        });

        this.nodes = nodes;
        this.edges = edges;
        this.options = options;
        this.network = network;
      },
      addNode(fromId, obj, addresses){
        var infoArray = obj.split("_");
        var type = infoArray[1] == "未知" ? "type_3" : "type_1";
        if (type == "type_1") {
          this.canAdd = false;
        }
        this.edgesData.push({from: infoArray[0], to:fromId });
        for(var i=0;i<this.nodesData.length;i++){
          /*是否记录过当前的点*/
          if(this.nodesData[i].id==infoArray[0])
            return
        }
        this.nodesData.push({
          id: infoArray[0],
          group: type,
          title: infoArray[0],
          addresses: addresses
        });
        return infoArray[0];
      },
      getAddress(id){
        for (var i = 0; i < this.nodesData.length; i++) {
          if (this.nodesData[i].id == id) {
            return this.nodesData[i].addresses;
          }
        }
      },
      addData(){
        /*是否找到终点了*/
        if (!this.canAdd) {
          return;
        }

        if(this.checkAddress&&!this.hasCheckAddress[this.checkAddress]){
          this.getData();
        }
      },
      delConfirm(){
        this.$confirm('是否删除该报告?', '提示', {
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
      },
      searchAddress2(){},
      handleTradeAddChange(value){
        this.getTradeAdd({pageNumber:value})
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
              message: '登录失效,请重新登录',
              type: 'warning',
            })
            setTimeout(()=>{this.$router.push('/loginpage')},3000)
          }
        })
      },
      getTradeAdd(params){
        let defaultData = {'address': this.$route.query.address}
        // let defaultData = {'address': '13zy8e4kk8vJzBepuxEoBzEmS1KAQtbKPQ'}
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
            this.$message({
              message: '登录失效,请重新登录',
              type: 'warning',
            })
            setTimeout(()=>{this.$router.push('/loginpage')},3000)
          }
        })
      },
      openSelectAddress(){
        $("#myModalE").modal("show")
      },
      initialize(){
        let address = this.$route.query.address
        this.$http.all([this.getData(address, true),this.getTrade(address),this.getTradeAdd(address)])
      },
    },
    mounted()
    {
     // let address = this.$route.query.address
      //this.getData(address, true);
      this.initialize();
    },
    components: {
      PageHeader,
      Panelwrap,
      selectAddress
    }
  }
</script>
