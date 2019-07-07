<template>
  <div class="tooldropdown">
    <el-dropdown>
      <el-button type="primary">
        工具箱<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <p @click="drawRegion">绘制区域</p>
        </el-dropdown-item>
        <el-dropdown-item>
          <p @click="setRegion">设置区域</p>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {drawPicture} from "../api_map/baidu_map_api";

  export default {
    name: "dropDown",
    props: {
      drawPictureParams: "",
      parentMethod: {
        type: Function,
        default: null
      }
    },
    data() {
      return {
        bmap: "",
      }
    },
    methods: {
      drawRegion() {
       if (this.parentMethod) {
         drawPicture(this.bmap, this.parentMethod);
       }
      },
      setRegion() {
        alert("fdjsogjd")
      }
    },
    watch: {
      drawPictureParams(newVal) {
        this.bmap = newVal;
      }
    }
  }
</script>

<style>
  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .tooldropdown {
    position: absolute;
    right: 2%;
    top: 8%;
  }
</style>
