<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-hidden="true" style="color: #676a6c; ">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-center">
          <button @click="resetForm('ruleForm')" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">添加新对象</h4>
        </div>
        <div class="modal-body">
          <el-form class="form-horizontal" :model='ruleForm' :rules='objectRules' ref="ruleForm">
            <!--输入对象姓名-->
            <div class="form-group">
              <label class="col-sm-2 control-label form-label">对象姓名</label>
              <div class="col-sm-10">
                <el-form-item prop='name'>
                  <el-input v-model='ruleForm.name' type="text" placeholder="请输入对象姓名，必填">
                    <template slot="prepend"><i style="width: 16px; text-align: center" class="fa fa-user color5"></i>
                    </template>
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
                    <template slot="prepend"><i style="width: 16px; text-align: center" class="fa fa-phone color5"></i>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <!--对象备注-->
            <div class="form-group">
              <label class="col-sm-2 control-label form-label">备注</label>
              <div class="col-sm-10">
                <el-form-item prop='remark'>
                  <el-input type='textarea' :rows='5' v-model='ruleForm.remark'
                            placeholder="可输入更多对象备注信息，选填(最大长度不能超过100汉字)"></el-input>
                </el-form-item>
              </div>
            </div>
            <!--更多信息begin-->
            <div v-if="noMore==0||noMore=='0'">
              <a class="clearfix" data-toggle="collapse" :href="'#'+id+'collapseExample'" aria-expanded="false"
                 aria-controls="collapseExample">
                <span class="float-r">更多&nbsp;<i class="fa fa-angle-down"></i></span>
              </a>
              <div class="collapse margin-t-10" :id="id+'collapseExample'">
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
</template>
<script>
  import { objectUpdate } from '../../store/types.js'
  export default {
    props: ["id"],
    data(){
      var checkName = (rule, value, callback) =>{
        if (value === '') {
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
        } else {
          callback()
        }
      }
      return {
        loading: false,
        noMore:false,
        filteradd: [],
        optionlists: [],
        ruleForm: {
          name: '',
          code: '',
          phone: '',
          remark: '',
          addresses: '',
        },
        objectRules: {
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
          code: [
            {validator: checkCode, trigger: 'blur'}
          ],
          phone: [
            {validator: checkPhone, trigger: 'blur'}
          ],
          remark: [
            {validator: checkTextArea, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() =>{
            this.loading = false;
          this.filteradd = this.optionlists.filter(item =>{
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
        });},200);
        } else {
          this.filteradd = [];
        }
      },
      submitForm(formName) {
        //this.$store.commit({type: 'setUpdateFlag', flag: true});
        this.$refs[formName].validate((valid) =>{
          if (valid) {
            this.addObject()
          } else {
            return false;
         }})
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      addObject(){
        this.$emit('loading', true)
        this.$http.post('/api/target/insertupdate', this.ruleForm)
          .then(res =>{
          if (res.data.success)
        {
          this.$store.commit(objectUpdate,true);
          console.log(this.id)
          $('#' + this.id).modal("hide");
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('loading', false)
          this.$refs['ruleForm'].resetFields();
          this.$emit('addSuccess', true)
        }else if (!res.data.success) {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
          this.$emit('loading', false)
        }
      })
      },
      getAddressList() {
        this.$http.post('/api/address/addressList')
          .then(res =>{
          this.addlists = res.data.data
          this.optionlists = this.addlists.map(item =>{
            return {value: item, label: item};
          });
        })
      },
    },
    created(){
      this.getAddressList();
      /*  if(this.defaultOption&&this.defaultOption.length){
       this.optionlists=this.defaultOption;
       }else{
       this.getAddressList();
       }*/
    },
    mounted(){
      var _this=this;
      $('#'+this.id).on('show.bs.modal', function(e) {
         _this.noMore=e.relatedTarget.noMore?true:false
      })
    },
    components: {}
  }
</script>
