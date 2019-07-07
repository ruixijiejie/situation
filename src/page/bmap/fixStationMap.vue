<template>
  <div id="container"></div>
</template>

<script>
  export default {
    name: "fixStation",
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
        // 网台弹出框自定义控件
        function ZoomControlFix() {   //
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 140);
        }

        ZoomControlFix.prototype = new BMap.Control();
        ZoomControlFix.prototype.initialize = function (map) {
          var div = document.createElement("div");
          div.innerHTML = `
             <div id="fixwrap" style="width: 260px;height: 300px;background-color: #fff;position: relative;display: block;border-radius: 7px">
              <span style="display: block;width: 2px;height: 15px;background-color: #22d5ff; position: absolute;left: 10px;top: 20px;"></span>
              <p style="font-size: 12px;position: absolute;left: 20px;top: 20px;">网台</p>
              <p class="closefix"></p>
              <div style="position: absolute;top: 40px;left: 10px;">
                 <input style="position: absolute; left: -4px; top: 5px;width: 12px;height: 12px;" type="radio">
                 <span style="font-size: 12px;margin-left: 15px;">国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span>
                 <select id="fixCountry" style="width: 120px;">
                  <option value=""></option>
                 </select>
              </div>
              <div style="position: absolute;left: 6px;top: 68px;">
                <input style="width: 12px;height: 12px;position: absolute;left: 0;top: 3px;" type="radio">
                <span style="font-size: 12px;margin-left: 15px;">区域绘制：</span>
                <p class="drawpicture"></p>
                <p style="font-size: 12px;margin: -17px 0 0 100px;">作图</p>
                <p class="clearpicture"></p>
                <p style="font-size: 12px;margin: -16px 0 0 153px;">清除</p>
                <button style="width: 35px;height: 20px;background-color: #47a7ff;position: absolute;left: 205px; top: -1px;">
                  <span style="font-size: 12px;">确认</span>
                </button>
              </div>
              <div style="width: 240px;height: 2px;background-color: #38ccff;position: absolute;left: 5px;top: 90px;"></div>
              <p style="font-size: 12px;position: absolute;left: 40px;top: 95px;">网支台通联时间</p>
              <div style="position: absolute;left: 3px;top: 115px;">
                <span style="font-size: 12px;margin-top: 50px;">开始时间：</span>
                 <input type="text" style="width: 125px;height: 20px;font-size: 12px;position: absolute;left: 60px;top: 0;padding-left: 5px" class="jeinput" id="test06" placeholder="请输入开始时间">
              </div>
              <div style="position: absolute;left: 3px;top: 153px;">
                <span style="font-size: 12px;">结束时间：</span>
                <input type="text" style="width: 125px;height: 20px;font-size: 12px;position: absolute;left: 60px;top: 0;padding-left: 5px" class="jeinput" id="test07" placeholder="请输入结束时间">
              </div>
              <button id="fixconnectSearchTimeBtn" style="width: 35px;height: 20px;background-color: #47a7ff;position: absolute;left: 210px; top: 156px;">
               <span style="font-size: 12px;">搜索</span>
              </button>
              <div style="position: absolute;left: 8px;top: 190px;height: 80px;overflow-y: scroll">
                <table class="fixmanagetable" border="1" width="242" cellspacing="0" cellpadding="0" style="text-align: center">
                  <thead>
                    <tr style="font-size: 12px;">
                      <th>名称</th>
                      <th>经纬度</th>
                      <th>使用</th>
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
        var myZoomCtrlFix = new ZoomControlFix();
        map.addControl(myZoomCtrlFix);
        this.showFixWrap();
        jeDate("#test06", {
          festival: false,
          minDate: "1900-01-01",              //最小日期
          maxDate: "2200-12-31",              //最大日期
          method: {
            choose: function (params) {
            }
          },
          format: "YYYY-MM-DD hh:mm:ss"
        });

        jeDate("#test07", {
          festival: false,
          minDate: "1900-01-01",              //最小日期
          maxDate: "2200-12-31",              //最大日期
          method: {
            choose: function (params) {
            }
          },
          format: "YYYY-MM-DD hh:mm:ss"
        });
      },
      showFixWrap() {
        var oFixwrap = document.getElementById("fixwrap");
        var oCloseFix = document.getElementsByClassName("closefix")[0];
        var oFixfly = document.getElementById("fixfly");
        oFixwrap.style.display = "block";
        oFixfly.style.display = "block";
        // 获取网台管理中表格数据=============================================
        $.ajax({
          type: 'get',
          // url: '/api/xxxx/xx/x/xx/x/x/x/x/',    // 获取网台管理中表格数据的API
          url: 'static/searchTable.json',
          contentType: 'application/json;charset=utf-8',
          dataType: 'json',
          success: function (data) {
            console.log("获取网台管理弹框表格的数据返回", data);
            for (let i in data) {
              let str = `
                  <tr style="font-size: 12px;text-align: center">
                    <td>${data[i].name}</td>
                    <td>${data[i].type}</td>
                    <td>${data[i].message}</td>
                  </tr>
                `
              $(".fixmanagetable tbody").append(str);
            }
          },
          error(err) {
            alert("获取网台管理信息列表数据失败！", err);
          }
        })

        // 获取网台管理弹框中国别下拉列表的数据====================================
        let oFixCountry = document.getElementById("fixCountry");
        oFixCountry.onchange = function () {
          $.ajax({
            type: 'get',
            url: '/api/xxx/xx/x/x/x/x',    // 获取网台管理弹框中国别的数据请求API
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
              console.log("获取网台管理弹框国别的数据返回", data);
            },
            error(err) {
              alert("获取网台管理国别数据失败！", err);
            }
          })
        }

        // 网台管理弹框网支台通联时间的搜索=================================================
        let oFixconnectSearchTimeBtn = document.getElementById("fixconnectSearchTimeBtn");
        oFixconnectSearchTimeBtn.onclick = function () {
          let paramStartTime = document.getElementById("test06").value;
          console.log("开始时间", paramStartTime);
          let paramEndTime = document.getElementById("test07").value;
          console.log("结束时间", paramEndTime);
          let params = {
            starttime: paramStartTime,
            endtime: paramEndTime
          }
          console.log("向后端发送总的参数", JSON.stringify(params));
          $.ajax({
            type: 'get',
            url: '/api/xxxxxx/xxxxx/xxxx',     // 网台管理弹框网支台通联时间搜索请求的数据API
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (data) {
              console.log("获取网支台通联时间的搜索数据返回", data);
            },
            error(err) {
              alert("搜索数据失败,请稍后再试！", err)
            }
          })
        }
        oCloseFix.onclick = function () {
          oFixwrap.style.display = "none";
          oFixfly.style.display = "none";
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
  #btns ul li:nth-child(4) {
    background: url("../../assets/img/组-12-拷贝.png");
  }
</style>
