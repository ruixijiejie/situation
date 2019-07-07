<template>
  <section>
    <!----------------------------------------------------工具条------------------------------------------------------------->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <i style="display: inline-block;font-size: 25px;color: green;margin-top: 3px;" class="el-icon-refresh"
             title="刷新" @click="refresh"></i>
        </el-form-item>
        <el-form-item>
          <el-select v-model="all" style="width: 100px;" placeholder="请选择">
            <el-option value="全部">全部</el-option>
            <el-option value="系统">系统</el-option>
            <el-option value="单位">单位</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :disabled="btnDisabled" @click="delDialog=true">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnDisabled" @click="handleEdit">编辑</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="fixalarmSearchValue" @keyup.enter.native="search" style="width: 330px;"
                    placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------网台通联异常策略列表-------------------------------------------------------------->
    <el-table :data="fixAlarmData" highlight-current-row border :loading="listLoading" size="mini"
              @row-click="rowClick">
      <el-table-column prop="name" label="策略名称" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="radius" label="异常半径(0-100千米)" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="limitvalue" label="信号频点门限(0-100)" align="center" min-width="120"
                       sortable></el-table-column>
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
    <el-dialog title="编辑策略预警信息" :visible.sync="editFixAlarmVisible" width="30%" :close-on-click-modal="false">
      <el-form v-model="editFixAlarm" label-width="150px" :rules="addFormRules" ref="editAlarm"
               style="margin-left: 45px;">
        <el-form-item label="策略名称">
          <el-input style="width: 72%;" v-model="editFixAlarm.name" placeholder="请输入策略名称"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="异常半径(0-100千米)">
          <el-input-number style="width: 72%;" placeholder="请输入异常半径(0-100千米)" auto-complete="off"
                           v-model="editFixAlarm.radius" controls-position="right" :min="0"
                           :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="信号频点门限(0-100)">
          <el-input-number style="width: 72%;" placeholder="请输入信号频点门限" auto-complete="off"
                           v-model="editFixAlarm.limitvalue" controls-position="right" :min="0"
                           :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editFixAlarm.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFixAlarmVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加策略预警信息" :visible.sync="addFixAlarmVisible" :close-on-click-modal="false" width="32%">
      <el-form v-model="addFixAlarm" label-width="150px" :rules="addFormRules" ref="addFixAlarm"
               style="margin-left: 30px;">
        <el-form-item label="策略名称">
          <el-input style="width: 72%;" v-model="addFixAlarm.name" placeholder="请输入策略名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="异常半径(0-100千米)">
          <el-input-number style="width: 72%;" placeholder="请输入异常半径(0-100千米)" auto-complete="off"
                           v-model="addFixAlarm.radius" controls-position="right" :min="0"
                           :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="信号频点门限(0-100)">
          <el-input-number style="width: 72%;" placeholder="请输入信号频点门限" auto-complete="off"
                           v-model="addFixAlarm.limitvalue" controls-position="right" :min="0"
                           :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addFixAlarm.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFixAlarmVisible = false">取消</el-button>
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
        <p style="margin: 15px 0 0 10px;">请输入网台通联异常策略名称进行删除确认。</p>
        <el-input v-model="fixalarmNameInput" @change="changeFixAlarmNameInput"
                  style="width: 210px;margin: 15px 0 10px 0;"/>
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
        fixAlarmData: [],
        clickRowData: {},
        editFixAlarm: {},
        fixalarmNameInput: "",
        fixalarmSearchValue: "",
        all: "全部",
        total: 0,
        current: 0,
        pageSize: 0,
        listLoading: false,
        editLoading: false,
        addLoading: false,
        delLoading: false,
        addFixAlarmVisible: false,
        editFixAlarmVisible: false,
        delDialog: false,
        delStatus: false,
        btnDisabled: true,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addFixAlarm: {
          name: '',
          radius: '',
          limitvalue: '',
          type: ''
        },
      }
    },
    methods: {
      // 获取网台通联异常列表
      getFixAlarmList() {
        this.fixAlarmData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$stgCmctAlarm_API.list, requestValue, res => {
          console.log("返回网台通联预警列表数据", res);
          if (res.status == 200) {
            this.fixAlarmData = res.data.value;
            this.total = res.data.page.total;
            this.listLoading = false;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '获取预警策略列表失败'
            })
          }
        })
      },
      // 添加网台通联异常信息
      addSubmit() {
        let fixalarmJson = JSON.stringify(this.addFixAlarm);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: fixalarmJson,
        }
        console.log("添加的字段", fixalarmJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$stgCmctAlarm_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addFixAlarm"].resetFields();
            this.addFixAlarmVisible = false;
            this.getFixAlarmList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addFixAlarm"].resetFields();
            this.addFixAlarmVisible = false;
          }
        });
      },
      // 更新网台通联异常信息
      editSubmit() {
        let fixalarmJson = JSON.stringify(this.editFixAlarm);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: fixalarmJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$stgCmctAlarm_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["editAlarm"].resetFields();
            this.editFixAlarmVisible = false;
            this.btnDisabled = true;
            this.getFixAlarmList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.editFixAlarmVisible = false;
          }
        });
      },
      // 删除网台通联异常信息
      del() {
        this.delLoading = true;
        let fixalarmStationId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${fixalarmStationId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$stgCmctAlarm_API.delete, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.fixalarmNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getFixAlarmList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.fixalarmNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      // 搜索望台通联预警信息
      search() {
        this.fixAlarmData = [];
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.fixalarmSearchValue
        }]
        let JsonParam = `[${JSON.stringify(search_one)}]`;
        console.log("JsonParams", JsonParam)
        let search_params = JSON.stringify(JsonParam);
        console.log("search params", search_params);
        let url_params = `current=${this.current}&pageSize=${this.pageSize}`;
        let requestValue = {
          urlParamers: url_params,
          bodyParamers: search_params
        }
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$stgCmctAlarm_API.mapSearch, requestValue, res => {
          console.log("搜索返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.fixAlarmData = res.data.value;
            this.total = res.data.page.total;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '搜索失败'
            })
          }
        })
        this.listLoading = false;
      },
      // 显示新增弹出框
      handleAdd() {
        this.addFixAlarmVisible = true;
      },
      // 显示编辑弹出框
      handleEdit() {
        this.editFixAlarmVisible = true;
        this.editFixAlarm = Object.assign({}, this.clickRowData);
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
      },
      // 删除确认
      changeFixAlarmNameInput() {
        if (this.fixalarmNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        this.getFixAlarmList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        this.getFixAlarmList(this.current, this.pageSize);
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.fixalarmNameInput = '';
        this.delStatus = false;
      },
      refresh() {
        this.fixalarmSearchValue = '',
          this.getFixAlarmList();
      },
      changeType(val) {
        if (val === "1") {
          this.addFixAlarm.type = val;
        } else if (val === "0") {
          this.addFixAlarm.type = val;
        }
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
      this.getFixAlarmList();
    }
  }
</script>

<style scoped>

</style>
