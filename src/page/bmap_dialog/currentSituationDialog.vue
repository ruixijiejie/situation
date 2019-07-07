<template>
  <div>
    <Modal title='信息列表' v-model="currentsituationDialog" width='800' draggable  @on-cancel="cancel">
      <div slot="footer"></div>
      <Table border size="small" disabled-hover highlight-row :columns="currentsituationColumns"
             :data="currentsituationList">

      </Table>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "currentSituationDialog",
    props: {
      showDialog1: Boolean
    },
    data() {
      return {
        currentsituationList: [],
        currentsituationDialog: false,
        currentsituationColumns: [
          {title: '目标名称', align: "center", key: "123", minWidth: 100, tooltip: true},
          {title: '最后发现时间', align: "center", key: "456", minWidth: 100, tooltip: true},
        ],
      }
    },
    methods: {
      cancel() {
        this.$emit('on-close1', false)
      }
    },
    watch: {
      showDialog1(newVal) {
        this.currentsituationDialog = newVal;
      }
    },
    mounted() {

    }
  }
</script>

<style>
  .ivu-form-item {
    margin-bottom: 10px;
    vertical-align: top;
    zoom: 1;
  }

  .ivu-modal-footer {
    border-top: none;
    padding: 12px 18px 12px 18px;
    text-align: right;
  }
</style>
