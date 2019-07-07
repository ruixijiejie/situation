// 绘制markers
const drawMarkers = function (source, points, icon, infoWindows) {
  let markers = new BMap.Marker(points, {icon: icon});
  source.addOverlay(markers);
  markers.addEventListener('mouseover', function () {
    source.openInfoWindow(infoWindows, points)
  })
}

// 字符串操作
const getCircleArea = function (points) {
  let index = points.indexOf("},");
  let firstPoint = "," + points.substring(1, index + 1) + "]";
  points = points.replace("]", "");
  points = points + firstPoint;
  return points;
}

// 绘制区域
const loadArea = function (source, points) {
  let AreaArr = [];
  for (let i = 0; i < points.length; i++) {
    let baiduPoint = new BMap.Point(points[i].longitude, points[i].latitude);
    AreaArr.push(baiduPoint);
  }
  let polyLineMonitorRegion = new BMap.Polyline(newArr, {
    strokeColor: '#ad2529',
    strokeWeight: 1,
    strokeOpacity: 1,
  })
  source.addOverlay(polyLineMonitorRegion);
}

function drawAirLine(source, type, icon, points) {
  let newArr = [];
  for (let i = 0; i < points.length; i++) {
    let baiduPoint = new BMap.Point(points[i].longitude, points[i].latitude);
    var dictmarkers = new BMap.Marker(points, {icon: icon});
    source.addOverlay(dictmarkers);
    newArr.push(baiduPoint);
  }
  let polyLineMonitorRegion = new BMap.Polyline(newArr, {
    strokeColor: '#ad2529',
    strokeWeight: 1,
    strokeOpacity: 1,
  })
  source.addOverlay(polyLineMonitorRegion);
}


const drawPicture = function (source, drawCompleteEvent) {
  let overlays = [];
  let overlaycomplete = function (e) {
    overlays.push(e.overlay);
  };
  let styleOptions = {
    strokeColor: "red",
    fillColor: "red",
    strokeWeight: 1,
    strokeOpacity: 0.6,
    fillOpacity: 0.6,
    strokeStyle: 'solid'
  }
  let drawingManager = new BMapLib.DrawingManager(source, {
    isOpen: false,
    enableDrawingTool: true,
    drawingToolOptions: {
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      offset: new BMap.Size(220, 15),
      scale: 0.6,
    },
    circleOptions: styleOptions,
    polylineOptions: styleOptions,
    polygonOptions: styleOptions,
    rectangleOptions: styleOptions
  })
  drawingManager.addEventListener('overlaycomplete', overlaycomplete);
  drawingManager.addEventListener('circlecomplete', drawCompleteEvent);
  drawingManager.addEventListener('polygoncomplete', drawCompleteEvent);
  drawingManager.addEventListener('polylinecomplete', drawCompleteEvent);
  drawingManager.addEventListener('rectanglecomplete', drawCompleteEvent);
}

// 清除覆盖物  params source:地图 overlays:覆盖物
const clearAllOverlays = function (source, overlays) {
  for (var i = 0; i < overlays.length; i++) {
    source.removeOverlay(overlays[i]);
  }
  overlays.length = 0
}

// 截图
const prtScn = function (domName) {
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
          logging: false,                       // 后台打印日志
          foreignObjectRendering: true,        // 浏览器支持的情况下使用foreignObject模式渲染图片
          allowTaint: false,                   // 允许跨域数据污染
          taintTest: true,
        }).then((cnv) => {
          let imgUrl = cnv.toDataURL("image/png");         // 将canvas转换成img的src流，  base64 ==> Arraybuffer blob
          console.log("截取图片base64:", imgUrl);

          for (let i = 0; i < nodesToRecover.length; i++) {
            nodesToRecover[i].parent.appendChild(nodesToRecover[i].child);
          }
          for (let i = 0; i < nodesToRemove.length; i++) {
            nodesToRemove[i].parent.removeChild(nodesToRemove[i].child);
          }
          resolve(imgUrl);
        });
      }
    }, 5);
  });
}
export {
  drawMarkers,
  getCircleArea,
  drawPicture,
  clearAllOverlays,
  prtScn
}
