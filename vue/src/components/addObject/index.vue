<template>
  <div class="modal fade" id="myModalA" tabindex="-1" role="dialog" aria-hidden="true" style="color: #676a6c; ">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-center">
          <button @click="resetForm('ruleForm')" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">添加新对象</h4>
        </div>
        <div class="modal-body">
          <el-form class="form-horizontal" :model='ruleForm' :rules='objectRules' ref="ruleForm">
            <div class="form-group" v-for="item in itemArray">
              <label class="col-sm-2 control-label form-label">{{item.name}}</label>
              <div class="col-sm-10">
                <el-form-item :prop='item.prop'>
                  <el-input v-model='ruleForm[item.prop]' :rows='5' :type="item.type" :placeholder="item.placeholder">
                    <template v-if="item.type=='text'" slot="prepend"><i :class=item.class></i></template>
                  </el-input>
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
                  <!--<div class="col-sm-2">
                    <a href="#" class="btn btn-default pull-right">添加新地址</a>
                   </div> -->
                </div>
                <!--涉及案件-->
               <!--       <div class="form-group">
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
                      </div>-->
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
        var iSum=0 ;
        var ID=/^\d{17}(\d|x)$/i;
        var sId=value.replace(/x$/i,"a");
        var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
        var d=new Date(sBirthday.replace(/-/g,"/")) ;
        for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
        if (!value) {
          return callback(new Error('身份证号码不能为空'));
        } else if (!ID.test(value)) {
          return callback(new Error('你输入的身份证长度或格式错误'));
        } else if (this.aCity[parseInt(sId.substr(0,2))]==null) {
          return callback(new Error('你的身份证地区非法'));
        } else if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
          return callback(new Error('身份证上的出生日期非法'));
        }else {
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
        aCity:[],
        filteradd: [],
        optionlists: [],
        ruleForm: {
          name: '',
          code: '',
          phone: '',
          remark: '',
          addresses: '',
        },
        itemArray:[
          {name:"对象姓名",prop:"name",placeholder:"请输入对象姓名，必填",class:"fa fa-user color5",type:'text'},
          {name:"身份证号",prop:"code",placeholder:"请输入身份证号，必填",class:"fa fa-newspaper-o color5",type:'text'},
          {name:"联系方式",prop:"phone",placeholder:"可输入联系方式，选填",class:"fa fa-phone color5",type:'text'},
          {name:"备注",prop:"remark",placeholder:"可输入更多对象备注信息，选填(最大长度不能超过100汉字)",type:'textarea'}
        ],
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
          $('#myModalA').modal("hide");
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
            if( this.addlists ){
              this.optionlists = this.addlists.map(item =>{
                return {value: item, label: item};
              });
            }

        })
      },
      resetCodeCity(){
        this.aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
      }
    },
    created(){
      this.getAddressList();
      this.resetCodeCity();
      /*  if(this.defaultOption&&this.defaultOption.length){
       this.optionlists=this.defaultOption;
       }else{
       this.getAddressList();
       }*/
    },
    mounted(){
      var _this=this;
      $('#myModalA').on('show.bs.modal', function(e) {
         _this.noMore=e.relatedTarget.noMore?true:false
      })
    },
    components: {}
  }
</script>
