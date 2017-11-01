<template>
	<div>
		<CoinHeader></CoinHeader>
    <SideBar></SideBar>
    <div class="content">
      <div class="mainContent">
        <router-view></router-view>
      </div>
      <CoinFooter></CoinFooter>
    </div>
	</div>
</template>
<script>

import CoinHeader from '../../components/Header/Header'
import SideBar from '../../components/Sidebar/'
import CoinFooter from '../../components/Footer/'

document.body.style.background = "#3d464d"

export default {
  components: {
    CoinHeader,
    SideBar,
    CoinFooter,
  },
  data() {
    return {
    }
  },
  mounted(){
  },
  methods:{
  },
}
</script>
<style lang="stylus" scoped>
</style>
