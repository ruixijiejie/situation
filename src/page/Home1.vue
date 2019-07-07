<template>
  <div id="container"></div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      initMap() {
        // 实例化地图
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

        /*
         * 网台markers
         **/
        let paramsfixStationList = `current=${1}&pageSize=${10}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: paramsfixStationList
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$Fixstation_API.list, requestValue, res => {
          let markersData = res.data.value;

          function markerFun(points, icon, infoWindows) {
            var markers = new BMap.Marker(points, {icon: icon});
            map.addOverlay(markers);
            markers.addEventListener('click', function () {
              map.openInfoWindow(infoWindows, points)
            })
          }

          for (let i = 0; i < markersData.length; i++) {
            var myIcon = new BMap.Icon("/static/8网-30.png", new BMap.Size(26, 30));
            var points = new BMap.Point(markersData[i].longitude, markersData[i].latitude);
            let fixStationContext = `
            <p>网台名称：${markersData[i].name}</p><br>
            <p>国别：${markersData[i].belongcountry}</p><br>
            <p>使用国别：${markersData[i].usecountry}</p><br>
            <p>性质：${markersData[i].nature}</p>
          `
            var opts = {
              width: 130,
              height: 150,
              enableMessage: true
            }
            var infoWindows = new BMap.InfoWindow(fixStationContext, opts);
            markerFun(points, myIcon, infoWindows);
          }
        })

        /*
         * 测向站markers
         **/
        let paramsDictdfStationList = `current=${1}&pageSize=${10}`;
        let requestValueDictStation = {
          genType: this.$GenType.url,
          urlParamers: paramsDictdfStationList
        }

        this.$sendRequest2Server(this.$OptType.LIST, this.$dictdfStation_API.list, requestValueDictStation, res => {
          let dictStationMarkers = res.data.value;

          function dictMarkersFun(points, icon, infoWindows) {
            var dictmarkers = new BMap.Marker(points, {icon: icon});
            map.addOverlay(dictmarkers);
            dictmarkers.addEventListener('click', function () {
              map.openInfoWindow(infoWindows, points);
            })
          }

          for (let i = 0; i < dictStationMarkers.length; i++) {
            var dictStationIcon = new BMap.Icon("/static/测向站.png", new BMap.Size(32, 32));
            var dictPoints = new BMap.Point(dictStationMarkers[i].longitude, dictStationMarkers[i].latitude);
            let dictOpts = {
              width: 100,
              height: 50,
              enableMessage: true
            }
            var dictInfoWindows = new BMap.InfoWindow(dictStationMarkers[i].name, dictOpts);
            dictMarkersFun(dictPoints, dictStationIcon, dictInfoWindows);
          }
        })
        /*
         * 用户自定义在地图上绘制图形
         **/
        var overlays = [];
        var overlaycomplete = function (e) {
          overlays.push(e.overlay);
        };
        var styleOptions = {
          strokeColor: "red",
          fillColor: "red",
          strokeWeight: 3,
          strokeOpacity: 0.8,
          fillOpacity: 0.6,
          strokeStyle: 'solid'
        }
        var showAddDrawing = function () {
          var oAddRegion = document.getElementById("addRegion");
          oAddRegion.style.display = "block";
        }

        // 展示绘图的工具条及实现绘制覆盖物
        function showDrawingTool() {
          var oDrawingTool = document.getElementById("drawingTool");
          oDrawingTool.onclick = function () {
            var drawingManager = new BMapLib.DrawingManager(map, {
              isOpen: false,
              enableDrawingTool: true,
              drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                offset: new BMap.Size(60, 20),
                scale: 0.6,
              },
              circleOptions: styleOptions,
              polylineOptions: styleOptions,
              polygonOptions: styleOptions,
              rectangleOptions: styleOptions
            })
            var oExpand = document.getElementById("expand");
            var oCloseToolsBtn = document.getElementById("closeTools");
            oCloseToolsBtn.onclick = function () {
              let _this = drawingManager._drawingTool.panel;
              _this.style.display = "none"
              oExpand.style.display = "none";

              for (var i = 0; i < overlays.length; i++) {
                map.removeOverlay(overlays[i]);
              }
              overlays.length = 0;
              oThumbnail.innerHTML = "";
              oRegionName.value = "";
              oAddRegion.style.display = "none";
            }
            // 绘图完毕后显示弹出框的派发事件
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);          // 绘制覆盖物后的派发事件
            drawingManager.addEventListener('circlecomplete', showAddDrawing);            // 绘制圆形区域后的派发事件
            drawingManager.addEventListener('polygoncomplete', showAddDrawing);           // 绘制多边形区域后的派发事件
            drawingManager.addEventListener('polylinecomplete', showAddDrawing);          // 绘制线后的派发事件
            drawingManager.addEventListener('rectanglecomplete', showAddDrawing);         // 绘制矩形完成后的派发事件
          }
        }

        function closeDrawingtool() {
          var oExpand = document.getElementById("expand");
          var oToolsBtn = document.getElementById("toolbtn");
          var oCloseTools = document.getElementById("closeTools");
          oToolsBtn.onclick = function () {
            if (oExpand.style.display = "none") {
              oExpand.style.display = "block";
            } else if (oExpand.style.display = "block") {
              oExpand.style.display = "none";
            }
            // oExpand.style.display = "block";
          }
          oCloseTools.onclick = function () {
            oExpand.style.display = "none";
          }
        }

        // 添加地图控件
        map.addControl(new BMap.ScaleControl());

        // 1.地图左上角搜索框自定义组件
        function ZoomControl() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(10, 10);
        }

        ZoomControl.prototype = new BMap.Control();
        ZoomControl.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div>
              <input type="text" size="20" placeholder="请输入内容" id="sole-input1" class="searchbox-content"/>
            </div>
            <div>
             <button id="btn">搜索  </button>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrl = new ZoomControl();
        map.addControl(myZoomCtrl);
        // 搜索框的向后端发送要请求的数据------------------------------------------
        $("#btn").click(function () {
          let paramSearchValue = $("#sole-input1").val();
          console.log("向后台发送的数据", paramSearchValue);
          $.ajax({
            type: "get",
            url: "/api/xxxx/xxxxxx",    // 搜索框的请求数据的API
            data: paramSearchValue,
            success: function (data) {
              console.log("后台返回的数据", data);
              paramSearchValue = ""
            },
            error(err) {
              alert("查询数据失败,请稍后再试！", err);
              paramSearchValue = ""
            }
          })
        })

        // 2.地图中部按钮自定义控件
        function ZoomControlBtn() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
          this.defaultOffset = new BMap.Size(650, 20)
        }

        ZoomControlBtn.prototype = new BMap.Control();
        ZoomControlBtn.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div>
              <div id="openBtns""></div>
            </div>
            <div id="btns">
              <ul>
                <li id="showRel"></li>
                <li id="earlying"></li>
                <li id="situation"</li>
                <li id="openfix"></li>
                <li id="analyzebtn"></li>
                <li id="preRes"></li>
                <div id="closeBtns"></div>
              </ul>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoolCtrlButton = new ZoomControlBtn();
        map.addControl(myZoolCtrlButton)
        this.handleBtn();

        // 3.地图右上角工具包自定义控件
        function ZoomControlTools() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 10);
        }

        ZoomControlTools.prototype = new BMap.Control();
        ZoomControlTools.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div style="position: relative;">
             <div id="toolbtn"><span class="tool">工具箱</span></div>
             <div id="expand">
              <ul>
                <li id="drawingTool">
                  <span class="drawRegionPicture"></span>
                  <span class="drawRegionText">监控区域</span>
                </li>
                <li id="uploadRegion">
                  <span class="uploadRegionPicture"></span>
                  <span class="uploadRegionText">加载区域</span>
                </li>
                <li id="closeTools">
                  <span class="closePicture"></span>
                  <span class="closeText">关闭绘制</span>
                </li>
               <!-- <li id="delRegion" title="删除区域"></li>-->
              </ul>
            </div>
          </div>
          `

          map.getContainer().appendChild(div);
          return div;
        }
        var myZoolCttrlTools = new ZoomControlTools();
        map.addControl(myZoolCttrlTools);
        showDrawingTool();
        closeDrawingtool();
        let oPersonRegion = document.getElementsByClassName("personRegion")[0];
        $(".uploadRegionText").click(function () {
          // oPersonRegion.style.display = "block"
        })

        // 加载个人区域
        function ZoomControlPersonRegion() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 200);
        }

        ZoomControlPersonRegion.prototype = new BMap.Control();
        ZoomControlPersonRegion.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div class="personRegion" style="width: 250px;height: 250px;position: relative;background-color: #fff;display: block">
              <span class="addMonitorRegion" title="新增监控区域"></span>
              <span class="deleteMonitorRegion" title="删除监控区域"></span>
              <table class="monitionTable" border="1" cellspacing="0" cellpadding="0" width="215" style="position: absolute;left: 14px;top: 40px;">
              <thead>
                <tr style="font-size: 12px;text-align: center">
                  <th style="width: 50px"><input type="checkbox"></th>
                  <th style="width: 200px">区域名称</th>
                  <th style="width: 100px">区域边界</th>
                </tr>
              </thead>
             <tbody>

             </tbody>
            </table>
              <button style="width: 40px;height: 20px;position: absolute;left: 180px;top: 200px;">确认</button>
           </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoolCtrlPersonSettings = new ZoomControlPersonRegion();
        map.addControl(myZoolCtrlPersonSettings);
        let oUploadRegion = document.getElementById("uploadRegion");

        //加载监控区域
        loadArea()

        function loadArea() {
          $.ajax({
            type: 'get',
            url: '/api/personSettings/getAreaSetting',
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
              let monitorIds = JSON.stringify(data);
              console.log("发送的ids:", monitorIds);
              $.ajax({
                type: 'post',
                url: '/api/monitorRegion/getListByIds',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: monitorIds,
                success: function (res) {
                  console.log("要搜索的数据", res);
                  for (let i in res) {
                    let str = `
                       <tr style="font-size: 12px;text-align: center">
                         <td><input type="checkbox" name="selectoneMonitorRegion"></td>
                         <td>${res[i].name}</td>
                         <td>${res[i].point}</td>
                       </tr>
                    `
                    $(".monitionTable tbody").append(str);


                    let pointRegion = [];
                    if (res[i].points != null || res[i].points != undefined) {
                      let oldpoints = getCircleArea(res[i].points);
                      console.log("points点位数组", oldpoints);
                      pointRegion = JSON.parse(oldpoints);
                      drawMonitorRegion(pointRegion)
                    }

                    function getCircleArea(points) {
                      let index = points.indexOf("},");
                      let firstPoint = "," + points.substring(1, index + 1) + "]";
                      points = points.replace("]", "");
                      points = points + firstPoint;
                      return points;
                    }

                    //地图画点
                    function drawMonitorRegion(points) {
                      let newArr = [];

                      for (let i = 0; i < points.length; i++) {
                        let baiduPoint = new BMap.Point(points[i].longitude, points[i].latitude);
                        newArr.push(baiduPoint);
                      }
                      let polyLineMonitorRegion = new BMap.Polyline(newArr, {
                        strokeColor: '#ad2529',
                        strokeWeight: 1,
                        strokeOpacity: 1,
                      })
                      map.addOverlay(polyLineMonitorRegion);
                    }
                  }
                },
                error: function (err) {
                  console.log("搜索数据失败", err);
                }
              })
            },
            error(err) {
              console.log("获取用户监控区域失败", err);
            }
          })
        }


        // 个人设置框中添加按钮触发操作
        function ZoomControlAddMonitorRegion() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(260, 200);
        }

        ZoomControlAddMonitorRegion.prototype = new BMap.Control();
        ZoomControlAddMonitorRegion.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div class="allMonitorRegion" style="width: 250px;height: 250px;background: #fff;overflow-y: scroll;position: relative;display: none;">
            <table class="addMonitorRegionTable" border="1" cellspacing="0" cellpadding="0" width="215" style="position: absolute;left: 14px;top: 30px;">
              <thead>
                <tr style="font-size: 12px;text-align: center">
                  <th style="width: 50px;"><input type="checkbox" name="monitorRegionSelectAll"></th>
                  <th style="width: 200px">区域名称</th>
                  <th style="width: 100px">区域边界</th>
                </tr>
              </thead>
             <tbody

             </tbody>
            </table>
            <button class="addRightTable" type="button" style="position: absolute;left: 180px;top: 210px;">确认</button>
           </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlAddMonitorRegion = new ZoomControlAddMonitorRegion();
        map.addControl(myZoomCtrlAddMonitorRegion);
        let oAddMonitorRegion = document.getElementsByClassName("addMonitorRegion")[0];
        let oAllMonitorRegion = document.getElementsByClassName("allMonitorRegion")[0];
        oAddMonitorRegion.onclick = function () {
          oAllMonitorRegion.style.display = "block";
          $.ajax({
            type: 'get',
            url: '/api/monitorRegion/lists',
            contentType: 'application/json;charset=utf-8',
            data: {
              current: 0,
              pageSize: 10
            },
            success: function (data) {
              console.log("新增展示的监控区域列表", data);
              for (let i in data.value) {
                let str = `
                  <tr style="font-size: 12px;text-align: center">
                    <td><input type="checkbox" name="selectoneMonitorRegion"></td>
                    <td>${data.value[i].name}</td>
                    <td>${data.value[i].point}</td>
                  </tr>
                `
                $(".addMonitorRegionTable tbody").append(str);
              }
            },
            error(err) {
              console.log("新增监控区域列表获取失败", err);
            }
          })
        }

        let check = "input[type='checkbox']";

        // checkbox全选
        function allChecked(tableClass) {
          $(tableClass).find(check).change(function () {
            var thead = $(this).parent().parent().parent();
            if (thead.prop("nodeName") == "THEAD") {
              if (thead.find(check).is(':checked')) {
                $(tableClass).find(check).prop("checked", true);
              } else {
                $(tableClass).find(check).prop("checked", false);
              }
            }
          })
        }

        // 部分选取移动
        function ckeckboxTurn(tableClass, hiddenDiv) {
          $(tableClass).each(function () {
            if ($(this).find(check).is(':checked')) {
              $(hiddenDiv).append(`<tr style="font-size: 12px">${$(this).html()}</tr>`);
            }
          })
        }

        // 全部选择移动
        function checkboxAllTurn(leftTable, rightTable) {
          $(rightTable).find("tbody").append($(".addMonitorRegionTable").find("tbody").html());
          $(leftTable).find("thead").find(check).prop("checked", false);
        }

        // table数据从左向右移动
        allChecked(".addMonitorRegionTable");
        $('.addRightTable').click(function () {
          // 全选
          if ($(".addMonitorRegionTable thead").find(check).is(':checked')) {
            checkboxAllTurn(".addMonitorRegionTable", ".monitionTable");
          } else {
            ckeckboxTurn(".addMonitorRegionTable tbody tr", ".monitionTable tbody");
          }
        })

        // 4.态势生成弹出框自定义控件
        function ZoomControlSituation() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 140);
        }

        ZoomControlSituation.prototype = new BMap.Control();
        ZoomControlSituation.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div class="situationbox">
              <div id="closeSituation"></div>
                <p style="font-size: 12px;float: left;position: absolute;left: 15px;top: 20px;">态势生成</p>
                  <input type="radio" style="position: absolute;left: 70px;top: 22px;">
                  <span style="font-size: 12px;position: absolute;left: 88px;top: 20px;">自动</span>
                  <input type="radio" style="position: absolute;left: 120px;top: 22px;">
                  <span style="font-size: 12px;position: absolute;left: 138px;top: 20px;">手动</span>
                  <input type="radio" style="position: absolute;left: 170px;top: 22px;">
                  <span style="font-size: 12px;position: absolute;left: 188px;top: 20px;">人工</span>
                  <div style="width: 230px;height: 2px;background-color: #13b0ff;position: absolute;left: 10px;top: 40px;"></div>
              <div>
               <span style="font-size: 12px;position: absolute;left: 15px;top: 54px;">信号类型：</span>
               <select id="situationSignalType" style="width: 140px;position: absolute;left: 82px;top: 52px;">
                <option value="信号1">信号1</option>
                <option value="信号2">信号2</option>
               </select>
              </div>
              <div>
               <span style="font-size: 12px;position: absolute;left: 18px;top: 82px;">PU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
               <input type="text" style="width: 136px;position: absolute;left: 82px;top: 82px;">
              </div>
              <div>
               <span style="font-size: 12px;position: absolute;left: 18px;top: 114px;">频&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</span>
               <input style="width: 136px;position: absolute;left: 82px;top: 112px;" type="text" placeholder="请输入频点(KHz)"></span>
              </div>
              <div>
                <span style="font-size: 12px;position: absolute;left: 18px;top: 150px;">开始时间：</span>
                 <input type="text" style="width: 130px;height: 20px;position: absolute;left: 82px;top: 146px;font-size: 12px;padding-left: 5px;" class="jeinput" id="test04" placeholder="请输入开始时间">
              </div>
              <div>
                <span style="font-size: 12px;position: absolute;left: 18px;top: 183px;">结束时间：</span>
                 <input type="text" style="width: 130px;height: 20px;position: absolute;left: 82px;top: 183px;font-size: 12px;padding-left: 5px;" class="jeinput" id="test05" placeholder="请输入结束时间">
              </div>
               <div>
                <span style="font-size: 12px;position: absolute;left: 18px;top: 220px;">测&nbsp;向&nbsp;站：</span>
                <select style="width: 140px;position: absolute;left: 82px;top: 220px;"></select>
              </div>
             <div>
                <span style="font-size: 12px;position: absolute;left: 18px;top: 252px;">测向站数：</span>
                <input type="text" placeholder="请输入测向站数" style="width: 136px;position: absolute;left: 82px;top: 252px;"></span>
              </div>
              <div>
               <table border="1" cellpadding="0" cellspacing="0" width=85%  style="position: absolute;left: 18px;top: 280px; text-align: center">
                 <tr>
                   <th style="font-size: 12px;font-weight: 400;">目标名称</th>
                   <th style="font-size: 12px;font-weight: 400;">...</th>
                   <th style="font-size: 12px;font-weight: 400;">开始</th>
                   <th style="font-size: 12px;font-weight: 400;">结束</th>
                 </tr>
                 <tr>
                   <td>1234</td>
                 </tr>
               </table>
               <button class="situationGenBtn" type="button" style="position: absolute;left: 120px;bottom: 5px;">确认</button>
             </div>
            </div>
            `
          map.getContainer().appendChild(div);
          return div;
        }

        var myZoomCtrlSituationBox = new ZoomControlSituation();
        map.addControl(myZoomCtrlSituationBox);
        this.openSituation();
        // 态势生成列表获取
        $(".situationGenBtn").click(function () {

          let params = {
            searchType: 1,
            delflydotexEnable: 0,
            trackprocEnable: 1,
            fuzzyMatch: 0,
            allShow: 0,
            withTimeZone: 1,
            signalType: -1,
            puNum: "NTM123",
            freq: 32.56,
            startTimeStr: "2019-06-26 14:08:34",
            endTimeStr: "2019-06-26 16:08:34",
            dfStation: {
              name: "城阳",
              unitid: "JN",
              siteid: "CY"
            },
            leastCrossStaCunt: 5
          }
          console.log("组装的态势生成发送参数", JSON.stringify(params));     //
          $.ajax({
            type: 'post',
            url: '/api/situationGen/search',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(params),
            success: function (res) {
              console.log("获取态势生成数据列表", res);
            },
            error(err) {
              console.log("获取态势生成数据失败", err);
            }
          })
        })

        jeDate("#test04", {
          festival: false,
          minDate: "1900-01-01",              //最小日期
          maxDate: "2099-12-31",              //最大日期
          format: "YYYY-MM-DD hh:mm:ss"
        });

        jeDate("#test05", {
          festival: false,
          minDate: "1900-01-01",              //最小日期
          maxDate: "2099-12-31",              //最大日期
          format: "YYYY-MM-DD hh:mm:ss"
        });

        // 5.预警弹出框自定义控件
        function ZoomControlAlarm() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
          this.defaultOffset = new BMap.Size(0, 50);
        }

        ZoomControlAlarm.prototype = new BMap.Control();
        ZoomControlAlarm.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
           <div id="earlyingbox" style="width: 380px;height: 140px;background-color: #fff;border-radius: 10px;display: none;">
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
        this.openEarlying();

        // 6.地图左上角搜索框展开的自定义控件
        function ZoomControlSearchBox() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(10, 45);
        }

        ZoomControlSearchBox.prototype = new BMap.Control();
        ZoomControlSearchBox.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
          <div id="search1" style="width: 420px; height: 300px;background-color: #fff;position: relative;display: none;border-radius: 7px">
           <div>
            <span style="font-size: 12px;float: left;margin: 10px 0 0 10px;">开始时间:</span>
            <input type="text" style="font-size: 12px;float: left;width: 120px;height: 20px;margin: 8px 0 0 5px;" class="jeinput" id="test11" placeholder="请输入开始时间">
           </div>
           <div>
            <span style="font-size: 12px;float: left;margin: 10px 0 0 8px;">结束时间:</span>
            <input type="text" style="font-size: 12px;float: left;width: 120px; height: 20px;margin: 8px 0 0 5px;" class="jeinput" id="test12" placeholder="请输入结束时间">
           </div>
           <div id="closeSearch"></div>
           <div style="width: 410px;height: 2px;background-color: #41faff;position: absolute;left: 5px;top: 40px;"></div>
           <div>
            <input class="filtervalue" style="width: 240px;height: 18px;padding-left: 10px;margin: 20px 0 0 10px;" type="text" placeholder="请输入要搜索的内容"/>
            <button class="filtrate" style="width: 50px;background-color: #1f90ff;color: #fff">筛选</button>
           </div>
           <div style="height: 180px;overflow-y: scroll;margin: 10px 13px 0 15px;">
            <table class="searchTableList" border="1" cellspacing="0" cellpadding="0" width="375">
              <thead>
                <tr style="font-size: 12px;text-align: center">
                  <th style="width: 150px">名称</th>
                  <th style="width: 100px">类型</th>
                  <th>信息量</th>
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
        var myZoomCtrlSearchBox = new ZoomControlSearchBox();
        map.addControl(myZoomCtrlSearchBox);
        this.openSearchBox();
        // 筛选向后台发送的数据请求-------------------------------
        $(".filtrate").click(function () {
          let paramFilterValue = $(".filtervalue").val();
          $.ajax({
            type: 'get',
            url: "/api/xxxxx/xxxxxx",
            data: paramFilterValue,
            success: function (data) {
              console.log("后台返回的数据", data);
              paramFilterValue = ""
            },
            error: function (err) {
              alert("查询数据失败!", err);
              paramFilterValue = ""
            }
          })
        })

        jeDate("#test11", {
          festival: false,
          minDate: "1900-01-01",
          maxDate: "2200-12-31",
          method: {
            choose: function (params) {
            }
          },
          format: "YYYY-MM-DD hh:mm:ss"
        });

        jeDate("#test12", {
          festival: false,
          minDate: "1900-01-01",
          maxDate: "2200-12-31",
          method: {
            choose: function (params) {
            }
          },
          format: "YYYY-MM-DD hh:mm:ss",
        });

        // 8. 网台弹出框自定义控件
        function ZoomControlFix() {   //
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 140);
        }

        ZoomControlFix.prototype = new BMap.Control();
        ZoomControlFix.prototype.initialize = function (map) {
          var div = document.createElement("div");
          div.innerHTML = `
             <div id="fixwrap" style="width: 260px;height: 300px;background-color: #fff;position: relative;display: none;border-radius: 7px">
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

        // 9.关联分析弹窗框自定义控件
        function ZoomControlAnalyze() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 150);
        }

        ZoomControlAnalyze.prototype = new BMap.Control();
        ZoomControlAnalyze.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="analyzebox" style="width: 310px;height: 250px;background-color: #fff;position: relative;display: none;border-radius: 7px">
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
        this.showAnalyzeBox();

        // 10.预测结果弹出框自定义控件
        function ZoomControlPreResult() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 140);
        }

        ZoomControlPreResult.prototype = new BMap.Control();
        ZoomControlPreResult.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="prebox" style="width: 300px;height: 200px;background-color: #fff;position: relative;display: none;border-radius: 7px">
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
        this.showPreResult();

        // 11.实时态势弹出框自定义控件
        function ZoomControlRel() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(0, 160);
        }

        ZoomControlRel.prototype = new BMap.Control();
        ZoomControlRel.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="relbox" style="width: 310px;height: 250px;background-color: #fff;position: relative;display: none;border-radius: 10px">
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


        // 12.预警通报飞机自定义控件
        function ZoomControlAlarmFly() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
          this.defaultOffset = new BMap.Size(0, 30);
        }

        ZoomControlAlarmFly.prototype = new BMap.Control();
        ZoomControlAlarmFly.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
             <div id="alarmfly" style="width: 140px;height: 80px;background-color: #fff;position: relative;display: none;border-radius: 7px">
              <p class="relalarmfly"></p>
              <span style="font-size: 16px;position: absolute;left: 45px;top: 15px;font-family: '宋体';">实时预警</span>
              <p class="hisalarmfly"></p>
              <span style="font-size: 16px;position: absolute;left: 45px;top: 48px;font-family: '宋体';">历史预警</span>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlAlarmFly = new ZoomControlAlarmFly();
        map.addControl(myZoomCtrlAlarmFly);
        this.openEarlying();

        // 13.态势生成飞机自定义控件
        function ZoomControlSituationFly() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
          this.defaultOffset = new BMap.Size(0, 30);
        }

        ZoomControlSituationFly.prototype = new BMap.Control();
        ZoomControlSituationFly.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div>
              <div id="situationfly" style="width: 120px;height: 100px;background-color: #fff;position: relative;border-radius: 8px;display: none;">
                <p class="autofly"></p>
                <span style="font-size: 16px;position: absolute;left: 52px;top: 16px;font-family: '宋体';">自动</span>
                <p class="operation"></p>
                <span style="font-size: 16px;position: absolute;left: 52px;top: 46px;font-family: '宋体';">手动</span>
                <p class="artificial"></p>
                <span style="font-size: 16px;position: absolute;left: 52px;top: 76px;font-family: '宋体';">人工</span>
              </div>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlSituationFly = new ZoomControlSituationFly();
        map.addControl(myZoomCtrlSituationFly);
        this.openSituation();

        // 14.网台通信的飞机自定义控件
        function ZoomControlFIxfky() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
          this.defaultOffset = new BMap.Size(0, 0);
        }

        ZoomControlFIxfky.prototype = new BMap.Control();
        ZoomControlFIxfky.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="fixfly" style="width: 150px;height: 190px;position: relative;background-color: #fff;display: none;border-radius: 7px">
              <p class="fixone"></p>
              <span style="font-size: 16px;position: absolute;left: 52px;top: 16px;font-family: '宋体';">通联支台</span>
              <p class="nofix"></p>
              <span style="font-size: 16px;position: absolute; left: 52px;top: 52px;font-family: '宋体';">未  通  信</span>
              <p class="extrudefix"></p>
              <span style="font-size: 16px;font-family: '宋体';position: absolute;left: 52px;top: 86px;">突出网络</span>
              <p class="communicationfix"></p>
              <span style="font-size: 16px;font-family: '宋体';position: absolute;left: 52px;top: 122px;">通信网台</span>
              <p class="fixsign"></p>
              <span style="font-size: 16px;font-family: '宋体';position: absolute;left: 52px;top: 158px;">通联标记</span>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlFixfly = new ZoomControlFIxfky();
        map.addControl(myZoomCtrlFixfly);
        this.showFixWrap();

        // 15.关联分析的飞机自定义控件
        function ZoomControlrelfix() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
          this.defaultOffset = new BMap.Size(0, 30);
        }

        ZoomControlrelfix.prototype = new BMap.Control();
        ZoomControlrelfix.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="relfly" style="width: 130px;height: 168px;background-color: #fff;position: relative;display: none;border-radius: 7px">
              <p class="location"></p>
              <div style="font-size: 16px;font-family: '宋体';position: absolute;left: 45px;top: 16px;">开始定位</div>
              <p class="relgoal"></p>
              <div style="font-size: 16px;font-family: '宋体';position: absolute;left: 45px;top: 47px;">关联目标</div>
              <p class="relnormal"></p>
              <div style="font-size: 16px;font-family: '宋体';position: absolute;left: 45px;top: 78px;">正&nbsp;&nbsp;常</div>
              <p class="add"></p>
              <div style="font-size: 16px;font-family: '宋体';position: absolute;left: 45px;top: 109px;">新&nbsp;&nbsp;增</div>
              <p class="disappear"></p>
              <div style="font-size: 16px;font-family: '宋体';position: absolute;left: 45px;top: 140px;">消&nbsp;&nbsp;失</div>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlrelfly = new ZoomControlrelfix();
        map.addControl(myZoomCtrlrelfly);
        this.showAnalyzeBox();

        // 16.预测结果的飞机自定义控件
        function ZoomControlprefly() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
          this.defaultOffset = new BMap.Size(0, 30);
        }

        ZoomControlprefly.prototype = new BMap.Control();
        ZoomControlprefly.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="prefly" style="width: 130px;height: 35px;background-color: #fff;position: relative;display: none;border-radius: 7px">
              <p class="forecast"></p>
                 <div style="font-size: 16px;font-family: '宋体';position: absolute;left: 50px;top: 10px;">预测路线</div>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlPrefly = new ZoomControlprefly();
        map.addControl(myZoomCtrlPrefly);
        this.showPreResult();

        // 21.任务指令下发选择策略弹出框的自定义控件
        function ZoomControlTaskCommand() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
          this.defaultOffset = new BMap.Size(180, 60);
        }

        ZoomControlTaskCommand.prototype = new BMap.Control();
        ZoomControlTaskCommand.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="taskcommandwrap" style="width: 205px;height: 200px;background-color: #fff;border-radius: 7px;position: relative;display: none;">
              <span style="font-size: 14px;position: absolute;left: 10px;top: 5px;">预警策略</span>
              <div id="closeTaskBtn"></div>
              <div style="width: 195px;height: 2px;background-color: #3593ff;position: absolute;left: 5px;top: 25px;"></div>
              <span style="font-size: 14px;position: absolute;left: 10px;top: 35px;">选择策略：</span>
              <select class="earlyWarningSelectData" style="width: 110px;position: absolute;left: 83px;top: 35px;"></select>
              <span style="font-size: 12px;position: absolute;top: 65px;left: 12px">策略名称：5555</span>
              <span style="font-size: 12px;position: absolute;top: 90px;left: 12px;">起始时间：2018-05-12 00:00:00</span>
                <!--<span style="font-size: 12px;position: absolute;">结束时间：2018-05-12 00:00:00</span>
              <span style="font-size: 12px;position: absolute;">信号类型：353645</span>-->
             <button id="ensureTaskBtn" style="position: absolute;right: 30px;top: 165px;background-color: #22c0ff;">确认</button>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlTaskCommand = new ZoomControlTaskCommand();
        map.addControl(myZoomCtrlTaskCommand);

        $(".earlyWarningSelectData").focus(function () {
          let paramsEarlyWarning = {
            current: 1,
            pageSize: 10,
          }
          $.ajax({
            type: 'get',
            url: '/api/stgSignalAlarm/lists',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: paramsEarlyWarning,
            success: function (res) {
              console.log("预警策略列表", res);
              let earlyWarning = res.value;
              for (let i in earlyWarning) {
                let str = `
                  <option value="${earlyWarning[i].value}">${earlyWarning[i].name}</option>
                `
                $(".earlyWarningSelectData").append(str);
              }
              console.log(earlyWarning);
            },
            error(err) {
              console.log("服务器错误,请稍后再试", err);
            }
          })
        })

        $(".earlyWarningSelectData").change(function (val) {
          console.log("这他娘的是啥", val);
        })

        $("#ensureTaskBtn").click(function () {
          // 向后端发起请求，运行态势
          $.ajax({
            url: "/api/xxxx/runsituation",                   //  演员未定 接口暂无
            contentType: "application/json;charset=utf-8",   //  向后台发送json的形式 声明请求格式
            dataType: "json",                                //  json形式的类型   声明data类型

            success: function (res) {
              console.log("后台返回的数据", res);
            },
            error: function (err) {
              alert("提交数据失败", err);
            }
          })
          $("#taskcommandwrap").hide();
          $(".runbox").hide();
        })

        // 17.态势生成运行自定义控件
        function ZoomControlSituationRun() {
          this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
          this.defaultOffset = new BMap.Size(20, 70);
        }

        ZoomControlSituationRun.prototype = new BMap.Control();
        ZoomControlSituationRun.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div style="position: relative;">
              <div id="unfold"></div>
              <div class="runbox">
                <p class="closeRun"></p>
                <div style="font-size: 12px;font-family: '宋体';position: absolute;left: 5px;top: 8px;">状态<span class="showTaskStatus"></span></div>
                <div style="width: 130px;height: 2px;background-color: #3decff;position: absolute;left: 5px;top: 28px;"></div>
                <div style="position: absolute;left: 5px;top: 35px;">
                  <table id="taskTable" border="1" width="120" cellspacing="0" cellpadding="0" style="text-align: center;font-size: 12px;margin-left: 5px;">
                    <tr>
                      <td style="width: 50px;">分发</td>
                      <td>
                        <select style="width: 66px;">
                          <option value="停止">停止</option>
                          <option value="开始">开始</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                     <td style="width: 50px;">预警</td>
                      <td>
                        <select id="startsituation" style="width: 66px;">
                         <option value="停止">停止</option>
                         <option value="开始">开始</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 50px;">通联预警</td>
                      <td>
                        <select style="width: 66px;">
                          <option value="停止">停止</option>
                          <option value="开始">开始</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 50px">通报</td>
                      <td>
                        <select style="width: 66px">
                         <option value="停止">停止</option>
                         <option value="开始">开始</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 50px;">关联分析</td>
                      <td>
                        <select style="width: 66px;">
                          <option value="停止">停止</option>
                          <option value="开始">开始</option>
                        </select>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }

        var myZoomCtrlSituationRun = new ZoomControlSituationRun();
        map.addControl(myZoomCtrlSituationRun);
        this.unfoldDialog();
        // 任务下发时状态的选择
        var oShowTaskStatus = document.getElementsByClassName("showTaskStatus")[0];
        $("#taskTable td:eq(1) select").change(function () {
          oShowTaskStatus.innerHTML = "(" + "分发" + $("#taskTable td:eq(1) select").val() + ")";
        })
        $("#taskTable td:eq(3) select").change(function () {
          oShowTaskStatus.innerHTML = "(" + "预警" + $("#taskTable td:eq(3) select").val() + ")";
        })
        $("#taskTable td:eq(5) select").change(function () {
          oShowTaskStatus.innerHTML = "(" + "通联预警" + $("#taskTable td:eq(5) select").val() + ")";
        })
        $("#taskTable td:eq(7) select").change(function () {
          oShowTaskStatus.innerHTML = "(" + "通报" + $("#taskTable td:eq(7) select").val() + ")";
        })
        $("#taskTable td:eq(9) select").change(function () {
          oShowTaskStatus.innerHTML = "(" + "关联分析" + $("#taskTable td:eq(9) select").val() + ")";
        })
        var oTaskCommandWrap = document.getElementById("taskcommandwrap");
        var oCloseTaskBtn = document.getElementById("closeTaskBtn");

        $("#taskTable td:eq(1) select").change(function () {
          if ($("#taskTable td:eq(1) select").val() == "开始") {
            oTaskCommandWrap.style.display = "block";
          }
        })
        $("#taskTable td:eq(3) select").change(function () {
          if ($("#taskTable td:eq(3) select").val() == "开始") {
            oTaskCommandWrap.style.display = "block";
          }
        })
        $("#taskTable td:eq(5) select").change(function () {
          if ($("#taskTable td:eq(5) select").val() == "开始") {
            oTaskCommandWrap.style.display = "block";
          }
        })
        $("#taskTable td:eq(7) select").change(function () {
          if ($("#taskTable td:eq(7) select").val() == "开始") {
            oTaskCommandWrap.style.display = "block";
          }
        })
        $("#taskTable td:eq(9) select").change(function () {
          if ($("#taskTable td:eq(9) select").val() == "开始") {
            oTaskCommandWrap.style.display = "block";
          }
        })
        oCloseTaskBtn.onclick = function () {
          oTaskCommandWrap.style.display = "none";
        }

        // 20.展示名字及缩略图 (此页面只做用户所提交信息的展示 不能修改 确认之后提交数据)
        function ZoomControlShowNameAndPicture() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(850, 320);   // 自定义控件相对于地图的偏移量
        }

        ZoomControlShowNameAndPicture.prototype = new BMap.Control();
        ZoomControlShowNameAndPicture.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="showPicture" style="width: 270px;height: 250px;background-color: #fff; position: relative;border-radius: 5px;display: none;">
              <p style="font-size: 14px;position: absolute;left: 12px;top: 8px;">您所添加的区域信息：</p>
              <div style="width: 260px;height: 2px;background-color: #4c9ed1;position: absolute;left: 5px;top: 30px;"></div>
              <span style="font-size: 14px;position: absolute;left: 12px;top: 40px;">区域名称：</span>
              <input id="showRegionName" type="text" style="width: 148px;height: 18px;border:none; font-size: 14px;position: absolute;left: 85px;top: 40px;pointer-events: none">
               <span style="font-size: 14px;position: absolute;left: 12px;top: 73px;">用户级别：</span>
              <input id="regionUserType" type="text" style="width: 148px;border: none; height: 18px;font-size: 14px;position: absolute;left: 85px;top: 73px;pointer-events: none">
              <span style="font-size: 14px;position: absolute;left: 12px;top: 105px;">缩&nbsp;略&nbsp; 图：</span>
              <div id="thumbnail" style="width: 150px;height: 100px;position: absolute;left: 85px;top: 105px;border: 1px solid #ccc;"></div>
              <button id="addBtn" style="position: absolute;right: 20px;bottom: 10px;background-color: #43b5ff;">确认</button>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlDrawRegion = new ZoomControlShowNameAndPicture();
        map.addControl(myZoomCtrlDrawRegion);
        var oAddBtn = document.getElementById("addBtn");
        var oShowPicture = document.getElementById("showPicture");
        oAddBtn.onclick = function () {
          for (var i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
          }
          overlays.length = 0;
          oShowPicture.style.display = "none";
          // 向后台发送请求  发送字段 name  points   image(字段未定)
          let paramsPoints = document.getElementById("getPoints").value;
          //let paramsPointsString = JSON.stringify(paramsPoints)
          console.log("向后台发送的points数据", paramsPoints);
          let paramsName = document.getElementById("showRegionName").value;
          console.log("向后台发送的区域名称", paramsName);
          let paramsType = document.getElementById("selRegionType").value;
          let paramsImage = document.getElementsByClassName("smallImage")[0].src;
          console.log("向后台发送的图片数据", paramsImage);
          let params = {
            name: paramsName,
            points: paramsPoints,
            type: paramsType,
            thumbanail: paramsImage
          }
          console.log("向后台发送的总的参数集合", JSON.stringify(params));
          $.ajax({
            type: 'put',
            url: '/api/monitorRegion/add',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (res) {
              console.log("后台返回的数据", res);
              alert("添加成功");
              /* this.$message({
                 type: 'success',
                 message: '添加成功'
               })*/
            },
            error: function (err) {
              // alert("提交数据失败", err);
              for (var i = 0; i < overlays.length; i++) {
                map.removeOverlay(overlays[i]);
              }
              overlays.length = 0;
              oThumbnail.innerHTML = "";
              oRegionName.value = "";
            }


          })
        }

        // 打开查询航线的弹出框按钮自定义控件
        function ZoomControlOpenAirLineWrap() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(3, 150);
        }

        ZoomControlOpenAirLineWrap.prototype = new BMap.Control();
        ZoomControlOpenAirLineWrap.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `<div id="openFindAirLineWrapBtn"><span class="btnimg"></span></div>`
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlOpenAirLineWrap = new ZoomControlOpenAirLineWrap();
        map.addControl(myZoomCtrlOpenAirLineWrap);

        // 22.查询及筛选数据搜索框的自定义控件
        function ZoomControlFindAirLinePoint() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = new BMap.Size(30, 100);
        }

        ZoomControlFindAirLinePoint.prototype = new BMap.Control();
        ZoomControlFindAirLinePoint.prototype.initialize = function (map) {

          var div = document.createElement('div');
          div.innerHTML = `
            <div id="findAirLineWrap" style="width: 300px;height: 160px;background-color: #fff;border-radius: 7px;display: none;position: relative;">
              <span style="font-size: 14px;position: absolute;left: 12px;top: 5px;">查找航线</span>
              <div id="closeFindAirLineBtn"></div>
              <div style="width: 290px;height: 2px;background-color: #5cd8ff;position: absolute;left: 5px;top: 25px;"></div>
              <span style="font-size: 14px;position: absolute;left: 10px;top: 38px;">开始时间：</span>
              <input type="text" style="width: 150px;height: 25px;position: absolute;top: 35px;left: 85px;font-size: 14px" class="jeinput" id="test08" placeholder="请输入查询开始时间">
              <span style="font-size: 14px;position: absolute;left: 10px;top: 78px;">结束时间：</span>
              <input type="text" style="width: 150px;height: 25px;position: absolute;top: 75px;left: 85px;font-size: 14px" class="jeinput" id="test09" placeholder="请输入查询结束时间">
              <input id="findAirLineBtn" type="button" value="查询" style="position: absolute;right: 20px;top: 120px;">
             </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }

        var myZoomCtrlFindAirLinePoint = new ZoomControlFindAirLinePoint();
        map.addControl(myZoomCtrlFindAirLinePoint);
        $("#closeFindAirLineBtn").click(function () {
          $("#findAirLineWrap").hide();
        })
        $("#openFindAirLineWrapBtn").click(function () {
          $("#findAirLineWrap").show();
        })
        // 查询一段时间内生成的航线
        $("#findAirLineBtn").click(function () {
          // 发送的查询的时间的数据
          let findStartTime = $("#test08").val();
          let findEndTime = $("#test09").val();
          let params = {
            startTime: findStartTime,
            endTime: findEndTime
          }
          console.log("发送的数据格式", JSON.stringify(params));


          $.ajax({
            type: 'put',
            url: '/api/xxxx/xxx',     // 查询的一段时间内生成的航线
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            success: function (res) {
              console.log("后台返回的数据", res);
            },
            error: function (err) {
              alert("查询数据失败", err);
            },
          })
          $("#findAirLineWrap").hide();
        })

        jeDate("#test08", {
          festival: false,
          minDate: "1900-01-01",              //最小日期
          maxDate: "2200-12-31",              //最大日期
          method: {
            choose: function (params) {
            }
          },
          format: "YYYY-MM-DD hh:mm:ss"
        });

        jeDate("#test09", {
          festival: false,
          minDate: "1900-01-01",              //最小日期
          maxDate: "2200-12-31",              //最大日期
          method: {
            choose: function (params) {
            }
          },
          format: "YYYY-MM-DD hh:mm:ss"
        });

        // 18.双击所绘制的区域,弹出新增地理围栏的自定义组件
        function ZoomControlDrawRegion() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(800, 320);
        }

        ZoomControlDrawRegion.prototype = new BMap.Control();
        ZoomControlDrawRegion.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `
            <div id="addRegion" style="width: 320px;height: 200px;background-color: #fff;position: relative;border-radius: 5px;display: none;">
              <p style="font-size: 13px;position: absolute;left: 12px;top: 8px;">请输入区域名称：</p>
              <p class="closeRegionName"></p>
              <div style="width: 310px;height: 2px;background-color: #52daff;position: absolute;left: 5px;top: 30px;"></div>
              <span style="font-size: 14px;position: absolute;left: 12px;top: 42px;">区域名称：</span>
              <input id="regionName" name="name" type="text" placeholder="请输入区域名称" style="width: 110px;height: 18px;font-size: 12px; position: absolute;left: 85px;top: 40px;padding-left: 5px;">
              <p id="tipMessage" style="font-size: 14px;position: absolute;right: 8px; top: 40px;"></p>
              <span style="font-size: 14px;position: absolute;left: 12px;top: 75px;">用户级别：</span>
              <select id="selRegionType" style= "width: 120px;position: absolute; left: 85px;top: 75px;">
                <option value="1">共享</option>
                <option value="0">私有</option>
              </select>
              <input id="getPoints" type="hidden">
              <button id="cancelDrawing" type="button" style="position: absolute;left: 190px;top:145px;">取消</button>
              <button id="saveDrawing" type="button" style="position: absolute;left: 240px;top:145px;background-color: #46f2ff;">保存</button>
            </div>
          `
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlDrawRegion = new ZoomControlDrawRegion();
        map.addControl(myZoomCtrlDrawRegion);

        /* 截图核心方法封装，获取base64*/
        function PrtScn(domName) {
          if (null == domName || '' == domName) {
            throw ('dom name should not be null');
          }
          if ('#' != domName.charAt(0) && '.' != domName.charAt(0)) {
            throw ('dom element only supports id or class');
          }
          let domIsNull = null;
          switch (domName.charAt(0)) {
            case '#':
              domIsNull = document.getElementById(domName.substr(1));
              break;
            case '.':
              domIsNull = document.getElementsByClassName(domName.substr(1))[0];
              break;
            default:
              break;
          }
          if (null == domIsNull) {
            throw ('dom element should not be null');
          }
          // svg转canvas
          let nodesToRecover = [];
          let nodesToRemove = [];
          let svgElem;
          switch (domName.charAt(0)) {
            case '#':
              svgElem = document.getElementById(domName.substr(1)).getElementsByTagName('svg');
              break;
            case '.':
              svgElem = document.getElementsByClassName(domName.substr(1))[0].getElementsByTagName('svg');
              break;
            default:
              break;
          }
          let prepare = [];
          for (let i = 0; i < svgElem.length; i++) {
            prepare.push(0);
          }
          for (let i = 0; i < svgElem.length; i++) {
            let parentNode = svgElem[i].parentNode;
            let canvas = document.createElement('canvas');
            canvas.style.position = svgElem[i].style.position;
            canvas.width = parseInt(svgElem[i].style.width);
            canvas.height = parseInt(svgElem[i].style.height);
            canvas.style.left = 0;
            canvas.style.top = 0;    // 生成与svg对应尺寸的canvas
            let ctx = canvas.getContext('2d');
            let svg_xml = (new XMLSerializer()).serializeToString(svgElem[i]);
            let img = new Image();
            img.src = "data:image/svg+xml;base64," + window.btoa(svg_xml);
            img.onload = function () {
              ctx.drawImage(img, 0, 0);
              prepare[i] = 1;
              //download(canvas.toDataURL("image/png")); // 调试用
            }
            parentNode.appendChild(canvas); // 使用canvas代替svg进行截图
            nodesToRemove.push({            // 完成截图后删除canvas
              parent: parentNode,
              child: canvas
            });
            nodesToRecover.push({ // 完成截图后恢复svg  /
              parent: parentNode,
              child: svgElem[i]
            });
            parentNode.removeChild(svgElem[i]);       // 暂时移除svg
          }
          return new Promise((resolve) => {
            let waitInterval = setInterval(() => {
              let isComplete = true;                  // 创建定时器，等待上面img.onload的异步操作
              for (let i = 0; i < prepare.length; i++) {
                if (prepare[i] == 0) {
                  isComplete = false;
                  break;
                }
              }
              if (isComplete) {
                clearInterval(waitInterval);
                // div转canvas截图
                let domElem;
                switch (domName.charAt(0)) {
                  case '#':
                    domElem = document.getElementById(domName.substr(1));
                    break;
                  case '.':
                    domElem = document.getElementsByClassName(domName.substr(1))[0];
                    break;
                  default:
                    break;
                }
                html2canvas(domElem, {
                  useCORS: true,                       // 允许图片跨域
                  logging: true,                       // 后台打印日志
                  foreignObjectRendering: true,        // 浏览器支持的情况下使用foreignObject模式渲染图片
                  allowTaint: false,                   // 允许跨域数据污染
                  taintTest: true,
                }).then((cnv) => {
                  let imgUrl = cnv.toDataURL("image/png");         // 将canvas转换成img的src流，  base64 ==> Arraybuffer blob

                  function base64ToUint8Array(base64String) {
                    const padding = '='.repeat((4 - base64String.length % 4) % 4);
                    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
                    const rawData = window.btoa(base64);

                    const outputArray = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; i++) {
                      outputArray[i] = rawData.charCodeAt(i)
                    }
                    return outputArray;
                  }

                  let ArrayBuffer = base64ToUint8Array(imgUrl);
                  console.log("转为ArrayBuffer", ArrayBuffer);
                  console.log("截取图片base64:", imgUrl);

                  for (let i = 0; i < nodesToRecover.length; i++) {
                    nodesToRecover[i].parent.appendChild(nodesToRecover[i].child);
                  }
                  for (let i = 0; i < nodesToRemove.length; i++) {
                    nodesToRemove[i].parent.removeChild(nodesToRemove[i].child);
                  }
                  resolve(imgUrl);
                  // 缩略图
                  var oSmallImg = document.createElement("img");
                  var oThumbnail = document.getElementById("thumbnail");
                  oSmallImg.classList.add('smallImage')
                  oSmallImg.style.width = "150px";
                  oSmallImg.style.height = "100px";
                  oSmallImg.src = imgUrl;
                  oThumbnail.append(oSmallImg);

                  //点击放大   容器中放置一张大图片
                  var oBigImgContainer = document.getElementById("bigImgContainer");
                  var oAddRegionBox = document.getElementById("addRegion");
                  var oBigImg = document.createElement("img");
                  oBigImg.style.maxWidth = "100%";
                  oBigImg.style.minHeight = "100%";
                  oBigImg.style.borderRadius = "12px";
                  oBigImg.classList.add("scaleImg");
                  oBigImg.src = imgUrl;
                  oBigImgContainer.append(oBigImg);
                  console.log("查看大图片是否添加成功", oBigImg);
                  oSmallImg.onclick = function (e) {
                    e.stopPropagation();   // 阻止冒泡
                    e.preventDefault();    // 组织默认行为
                    oBigImgContainer.style.display = "block";
                    oAddRegionBox.style.display = "none";
                  }
                  oBigImg.onclick = function (e) {
                    e.preventDefault();    // 组织默认行为
                    e.stopPropagation();   // 阻止冒泡
                    oBigImgContainer.style.display = "none";
                  }
                });
              }
            }, 5);
          });
        }

        //  下载图片的方法
        function download(url) {
          let a = document.createElement('a');
          a.style.display = 'none';
          document.body.appendChild(a);
          let timestamp = Date.parse(new Date());
          let triggerDownload = $(a).attr("href", url).attr("download", timestamp + 'jpg');
          triggerDownload[0].click();
          document.body.removeChild(a);
        }

        var oThumbnail = document.getElementById("thumbnail");
        var oCancelDrawing = document.getElementById("cancelDrawing");
        var oAddRegion = document.getElementById("addRegion");
        var oRegionName = document.getElementById("regionName");
        // 点击绘图弹出框取消按钮所做的操作
        oCancelDrawing.onclick = function () {
          for (var i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
          }
          overlays.length = 0;
          oThumbnail.innerHTML = "";         // 清除缩略图容器html内容
          oRegionName.value = "";
          var clearDrawRegion = document.getElementsByClassName("scaleImg")[0];    // 获取要清除的图形的html标签
          console.log("要清除的标签元素：", clearDrawRegion);
          // clearDrawRegion.remove();
          console.log("查看上次绘制的图形是否清除", clearDrawRegion);
          oAddRegion.style.display = "none";     // 关闭新增弹出框
        }

        // 点击绘制弹出框按钮保存所做的操作
        var oShowPicture = document.getElementById("showPicture");
        var oShowRegionName = document.getElementById("showRegionName");
        // var oRegionName = document.getElementById("regionName");
        var oGetPoints = document.getElementById("getPoints");
        var oRegionUserType = document.getElementById("regionUserType");
        $("#saveDrawing").click(function () {
          oShowPicture.style.display = "block";
          oAddRegion.style.display = "none";
          oShowRegionName.value = oRegionName.value;       // 赋值给显示信息页面
          // 获取到顶点的坐标
          for (var i = 0; i < overlays.length; i++) {
            var originalArr = overlays[i].getPath();
            var newArr = [];
            originalArr.map(val => {
              newArr.push({"longitude": val.lng, "latitude": val.lat});
            })
            console.log("修改后的", newArr);
            console.log("最终需要的数组对象格式：", JSON.stringify(newArr));
            oGetPoints.value = JSON.stringify(newArr);
          }
          PrtScn("#container");     // 截取区域
          let oRegionType = document.getElementById("selRegionType").value;
          if (oRegionType == "1") {                       // 将用户级别赋值给显示页面
            oRegionUserType.value = "共享"
          } else if (oRegionType == "0") {
            oRegionUserType.value = "私有"
          }
        })
        // xx关闭按钮触发所做的操作
        $(".closeRegionName").click(function () {
          for (var i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
          }
          overlays.length = 0;
          oThumbnail.innerHTML = "";
          oRegionName.value = "";
          var clearDrawRegion = document.getElementsByClassName("scaleImg")[0];    // 获取要清除的图形的html标签
          console.log("要清除的标签元素：", clearDrawRegion);
          // clearDrawRegion.remove();
          console.log("查看上次绘制的图形是否清除", clearDrawRegion);
          $("#addRegion").hide();
        })
        // ajax校验用户输入的区域名称是否存在
        var oTipMessage = document.getElementById("tipMessage");
        $("#regionName").blur(function () {
          var name = this.value;
          $.ajax({
            type: 'get',
            url: '/api/monitorRegion/checkName',                    // 接口暂无
            data: name,
            success: function (res) {
              console.log("后台返回的数据", res);
              var isExist = res.isExist;                           // res.xx现随机写,届时根据后台返回的实际值为准。
              console.log("这是啥？", isExist);
              if (isExist) {
                oTipMessage.innerText = "该区域名已占用!"
                oTipMe00ssage.style.color = "red";
              } else {
                oTipMessage.innerText = "该区域名可使用!"
                oTipMessage.style.color = 'green';
              }
            },
            error: function (err) {
              // 测试提示消息是否添加成功
              oTipMessage.innerText = "该区域名可使用!";
              oTipMessage.style.color = 'green';
              console.log("服务器开小差了,请稍后再试!", err);        // 路书
            }
          })
        })

        // 19.单击缩略图实现方法的功能
        function ZoomControlScaleImg() {
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(240, 80);
        }

        ZoomControlScaleImg.prototype = new BMap.Control();
        ZoomControlScaleImg.prototype.initialize = function (map) {
          var div = document.createElement('div');
          div.innerHTML = `<div id="bigImgContainer" style="width: 900px;height: 450px;display: none;background-color: #fff;border:2px solid #9133ff;border-radius: 10px;box-shadow: #666 4px 8px 8px 10px"></div>`
          map.getContainer().appendChild(div);
          return div;
        }
        var myZoomCtrlScaleImg = new ZoomControlScaleImg();
        map.addControl(myZoomCtrlScaleImg);

        /*
         * 以下为根据点聚合在地图上展示获取到后台的态势点位  点聚合markers 将后台返回的点全部显示在前端页面上
         **/

        // 定义用到的全局变量
        let markersAirLine = [];    // 点聚合集合
        let markerCluster;
        getAirLinePoints();

        // 获取地图上的航线数据
        function getAirLinePoints(search = "", isFirst = true) {
          $.ajax({
            type: "post",
            url: "/api/xxx/xxx/xxx",        // 接口暂无
            data: {
              search: search
            },
            dataType: 'json',
            success: function (data) {
              if (isFirst) {
                generateAirLineMakers(data)  // 查询全部
              } else {
                // 清除所有标注
                for (var i = 0; i < markersAirLine.length; i++) {
                  map.removeOverlay(markersAirLine[i])
                }
                // 清除所有聚合
                markerCluster.removeMarkers(markersAirLine);
                markersAirLine.splice(0, markersAirLine.length);
                generateAirLineMakers(data);
              }
            },
            error(err) {
              console.log("查询数据失败,请稍后再试", err);
            }
          })
        }

        // 生成Marker
        function generateAirLineMakers(data) {
          $.each(data, function (i, itemList) {
            $.each(itemList, function (k, item) {
              var point = new BMap.Point(item.longitude, item.latitude);
              var maker = new BMap.Marker(point);
              addClickHanderAirLine(maker, item.id);     // 添加点击事件
              markersAirLine.push(maker);       // 把所有的marker坐标放到一个数组中，用于添加点聚合
            })
          })
          markerClusterAirLine();               // 调用点聚合方法
        }

        // 航线点聚合(附带添加标注)
        function markerClusterAirLine() {
          markerCluster = new BMapLib.MarkerClusterer(map, {markers: markerCluster});
          markerCluster.setMinClusterSize(5);   // 设置单个聚合的最小数量
        }

        // 标注单击事件
        function addClickHanderAirLine(marker, AirLineId) {
          marker.addEventListener("click", function (e) {
            openInfoAirLine(e, AirLineId)
          })
        }

        // 单击之后的信息窗口
        function openInfoAirLine(e, AirLineId) {
          $.ajax({
            url: '/api/xxx/xxx',        // 点击聚合点显示消息弹出框   接口未定
            type: 'post',
            data: {Id: AirLineId},
            dataType: 'json',
            success: function (data) {
              var optsAirLine = {
                // ...    此处为信息窗口显示的信息
              }
              var p = e.target;
              var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
              var infoWindow = new BMap.InfoWindow(data.Name, optsAirLine);
              map.openInfoWindow(infoWindow, point);
            }
          })
        }

        /*
         * 根据后台返回的点位 绘制出航线  在前端页面展示
         **/

        // 从后台拿到一段时间内的点位,放到一空数组中
        getAirLinePointsArr();

        function getAirLinePointsArr() {      // 获取后台请求的数据
          $.ajax({
            type: "get",
            /* url: "/api/xxx/xxx/xxx",*/      // 获取生成航线的点的坐标  接口未定
            url: 'static/data.json',           // 模拟本地的json数据
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            success: function (data) {
              console.log("获取的json格式数据", data);
              var tractPoint = [];
              for (let i = 0; i < data.length; i++) {
                tractPoint.push(new BMap.Point(data[i].longitude, data[i].latitude));
                console.log("tractPoint是啥？", tractPoint);
              }

              map.centerAndZoom(tractPoint[0], 6);

              var polyline = new BMap.Polyline(tractPoint, {
                strokeColor: '#ad2529',
                strokeWeight: 3,
                strokeOpacity: 1,
              })
              map.addOverlay(polyline);

              // 根据经纬度坐标计算绽放级别
              function getZoom(maxLng, minLng, maxLnt, minLat) {
                var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"];
                var pointA = new BMap.Point(maxLng, maxLnt);
                var pointB = new BMap.Point(minLng, minLat);
                var distance = map.getDistance(pointA, pointB).toFixed(1);
                for (let i = 0; i < zoom.length; i++) {
                  if (zoom[i] - distance < 0) {
                    return 18 - i + 3  // 之所以会多3， 是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3
                  }
                }
              }

              function setZoom(points) {
                if (points.length > 0) {
                  var maxLng = points[0].lng;
                  var minLng = points[0].lng;
                  var maxLat = points[0].lat;
                  var minLat = points[0].lat;
                  var res;
                  for (var i = points.length - 1; i >= 0; i--) {
                    res = points[i];
                    if (res.lng > maxLng) maxLng = res.lng;
                    if (res.lng < minLng) minLng = res.lng;
                    if (res.lat > maxLat) maxLat = res.lat;
                    if (res.lat < minLat) minLat = res.lat;
                  }
                  var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
                  var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
                  var zoom = getZoom(maxLng, minLng, maxLat, minLat);
                  map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
                } else {
                  // 没有坐标，显示全中国
                  map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5);
                }
              }

              setZoom(data);
            },
            error(err) {
              console.log("获取点位失败", err);
            }
          })
        }
      },
      unfoldDialog() {
        var oRunBox = document.getElementsByClassName("runbox")[0];
        var oCloseRun = document.getElementsByClassName("closeRun")[0];
        var oUnfold = document.getElementById("unfold");
        oUnfold.onclick = function () {
          if (oRunBox.style.display == 'none') {
            oRunBox.style.display = 'block';
          } else {
            oRunBox.style.display = "none";
          }
        }
        oCloseRun.onclick = function () {
          oRunBox.style.display = "none";
        }
      },
      showRel() {
        var oShowRelBtn = document.getElementById("showRel");
        var oRelbox = document.getElementById("relbox");
        var oCloseRel = document.getElementsByClassName('closeRel')[0];
        var that = this;
        oShowRelBtn.onclick = function () {
          that.$router.push('/currentstationmap');
          oRelbox.style.display = 'block';
          // 实时态势信息列表(table)数据的获取
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
        }
        oCloseRel.onclick = function () {
          oRelbox.style.display = "none";
        }
      },
      showPreResult() {
        var oPreRes = document.getElementById("preRes");
        var oPrebox = document.getElementById("prebox");
        var oClosePre = document.getElementsByClassName("closePreRes")[0];
        var oPrefly = document.getElementById("prefly");
        oPreRes.onclick = function () {
          oPrebox.style.display = "block";
          oPrefly.style.display = "block";
          // 获取关联分析的表格列表数据
          $.ajax({
            type: 'get',
            // url: "/api/xxxxx/xxxx/xxx/x/x/x/x/x/x",    // 获取关联分析的表格数据请求API
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
        }
        oClosePre.onclick = function () {
          oPrebox.style.display = "none";
          oPrefly.style.display = "none";
        }
      },
      // 点击关联分析打开弹出框
      showAnalyzeBox() {
        var oAnalyzebtn = document.getElementById("analyzebtn");
        var oAnalyzeBox = document.getElementById("analyzebox");
        var oCloseAnalyze = document.getElementsByClassName('closeanalyze')[0];
        var oRelfly = document.getElementById("relfly");
        oAnalyzebtn.onclick = function () {
          oAnalyzeBox.style.display = "block";
          oRelfly.style.display = "block";

          // 获取关联分析弹框的表格数据
          $.ajax({
            type: 'get',
            //  url: '/api/xxx/xxx/x/x/x/x',    // 获取关联分析弹框的表格数据请求API====================================
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
        }
        oCloseAnalyze.onclick = function () {
          oAnalyzeBox.style.display = 'none';
          oRelfly.style.display = 'none';
        }
      },
      showFixWrap() {
        var oOpenfix = document.getElementById("openfix");
        var oFixwrap = document.getElementById("fixwrap");
        var oCloseFix = document.getElementsByClassName("closefix")[0];
        var oFixfly = document.getElementById("fixfly");
        oOpenfix.onclick = function () {
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
        }
        oCloseFix.onclick = function () {
          oFixwrap.style.display = "none";
          oFixfly.style.display = "none";
        }
      },
      // input获取到光标显示,失去光标隐藏
      openSearchBox() {
        var oInput = document.getElementById("sole-input1");
        var oSearch = document.getElementById("search1");
        var oCloseSearch = document.getElementById("closeSearch");
        oInput.onfocus = function () {
          oSearch.style.display = "block"
          $.ajax({
            type: 'get',
            // url: '/api/xxxxx/xxxx/xxxx',       // 地图左上角搜索框的table列表数据请求API
            url: 'static/searchTable.json',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
              console.log("后台返回的table列表数据", data);
              for (let i in data) {
                let str = `
                  <tr style="text-align: center;font-size: 12px">
                    <td>${data[i].name}</td>
                    <td>${data[i].type}</td>
                    <td>${data[i].message}</td>
                  </tr>
                `
                $(".searchTableList tbody").append(str)
              }
            },
            error(err) {
              console.log('获取列表数据失败,请稍后再试！', err);
            }
          })
        }
        oCloseSearch.onclick = function () {
          oSearch.style.display = 'none';
        }
      },
      // 预警通报弹出框
      openEarlying() {
        var oEarlying = document.getElementById("earlying");
        var oEarlyingbox = document.getElementById("earlyingbox");
        var oCloseEarlyBox = document.getElementById("closeEarlyBox");
        var oAlarmfly = document.getElementById("alarmfly");
        oEarlying.onclick = function () {
          oEarlyingbox.style.display = "block";
          oAlarmfly.style.display = "block";
        }
        oCloseEarlyBox.onclick = function () {
          oEarlyingbox.style.display = "none";
          oAlarmfly.style.display = "none";
        }
      },
      openSituation() {
        var oSituation = document.getElementById("situation");
        var oSituationBox = document.getElementsByClassName("situationbox")[0];
        var oCloseSituation = document.getElementById("closeSituation");
        var oSituationfly = document.getElementById("situationfly");
        oSituation.onclick = function () {
          oSituationBox.style.display = "block";
          oSituationfly.style.display = "block";
          // 获取态势生成的表格数据
          $.ajax({
            type: 'get',
            url: '/api/xxxx/xxx/xxx/xxx/x',    // 获取态势生成的弹出框中表格中数据的获取
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
              console.log("获取态势生成弹框中表格数据", data);
            },
            error(err) {
              //  alert("获取态势生成列表数据失败！", err)
            }
          })
          // 获取态势生成弹框列表中信号类型的数据----------------------------------------------
          let oSituationSignalType = document.getElementById("situationSignalType");
          oSituationSignalType.onchange = function () {
            $.ajax({
              type: 'get',
              url: '/api/xxxx/xxx/x/x/x/x',    // 获取态势生成弹框信号类型的数据请求API------------------
              contentType: 'application/json;charset=utf-8',
              dataType: 'json',
              success: function (data) {
                console.log("获取态势生成弹框中信号类型的数据", data);
              },
              error(err) {
                // alert("获取态势生成信号类型数据失败！", err);
              }
            })
          }
        }

        oCloseSituation.onclick = function () {
          oSituationBox.style.display = "none";
          oSituationfly.style.display = "none";
        }
      },
      // btn按钮事件
      handleBtn() {
        var oOpenBtns = document.getElementById("openBtns");
        var oCloseBtns = document.getElementById("closeBtns")
        var oBtns = document.getElementById("btns");
        var oLis = document.querySelectorAll("#btns > ul > li");
        for (let i = 0; i < oLis.length; i++) {
          oLis[i].onclick = function () {
            for (let j = 0; j < oLis.length; j++) {
              oLis[j].classList.remove('active');
            }
            this.classList.add('active');
          }
        }
        oOpenBtns.onclick = function () {
          oBtns.style.display = "block";
          oOpenBtns.style.display = "none";
        }
        oCloseBtns.onclick = function () {
          oBtns.style.display = "none";
          oOpenBtns.style.display = "block";
        }
      },
      // 方法一实现截图
      screenshot() {
        $("#screenshot").click(function (e) {
          e.preventDefault();
          html2canvas($("#container"), {
            useCORS: true,
            foreignObjectRendering: true,        // 浏览器支持的情况下使用foreignObject模式渲染图片
            allowTaint: false,                   // 允许跨域数据污染
            taintTest: true,
            onrendered: function (canvas) {
              // 获取到截取带的图片
              var timestamp = Date.parse(new Date());
              console.log("canvas图片base64:", canvas.toDataURL());
              //把截取到的图片替换到a标签的路径下载
              $("#down1").attr('href', canvas.toDataURL());
              //下载下来的图片名字
              $("#down1").attr('download', timestamp + '.jpg');
              document.body.appendChild(canvas);
            },
          })
        });
      },
      // 方法二实现截屏
      // 图跨域及图片模糊处理
      shotimage() {
        $("#screenshot").click(function (e) {
          e.preventDefault();
          let canvasContent = document.getElementById("container"),
            width = canvasContent.clientWidth,
            height = canvasContent.clientHeight,
            canvas = document.createElement("canvas"),
            scale = 1.2;
          canvas.width = width * scale;
          canvas.height = height * scale;
          canvas.style.width = canvasContent.clientWidth * scale + "px";
          canvas.style.height = canvasContent.clientHeight * scale + "px";
          canvas.getContext("2d").scale(scale, scale);
          // opts配置
          let opts = {
            scale: scale,
            canvas: canvas,
            width: width,
            height: height,
            useCORS: true,                       // 跨域
            logging: false,                      // 记录
            foreignObjectRendering: true,        // 浏览器支持的情况下使用foreignObject模式渲染图片
            allowTaint: false,                   // 允许跨域数据污染
            taintTest: true,                     // 污染测试
          }

          let oContainer = document.getElementById("container");
          html2canvas(oContainer, opts).then(function (canvas) {

            console.log("Base64图片", canvas.toDataURL());

            var timestamp = Date.parse(new Date());

            $("#down1").attr('href', canvas.toDataURL());
            //下载下来的图片名字
            $("#down1").attr('download', timestamp + '.jpg');

            document.body.appendChild(canvas);
          })
        })
      }
    },
    mounted() {
      this.initMap();
    }
  };
</script>


