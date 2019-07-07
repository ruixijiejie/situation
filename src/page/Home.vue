<template>
  <div>
    <div id="container"></div>
    <searchBox/>
    <btnsMap/>
    <tooldropdown :drawPictureParams="map" :parentMethod="showPrtScnDialogEvent"/>
    <prtscndialog :showPrtScn="showPrtScnDialog" @on-closePrtScnDialog="closePrtScnDialog"/>
  </div>
</template>

<script>
  import btnsMap from './bmap_dialog/btnsMap'
  import tooldropdown from './bmap_dialog/dropDown'
  import searchBox from './bmap_dialog/searchBox'
  import prtscndialog from './bmap_dialog/prtScnDialog'

  export default {
    name: "Home",
    components: {btnsMap, tooldropdown, searchBox, prtscndialog},
    data() {
      return {
        showPrtScnDialog: false,
        img: '',
        map: ""
      }
    },
    methods: {
      initMap() {
        this.map = new BMap.Map('container', {minZoom: 5, maxZoom: 6});
        let point = new BMap.Point(116.404, 39.915);
        this.map.setDefaultCursor("default");
        this.map.centerAndZoom(point, 5);
        this.map.enableScrollWheelZoom(true)

        let bs = this.map.getBounds();
        let bssw = bs.getSouthWest();
        let bssh = bs.getNorthEast();

        let b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bssh.lng, bssh.lat))
        try {
          BMapLib.AreaRestriction.setBounds(this.map, b);
        } catch (e) {
        }
      },
      closePrtScnDialog(newVal) {
        this.showPrtScnDialog = newVal;
      },
      showPrtScnDialogEvent() {
        this.showPrtScnDialog = true;
      },
    },
    mounted() {
      this.initMap();
    }
  }
</script>

<style>

</style>
