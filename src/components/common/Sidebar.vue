<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
             text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from '../common/bus';

  export default {
    data() {
      return {
        collapse: false,
        items: [
          {
            icon: 'el-icon-info',
            index: 'home',
            title: '系统首页'
          },
          {
            icon: 'el-icon-circle-check',
            index: 'strategy',
            title: '策略管理',
            subs: [
              {
                index: 'subscribe',
                title: '订阅策略'
              },
              {
                index: 'earlywarning',
                title: '信号预警策略'
              },
              {
                index: 'networkwarning',
                title: '网台通联异常策略'
              },
              {
                index: 'targetsituation',
                title: '态势生成策略'
              },
              {
                index: 'relanalyze',
                title: '关联分析策略'
              },
              {
                index: 'bulletin',
                title: '通报策略'
              },
              {
                index: 'prejudge',
                title: '预判策略'
              }
            ]
          },
          {
            icon: 'el-icon-location',
            index: 'location',
            title: '区域管理',
            subs: [
              {
                index: 'monitorRegion',
                title: '监控区域',
              },
              {
                index:　'dictdfStation',
                title: '测向站'
              },
              {
                index: 'network',
                title: '固定网台',
              },
            ]
          },
          {
            icon: 'el-icon-upload',
            index: '3',
            title: '用户管理',
            subs: [
              {
                index: 'personSetting',
                title: '个人设置'
              },
              {
                index: 'permission',
                title: '权限测试'
              },
              {
                index: '404',
                title: '404页面测试'
              },
              {
                index: '403',
                title: '403页面测试'
              }
            ]
          },
          {
            icon: 'el-icon-bell',
            index: 'signaltype',
            title: '信号类型',
          },
        ]
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
