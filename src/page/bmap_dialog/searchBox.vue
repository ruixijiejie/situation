<template>
  <div class="seachWrap">
    <div style="margin-left:5px;">
      <Input @on-focus="showSearchBox" v-model="Serachvalue" class="inputSty"
             placeholder="请输入搜索内容">
        <Button slot="append" icon="ios-search" @click="hideSearchBox"></Button>
      </Input>
    </div>
    <div class="searchBox">
      <Form ref="earlyWarningForm" :model="searchForm" :label-width="75">
        <div style="display:flex">
          <div style="width:50%">
            <FormItem style="margin-top: 3%;" label="开始时间">
              <DatePicker style="width:90%" type="datetime" placeholder="请选择开始日期"
                          v-model="searchForm.startTime"
                          @on-change="changeSearchBox_startDate">
              </DatePicker>
            </FormItem>
            <FormItem label="筛选">
              <Input type="text" style="width: 90%;" placeholder="请输入筛选内容"
                     v-model="filterContent"></Input>
            </FormItem>
          </div>
          <div style="width:50%">
            <FormItem style="margin-top: 3%;" label="结束时间">
              <DatePicker style="width:90%" type="datetime" placeholder="请选择结束日期"
                          v-model="searchForm.endTime"
                          @on-change="changeSearchBox_endDate">
              </DatePicker>
            </FormItem>
          </div>
        </div>
      </Form>
      <Table style="margin-left: 3%;" border size="small" width="460" disabled-hover highlight-row
             :columns="seachBoxColumns" :data="seachBoxList">

      </Table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "searchBox",
    data() {
      return {
        Serachvalue: "",
        filterContent: "",
        seachBoxList: [],
        searchForm: {
          starttime: "",
          endtime: ""
        },
        seachBoxColumns: [
          {title: '名称', align: "center", key: "tarNam", minWidth: 100, tooltip: true},
          {title: '类型', align: "center", key: "corNum", minWidth: 100, tooltip: true},
          {title: '信息量', align: "center", key: "tarStaStaTim", minWidth: 100, tooltip: true}
        ]
      }
    },
    methods: {
      changeSearchBox_startDate(date) {
        this.searchForm.starttime = date;
      },
      changeSearchBox_endDate(date) {
        this.searchForm.endtime = date;
      },
      showSearchBox() {
        let oSearchBox = document.getElementsByClassName("searchBox")[0];
        oSearchBox.style.display = 'block'
      },
      hideSearchBox() {
        let oSearchBox = document.getElementsByClassName("searchBox")[0];
        oSearchBox.style.display = 'none'
      }
    },
    mounted() {

    }
  }
</script>

<style>
  .inputSty {
    width: 500px;
  }

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

  .searchBox {
    width: 500px;
    height: 300px;
    background-color: #fff;
    border-radius: 7px;
    margin-left: 4px;
    margin-top: 5px;
    display: none;
  }

  .seachWrap {
    position: absolute;
    top: 8%;
    left: 1%;
  }
</style>
