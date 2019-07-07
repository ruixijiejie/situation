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
          <el-button type="primary" @click="addNotifyVisible=true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="notifySearchValue" @keyup.enter.native="search" style="width: 330px;" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------通报策略列表-------------------------------------------------------------->
    <el-table :data="notifyData" highlight-current-row border :v-loading="listLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="name" label="通报策略名称" min-width="120" align="center" sortable></el-table-column>
      <el-table-column prop="singals" label="信号类型" min-width="120" align="center" sortable></el-table-column>
      <el-table-column prop="feqbegin" label="起始频点/KHz(0-3000)" align="center" min-width="120" sortable></el-table-column>
      <el-table-column prop="feqend" label="结束频点/KHz(0-3000)" align="center" min-width="120" sortable></el-table-column>
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
    <el-dialog title="编辑策略预警信息" :visible.sync="editNotifyVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="editNotify" label-width="160px" :rules="addFormRules" ref="editNotify" style="margin-left: 30px;">
        <el-form-item label="通报策略名称">
          <el-input style="width: 72%;" v-model="editNotify.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="信号类型">
          <el-input style="width: 72%;" v-model="editNotify.singals" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="起始频点/KHz(0-3000)">
          <el-input-number v-model="editNotify.feqbegin" style="width: 72%;" controls-position="right"
                           placeholder="请输入起始频点/KHz(0-3000)" :min="0" :max="3000"></el-input-number>
        </el-form-item>
        <el-form-item label="结束频点/KHz(0-3000)">
          <el-input-number v-model="editNotify.feqend" style="width: 72%;" controls-position="right"
                           placeholder="请输入结束频点/KHz(0-3000)" :min="0" :max="3000"
                           auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editNotify.type" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editNotifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加通报策略信息" :visible.sync="addNotifyVisible" :close-on-click-modal="false" width="32%">
      <el-form :model="addNotify" label-width="160px" :rules="addFormRules" ref="addNotify" style="margin-left: 20px;">
        <el-form-item label="通报策略名称">
          <el-input style="width: 72%;" v-model="addNotify.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="信号类型">
          <el-input style="width: 72%;" v-model="addNotify.singals" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="起始频点/KHz(0-3000)">
          <el-input-number v-model="addNotify.feqbegin" style="width: 72%;" controls-position="right"
                           placeholder="请输入起始频点/KHz(0-3000)" :min="0" :max="3000"></el-input-number>
        </el-form-item>
        <el-form-item label="结束频点/KHz(0-3000)">
          <el-input-number v-model="addNotify.feqend" style="width: 72%;" controls-position="right"
                           placeholder="请输入结束频点/KHz(0-3000)" :min="0" :max="3000"
                           auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addNotify.type" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addNotifyVisible = false">取消</el-button>
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
        <p style="margin: 15px 0 0 10px;">请输入通报策略名称进行删除确认。</p>
        <el-input v-model="notifyNameInput" @change="changeNotifyNameInput" style="width: 210px;margin: 15px 0 10px 0;"/>
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
    name: 'Bulletin',
    data() {
      return {
        notifyData: [],
        notifyNameInput: "",
        notifySearchValue: "",
        all: "全部",
        clickRowData: {},
        editNotify: {},
        total: 0,
        current: 0,
        pageSize: 0,
        listLoading: false,
        editLoading: false,
        addLoading: false,
        delLoading: false,
        addNotifyVisible: false,
        editNotifyVisible: false,
        delDialog: false,
        delStatus: false,
        btnDisabled: true,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addNotify: {
          name: '',
          singals: '',
          feqbegin: '',
          feqend: '',
          type: ''
        },
      }
    },
    methods: {
      getNotifyList() {
        this.notifyData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$notify_API.list, requestValue, res => {
          console.log("返回态势生成列表数据", res);
          if (res.status == 200) {
            this.notifyData = res.data.value;
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
      addSubmit() {
        let notifyJson = JSON.stringify(this.addNotify);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: notifyJson,
        }
        console.log("添加的字段", notifyJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$notify_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addNotify"].resetFields();
            this.addNotifyVisible = false;
            this.getNotifyList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addNotify"].resetFields();
            this.addNotifyVisible = false;
          }
        });
      },
      editSubmit() {
        let notifyJson = JSON.stringify(this.editNotify);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: notifyJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$notify_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["editNotify"].resetFields();
            this.editNotifyVisible = false;
            this.btnDisabled = true;
            this.getNotifyList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.$refs["editNotify"].resetFields();
            this.editNotifyVisible = false;
          }
        });
      },
      del() {
        this.delLoading = true;
        let notifyId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${notifyId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$notify_API.delete, requestValue, res => {
          console.log(res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.notifyNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getNotifyList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.notifyNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      search() {
        this.notifyData = [];
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.notifySearchValue
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
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$notify_API.mapSearch, requestValue, res => {
          console.log("搜索返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.notifyData = res.data.value;
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
        this.editNotifyVisible = true;
        this.editNotify = Object.assign({}, this.clickRowData);
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("Bulletin", this.current, this.pageSize);
        this.getNotifyList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("Bulletin", this.current, this.pageSize);
        this.getNotifyList(this.current, this.pageSize);
      },
      changeNotifyNameInput() {
        if (this.notifyNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      refresh() {
        this.notifySearchValue = '',
          this.getNotifyList();
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.notifyNameInput = '';
        this.delStatus = false;
      },
      // 改变用户级别 0: 私有,用户组独立访问 1：共享,所有用户都可以访问
      changeType(val) {
        if (val === "1") {
          this.addSituation.type = val;
        } else if (val === "0") {
          this.addSituation.type = val;
        }
      },
    },
    mounted() {
      let pageSetting = this.$getPageSetting("Bulletin");
      if (pageSetting != '') {
        this.pageSize = pageSetting.pageSize;
        this.current = pageSetting.current;
      } else {
        this.pageSize = 10;
        this.current = 1;
      }
      this.getNotifyList();
    }
  }
</script>

<style scoped>

</style>
