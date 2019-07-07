<template>
  <div id="container"></div>
</template>

<script>
  export default {
    name: "earlyWarningMap",
    data() {
      return {}
    },
    methods: {
      initMap() {
        var map = new BMap.Map('container', {minZoom: 5, maxZoom: 6});
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 5);
        map.setDefaultCursor("default");
        map.enableScrollWheelZoom(true)
        var bs = map.getBounds();
        var bssw = bs.getSouthWest();
        var bssh = bs.getNorthEast();
        var b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bssh.lng, bssh.lat))
        try {
          console.log(BMapLib)
          BMapLib.AreaRestriction.setBounds(map, b);
        } catch (e) {
          alert(e);
        }

        // 1.地图中心按钮的自定义控件
        function ZoomControlBtn() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
          this.defaultOffset = new BMap.Size(650, 20)
        }

        ZoomControlBtn.prototype = new BMap.Control();
        ZoomControlBtn.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="btns">
              <ul>
                <li id="showRel"></li>
                <li id="earlying"></li>
                <li id="situation"</li>
                <li id="openfix"></li>
                <li id="analyzebtn"></li>
                <li id="preRes"></li>
              </ul>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoolCtrlButton = new ZoomControlBtn();
        map.addControl(myZoolCtrlButton)
        // 预警通报弹出框控件
        function ZoomControlAlarm() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
          this.defaultOffset = new BMap.Size(0, 50);
        }
        ZoomControlAlarm.prototype = new BMap.Control();
        ZoomControlAlarm.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
           <div id="earlyingbox" style="width: 380px;height: 140px;background-color: #fff;border-radius: 10px;display: block;">
            <div>
              <p style="font-size: 12px;float: left;margin: 5px 0 0 10px;">预警</p>
              <p id="closeEarlyBox"></p>
             <div>
            <div>
             <span style="font-size: 12px;float: left;margin: 25px 0 0 -25px;">经&nbsp;纬&nbsp;度：</span>
             <input type="text" style="font-size: 12px; float: right; width: 100px;margin: 8px 210px 0 0;">
            </div>
           <div>
            <span style="font-size: 12px;float: left;margin: -18px 0 0 190px;">发现时间：</span>
            <input type="text" style="font-size: 12px; float: right; width: 100px;margin: -18px 20px 0 0;">
           </div>
           <div>
             <span style="font-size: 12px;float: left;margin: 10px 0 0 8px;">PU&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
             <input type="text" style="font-size: 12px; float: right; width: 100px;margin: 10px 210px 0 0;">
            </div>
           </div>
           <div>
             <span style="font-size: 12px;float: left;margin: -18px 0 0 190px;">所属基地：</span>
             <input type="text" style="font-size: 12px; float: right; width: 100px;margin: -18px 20px 0 0;">
           </div>
           <div>
             <span style="font-size: 12px;float: left;margin: 10px 0 0 2px;">信号类型：</span>
             <input type="text" style="font-size: 12px; float: right; width: 100px;margin: 10px 210px 0 0;">
            </div>
            <div>
             <span style="font-size: 12px;float: left;margin: -18px 0 0 190px;">国家地区：</span>
             <input type="text" style="font-size: 12px; float: right; width: 100px;margin: -18px 20px 0 0;">
           </div>
           <div>
             <span style="font-size: 12px;float: left;margin: 10px 0 0 2px;">目标类型：</span>
             <input type="text" style="font-size: 12px; float: right; width: 100px;margin: 10px 210px 0 0;">
            </div>
            <div>
             <span style="font-size: 12px;float: left;margin: -18px 0 0 190px;">预警时间：</span>
             <input type="time" style="font-size: 12px;float: right;width: 100px;margin: -18px 20px 0 0;">
           </div>
           </div>
         `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlAlarm = new ZoomControlAlarm();
        map.addControl(myZoomCtrlAlarm);
      },
      openEarlying() {
        var oEarlyingbox = document.getElementById("earlyingbox");
        var oCloseEarlyBox = document.getElementById("closeEarlyBox");
        var oAlarmfly = document.getElementById("alarmfly");
        oCloseEarlyBox.onclick = function () {
          oEarlyingbox.style.display = "none";
          oAlarmfly.style.display = "none";
        }
      },
    },
    mounted() {
      this.initMap();
    }
  }
</script>

<style>
  @import "../../assets/css/bmap.css";
</style>
<style>
  #btns {
    display: block;
  }

  #btns ul li:nth-child(2) {
    background: url("../../assets/img/组-11-拷贝.png");
  }
</style>
