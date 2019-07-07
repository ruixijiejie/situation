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
          <el-button type="primary" :disabled="btnDisabled" @click="handleEdit">编辑
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSituationVisible=true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="situationSearchValue" @keyup.enter.native="search" style="width: 330px;"
                    placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------态势生成列表-------------------------------------------------------------->
    <el-table :data="situationData" highlight-current-row border :v-loading="listLoading" size="mini"
              @row-click="rowClick">
      <el-table-column prop="name" label="态势名称" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="begintime" label="开始时间" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="endtime" label="结束时间" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="punums" label="PU号" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="feqbegin" label="起始频点/KHz(0-3000)" align="center" min-width="120"
                       sortable></el-table-column>
      <el-table-column prop="fegend" label="结束频点/KHz(0-3000)" align="center" min-width="120" sortable></el-table-column>
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
    <el-dialog title="编辑策略预警信息" :visible.sync="editSituationVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="editSituation" label-width="200px" :rules="addFormRules" ref="editSituation"
               style="margin-left: -20px;">
        <el-form-item label="态势名称">
          <el-input style="width: 72%" v-model="editSituation.name" auto-complete="off"
                    placeholder="请输入态势名称"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker style="width: 72%;" v-model="editSituation.begintime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择开始日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker style="width: 72%;" v-model="editSituation.endtime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择结束日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="PU号">
          <el-select style="width: 52%;" multiple v-model="editSituation.punums" placeholder="请选择PU号" auto-complete="off" @visible-change="showPUList">
            <el-option v-for="item in punumsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="addPuDialog=true">新增</el-button>
        </el-form-item>
        <el-form-item label="起始频点/KHz(0-3000)">
          <el-input-number v-model="editSituation.feqbegin" style="width: 72%;" controls-position="right"
                           placeholder="请输入起始频点/KHz(0-3000)" :min="0" :max="3000"></el-input-number>
        </el-form-item>
        <el-form-item label="结束频点/KHz(0-3000)">
          <el-input-number v-model="editSituation.fegend" style="width: 72%;" controls-position="right"
                           placeholder="请输入结束频点/KHz(0-3000)" :min="0" :max="3000"
                           auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editSituation.type" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSituationVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加态势生成策略信息" :visible.sync="addSituationVisible" :close-on-click-modal="false" width="32%">
      <el-form v-model="addSituation" label-width="200px" :rules="addFormRules" ref="addSituation"
               style="margin-left: -20px;">
        <el-form-item label="态势名称">
          <el-input style="width: 72%" v-model="addSituation.name" auto-complete="off" placeholder="请输入态势名称"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker style="width: 72%;" v-model="addSituation.begintime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择开始日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker style="width: 72%;" v-model="addSituation.endtime" type="datetime" size="mini"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择结束日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="PU号">
          <el-select style="width: 52%;" multiple v-model="addSituation.punums" placeholder="请选择PU号" auto-complete="off" @visible-change="showPUList">
            <el-option v-for="item in punumsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="addPuDialog=true">新增</el-button>
        </el-form-item>
        <el-form-item label="起始频点/KHz(0-3000)">
          <el-input-number v-model="addSituation.feqbegin" style="width: 72%;" controls-position="right"
                           placeholder="请输入起始频点/KHz(0-3000)" :min="0" :max="3000"></el-input-number>
        </el-form-item>
        <el-form-item label="结束频点/KHz(0-3000)">
          <el-input-number v-model="addSituation.fegend" style="width: 72%;" controls-position="right"
                           placeholder="请输入结束频点/KHz(0-3000)" :min="0" :max="3000"
                           auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addSituation.type" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addSituationVisible = false">取消</el-button>
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
        <p style="margin: 15px 0 0 10px;">请输入态势名称进行删除确认。</p>
        <el-input v-model="situationNameInput" @change="changesituationNameInput"
                  style="width: 210px;margin: 15px 0 10px 0;"/>
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
    name: 'targetstituation',
    data() {
      return {
        situationData: [],
        punumsList: [],
        situationNameInput: "",
        situationSearchValue: "",
        all: "全部",
        clickRowData: {},
        editSituation: {},
        total: 0,
        current: 0,
        pageSize: 0,
        listLoading: false,
        editLoading: false,
        addLoading: false,
        delLoading: false,
        addSituationVisible: false,
        editSituationVisible: false,
        delDialog: false,
        addPuDialog: false,
        delStatus: false,
        btnDisabled: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addSituation: {
          name: '',
          begintime: '',
          endtime: '',
          punums: '',
          feqbegin: '',
          fegend: '',
          type: '',
        },
        addPunums: {
          punums: ''
        }
      }
    },
    methods: {
      // 获取态势生成列表
      getSituationList() {
        this.situationData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$situation_API.list, requestValue, res => {
          console.log("返回态势生成列表数据", res);
          if (res.status == 200) {
            this.situationData = res.data.value;
            this.total = res.data.page.total;
            this.listLoading = false;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '获取态势生成列表失败'
            })
          }
        })
      },
      // 添加态势生成信息
      addSubmit() {
        let situationJson = JSON.stringify(this.addSituation);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: situationJson,
        }
        console.log("添加的字段", situationJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$situation_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addSituation"].resetFields();
            this.addSituationVisible = false;
            this.getSituationList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addSituation"].resetFields();
            this.addSituationVisible = false;
          }
        });
      },
      editSubmit() {
        let situationJson = JSON.stringify(this.editSituation);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: situationJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$situation_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["editSituation"].resetFields();
            this.editSituationVisible = false;
            this.btnDisabled = true;
            this.getSituationList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.$refs["editSituation"].resetFields();
            this.editSituationVisible = false;
          }
        });
      },
      del() {
        this.delLoading = true;
        let situationId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${situationId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$situation_API.delete, requestValue, res => {
          console.log(res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.situationNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getSituationList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.situationNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      search() {
        this.situationData = [];
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.situationSearchValue
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
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$situation_API.mapSearch, requestValue, res => {
          console.log("搜索返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.situationData = res.data.value;
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
      // 显示编辑弹出框
      handleEdit() {
        this.editSituationVisible = true;
        this.editSituation = Object.assign({}, this.clickRowData);
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("Targetsituation", this.current, this.pageSize);
        this.getSituationList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("Targetsituation", this.current, this.pageSize);
        this.getSituationList(this.current, this.pageSize);
      },
      // 删除确认
      changesituationNameInput() {
        if (this.situationNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.situationNameInput = '';
        this.delStatus = false;
      },
      cancelAddPuDialog() {
        this.addPuDialog = false;
        this.addPunums.punums = ""
      },
      refresh() {
        this.situationSearchValue = '',
          this.getSituationList();
      },
      // 改变用户级别 0: 私有,用户组独立访问 1：共享,所有用户都可以访问
      changeType(val) {
        if (val === "1") {
          this.addSituation.type = val;
        } else if (val === "0") {
          this.addSituation.type = val;
        }
      },
      // 下拉显示PU列表
      showPUList() {
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.PULIST, this.$situation_API.puList, requestValue, res => {
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
      // 新增PU号
      addPu() {
        this.punumsList = [];
        let puJson = JSON.stringify(this.addPunums);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: puJson,
        }
        console.log("添加的字段", puJson);
        this.$sendRequest2Server(this.$OptType.ADDPU, this.$situation_API.addPu, requestValue, res => {
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
      this.getSituationList();
    }
  }
</script>

<style scoped>

</style>
