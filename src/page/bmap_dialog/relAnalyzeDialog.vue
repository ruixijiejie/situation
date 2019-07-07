<template>
  <div>
    <Modal title='当前选中目标的名称' v-model="relAnalyzeDialog" width='800' draggable @on-cancel="cancel">
      <div slot="footer"></div>
      <Table border size="small" disabled-hover highlight-row :columns="relanalyzeColumns" :data="relanalyzeList">

      </Table>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "relAnalyzeDialog",
    props: {
      showDialog5: Boolean
    },
    data() {
      return {
        relAnalyzeDialog: false,
        relanalyzeList: [],
        relanalyzeColumns: [
          {title: '目标名称', align: "center", key: "123", minWidth: 100, tooltip: true},
          {title: '目标状态', align: "center", key: "456", minWidth: 100, tooltip: true},
          {title: '时间', align: "center", key: "789", minWidth: 100, tooltip: true},
        ]
      }
    },
    methods: {
      cancel() {
        this.$emit('on-close5', false)
      }
    },
    watch: {
      showDialog5(newVsl) {
        this.relAnalyzeDialog = newVsl
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
