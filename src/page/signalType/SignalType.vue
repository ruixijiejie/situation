<template>
  <section>
    <!----------------------------------------工具条-------------------------------->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <i style="display: inline-block;font-size: 25px;color: green;margin-top: 3px;" class="el-icon-refresh"
             title="刷新"></i>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :disabled="btnDisabled" @click="delDialog=true">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSignalTypeDialog=true">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!----------------------------------信号类型列表-------------------------------------->
    <el-table :data="signalTypeTableData" highlight-current-row border :v-loading="signalTypeListLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="name" label="信号名称" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="value" label="信号类型值" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="dsrc" label="描述" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
    </el-table>
    <!-------------------------------------分页-------------------------------------------->
    <div class="Pagination">
      <el-pagination @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     :current-page="current"
                     :page-sizes="[10,20,30,40]"
                     :page-size="pageSize"
                     :total="total"
                     layout="total,sizes,prev, pager, next"
                     style="float:right;">
      </el-pagination>
    </div>
    <!------------------------------------新增弹出框---------------------------------------->
    <el-dialog title="添加信号类型信息" :visible.sync="addSignalTypeDialog" :close-on-click-modal="false" width="32%">
      <el-form v-model="addSignalType" label-width="80px" ref="addSignalTypeForm"
               style="margin-left: 45px;">
        <el-form-item label="信号名称">
          <el-input style="width: 72%;" v-model="addSignalType.name" prop="name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="取值">
          <el-input style="width: 72%;" v-model="addSignalType.value" prop="value"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input style="width: 72%" v-model="addSignalType.dsrc" prop="dsrc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addSignalTypeDialog = false">取消</el-button>
        <el-button type="primary" @click.native="addSignalTypeSubmit" :loading="addSignalTypeLoading">确定</el-button>
      </div>
    </el-dialog>
    <!-----------------------------------删除信号类型----------------------------------------->
    <el-dialog :visible.sync="delDialog" width="20%" @close="cancelDelDialog">
      <p style="color:#f60;text-align:center;margin-top: -10px;">
        <i class="el-icon-warning"></i>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p style="margin: 15px 0 0 10px;">请输入信号名称进行删除确认。</p>
        <el-input v-model="signalTypeNameInput" @change="changeSignalTypeInput"
                  style="width: 210px;margin: 15px 0 10px 0;"/>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="cancelDelDialog">取消</el-button>
        <el-button type="danger" :disabled="delStatus? false : true" :loading='delLoading' @click='delSignalType'>确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: "SignalType",
    data() {
      return {
        signalTypeTableData: [],
        current: 0,
        pageSize: 0,
        total: 0,
        signalTypeNameInput: "",
        btnDisabled: true,
        addSignalTypeDialog: false,
        delDialog: false,
        delStatus: false,
        signalTypeListLoading: false,
        addSignalTypeLoading: false,
        delLoading: false,
        clickRowData: {},
        addSignalType: {
          name: "",
          value: "",
          dsrc: ""
        }
      }
    },
    methods: {
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("SignalType", this.current, this.pageSize);
        this.getSignalTypeList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("SignalType", this.current, this.pageSize);
        this.getSignalTypeList(this.current, this.pageSize);
      },
      rowClick(row) {
        this.btnDisabled = false;
        this.clickRowData = row;
      },
      changeSignalTypeInput() {
        if (this.signalTypeNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.signalTypeNameInput = '';
        this.delStatus = false;
      },
      // 获取信号类型列表
      getSignalTypeList() {
        this.signalTypeListLoading = true;
        let params = `current=${0}&pageSize=${10}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$signalType_API.list, requestValue, res => {
          console.log("信号类型数据列表", res);
          if (res.status == 200) {
            this.signalTypeTableData = res.data.value;
            this.total = res.data.page.total;
            this.signalTypeListLoading = false;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '获取信号类型失败'
            })
          }
        })
      },
      // 添加信号类型
      addSignalTypeSubmit() {
        let signalTypeJson = JSON.stringify(this.addSignalType);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: signalTypeJson
        }
        this.$sendRequest2Server(this.$OptType.ADD, this.$signalType_API.add, requestValue, res => {
          console.log("添加的返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addSignalTypeForm"].resetFields();
            this.addSignalTypeDialog = false;
            this.getSignalTypeList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.addSignalTypeDialog = false;
          }
        })
      },
      // 删除信号类型
      delSignalType() {
        this.delLoading = true;
        let signalId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${signalId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$signalType_API.delete, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.signalTypeNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getSignalTypeList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.signalTypeNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        })
      }
    },
    mounted() {
      let pageSetting = this.$getPageSetting("SignalType");
      if (pageSetting != '') {
        this.pageSize = pageSetting.pageSize;
        this.current = pageSetting.current;
      } else {
        this.pageSize = 10;
        this.current = 1;
      }
      this.getSignalTypeList();
    }
  }
</script>

<style scoped>

</style>
