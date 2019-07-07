<template>
  <div id="container"></div>
</template>

<script>
  export default {
    name: "currentSituation",
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

        // 2.点击实时态势打开弹出框
        function ZoomControlRel() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 160);
        }
        ZoomControlRel.prototype = new BMap.Control();
        ZoomControlRel.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="relbox" style="width: 310px;height: 250px;background-color: #fff;position: relative;display: block;border-radius: 10px">
              <div style="font-size: 12px;position: absolute;left: 13px;top: 10px;">信息列表</div>
              <div class="closeRel"></div>
              <div style="width: 290px;height: 2px;background-color: #6f90ff;position: absolute;left: 10px;top: 30px;"></div>
              <div style="height: 175px;overflow-y: scroll;position: absolute; left: 20px;top: 40px;">
                 <table class="realtimeSituation" border="1" cellpadding="0" cellspacing="0" width="260" style="text-align: center;">
                  <thead>
                    <tr style="font-size: 12px;">
                      <th style="width: 50px;">目标名称</th>
                      <th>最后发现时间</th>
                    </tr>
                  </thead>
                 <tbody>

                 </tbody>
              </table>
              </div>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomControlRel = new ZoomControlRel();
        map.addControl(myZoomControlRel);
        this.showRel();
      },
      showRel() {
        $.ajax({
          type: 'get',
          // url: '/api/xxxxx/xxxxx/xxx/x/x/x/x/',   // 实时信息列表数据获取的请求API
          url: 'static/searchTable.json',
          contentType: 'application/json;charset=utf-8',
          dataType: 'json',
          success: function (data) {
            console.log("获取实时态势的列表的返回数据", data);
            // 渲染数据
            for (let i in data) {
              let str = `
                  <tr style="font-size: 12px;text-align: center">
                    <td>${data[i].name}</td>
                    <td>${data[i].type}</td>
                  </tr>
                `
              $(".realtimeSituation tbody").append(str);
            }
          },
          error(err) {
            alert("获取实时态势信息列表失败！", err);
          }
        })
        var oRelbox = document.getElementById("relbox");
        var oCloseRel = document.getElementsByClassName('closeRel')[0];
        oCloseRel.onclick = function () {
          oRelbox.style.display = "none";
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
  #btns ul li:nth-child(1) {
    background: url("../../assets/img/组-9.png");
  }
</style>
