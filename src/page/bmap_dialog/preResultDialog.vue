<template>
  <div>
    <Modal title='预测结果' v-model="preResultDialog" width='800' draggable @on-cancel="cancel">
      <div slot="footer"></div>
      <Table border size="small" disabled-hover highlight-row :columns="preResultColumns" :data="preResultList">

      </Table>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "preResultDialog",
    props: {
      showDialog6: Boolean
    },
    data() {
      return {
        preResultDialog: false,
        preResultList: [],
        preResultColumns: [
          {title: '目标名称', align: "center", key: "123", minWidth: 100, tooltip: true},
          {title: '目标经纬度', align: "center", key: "456", minWidth: 100, tooltip: true},
          {title: '几率', align: "center", key: "789", minWidth: 100, tooltip: true},
        ]
      }
    },
    methods: {
      cancel() {
        this.$emit('on-close6', false)
      }
    },
    watch: {
      showDialog6(newVal) {
        this.preResultDialog = newVal;
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
