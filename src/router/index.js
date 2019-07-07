import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/',
      component: resolve => require(['@/components/common/Manage'], resolve),
      children: [
        {
          path: '/home',
          component: resolve => require(['@/page/Home'], resolve),
          meta: {title: '系统首页'}
        },
        {
          path: '/home1',
          component: resolve => require(['@/page/Home1'], resolve),
          meta: {title: '系统首页'}
        },
        /*
         * 策略管理
        **/
        {
          path: '/subscribe',
          component: resolve => require(['@/page/strategy/Subscribe'], resolve),
          meta: {title: '订阅策略'}
        },
        {
          path: '/earlywarning',
          component: resolve => require(['@/page/strategy/EarlyWarning'], resolve),
          meta: {title: '信号预警策略'}
        },
        {
          path: '/networkwarning',
          component: resolve => require(['@/page/strategy/NetworkWarning'], resolve),
          meta: {title: '网台通联异常策略'}
        },
        {
          path: '/targetsituation',
          component: resolve => require(['@/page/strategy/Targetsituation'], resolve),
          meta: {title: '态势生成策略'}
        },
        {
          path: '/relanalyze',
          component: resolve => require(['@/page/strategy/Relanalyze'], resolve),
          meta: {title: '关联分析策略'}
        },
        {
          path: '/bulletin',
          component: resolve => require(['@/page/strategy/Bulletin'], resolve),
          meta: {title: '通报策略'}
        },
        {
          path: '/prejudge',
          component: resolve => require(['@/page/strategy/Prejudge'], resolve),
          meta: {title: '预判策略'}
        },
        /*
         * 区域管理
         **/
        {
          path: '/monitorRegion',
          component: resolve => require(['@/page/monitorRegion/MonitorRegion'], resolve),
          meta: {title: '监控区域'}
        },
        {
          path: "/dictdfStation",
          component: resolve => require(['@/page/monitorRegion/dictdfStation'], resolve),
          meta: {title: '测向站'}
        },
        {
          path: '/network',
          component: resolve => require(['@/page/monitorRegion/Network'], resolve),
          meta: {title: '固定网台'}
        },
        /*
         * 用户管理组件
         **/
        {
          path: '/personSetting',
          component: resolve => require(['@/page/userManage/personSettings'], resolve),
          meta: {title: '个人设置'}
        },
        {
          path: '/permission',
          component: resolve => require(['@/page/userManage/Permission'], resolve),
          meta: {title: '权限测试'}
        },
        {
          path: '/404',
          component: resolve => require(['@/page/404'], resolve),
          meta: {title: '404'}
        },
        {
          path: '/403',
          component: resolve => require(['@/page/403'], resolve),
          meta: {title: '403'}
        },
        /*
         * 型号类型
         **/
        {
          path: '/signaltype',
          component: resolve => require(["@/page/signalType/SignalType"], resolve),
          meta: {title: '信号类型'}
        },
        /*
         * 地图的弹出框
         **/
        {
          path: '/prt',
          component: resolve => require(["@/page/bmap_dialog/prtScnDialog"], resolve)
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['@/page/Login'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

