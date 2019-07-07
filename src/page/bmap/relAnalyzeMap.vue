<template>
  <div id="container"></div>
</template>

<script>
  export default {
    name: "relAnalyze",
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

        // 2.打开关联分析弹出框
        function ZoomControlAnalyze() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 150);
        }

        ZoomControlAnalyze.prototype = new BMap.Control();
        ZoomControlAnalyze.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="analyzebox" style="width: 310px;height: 250px;background-color: #fff;position: relative;display: block;border-radius: 7px">
              <div style="font-size: 12px;position: absolute;left: 15px;top: 10px;">当前选中目标的名称：</div>
              <p class="closeanalyze"></p>
            </div>
            <div style="width: 290px;height: 2px;background-color: #44a8ff;position: absolute;left: 8px;top: 30px;"></div>
            <div style="height: 170px;overflow-y: scroll;position: absolute; left: 10px;top: 40px;font-size: 12px;font-weight: 400;">
              <table class="relevanceAnalyzeTable" style="text-align: center;" border="1" width="288" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="width: 80px">目标名称</th>
                    <th style="width: 80px;">目标状态</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>

                </tbody>
              </table>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlAnalyze = new ZoomControlAnalyze();
        map.addControl(myZoomCtrlAnalyze);
      },
      showAnalyzeBox() {
        var oAnalyzeBox = document.getElementById("analyzebox");
        var oCloseAnalyze = document.getElementsByClassName('closeanalyze')[0];
        var oRelfly = document.getElementById("relfly");
        oAnalyzeBox.style.display = "block";
        oRelfly.style.display = "block";

        // 获取关联分析弹框的表格数据
        $.ajax({
          type: 'get',
          url: 'static/searchTable.json',
          contentType: 'application/json;charset=utf-8',
          dataType: 'json',
          success: function (data) {
            console.log("获取关联分析弹框的表格数据", data);
            for (let i in data) {
              let str = `
                  <tr style="font-size: 12px;text-align: center">
                    <td>${data[i].name}</td>
                    <td>${data[i].type}</td>
                    <td>${data[i].message}</td>
                  </tr
               `
              $(".relevanceAnalyzeTable tbody").append(str);
            }
          },
          error(err) {
            alert("获取关联分析信息列表失败,请稍后再试！", err);
          }
        })
        oCloseAnalyze.onclick = function () {
          oAnalyzeBox.style.display = 'none';
          oRelfly.style.display = 'none';
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

  #btns ul li:nth-child(5) {
    background: url("../../assets/img/组-13-拷贝.png");
  }
</style>

