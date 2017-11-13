
var state = {
  configure: {
    enabled: false,
    filter: 'nodes,edges',
    showButton: true
  },
  interaction: {
    hover: true
  },
  groups: {
    type_1: {
      color: {
        border: '#e4afa9',
        background: '#ef4836',
        highlight: {
          border: '#fccf7e',
          background: '#FFA500'
        },
        hover: {
          border: '#fccf7e',
          background: '#FFA500'
        }
      }
    },

    type_2: {
      color: {
        border: '#98cafc',
        background: '#399bff',
        highlight: {
          border: '#fccf7e',
          background: '#FFA500'
        },
        hover: {
          border: '#fccf7e',
          background: '#FFA500'
        }
      },
      size: 20
    },

    type_3: {
      color: {
        border: '#dbedff',
        background: '#81bfff',
        highlight: {
          border: '#fccf7e',
          background: '#FFA500'
        },
        hover: {
          border: '#fccf7e',
          background: '#FFA500'
        }
      },
      size: 10
    }

  },
  autoResize: true,
  edges: {
    color: {
      color: '#D9D9D9',
      highlight: '#D9D9D9',
      hover: '#D9D9D9',
      opacity: 1.0
    },
    arrows: {from : true }
  },
  layout: {
    randomSeed: 2,//配置每次生成的节点位置都一样，参数为数字1、2等
    hierarchical: {
      direction: 'LR'//UD:上下 DU:下上 LR:左右 RL:右左
    }, //层级结构显示}
  },
  nodes: {
    color: {
      border: '#EC5148',
      background: '#EC5148',
      highlight: {
        border: '#FF8203',
        background: '#FF8203'
      },
      hover: {
        border: '#EC5148',
        background: '#EC5148'
      }
    },
    borderWidth: 3,
    chosen: true,
    font: {
      color: '#000',
      face: 'Microsoft YaHei',
      size: 8
    },
    fixed: {
      x: false,
      y: false
    },
    shape: 'dot',
    size: 15,
    physics: false,     // 将节点移出物理模拟
    scaling: {
      min: 15,
      max: 15
    }

  }
};
/*options*/
export default {
  state
}
