<template>
  <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-hidden="true" @click="showPrompt">
    <div class="modal-dialog" >
      <div class="modal-content">
        <div class="modal-header text-center">
          <button  type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">添加分析任务</h4>
        </div>
        <div class="modal-body">
          <el-form class="form-horizontal" :model="para" :rules="addrules" ref='ruleAddress'>
            <!--输入地址-->
            <div class="form-group">
              <div class="col-sm-10">
                <el-form-item prop='message'>
                  <el-input type="text" placeholder="请输入地址或者身份证号或者名称"  prefix-icon="el-icon-search" v-model='para.message' style="border-left: none">
                   <template slot="prepend"  style="border-right: none"><i class="fa fa-search"  style="color: rgba(0, 0, 0, 0.5)"></i></template>
                  </el-input>
                  <div v-if="showModal" style="position: absolute; top:36px; left: 34px; width: calc(100% - 34px);  background-color: white; z-index: 9999; ">
                      <ul style="border: 1px solid #ddd;  width: 100%;  ">
                        <li v-for="(task,index) in taskList" style="padding-left: 10px" @click="selectTask(task)">
                          <span>{{task.title}}&nbsp;:&nbsp;</span> <span>{{task.detail}}</span>
                        </li>
                      </ul>
                  </div>
                </el-form-item>

              </div>
         <!--     <label  class="col-sm-2 control-label form-label">地址</label>-->
              <button id="queryTask" type="button" class="col-sm-2 btn btn-default" >查询</button>
            </div>

            <div v-if="selectTaskList!=0" class="title">需进行分析的地址或对象</div>
            <ul class="selectList">
              <li v-for="(task,index) in selectTaskList" >
                <span>{{task.title}}&nbsp;:&nbsp;</span> <span>{{task.detail}}</span><span class="clear" @click="removeTask(index)"><i class="fa fa-times" ></i></span>
              </li>
            </ul>
          </el-form>
        </div>
        <div class="modal-footer" style="border: none">
          <button type="button" class="btn btn-white" data-dismiss="modal"  @click="showPrompt">取消</button>
          <button type="button" class="btn btn-default" @click="submitForm('ruleAddress')">添加</button>
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
        }else {
          callback()
        }
      }
      return {
        /*13MmZeQVspEuWFHUGsQWZtqiWVSgBWXZiJ
        * 33032719980122337x*/
        addrules:{
          message:[
            { validator: checkAddress, trigger: 'blur' }
          ]
        },
        para:{message:''},
        taskList:[],
        selectTaskList:[],
        objectData:'',
        showModal:false,
        loading:false
      }
    },
    props:["id"],
    methods: {
      resetForm(formName) {
        this.showModal=false
        this.$refs[formName].resetFields();
      },
      submitForm() {
        /*批量创建任务*/
        this.loading = true;
        if(this.selectTaskList.length>5){
          this.$message({
            message: '一次最多添加5个批量任务',
            type: 'warning',
          })
        }else{
          var messagePara="";
          for(var i=0;i<this.selectTaskList.length;i++){
            if(i!=0)
              messagePara+=","
            messagePara+=this.selectTaskList[i].detail;
          }
          this.$http.post('/api/view/addAnalysisTx',{message:messagePara})
            .then(res =>{
              if (res.data.success) {
                this.loading = false;
                this.showModal=false;
                this.$message({
                  type: 'success',
                  duration: 2000,
                  message:res.data.message
                })
                this.selectTaskList=[];
                $("#"+this.id).modal("hide");
                this.$emit('addTask', true);
              }
              else{
                this.$message({
                  message: res.data.message,
                  type: 'warning',
                });
                this.loading = false
              }
            })
        }
        this.showModal=true;
      },
      showPrompt(e){
        if(e.target.id=="queryTask"){
            this.searchTask();
        }else{
           this.showModal=false;
        }
      },
      selectTask(task){
        for(var i=0;i< this.selectTaskList.length;i++){
           if(this.selectTaskList[i].detail==task.detail){
             this.showModal=false;
              return;
           }
        }
        this.selectTaskList.push(task);
        this.showModal=false;
      },
      removeTask(index){
        this.selectTaskList.splice(index, 1);
      },
      searchTask(){
        this.loading = true;
        this.$http.post('/api/view/queryAddressTarget',this.para)
          .then(res =>{
            if (res.data.success) {
              this.loading = false;
              if(res.data.data.address){
                 this.taskList=[{title:'地址',detail:res.data.data.address}]
              }else{
                this.taskList=[{title:'对象',detail:res.data.data.target}]
              }
              this.showModal=true;
            }
            else{
              this.$message({
                message: '未查到相关地址或对象',
                type: 'warning',
              })
              this.loading = false
            }
        })
      }
    },
    components: {addObject},
    mounted(){
     // this.getObjectData()
    }
  }
</script>
