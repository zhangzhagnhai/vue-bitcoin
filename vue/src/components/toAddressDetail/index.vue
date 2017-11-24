<template>
    <div @click="toAddressDetail">
      <slot></slot>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props:["address"],
        methods: {
          toAddressDetail(){
            this.$http.post('/api/address/addrTask?',{address:this.address})
              .then(res =>{
                if(res.data.data==0){
                  /*正在处理*/
                  this.$message({
                    message: '数据正在分析中，请稍后再试',
                    type: 'warning',
                  })
                }else{
                  /*处理完毕*/
                  this.$router.push({name:"addressdetails",query:{address:this.address}})
                }
              })
          }
        },
        components: {}
    }
</script>
