<template>
  <section>
    <!----------------------------------------------------工具条------------------------------------------------------------->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <i style="display: inline-block;font-size: 25px;color: green;margin-top: 3px;" class="el-icon-refresh"
             title="刷新"></i>
        </el-form-item>
        <el-form-item>
          <el-button type="danger">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">编辑
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="alarmSearchValue" @keyup.enter.native="search" style="width: 330px;" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------策略预警列表-------------------------------------------------------------->
    <el-table :data="alarmData" highlight-current-row border :v-loading="listLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="region" label="区域" width="205" sortable></el-table-column>
      <el-table-column prop="time" label="时间段" width="270" sortable></el-table-column>
      <el-table-column prop="signaltype" label="信号类型" width="270" sortable></el-table-column>
      <el-table-column prop="pu" label="PU号" width="270" sortable></el-table-column>
    </el-table>
    <!-------------------------------------------------------分页------------------------------------------------------------->
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
    <!---------------------------------------------------- 编辑弹出框 ----------------------------------------------------------->
    <el-dialog title="编辑策略预警信息" :visible.sync="editAlarmVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="editAlarm" label-width="80px" :rules="addFormRules" ref="editAlarm" style="margin-left: 45px;">
        <el-form-item label="区域">
          <el-input v-model="editAlarm.region" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间段">
          <el-input v-model="editAlarm.time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="信号类型">
          <el-input v-model="editAlarm.signaltype" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="PU号">
          <el-input v-model="editAlarm.pu" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAlarmVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加策略预警信息" :visible.sync="addAlarmVisible" :close-on-click-modal="false" width="32%">
      <el-form :model="addAlarm" label-width="80px" :rules="addFormRules" ref="addAlarm">
        <el-form-item label="区域">
          <el-input v-model="addAlarm.region" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间段">
          <el-input v-model="addAlarm.time" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="信号类型">
          <el-input v-model="addAlarm.signaltype" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="PU号">
          <el-input v-model="addAlarm.pu" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addAlarmVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--------------------------------------------------------删除弹出框------------------------------------------------------------>
    <el-dialog :visible.sync="delDialog" width="20%" @close="cancelDelDialog">
      <p style="color:#f60;text-align:center;margin-top: -10px;">
        <i class="el-icon-warning"></i>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p style="margin: 15px 0 0 10px;">请输入网台名称进行删除确认。</p>
        <el-input v-model="fixNameInput" @change="changeFixNameInput" style="width: 210px;margin: 15px 0 10px 0;"/>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="cancelDelDialog">取消</el-button>
        <el-button type="danger" :disabled="delStatus? false : true" :loading='delLoading' @click='del'>确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'EarlyWarning',
    data() {
      return {
        alarmData: [],
        fixNameInput: "",
        alarmSearchValue: "",
        clickRowData: {},
        total: 0,
        current: 0,
        pageSize: 0,
        editAlarm: {},
        listLoading: false,
        editLoading: false,
        addLoading: false,
        delLoading: false,
        addAlarmVisible: false,
        editAlarmVisible: false,
        delDialog: false,
        delStatus: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addAlarm: {
          region: '',
          time: '',
          signaltype: '',
          pu: ''
        },
      }
    },
    methods: {
      addSubmit() {

      },
      editSubmit() {

      },
      del() {

      },
      search() {

      },
      // 点击行时启用编辑
      rowClick(row) {
        /*this.btnDisabled = false
        this.clickRowData = row;
        this.fixId = row.id;*/
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        //
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        //
      },
      changeFixNameInput() {
        if (this.fixNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      cancelDelDialog() {

      }
    },
    mounted() {
      let pageSetting = this.$getPageSetting("EarlyWarning");
      if (pageSetting != '') {
        this.pageSize = pageSetting.pageSize;
        this.current = pageSetting.current;
      } else {
        this.pageSize = 10;
        this.current = 1;
      }
      //
    }
  }
</script>

<style scoped>

</style>
