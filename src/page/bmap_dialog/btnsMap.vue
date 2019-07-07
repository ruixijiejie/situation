<template>
  <div>
    <el-button class="tool" @click="showBtns" circle></el-button>
    <div class="showBtn" style="display: flex;display: none">
      <el-button @click="clickOne" :class="isActive1?'one':'oneActive'" circle></el-button>
      <el-button @click="clickTwo" :class="isActive2?'two':'twoActive'" circle></el-button>
      <el-button @click="clickthree" :class="isActive3?'three':'threeActive'" circle></el-button>
      <el-button @click="clickFour" :class="isActive4?'four':'fourActive'" circle></el-button>
      <el-button @click="clickFive" :class="isActive5?'five':'fiveActive'" circle></el-button>
      <el-button @click="clickSix" :class="isActive6?'six':'sixActive'" circle></el-button>
      <el-button @click="clickSeven" class="seven"></el-button>
    </div>
    <currentsituationdialog :showDialog1="showDialog1" @on-close1="closeDialog1"/>
    <earlywarningdialog :showDialog2="showDialog2" @on-close2="closeDialog2"/>
    <situationgendialog :showDialog3="showDialog3" @on-close3="closeDialog3"/>
    <fixstationdialog :showDialog4="showDialog4" @on-close4="closeDialog4"/>
    <relanalyzedialog :showDialog5="showDialog5" @on-close5="closeDialog5"/>
    <preresultdialog :showDialog6="showDialog6" @on-close6="closeDialog6"/>
  </div>
</template>

<script>
  import currentsituationdialog from './currentSituationDialog'
  import earlywarningdialog from './earlyWarningDialog'
  import situationgendialog from './situationGenDialog'
  import fixstationdialog from './fixStationDialog'
  import relanalyzedialog from './relAnalyzeDialog'
  import preresultdialog from './preResultDialog'

  export default {
    name: "btnsMap",
    components: {
      currentsituationdialog,
      earlywarningdialog,
      situationgendialog,
      fixstationdialog,
      relanalyzedialog,
      preresultdialog
    },
    data() {
      return {
        isActive1: true,
        isActive2: true,
        isActive3: true,
        isActive4: true,
        isActive5: true,
        isActive6: true,
        showDialog1: false,
        showDialog2: false,
        showDialog3: false,
        showDialog4: false,
        showDialog5: false,
        showDialog6: false
      }
    },
    methods: {
      showBtns() {
        let oShowBtn = document.getElementsByClassName("showBtn")[0];
        let oTool = document.getElementsByClassName("tool")[0];
        oShowBtn.style.display = "block";
        oTool.style.display = "none";
      },
      clickOne() {
        this.isActive1 = false;
        this.isActive2 = true;
        this.isActive3 = true;
        this.isActive4 = true;
        this.isActive5 = true;
        this.isActive6 = true;
        this.showDialog1 = true;
        this.showDialog2 = false;
        this.showDialog3 = false;
        this.showDialog4 = false;
        this.showDialog5 = false;
        this.showDialog6 = false;
      },
      closeDialog1(newVal) {
        this.showDialog1 = newVal;
      },
      clickTwo() {
        this.isActive2 = false;
        this.isActive1 = true;
        this.isActive3 = true;
        this.isActive4 = true;
        this.isActive5 = true;
        this.isActive6 = true;
        this.showDialog2 = true;
        this.showDialog1 = false;
        this.showDialog3 = false;
        this.showDialog4 = false;
        this.showDialog5 = false;
        this.showDialog6 = false;
      },
      closeDialog2(newVal) {
        this.showDialog2 = newVal;
      },
      clickthree() {
        this.isActive3 = false;
        this.isActive2 = true;
        this.isActive1 = true;
        this.isActive4 = true;
        this.isActive5 = true;
        this.isActive6 = true;
        this.showDialog3 = true;
        this.showDialog1 = false;
        this.showDialog2 = false;
        this.showDialog4 = false;
        this.showDialog5 = false;
        this.showDialog6 = false;
      },
      closeDialog3(newVal) {
        this.showDialog3 = newVal;
      },
      clickFour() {
        this.isActive4 = false;
        this.isActive2 = true;
        this.isActive3 = true;
        this.isActive1 = true;
        this.isActive5 = true;
        this.isActive6 = true;
        this.showDialog4 = true;
        this.showDialog1 = false;
        this.showDialog3 = false;
        this.showDialog2 = false;
        this.showDialog5 = false;
        this.showDialog6 = false;
      },
      closeDialog4(newVal) {
        this.showDialog4 = newVal;
      },
      clickFive() {
        this.isActive5 = false;
        this.isActive2 = true;
        this.isActive3 = true;
        this.isActive4 = true;
        this.isActive1 = true;
        this.isActive6 = true;
        this.showDialog5 = true;
        this.showDialog1 = false;
        this.showDialog3 = false;
        this.showDialog4 = false;
        this.showDialog2 = false;
        this.showDialog6 = false;
      },
      closeDialog5(newVal) {
        this.showDialog5 = newVal;
      },
      clickSix() {
        this.isActive6 = false;
        this.isActive2 = true;
        this.isActive3 = true;
        this.isActive4 = true;
        this.isActive5 = true;
        this.isActive1 = true;
        this.showDialog6 = true;
        this.showDialog1 = false;
        this.showDialog3 = false;
        this.showDialog4 = false;
        this.showDialog5 = false;
        this.showDialog2 = false;
      },
      closeDialog6(newVal) {
        this.showDialog6 = newVal;
      },
      clickSeven() {
        let oShowBtn = document.getElementsByClassName("showBtn")[0];
        let oTool = document.getElementsByClassName("tool")[0];
        oShowBtn.style.display = "none";
        oTool.style.display = "block";
      }
    },
    mounted() {
      this.initMap();
    }
  }
