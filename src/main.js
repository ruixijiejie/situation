// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import axios from 'axios'
import ElementUI from 'element-ui'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/icon.css'
// 引入网页截屏工具 html2canvas(DOM节点转化)
import './assets/js/jquery-1.11.3.min.js'
import './assets/js/html2canvas_0.5.0.js'

import VuePreview from 'vue2-preview'
Vue.use(VuePreview)

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

let OptType = {
  ADD: 0,
  UPDATE: 1,
  DELETE: 2,
  SEARCH: 3,
  LIST: 4,
  PULIST: 5,
  REGIONLIST: 6,
  ADDPU: 7
}

// 网台管理API
let Fixstation_API = {
  add: '/api/fixStation/add',
  update: '/api/fixStation/update',
  delete: '/api/fixStation/delete',
  mapSearch: '/api/fixStation/mapSearch',
  list: '/api/fixStation/lists'
}
// 信号预警策略API
let SignalAlarm_API = {
  add: '/api/stgSignalAlarm/add',
  update: '/api/stgSignalAlarm/update',
  delete: '/api/stgSignalAlarm/delete',
  mapSearch: '/api/stgSignalAlarm/mapSearch',
  list: '/api/stgSignalAlarm/lists',
  puList: '/api/stgSignalAlarm/xxx',                         // 下拉PU列表接口未定
  addPu: '/api/stgSignalAlarm/xxxxx',                        // 新增PU号接口未定
  regionList: 'api/stgSignalAlarm/xxx'                       // 下拉显示区域列表接口未定
}
// 网台通联异常策略API
let stgCmctAlarm = {
  add: '/api/stgCmctAlarm/add',
  update: '/api/stgCmctAlarm/update',
  delete: '/api/stgCmctAlarm/delete',
  mapSearch: '/api/stgCmctAlarm/mapSearch',
  list: '/api/stgCmctAlarm/lists'
}
// 态势生成API
let situation = {
  add: '/api/stgTarSutGen/add',
  update: '/api/stgTarSutGen/update',
  delete: '/api/stgTarSutGen/delete',
  mapSearch: '/api/stgTarSutGen/mapSearch',
  list: '/api/stgTarSutGen/lists',
  puList: '/api/stgTarSutGen/xxx',                           // 下拉PU列表接口未定
  addPu: '/api/stgTarSutGen/xxxxx',
}
// 关联分析API
let RelAanalyze = {
  add: '/api/stgRelAanalyze/add',
  update: '/api/stgRelAanalyze/update',
  delete: '/api/stgRelAanalyze/delete',
  mapSearch: '/api/stgRelAanalyze/mapSearch',
  list: '/api/stgRelAanalyze/lists'
}

// 预判分析API
let prejudge = {
  add: '/api/stgPreJudge/add',
  update: '/api/stgPreJudge/update',
  delete: '/api/stgPreJudge/delete',
  mapSearch: '/api/stgPreJudge/mapSearch',
  list: '/api/stgPreJudge/lists'
}

// 通报策略API
let notify = {
  add: '/api/stgNotify/add',
  update: '/api/stgNotify/update',
  delete: '/api/stgNotify/delete',
  mapSearch: '/api/stgNotify/mapSearch',
  list: '/api/stgNotify/lists'
}

// 监控区域API
let region = {
  add: '/api/monitorRegion/add',
  update: '/api/monitorRegion/update',
  delete: '/api/monitorRegion/delete',
  mapSearch: '/api/monitorRegion/mapSearch',
  list: '/api/monitorRegion/lists'
}

// 测向站
let distdfStation = {
  add: '/api/dfStation/add',
  update: '/api/dfStation/update',
  delete: '/api/dfStation/delete',
  mapSearch: '/api/dfStation/mapSearch',
  list: '/api/dfStation/lists',
}

// 信号类型
let signalType = {
  add: '/api/signalType/add',
  delete: '/api/signalType/delete',
  list: '/api//signalType/lists'
}

let situationGen = {
  search: '/api/situationGen/search',
  pointslist: '/api/situationGen/getCrossPoints'
}


let GenType = {
  url: 0,
  body: 1
}

