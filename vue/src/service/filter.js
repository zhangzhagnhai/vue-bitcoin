export default {
	sourceFilter(str){
		if (str == "manual"){
			return "手动添加"
		} else if(str == "unknown"){
			return "未知来源"
		} else {
			return "关联分析"
		}
	},

	feeFilter(str){
		if (str == '0E-8' || str == '0') {
			return "0.00000000"
		} else return str
	},

	nullFilter(val){
		if (val == null) {
			return '0'
		} else return val
	},
	fixFilter(val){
		if (val == '0.00') {
			return val
		} else {
			return parseInt(val).toFixed(4)*100
		}
	},
	nanFilter(val){
		if (isNaN(val) || val == 0) {
			return '0.00'
		} else return val
	},

  taskStatusFilter(val){
    if (val == 0){
      return "未开始"
    } else if(val == 1){
      return "已完成"
    } else {
      return "正在进行"
    }
  }
}
