<template>
  <div>
    <Modal title='态势生成' v-model="situationGenDialog" width='800' draggable @on-cancel="cancel">
      <Form ref="situationGenmapForm" :model="situationGenForm" :label-width="100">
        <div style="display:flex">
          <div style="width:50%">
            <!-- <div class="titleLabel">选填项：</div>-->
            <FormItem label="态势生成">
              <RadioGroup style="width: 80%;"
                          v-model="situationGenForm.situationGenRadio">
                <Radio label="自动">
                  <span>自动</span>
                </Radio>
                <Radio label="手动">
                  <span>手动</span>
                </Radio>
                <Radio label="人工">
                  <span>人工</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="PU号">
              <Input type="text" style="width: 70%;" placeholder="请输入PU号" v-model="situationGenForm.Pu"></Input>
            </FormItem>
            <FormItem label="开始时间">
              <DatePicker style="width:70%" type="datetime" placeholder="请选择态势生成开始日期"
                          v-model="situationGenForm.startTime"
                          @on-change="changeSituationGen_startDate">
              </DatePicker>
            </FormItem>
            <FormItem label="测向站">
              <Select style="width: 70%;" v-model="situationGenForm.cexiang" placeholder="请选择信号类型">

              </Select>
            </FormItem>
          </div>
          <div style="width:50%">
            <!-- <div class="titleLabel">必填项：</div>-->
            <FormItem label="信号类型">
              <Select style="width: 70%;" v-model="situationGenForm.signalType" placeholder="请选择信号类型">

              </Select>
            </FormItem>
            <FormItem label="频点">
              <Input type="text" style="width: 70%;" placeholder="请输入频点(KHZ)"
                     v-model="situationGenForm.carrCenFreq"></Input>
            </FormItem>
            <FormItem label="结束时间">
              <DatePicker style="width:70%" type="datetime" placeholder="请选择态势生成结束日期"
                          v-model="situationGenForm.endTime"
                          @on-change="changeSituationGen_endDate">
              </DatePicker>
            </FormItem>
            <FormItem label="测向站数">
              <InputNumber style="width:70%;" v-model.trim="situationGenForm.counts" placeholder="请填写测向站数量"/>
            </FormItem>
            <FormItem>
              <Button @click="getSituationGenList" style="margin-left: 60%;" type="primary">生成</Button>
            </FormItem>
          </div>
        </div>
      </Form>
      <div slot="footer"></div>
      <Table border size="small" disabled-hover highlight-row :columns="situationGenColumns" :data="situationGenList" @on-row-click="clickRowData">

      </Table>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: "situationGenDialog",
    props: {
      showDialog3: Boolean
    },
    data() {
      return {
        situationGenDialog: false,
        situationGenForm: {
          situationGenRadio: "",
          signalType: "",
          carrCenFreq: "",
          Pu: "",
          startTime: "",
          endTime: "",
          cexiang: "",
          counts: ""
        },
        clickRow: {},
        situationGenList: [],
        situationGenColumns: [
          {title: '目标名称', align: "center", key: "tarNam", minWidth: 100, tooltip: true},
          {title: '交汇数', align: "center", key: "corNum", minWidth: 100, tooltip: true},
          {title: '态势开始时间', align: "center", key: "tarStaStaTim", minWidth: 100, tooltip: true},
          {title: '态势结束时间', align: "center", key: "tarStaEndTim", minWidth: 100, tooltip: true},
        ]
      }
    },
    methods: {
      changeSituationGen_startDate(date) {
        this.situationGenForm.startTime = date;
      },
      changeSituationGen_endDate(date) {
        this.situationGenForm.endTime = date;
      },
      clickRowData(row) {
        this.clickRow = row;
      },
      cancel() {
        this.$emit('on-close3', false)
      },
      getSituationGenList() {
        let params = {
          searchType: 1,
          delflydotexEnable: 0,
          trackprocEnable: 1,
          fuzzyMatch: 0,
          allShow: 0,
          withTimeZone: 1,
          signalType: -1,
          puNum: "NTM123",
          freq: 32.56,
          startTimeStr: "2019-06-26 14:08:34",
          endTimeStr: "2019-06-26 16:08:34",
          dfStation: {
            name: "城阳",
            unitid: "JN",
            siteid: "CY"
          },
          leastCrossStaCunt: 5
        }
        let url_params = `current=${0}&pageSize=${10}`;
        let requestValue = {
          urlParamers: url_params,
          bodyParamers: JSON.stringify(params)
        }
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$situationGen_API.search, requestValue, res => {
          console.log("态势生成列表数据", res);
          this.situationGenList = res.data.value;
          this.getPointsById();
        })
      },
      getPointsById() {
        this.$axios.get('/api/situationGen/getCrossPoints', {params: {tsid: 1}}).then(res => {
          console.log("态势生成点位数据", res);
        })
      }
    },
    watch: {
      showDialog3(newVal) {
        this.situationGenDialog = newVal;
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