function sendRequest2Server(OptType, api, requestValue, callback) {
  let sendBodys = "";
  let sendAPI = api;
  if (requestValue.urlParamers != undefined && requestValue.urlParamers != "") {
    sendAPI = api + '?' + requestValue.urlParamers;
  }
  if (requestValue.bodyParamers != undefined && requestValue.bodyParamers != "") {
    sendBodys = requestValue.bodyParamers;
  }
  console.log("sendBodys", sendBodys);
  console.log("sendAPI", sendAPI);

  let myheaders = {
    'Content-Type': 'application/json;charset=UTF-8',
  };

  switch (OptType) {
    case this.$OptType.ADD:
      this.$axios.put(sendAPI, sendBodys, {
        headers: myheaders
      }).then(callback);
      break;
    case this.$OptType.UPDATE:
      this.$axios.post(sendAPI, sendBodys, {
        headers: myheaders
      }).then(callback);
      break;
    case this.$OptType.DELETE:
      this.$axios.delete(sendAPI).then(callback);
      break;

    case this.$OptType.SEARCH:
      this.$axios.post(sendAPI, sendBodys, {
        headers: myheaders
      }).then(callback);
      break;

    case this.$OptType.LIST:
      this.$axios.get(sendAPI).then(callback);
      break;

    case this.$OptType.PULIST:
      this.$axios.get(sendAPI).then(callback);
      break;
    case this.$OptType.REGIONLIST:
      this.$axios.get(sendAPI).then(callback);
      break;
    case this.$OptType.ADDPU:
      this.$axios.put(sendAPI, sendBodys, {
        headers: myheaders
      }).then(callback);
  }
}

//获取分页配置
Vue.prototype.$getPageSetting = function (modelName) {
  let pageSetting = window.sessionStorage.getItem(modelName);
  if (pageSetting != '' && pageSetting != undefined) {
    return JSON.parse(pageSetting);
  } else
    return '';
}
//设置分页配置
Vue.prototype.$setPageSetting = function (modelName, current, pageSize) {
  let pageSetting = {
    pageSize,
    current
  }
  // console.log('设置前', pageSetting);
  window.sessionStorage.setItem(modelName, JSON.stringify(pageSetting));
  // console.log('设置后', window.sessionStorage.getItem(modelName))
}

Vue.prototype.$sendRequest2Server = sendRequest2Server;
Vue.prototype.$GenType = GenType;
Vue.prototype.$Fixstation_API = Fixstation_API;
Vue.prototype.$SignalAlarm_API = SignalAlarm_API;
Vue.prototype.$stgCmctAlarm_API = stgCmctAlarm;
Vue.prototype.$situation_API = situation;
Vue.prototype.$RelAanalyze_API = RelAanalyze;
Vue.prototype.$prejudge_API = prejudge;
Vue.prototype.$notify_API = notify;
Vue.prototype.$region_API = region;
Vue.prototype.$OptType = OptType;
Vue.prototype.$dictdfStation_API = distdfStation;
Vue.prototype.$signalType_API = signalType;
Vue.prototype.$situationGen_API = situationGen;

Vue.use(ElementUI, {
  size: 'small'
});
Vue.use(iView);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

//ajax拦截器 拦截响应
axios.interceptors.response.use(response => {
  return response
}, msg => {
  let error = JSON.parse(JSON.stringify(msg))
  console.log("server response error:", error)
  let _this = window.vm   //保存的vue实例

  switch (error.response.status) {
    case 601: {
      window.localStorage.userManage = "";
      window.localStorage.menu = "";
      window.localStorage.menuItem = "";
      window.sessionStorage.clear();
      _this.$router.push("/"); //跳转到主页
      break;
    }
    case 602:
      Vue.prototype.$message({
        type: 'error',
        message: error.response.data
      })

      break;
    case 401: {
      break;
    }
    case 404: {

      break;
    }
    case 504: {
      Vue.prototype.$message({
        type: error,
        message: '数据库连接失败，请尝试刷新页面或者重新登录'
      })
      break;
    }
  }
  return Promise.reject(error)

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
