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
          <el-input v-model="alarmSearchValue" @keyup.enter.native="search" style="width: 330px;"
                    placeholder="请输入预警策略名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------策略预警列表-------------------------------------------------------------->
    <el-table :data="alarmData" highlight-current-row border :v-loading="listLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="name" label="策略名称" align="center" min-width="110" sortable></el-table-column>
      <el-table-column prop="begintime" label="预警起始时间" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="endtime" label="预警结束时间" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="singals" label="信号类型" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="punums" label="PU号" align="center" min-width="120" sortable></el-table-column>
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
        <el-form-item label="策略名称">
          <el-input style="width: 72%;" v-model="editAlarm.name" auto-complete="off" placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item label="选择区域">
          <el-select style="width: 72%;" v-model="editAlarm.regionid" placeholder="请选择区域" @visible-change="showRegionList">
            <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker style="width: 72%;" v-model="editAlarm.begintime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择开始日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker style="width: 72%;" v-model="editAlarm.endtime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择结束日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="信号类型">
          <el-input style="width: 72%;" v-model="editAlarm.singals" auto-complete="off"
                    placeholder="请输入型号类型"></el-input>
        </el-form-item>
        <el-form-item label="PU号">
          <el-select style="width: 53%;" multiple v-model="editAlarm.punums" placeholder="请选择PU号" auto-complete="off" @visible-change="showPUList">
            <el-option v-for="item in punumsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="addPuDialog=true">新增</el-button>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editAlarm.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAlarmVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加策略预警信息" :visible.sync="addAlarmVisible" :close-on-click-modal="false" width="32%">
      <el-form v-model="addAlarm" label-width="80px" :rules="addFormRules" ref="addAlarm" style="margin-left: 45px;">
        <el-form-item label="策略名称">
          <el-input style="width: 72%;" v-model="addAlarm.name" auto-complete="off" placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item label="选择区域">
          <el-select style="width: 72%;" v-model="addAlarm.regionid" placeholder="请选择区域" @visible-change="showRegionList">
            <el-option v-for="item in regionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker style="width: 72%;" v-model="addAlarm.begintime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择开始日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker style="width: 72%;" v-model="addAlarm.endtime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择结束日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="信号类型">
          <el-input style="width: 72%;" v-model="addAlarm.singals" auto-complete="off" placeholder="请输入型号类型"></el-input>
        </el-form-item>
        <el-form-item label="PU号">
          <el-select style="width: 55%;" multiple v-model="addAlarm.punums" placeholder="请选择PU号" auto-complete="off" @visible-change="showPUList">
            <el-option v-for="item in punumsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="addPuDialog=true">新增</el-button>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addAlarm.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
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
        <p style="margin: 15px 0 0 10px;">请输入预警策略名称进行删除确认。</p>
        <el-input v-model="alarmNameInput" @change="changeAlarmNameInput" style="width: 210px;margin: 15px 0 10px 0;"/>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="cancelDelDialog">取消</el-button>
        <el-button type="danger" :disabled="delStatus? false : true" :loading='delLoading' @click='del'>确认</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------ 新增PU号-------------------------------------------------------------->
    <el-dialog title="PU号信息" :visible.sync="addPuDialog" width="20%" @close="cancelAddPuDialog">
      <el-form v-model="addPunums" label-width="60px" ref="addPU">
        <el-form-item label="PU号">
          <el-input style="width: 77%" v-model="addPunums.punums" placeholder="请填写PU号" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="cancelAddPuDialog">取消</el-button>
        <el-button type="primary" @click.native='addPu'>确认</el-button>
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
        regionList: [],
        punumsList: [],
        alarmNameInput: "",
        alarmSearchValue: "",
        AlarmId: "",
        all: "全部",
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
        addPuDialog: false,
        delStatus: false,
        btnDisabled: true,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addAlarm: {
          name: '',
          begintime: '',
          endtime: '',
          singals: '',
          punums: [],
          regionid: '112',
          type: '',
        },
        addPunums: {
          punums: ''
        }
      }
    },
    methods: {
      // 1.获取预警策略列表
      getAlarmList() {
        this.alarmData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$SignalAlarm_API.list, requestValue, res => {
          console.log("返回预警策略列表数据", res);
          if (res.status == 200) {
            this.alarmData = res.data.value;
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
      // 2.添加预警策略信息
      addSubmit() {
        for (let i = 0; i < this.addAlarm.punums.length; i++) {
          let temp = this.addAlarm.punums[i];
          console.log("单个PU号转换为字符串",temp.toString());
          let params = {
            punums: temp.toString()
          }
          console.log("处理添加多个时发送多个字符串",params);
        }
        let alarmJson = JSON.stringify(this.addAlarm);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: alarmJson,
        }
        console.log("添加的字段", alarmJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$SignalAlarm_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addAlarm"].resetFields();
            this.addAlarmVisible = false;
            this.getAlarmList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addAlarm"].resetFields();
            this.addAlarmVisible = false;
          }
        });
      },
      // 更新预警策略信息
      editSubmit() {
        let alarmJson = JSON.stringify(this.editAlarm);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: alarmJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$SignalAlarm_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["editAlarm"].resetFields();
            this.editAlarmVisible = false;
            this.btnDisabled = true;
            this.getAlarmList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.$refs["editAlarm"].resetFields();
            this.editAlarmVisible = false;
          }
        });
      },
      // 4.删除预警策略信息
      del() {
        this.delLoading = true;
        let alarmStationId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${alarmStationId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$SignalAlarm_API.delete, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.alarmNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getAlarmList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.alarmNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      // 查询预警策略信息
      search() {
        this.alarmData = [];
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.alarmSearchValue
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
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$SignalAlarm_API.mapSearch, requestValue, res => {
          console.log("搜索返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.alarmData = res.data.value;
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
      // 删除确认
      changeAlarmNameInput() {
        if (this.alarmNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      // 显示新增弹出框
      handleAdd() {
        this.addAlarmVisible = true;
      },
      // 显示编辑弹出框
      handleEdit() {
        this.editAlarmVisible = true;
        this.editAlarm = Object.assign({}, this.clickRowData);
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
        this.AlarmId = row.id;
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        this.getAlarmList(this.current, this.pageSize)
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        this.getAlarmList(this.current, this.pageSize)
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.alarmNameInput = '';
        this.delStatus = false;
      },
      cancelAddPuDialog() {
        this.addPuDialog = false;
        this.addPunums.punums = ""
      },
      refresh() {
        this.alarmSearchValue = '',
          this.getAlarmList();
      },
      // 改变新增弹出框的type值  0:私有,用户组独立访问  1:共享,所有用户都可访问
      changeType(val) {
        if (val === "1") {
          this.addAlarm.type = val;
        } else if (val === "0") {
          this.addAlarm.type = val;
        }
      },
      // 下拉显示活动区域
      showRegionList() {
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.REGIONLIST, this.$SignalAlarm_API.regionList, requestValue, res => {
          console.log("返回下拉显示活动区域列表数据", res);
          if (res.status == 200) {
            this.regionList = res.data.value;
          } else {
            this.$message({
              type: 'error',
              message: '获取活动区域列表失败'
            })
          }
        })
      },
      // 下拉显示PU列表
      showPUList() {
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.PULIST, this.$SignalAlarm_API.puList, requestValue, res => {
          console.log("返回下拉显示PU号列表数据", res);
          if (res.status == 200) {
            this.punumsList = res.data.value;
          } else {
            this.$message({
              type: 'error',
              message: '获取PU号列表失败'
            })
          }
        })
      },
      // 新增Pu号
      addPu() {
        this.punumsList = [];
        let puJson = JSON.stringify(this.addPunums);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: puJson,
        }
        console.log("添加的字段", puJson);
        this.$sendRequest2Server(this.$OptType.ADDPU, this.$SignalAlarm_API.addPu, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.punumsList = res.data.value;
            this.$refs["addPU"].resetFields();
            this.addPuDialog = false;
            this.showPUList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addPU"].resetFields();
            this.addPuDialog = false;
          }
        });
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
      this.getAlarmList();
    }
  }
</script>

<style scoped>

</style>
