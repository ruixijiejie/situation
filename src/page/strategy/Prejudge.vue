<template>
  <section>
    <!----------------------------------------------------工具条------------------------------------------------------------->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <i style="display: inline-block;font-size: 25px;color: green;margin-top: 3px;" class="el-icon-refresh"
             title="刷新" @click="refresh"></i>
          <el-form-item>
            <el-select v-model="all" style="width: 100px;" placeholder="请选择">
              <el-option value="全部">全部</el-option>
              <el-option value="系统">系统</el-option>
              <el-option value="单位">单位</el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :disabled="btnDisabled" @click="delDialog=true">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnDisabled" @click="handleEdit">编辑</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPrejudgeVisible=true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="preJudgeSearchValue" @keyup.enter.native="search" style="width: 330px;" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------预判策略列表-------------------------------------------------------------->
    <el-table :data="prejudgeData" highlight-current-row border :v-loading="listLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="name" label="预判策略名称" min-width="205" align="center" sortable></el-table-column>
      <el-table-column prop="continueday" label="监控天数/(天)" min-width="270" align="center" sortable></el-table-column>
    </el-table>
    <!-------------------------------------------------------分页------------------------------------------------------------->
    <div class="Pagination">
      <el-pagination @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     :current-page="current"
                     :page-sizes="[10,20,30,40]"
                     :page-size="pageSize"min-
                     :total="total"
                     layout="total,sizes,prev, pager, next"
                     style="float:right;">
      </el-pagination>
    </div>
    <!---------------------------------------------------- 编辑弹出框 ----------------------------------------------------------->
    <el-dialog title="编辑预判策略信息" :visible.sync="editPreJudgeVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="editPreJudge" label-width="100px" :rules="addFormRules" ref="editPreJudge" style="margin-left: 45px;">
        <el-form-item label="预判策略名称">
          <el-input style="width: 72%;" v-model="editPreJudge.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="预判范围/(天)">
          <el-input-number style="width: 72%;" placeholder="请输入预判天数(0-100)" auto-complete="off"
                           v-model="editPreJudge.continueday" controls-position="right" :min="0"
                           :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editPreJudge.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPreJudgeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!---------------------------v----------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加预判策略信息" :visible.sync="addPrejudgeVisible" :close-on-click-modal="false" width="32%">
      <el-form v-model="addPreJudge" label-width="100px" :rules="addFormRules" ref="addPreJudge" style="margin-left: 30px;">
        <el-form-item label="预判策略名称">
          <el-input style="width: 72%;" v-model="addPreJudge.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="预判范围/(天)">
          <el-input-number style="width: 72%;" placeholder="请输入预判天数(0-100)" auto-complete="off"
                           v-model="addPreJudge.continueday" controls-position="right" :min="0"
                           :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addPreJudge.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addPrejudgeVisible = false">取消</el-button>
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
        <p style="margin: 15px 0 0 10px;">请输入预判策略名称进行删除确认。</p>
        <el-input v-model="preJudgeNameInput" @change="changePreJudgeNameInput" style="width: 210px;margin: 15px 0 10px 0;"/>
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
    name: 'Prejudge',
    data() {
      return {
        prejudgeData: [],
        preJudgeNameInput: "",
        preJudgeSearchValue: "",
        all: "全部",
        clickRowData: {},
        editPreJudge: {},
        total: 0,
        current: 0,
        pageSize: 0,
        listLoading: false,
        editLoading: false,
        addLoading: false,
        delLoading: false,
        addPrejudgeVisible: false,
        editPreJudgeVisible: false,
        delDialog: false,
        delStatus: false,
        btnDisabled: true,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addPreJudge: {
          name: '',
          continueday: '',
          type: ''
        },
      }
    },
    methods: {
      // 获取预判策略列表
      getprejudgeList() {
        this.prejudgeData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$prejudge_API.list, requestValue, res => {
          console.log("返回预警策略列表数据", res);
          if (res.status == 200) {
            this.prejudgeData = res.data.value;
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
      // 添加预判策略信息
      addSubmit() {
        let prejudgeJson = JSON.stringify(this.addPreJudge);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: prejudgeJson,
        }
        console.log("添加的字段", prejudgeJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$prejudge_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addPreJudge"].resetFields();
            this.addPrejudgeVisible = false;
            this.getprejudgeList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addPreJudge"].resetFields();
            this.addPrejudgeVisible = false;
          }
        });
      },
      // 编辑预判策略列表
      editSubmit() {
        let preJudgeJson = JSON.stringify(this.editPreJudge);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: preJudgeJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$prejudge_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["editPreJudge"].resetFields();
            this.editPreJudgeVisible = false;
            this.btnDisabled = true;
            this.getprejudgeList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.$refs["editPreJudge"].resetFields();
            this.editPreJudgeVisible = false;
          }
        });
      },
      // 删除预判策略列表
      del() {
        this.delLoading = true;
        let preJudgeId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${preJudgeId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$prejudge_API.delete, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.preJudgeNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getprejudgeList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.preJudgeNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      // 查询预判策略
      search() {
        this.prejudgeData = [];
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.preJudgeSearchValue
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
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$prejudge_API.mapSearch, requestValue, res => {
          console.log("搜索返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.prejudgeData = res.data.value;
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
        this.editPreJudgeVisible = true;
        this.editPreJudge = Object.assign({}, this.clickRowData);
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("Prejudge", this.current, this.pageSize);
        this.getprejudgeList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("Prejudge", this.current, this.pageSize);
        this.getprejudgeList(this.current, this.pageSize);
      },
      changePreJudgeNameInput() {
        if (this.preJudgeNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.preJudgeNameInput = '';
        this.delStatus = false;
      },
      refresh() {
        this.preJudgeSearchValue = '',
          this.getprejudgeList();
      },
      // 改变用户级别
      changeType(val) {
        if (val === "1") {
          this.addFixAlarm.type = val;
        } else if (val === "0") {
          this.addFixAlarm.type = val;
        }
      }
    },
    mounted() {
      let pageSetting = this.$getPageSetting("Prejudge");
      if (pageSetting != '') {
        this.pageSize = pageSetting.pageSize;
        this.current = pageSetting.current;
      } else {
        this.pageSize = 10;
        this.current = 1;
      }
      this.getprejudgeList();
    }
  }
</script>

<style scoped>

</style>
