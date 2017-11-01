<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-center">
          <button @click="resetForm('ruleAddress')" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">地址集</h4>
        </div>
        <div class="modal-body">
          <el-form class="form-horizontal" :model="ruleAddress" :rules="addrules" ref='ruleAddress'>
            <!--输入地址-->
            <div>该地址集包含3个地址，可手动选择一个进行扩线分析</div>
            <ul style="color: #37363e; font-size: 30px">
              <li><i class="fa fa-check-circle" ></i></li>
              <li><i class="fa fa-check-circle-o"></i></li>
            </ul>
          </el-form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-white" data-dismiss="modal" @click="resetForm('ruleAddress')">取消</button>
          <button type="button" class="btn btn-default" @click="submitForm('ruleAddress')">地址详情</button>
          <button type="button" class="btn btn-default" @click="submitForm('ruleAddress')">手动扩线</button>
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
      var checkAddress = (rule, value, callback) =>{
        if (value === '') {
          return callback(new Error('搜索内容不能为空'));
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
          $("#"+this.id).modal("hide");
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
        $("#myModalA").modal({ show: true }, {noMore: '1'})
      }
    },
    components: {addObject},
    mounted(){
     // this.getObjectData()
    }
  }
</script>
