<template>
  <div @click="toObjectDetail">
    <slot></slot>
  </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props:["targetId"],
        methods: {
          toObjectDetail(){
            this.$http.post('/api/target/targetTask?',{targetId:this.targetId})
              .then(res =>{
                if(res.data.data==0){
                  /*正在处理*/
                  this.$message({
                    message: '数据正在分析中，请稍后再试',
                    type: 'warning',
                  })
                }else{
                  /*处理完毕*/
                  this.$router.push({name:"objectdetails",query:{targetId:this.targetId}})
                }
              })
          }
        },
        components: {}
    }
</script>
