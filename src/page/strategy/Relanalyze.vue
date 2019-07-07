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
          <el-button type="primary" @click="addAnalyzeVisible=true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="relAnayzeSearchValue" @keyup.enter.native="search" style="width: 330px;" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------关联分析策略列表-------------------------------------------------------------->
    <el-table :data="relanalyzeData" highlight-current-row border :v-loading="listLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="name" label="名称" min-width="110" align="center" sortable></el-table-column>
      <el-table-column prop="radius" label="半径/Km" min-width="110" align="center" sortable></el-table-column>
      <el-table-column prop="analyzeinterval" label="分析时间间隔(/min)" align="center" min-width="110" sortable></el-table-column>
      <el-table-column prop="checkinterval" label="检查时间间隔(/min)" align="center" min-width="110" sortable></el-table-column>
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
    <el-dialog title="编辑关联分析信息" :visible.sync="editAnalyzeVisible" width="30%" :close-on-click-modal="false">
      <el-form v-model="editRelAnalyze" label-width="140px" :rules="addFormRules" ref="editRelAnalyze" style="margin-left: 25px;">
        <el-form-item label="名称">
          <el-input style="width: 72%;" v-model="editRelAnalyze.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="半径/Km">
          <el-input style="width: 72%;" v-model="editRelAnalyze.radius" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分析时间间隔(/min)">
          <el-input-number style="width: 72%;" v-model="editRelAnalyze.analyzeinterval" controls-position="right" :min="1" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="检查时间间隔(/min)">
          <el-input-number style="width: 72%;" v-model="editRelAnalyze.checkinterval" controls-position="right" :min="1" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editRelAnalyze.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAnalyzeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加关联分析策略信息" :visible.sync="addAnalyzeVisible" :close-on-click-modal="false" width="32%">
      <el-form v-model="addRelAnalyze" label-width="140px" :rules="addFormRules" ref="addRelAnalyze" style="margin-left: 25px;">
        <el-form-item label="名称">
          <el-input style="width: 72%;" v-model="addRelAnalyze.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="半径/Km">
          <el-input style="width: 72%;" v-model="addRelAnalyze.radius" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分析时间间隔(/min)">
          <el-input-number style="width: 72%;" v-model="addRelAnalyze.analyzeinterval" controls-position="right" :min="1" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="检查时间间隔(/min)">
          <el-input-number style="width: 72%;" v-model="addRelAnalyze.checkinterval" controls-position="right" :min="1" :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addRelAnalyze.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addAnalyzeVisible = false">取消</el-button>
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
        <p style="margin: 15px 0 0 10px;">请输入关联分析名称进行删除确认。</p>
        <el-input v-model="relAnalyzeNameInput" @change="changeRelAnalyzeNameInput" style="width: 210px;margin: 15px 0 10px 0;"/>
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
    name: 'Relanalyze',
    data() {
      return {
        relanalyzeData: [],
        relAnalyzeNameInput: "",
        relAnayzeSearchValue: "",
        all: "全部",
        clickRowData: {},
        editRelAnalyze: {},
        total: 0,
        current: 0,
        pageSize: 0,
        listLoading: false,
        editLoading: false,
        addLoading: false,
        delLoading: false,
        addAnalyzeVisible: false,
        editAnalyzeVisible: false,
        delDialog: false,
        delStatus: false,
        btnDisabled: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addRelAnalyze: {
          name: '',
          radius: '',
          analyzeinterval: '',
          checkinterval: '',
          type: ''
        },
      }
    },
    methods: {
      // 获取关联分析列表信息
      getRelAnalyzeList() {
        this.relanalyzeData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$RelAanalyze_API.list, requestValue, res => {
          console.log("返回关联分析列表数据", res);
          if (res.status == 200) {
            this.relanalyzeData = res.data.value;
            this.total = res.data.page.total;
            this.listLoading = false;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '获取关联分析列表失败'
            })
          }
        })
      },
      // 添加关联分析信息
      addSubmit() {
        let relanalyzeJson = JSON.stringify(this.addRelAnalyze);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: relanalyzeJson,
        }
        console.log("添加的字段", relanalyzeJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$RelAanalyze_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addRelAnalyze"].resetFields();
            this.addAnalyzeVisible = false;
            this.getRelAnalyzeList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addRelAnalyze"].resetFields();
            this.addAnalyzeVisible = false;
          }
        });
      },
      // 更新关联分析信息
      editSubmit() {
        let relanalyzeJson = JSON.stringify(this.editRelAnalyze);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: relanalyzeJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$RelAanalyze_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["editRelAnalyze"].resetFields();
            this.editAnalyzeVisible = false;
            this.btnDisabled = true;
            this.getRelAnalyzeList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.$refs["editRelAnalyze"].resetFields();
            this.editAnalyzeVisible = false;
          }
        });
      },
      // 删除关联分析信息
      del() {
        this.delLoading = true;
        let relAnalyzeId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${relAnalyzeId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$RelAanalyze_API.delete, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.relAnalyzeNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getRelAnalyzeList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.relAnalyzeNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      // 搜索关联分析信息
      search() {
        this.relanalyzeData = [];
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.relAnayzeSearchValue
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
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$RelAanalyze_API.mapSearch, requestValue, res => {
          console.log("搜索返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.relanalyzeData = res.data.value;
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
        this.editAnalyzeVisible = true;
        this.editRelAnalyze = Object.assign({}, this.clickRowData)
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        this.getRelAnalyzeList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("EarlyWarning", this.current, this.pageSize);
        this.getRelAnalyzeList(this.current, this.pageSize);
      },
      // 删除确认
      changeRelAnalyzeNameInput() {
        if (this.relAnalyzeNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.relAnalyzeNameInput = '';
        this.delStatus = false;
      },
      refresh() {
        this.relAnayzeSearchValue = '',
          this.getRelAnalyzeList();
      },
      // 改变新增弹出框的type值  0:私有,用户组独立访问  1:共享,所有用户都可访问
      changeType(val) {
        if (val === "1") {
          this.addRelAnalyze.type = val;
        } else if (val === "0") {
          this.addRelAnalyze.type = val;
        }
      },
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
      this.getRelAnalyzeList();
    }
  }
</script>

<style scoped>

</style>