</script>

<style>
  .el-button--small.is-circle {
    width: 100px;
    height: 100px;
    background: url("../../assets/img/功能键.png");
  }

  .el-button {
    border: none;
  }
</style>
<style scoped>
  .one, .two, .three, .four, .five, .six, .oneActive, .twoActive, .threeActive, .fourActive, .fiveActive, .sixActive {
    width: 60px;
    height: 60px;
  }

  .one {
    background: url("../../assets/img/组-10.png") no-repeat;
  }

  .two {
    background: url("../../assets/img/组-11.png") no-repeat;
  }

  .three {
    background: url("../../assets/img/18-1.png") no-repeat;
  }

  .four {
    background: url("../../assets/img/组-12.png") no-repeat;
  }

  .five {
    background: url("../../assets/img/组-13.png") no-repeat;
  }

  .six {
    background: url("../../assets/img/组-14.png") no-repeat;
  }

  .seven {
    width: 15px;
    height: 15px;
    background: url("../../assets/img/关闭.png") no-repeat;
    position: absolute;
    bottom: 73%;
    left: 100%;
  }

  .oneActive {
    background: url("../../assets/img/组-9.png") no-repeat;
  }

  .twoActive {
    background: url("../../assets/img/组-11-拷贝.png") no-repeat;
  }

  .threeActive {
    background: url("../../assets/img/18.png") no-repeat;
  }

  .fourActive {
    background: url("../../assets/img/组-12-拷贝.png") no-repeat;
  }

  .fiveActive {
    background: url("../../assets/img/组-13-拷贝.png") no-repeat;
  }

  .sixActive {
    background: url("../../assets/img/组-14-拷贝.png") no-repeat;
  }

  .tool {
    position: absolute;
    left: 50%;
    bottom: 3%;
  }

  .showBtn {
    position: absolute;
    left: 35%;
    bottom: 5%;
  }
</style>
