<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-center">
          <button @click="resetForm()" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">地址集</h4>
        </div>
        <div class="modal-body">
          <el-form class="form-horizontal">
            <!--输入地址-->
            <div style="margin-bottom: 5px">该地址集包含{{selectAddress.length}}个地址，可手动选择一个查看详情</div>
            <ul class="selectAddress">
              <li v-for="(address,index) in selectAddress" @click="checkIndex=index"><i :class="checkIndex==index?'fa fa-check-circle':'fa fa-check-circle-o'"></i><span>{{address}}</span></li>
            </ul>
          </el-form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-white" data-dismiss="modal">取消</button>
          <router-link type="button" class="btn btn-default" :to = "{ name: 'addressdetails',query:{ address: selectAddress[checkIndex]}}"  tag="button">地址详情</router-link>
         <!-- <button type="button" class="btn btn-default" data-dismiss="modal" @click="addData()">手动扩线</button>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { addressUpdate } from '../../store/types.js'
  import addObject from'../../components/addObject/'
  export default {
    data(){
      return {
        addressList: ["13uEiASd7VyfE7qWGYzZtanMiYguZM5c53","13uEiASd7VyfE7qWGYzZtanMiYguZM5c55","13uEiASd7VyfE7qWGYzZtanMiYguZM5c57"],
        checkIndex:0,
        objectData:''
      }
    },
    props:["id","selectAddress","source"],
    methods: {
      resetForm(){},
      addData(){
        this.$emit('addData', this.addressList[this.checkIndex]);
      },
      getObjectData(params){
        this.loading = true;
        this.$http.post('/api/target/targetList',params)
          .then(res =>{
          this.loading = false
          this.objectData = res.data.data;
       })
      },
      openObject(){
        $("#myModalA").modal({ show: true }, {noMore: '1'})
      }
    },
    components: {addObject},
    mounted(){
     // this.getObjectData()
    }
  }
</script>
