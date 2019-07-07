<template>
  <div>
    <Modal title='添加监控区域' v-model="monitorDialog" width='400' draggable @on-cancel="cancel">
      <Form ref="situationGenmapForm" :model="prtScnForm" :label-width="100">
        <div style="display:flex">
          <div style="width:50%">
            <FormItem label="区域名称">
              <Input type="text" style="width: 200%;" placeholder="请输入监控区域名称" v-model="prtScnForm.name"></Input>
            </FormItem>
            <FormItem label="用户级别">
              <Select style="width: 200%;" v-model="prtScnForm.type" placeholder="请选择用户级别">
                <Option v-for="item in userTypeOptions" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem label="缩略图">
              <img v-model="prtScnForm.thumbanail" class="preview-img" preview="0" :src="imgSrc" height="100">
            </FormItem>
          </div>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {clearAllOverlays} from "../api_map/baidu_map_api";

  export default {
    name: "prtScnDialog",
    props: {
      showPrtScn: Boolean,
      drawPictureParams: "",
    },
    data() {
      return {
        bmap: "",
        monitorDialog: false,
        prtScnForm: {
          name: "",
          type: "",
          thumbanail: ""
        },
        userTypeOptions: [
          {value: '0', label: '共享'},
          {value: '1', label: '私有'}
        ],
        imgSrc: 'https://placekitten.com/600/400',
      }
    },
    methods: {
      cancel() {
        this.$emit('on-closePrtScnDialog', false);
        clearAllOverlays(this.bmap)
      }
    },
    watch: {
      showPrtScn(newVal) {
        this.monitorDialog = newVal;
      },
      drawPictureParams(newVal) {
        this.bmap = newVal;
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>

</style>
