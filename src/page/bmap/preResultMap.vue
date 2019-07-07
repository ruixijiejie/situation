<template>
  <div id="container"></div>
</template>

<script>
  export default {
    name: "preResult",
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
        map.addControl(myZoolCtrlButton);

        // 2.预测结果弹出框
        function ZoomControlPreResult() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 140);
        }

        ZoomControlPreResult.prototype = new BMap.Control();
        ZoomControlPreResult.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="prebox" style="width: 300px;height: 200px;background-color: #fff;position: relative;display: block;border-radius: 7px">
              <div style="font-size: 12px;position: absolute;left: 10px; top: 10px;">预测结果</div>
              <p class="closePreRes"></p>
              <div style="height: 150px;overflow-y: scroll;position: absolute;left: 12px; top: 33px;">
                <table class="preResultTable" border="1" cellspacing="0" cellpadding="0" width="278" style="text-align: center;">
                  <thead>
                    <tr style="font-size: 12px;">
                      <th>目标名称</th>
                      <th>目标经纬度</th>
                      <th>几率</th>
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
        var myZoomControlPreResult = new ZoomControlPreResult();
        map.addControl(myZoomControlPreResult);
      },
      showPreResult() {
        var oPrebox = document.getElementById("prebox");
        var oClosePre = document.getElementsByClassName("closePreRes")[0];
        var oPrefly = document.getElementById("prefly");
        oPrebox.style.display = "block";
        oPrefly.style.display = "block";
        $.ajax({
          type: 'get',
          url: "static/searchTable.json",
          contentType: 'application/json;charset=utf-8',
          dataType: 'json',
          success: function (data) {
            console.log("获取关联分析弹框的表格数据返回", data);
            for (let i in data) {
              let str = `
                  <tr style="font-size: 12px;text-align: center">
                    <td>${data[i].name}</td>
                    <td>${data[i].type}</td>
                    <td>${data[i].message}</td>
                  </tr>
                `
              $(".preResultTable tbody").append(str);
            }
          },
          error(err) {
            alert("获取关联分析信息列表数据失败！", err);
          }
        })
        oClosePre.onclick = function () {
          oPrebox.style.display = "none";
          oPrefly.style.display = "none";
        }
      },
    },
  }
</script>

<style>
  @import "../../assets/css/bmap.css";
</style>
<style>
  #btns {
    display: block;
  }

  #btns ul li:nth-child(6) {
    background: url("../../assets/img/组-14-拷贝.png");
  }
</style>
