<template>
  <div>
    <div id="container"></div>
    <div id="btns" class="sss">
      <ul>
        <li id="showRel"></li>
        <li id="earlying"></li>
        <li id="situation"></li>
        <li id="openfix"></li>
        <li id="analyzebtn"></li>
        <li id="preRes"></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import situationGenDialog from '../bmap_dialog/situationGenDialog'

  export default {
    name: "situationGen",
    data() {
      return {}
    },
    components: {situationGenDialog},
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
      }
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

  .sss {
    z-index: 99;
    position: absolute;
    left: 200px;
    top: -150px;
  }

  #container {
    width: 1200px;
    height: 700px;
  }
</style>
