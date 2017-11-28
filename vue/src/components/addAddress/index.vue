<template>
   <div style="color: #676a6c;">
     <div class="modal fade" id="myModalB" tabindex="-1" role="dialog" aria-hidden="true">
       <div class="modal-dialog">
         <div class="modal-content">
           <div class="modal-header text-center">
             <button @click="resetForm('ruleAddress')" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
             <h4 class="modal-title">添加新地址</h4>
           </div>
           <div class="modal-body">
             <el-form class="form-horizontal" :model="ruleAddress" :rules="addrules" ref='ruleAddress'>
               <div class="form-group" v-for="item in itemArray">
                 <label class="col-sm-2 control-label form-label">{{item.name}}</label>
                 <div class="col-sm-10">
                   <el-form-item :prop='item.prop'>
                     <el-input v-model='ruleAddress[item.prop]' :rows='5' :type="item.type" :placeholder="item.placeholder">
                       <template v-if="item.type=='text'" slot="prepend"><i :class=item.class></i></template>
                     </el-input>
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
   </div>
</template>
<script>
   import { addressUpdate } from '../../store/types.js'
    export default {
        data(){
          var checkAddress = (rule, value, callback) =>{
            if (value === '') {
              return callback(new Error('地址不能为空'));
            }else if( value.length < 26 || value.length >34 ){
              return callback(new Error('地址输入有误'));
            }else {
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
            ruleAddress: {
              add: '',
              remark: '',
              objectValue: '',
            },
            addrules:{
              add:[
                { validator: checkAddress, trigger: 'blur' }
              ],
              remark:[
                { validator: checkTextArea, trigger: 'blur' }
              ],
            },
            itemArray:[
              {name:"地址",prop:"add",placeholder:"请输入地址，必填",class:"fa fa-map-marker color5",type:'text'},
              {name:"备注",prop:"remark",placeholder:"可输入更多地址备注信息，选填。(最大长度不能超过100汉字)",type:'textarea'}
            ],
            objectData:''
          }
        },
        props:["id"],
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
              console.log(res)
              if (res.data.success) {
                this.$store.commit(addressUpdate,true);
              $("#myModalB").modal("hide");
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.loading = false;
              //this.ruleAddress = ''
              this.resetForm('ruleAddress');
              this.$emit('addSuccess', true);
              //this.getList()
            }else{
              this.loading = false
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          })
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
           // $('#myModalA').data('index',1)
            var _this=this;
            $("#myModalA").modal({ show: true }, {noMore: '1'})
            $('#myModalA').on('hide.bs.modal', function () {
              _this.getObjectData();
           })
          }
        },
        mounted(){
          this.getObjectData()
        }
    }
</script>
