<template>
  <div>
    <Modal title='网台管理' v-model="fixStationDialog" width='800' draggable @on-cancel="cancel">
      <Form ref="fixStationmapForm" :model="fixStationForm" :label-width="100">
        <div style="display:flex">
          <div style="width:50%">
            <!-- <div class="titleLabel">选填项：</div>-->
            <FormItem style="margin-left: -15%;">
              <Radio label="国别">
                <span>国别</span>
              </Radio>
              <Select style="width: 58%;" v-model="fixStationForm.country" placeholder="请选择国别">
                <Option value='-1'>全部</Option>
              </Select>
            </FormItem>
            <p style="width: 180%;height: 1px;background-color: #ccc;margin-left: 8%;"></p>
            <FormItem label="开始时间" style="margin-top: 3%;">
              <DatePicker style="width:70%" type="datetime" placeholder="请选择网台开始日期"
                          v-model="fixStationForm.startTime"
                          @on-change="changeFixStation_startDate">
              </DatePicker>
            </FormItem>
          </div>
          <div style="width:50%">
            <!-- <div class="titleLabel">必填项：</div>-->
            <FormItem style="margin-left: -20%;">
              <Radio label="区域绘制">
                <span>区域绘制</span>
              </Radio>
              <img style="position: absolute;left: 22%;top: 25%;" src="../../assets/img/作图-能选.png" alt="">
              <p style="position: absolute;left: 30%;top: 1%;">作图</p>
              <img style="position: absolute;left: 42%;top: 25%;" src="../../assets/img/清除-选中.png" alt="">
              <p style="position: absolute;left: 50%;top:-3%;">清除</p>
              <Button style="position: absolute;left: 75%;top: 5%;" type="primary" size="small">确定</Button>
            </FormItem>
            <FormItem label="结束时间" style="margin-top: 5%;margin-right: 10%;">
              <DatePicker style="width:70%" type="datetime" placeholder="请选择网台开始日期"
                          v-model="fixStationForm.endTime"
                          @on-change="changeFixStation_endDate">
              </DatePicker>
              <Button style="position: absolute;left: 80%;top: 15%;" type="primary" size="small">搜索</Button>
            </FormItem>
          </div>
        </div>
      </Form>
      <div slot="footer"></div>
      <Table border size="small" disabled-hover highlight-row :columns="fixStationColumns" :data="fixStationList">

      </Table>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: "fixStationDialog",
    props: {
      showDialog4: Boolean
    },
    data() {
      return {
        fixStationDialog: false,
        fixStationForm: {
          country: "",
          startTime: "",
          endTime: "",
        },
        fixStationList: [],
        fixStationColumns: [
          {title: '名称', align: "center", key: "123", minWidth: 100, tooltip: true},
          {title: '经纬度', align: "center", key: "456", minWidth: 100, tooltip: true},
          {title: '使用', align: "center", key: "789", minWidth: 100, tooltip: true},
        ]
      }
    },
    methods: {
      changeFixStation_startDate(date) {
        this.fixStationForm.startTime = date;
      },
      changeFixStation_endDate(date) {
        this.fixStationForm.endTime = date;
      },
      cancel() {
        this.$emit('on-close4', false)
      }
    },
    watch: {
      showDialog4(newVal) {
        this.fixStationDialog = newVal
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
