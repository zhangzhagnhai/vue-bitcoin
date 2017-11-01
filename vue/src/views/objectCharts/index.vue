<template>
  <div>
    <div v-if="loading" class="loading"><img src="../../assets/img/loading.gif" alt="loading-img"></div>

    <MainHeader title='关联分析' sub-title='可管理对象，包括新增对象、编辑对象和删除对象' btn-title='添加新对象'></MainHeader>

    <div class="container" style="margin-top:50px">
      <div class="row">
        <div class="col-xs-12 col-md-8">
          <div ref="container_visjs" id="container_visjs"></div>
        </div>
        <div class="col-xs-12 col-md-4 col-gray">
          <table v-if="selectId&&selectId!=0" class="table" style="table-layout: fixed">
            <tbody>
            <!-- <tr>
               <td><strong><span>Size</span></strong></td>
               <td class="text-muted text-right">226 (bytes)</td>
             </tr>21.53 21.34
             <tr class="">
               <td><strong><span>Fee Rate</span></strong></td>
               <td class="text-muted text-right">0.00001690265486725664 BTC per kB</td>
             </tr>
             <tr>
               <td><strong><span>Received Time</span></strong></td>
               <td class="text-muted text-right">Oct 14, 2017 10:22:28 AM</td>
             </tr>
             <tr>
               <td><strong><span>Mined Time</span></strong></td>
               <td class="text-muted text-right">undefined NaN, NaN NaN:NaN:NaN PM</td>
             </tr>
             <tr>
               <td><strong><span>Included in Block</span></strong></td>
               <td class="text-muted text-right">Unconfirmed</td>
             </tr>
             <tr>
               <td><strong>LockTime</strong></td>
               <td class="text-muted text-right">0</td>
             </tr>
             <tr>
               <td><strong>Coinbase</strong></td>
               <td class="text-muted text-right">
                 <div class="ellipsis"><span></span></div>
               </td>
             </tr>-->
            <tr>
              <td colspan="2"><strong><span>地址集:</span></strong></td>
              <!-- <td class="text-muted text-right">{{address}}</td>-->
            </tr>
            <tr v-for="address in selectAddress">
              <td class="text-muted text-right" colspan="2" style="text-align: left">
                <label>
                  <input type="radio" name="inlineRadioOptions" id="" :value="address" v-model="checkAddress"
                         style="float: left"/>
                  <p style="position: relative; line-height: 34px; display: inline-block; float: left; margin: 4px">
                    {{address}}</p>
                </label>

              </td>
            </tr>
            <tr v-if="false">
              <td colspan="2" style="text-align:center;"><a class="btn btn-primary add_circle" href="javascript:;"
                                                            id="open_more" @click="addData">
                <small>点击扩线</small>
              </a></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import MainHeader from'../../components/MainHeader/'
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
        hasCheckAddress: {},
        /*点选中的地址集*/
        selectAddress: [],
        /*列表选中的地址*/
        checkAddress: "",
        data: {},
        loading: false,
        defaultAddress: '',
        testData: {
          "data": {
            "1de_未知": {
              "targetName": "未知",
              "addresses": ["1LJtEechWYL8GXdQUvxF3CGAhHHX7qgHpd", "13zy8e4kk8vJzBepuxEoBzEmS1KAQtbKPQ"],
              "txTotalAmount": "14.46000000",
              "targetId": 0,
              "txtargetAddressMap": {},
              "txTimes": 1,
              "_key": null
            },
            "1e8_未知": {
              "targetName": "未知",
              "addresses": ["1LvmNHMSKQ7zTGR7KebgfZbsroqsKAVsRf"],
              "txTotalAmount": "32.41000000",
              "targetId": 0,
              "txtargetAddressMap": {},
              "txTimes": 11,
              "_key": null
            },
            "185_未知": {
              "targetName": "未知",
              "addresses": ["1LrqWruvMzp76oQ8pZZmQ68ty1SnCdZr7W"],
              "txTotalAmount": "32.77000000",
              "targetId": 0,
              "txtargetAddressMap": {},
              "txTimes": 11,
              "_key": null
            },
            "1bc_未知": {
              "targetName": "未知",
              "addresses": ["1J3ShBAVauV2sA4xUF56VBP277pcucHTuk", "143sdiYh3MVQd746v89yA2Pyijb1uQ3WoP"],
              "txTotalAmount": "14.46000000",
              "targetId": 0,
              "txtargetAddressMap": {},
              "txTimes": 2,
              "_key": null
            },
            "王五-330327198901153367": {
              "targetName": "未知",
              "addresses": ["1DC42aVqeQGRFVZSw9LTnqccx1xoytmxjR", "13zy8e4kk8vJzBepuxEoBzEmS1KAQtbKPQ"],
              "txTotalAmount": "32.77000000",
              "targetId": 0,
              "txtargetAddressMap": null,
              "txTimes": 2,
              "_key": null
            },
            "美杜莎-330327199701183375": {
              "targetName": "未知",
              "addresses": ["1LJtEechWYL8GXdQUvxF3CGAhHHX7qgHpd", "1A6wk6475aSfHNsEvSsGw5cckbbh1nmAtJ"],
              "txTotalAmount": "15.77000000",
              "targetId": 0,
              "txtargetAddressMap": null,
              "txTimes": 2,
              "_key": null
            },
            "1fb_未知": {
              "targetName": "未知",
              "addresses": ["1C5nRRFcetWGMs3Kj2cgmSYq1KNwoFPhoH"],
              "txTotalAmount": "29.33000000",
              "targetId": 0,
              "txtargetAddressMap": {},
              "txTimes": 11,
              "_key": null
            },
            "14b_未知": {
              "targetName": "未知",
              "addresses": ["1GRTwhTKRXwuJki1Rgo7t2pm9Z6kxba1th", "12SWkYk96yZWGbqR9iv4ffvs1LnepiFGJq"],
              "txTotalAmount": "10.00000000",
              "targetId": 0,
              "txtargetAddressMap": {},
              "txTimes": 11,
              "_key": null
            },
            "16a_未知": {
              "targetName": "未知",
              "addresses": ["13zy8e4kk8vJzBepuxEoBzEmS1KAQtbKPQ", "1GRTwhTKRXwuJki1Rgo7t2pm9Z6kxba1th"],
              "txTotalAmount": "15.77000000",
              "targetId": 0,
              "txtargetAddressMap": {},
              "txTimes": 2,
              "_key": null
            }
          }, "success": true, "message": "查询成功"
        }
      }
    },
    methods: {
      getData(id)
      {
        //this.loading = true;
        var params = {};
        if (id) {
          params = {targetMessage: id};
        } else {
          params = {targetMessage: 1};
        }
        this.initData(this.testData.data);
        this.$http.post('/api/view/target', params)
          .then(res =>{
        this.loading = false;
        this.initData(res.data.data, id)
        }).
          catch(err =>{
            this.loading = false;
        })
      },
      initData(data, address)
      {
        /*生成一级起始点*/
        this.nodesData = [{
          id: '0',
          group: 'type_2',
          title: '0',
          addresses: [address]
        }];
        this.edgesData = [];
        this.hasExpandId = {};

        for (var obj in data) {
          var toId = this.addNode("0", obj, data[obj].addresses);
          var oneAddress = data[obj].txtargetAddressMap;
          for (var thirdAddressObj in oneAddress) {
            this.addNode(toId, thirdAddressObj, oneAddress[thirdAddressObj].addresses);
          }
        }

        this.initialize();
      },
      initialize()
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
            _this.checkAddress = _this.selectAddress[0];
          }
        });

        this.nodes = nodes;
        this.edges = edges;
        this.options = options;
        this.network = network;
      },
      addNode(fromId, obj, addresses){
        var infoArray = obj.split("_");
        this.edgesData.push({from: infoArray[0], to: fromId});
        for (var i = 0; i < this.nodesData.length; i++) {
          /*是否记录过当前的点*/
          if (this.nodesData[i].id == infoArray[0])
            return
        }
        this.nodesData.push({
          id: infoArray[0],
          group: "type_1",
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
      addData()
      {
        console.log(this.checkAddress)
        return;
        if (this.checkAddress && !this.hasCheckAddress[this.checkAddress]) {
          this.getData();
        }
      }
    },
    mounted()
    {
      let id = parseInt(this.$route.query.id);
      this.getData(id, true);
      // this.initialize();
    },
    components: {
      MainHeader
    }
  }
</script>
