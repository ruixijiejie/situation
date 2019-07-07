<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app',
  }

</script>
<style lang="scss">
  @import "./assets/css/main.css";
  /*@import "./assets/css/color-dark.css";*/
  /*深色主题*/
  @import "assets/css/theme-blue/color-blue.css"; /*浅蓝色主题*/
</style>
