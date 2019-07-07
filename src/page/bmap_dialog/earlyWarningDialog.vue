<template>
  <div>
    <Modal title='预警' v-model="earlyWarningDialog" width='800' draggable @on-cancel="cancel">
      <Form ref="earlyWarningForm" :model="earlyWarningForm" :label-width="100">
        <div style="display:flex">
          <div style="width:50%">
            <FormItem label="信号类型">
              <Select style="width: 70%;" v-model="earlyWarningForm.signalType" placeholder="请选择信号类型">

              </Select>
            </FormItem>
            <FormItem label="开始时间">
              <DatePicker style="width:70%" type="datetime" placeholder="请选择态势生成开始日期"
                          v-model="earlyWarningForm.startTime"
                          @on-change="changeEarlyWarning_startDate">
              </DatePicker>
            </FormItem>
            <FormItem label="频点">
              <Input type="text" style="width: 70%;" placeholder="请输入频点(KHz)"
                     v-model="earlyWarningForm.pindian"></Input>
            </FormItem>
          </div>
          <div style="width:50%">
            <FormItem label="PU号">
              <Input type="text" style="width: 70%;" placeholder="请输入PU号"
                     v-model="earlyWarningForm.pu"></Input>
            </FormItem>
            <FormItem label="结束时间">
              <DatePicker style="width:70%" type="datetime" placeholder="请选择态势生成结束日期"
                          v-model="earlyWarningForm.endTime"
                          @on-change="changeEarlyWarning_endDate">
              </DatePicker>
            </FormItem>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button class="current" type="primary">实时</Button>
        <Button class="search" type="primary">搜索</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "earlyWarningDialog",
    props: {
      showDialog2: Boolean
    },
    data() {
      return {
        earlyWarningDialog: false,
        earlyWarningForm: {
          signalType: "",
          pu: "",
          startTime: "",
          endTime: "",
          pindian: ""
        }
      }
    },
    methods: {
      changeEarlyWarning_startDate(date) {
        this.earlyWarningForm.startTime = date;
      },
      changeEarlyWarning_endDate(date) {
        this.earlyWarningForm.endTime = date;
      },
      cancel() {
        this.$emit('on-close2', false);
      }
    },
    watch: {
      showDialog2(newVal) {
        this.earlyWarningDialog = newVal;
      }
    }
  }
</script>

<style scoped>
  .ivu-modal-footer {
    border-top: 1px solid #e8e8e8;
    padding: 12px 18px 12px 18px;
    text-align: right;
  }
</style>
