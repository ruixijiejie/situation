<template>
  <section>
    <!-----------------------------------------工具条--------------------------------->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <i style="display: inline-block;font-size: 25px;color: green;margin-top: 3px;" class="el-icon-refresh"
             title="刷新" @click="refresh"></i>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :disabled="btnDisabled" @click="delDialog=true">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnDisabled" @click="handleEdit">编辑
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="AddDictStation">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dictStationSearchValue" @keyup.enter.native="dictStationSearch" style="width: 330px;"
                    placeholder="请输入测向站名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dictStationSearch" :loading="searchLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-------------------------------------------测向站列表--------------------------------------------------->
    <el-table :data="dictdfStationData" highlight-current-row border :v-loading="dictListLoading" size="mini"
              @row-click="rowClick">
      <el-table-column prop="name" label="测向站" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="unitid" label="单位代码" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="siteid" label="阵地代码" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="longitude" label="经度" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="latitude" label="纬度" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
    </el-table>
    <!-------------------------------------------分页------------------------------------------------------->
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
    <!------------------------------------------新增弹出框--------------------------------------------------->
    <el-dialog title="添加测向站信息" :visible.sync="addDictStationDialog" :close-on-click-modal="false" width="32%">
      <el-form v-model="addDictStation" label-width="80px" :rules="addFormRules" ref="addDictStation"
               style="margin-left: 45px;">
        <el-form-item label="网台名称">
          <el-input style="width: 72%;" v-model="addDictStation.name" prop="name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input style="width: 72%;" v-model="addDictStation.longitude" prop="longitude"
                    auto-complete="off"></el-input>
          <el-tag type="danger">+东经&nbsp;&nbsp;-西经</el-tag>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input style="width: 72%" v-model="addDictStation.latitude" prop="latitude" auto-complete="off"></el-input>
          <el-tag type="danger">+北纬&nbsp;&nbsp;-南纬</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addDictStationDialog = false">取消</el-button>
        <el-button type="primary" @click.native="addDictStationSubmit" :loading="addDictLoading">确定</el-button>
      </div>
    </el-dialog>
    <!---------------------------------------------编辑弹出框-------------------------------------------------->
    <el-dialog title="添加测向站信息" :visible.sync="updateDictStationDialog" :close-on-click-modal="false" width="32%">
      <el-form v-model="updateDictStation" label-width="80px" :rules="addFormRules" ref="updateDictStation"
               style="margin-left: 45px;">
        <el-form-item label="网台名称">
          <el-input style="width: 72%;" v-model="updateDictStation.name" prop="name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input style="width: 72%;" v-model="updateDictStation.longitude" prop="longitude"
                    auto-complete="off"></el-input>
          <el-tag type="danger">+东经&nbsp;&nbsp;-西经</el-tag>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input style="width: 72%" v-model="updateDictStation.latitude" prop="latitude"
                    auto-complete="off"></el-input>
          <el-tag type="danger">+北纬&nbsp;&nbsp;-南纬</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="updateDictStationDialog = false">取消</el-button>
        <el-button type="primary" @click.native="updateDictStationSubmit" :loading="updateDictLoading">确定</el-button>
      </div>
    </el-dialog>
    <!-----------------------------------------------删除测向站-------------------------------------->
    <el-dialog :visible.sync="delDialog" width="20%" @close="cancelDelDialog">
      <p style="color:#f60;text-align:center;margin-top: -10px;">
        <i class="el-icon-warning"></i>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p style="margin: 15px 0 0 10px;">请输入测向站名称进行删除确认。</p>
        <el-input v-model="dictStationNameInput" @change="changeDictStationNameInput"
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
    name: "dictdfStation",
    data() {
      return {
        btnDisabled: true,
        dictdfStationData: [],
        dictListLoading: false,
        current: 0,
        pageSize: 0,
        total: 0,
        addDictStationDialog: false,
        updateDictStationDialog: false,
        delDialog: false,
        addDictLoading: false,
        updateDictLoading: false,
        delStatus: false,
        delLoading: false,
        searchLoading: false,
        dictStationNameInput: "",
        dictStationSearchValue: "",
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        addDictStation: {
          name: "",
          longitude: "",
          latitude: "",
        },
        updateDictStation: {},
        clickRowData: {},
      }
    },
    methods: {
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("dictdfStation", this.current, this.pageSize);
        this.getDictdfStationList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("dictdfStation", this.current, this.pageSize);
        this.getDictdfStationList(this.current, this.pageSize);
      },
      rowClick(row) {
        this.btnDisabled = false;
        this.clickRowData = row;
      },
      changeDictStationNameInput() {
        if (this.dictStationNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.dictStationNameInput = '';
        this.delStatus = false;
      },
      refresh() {
        this.dictStationSearchValue = '';
        this.getDictdfStationList();

      },
      // 获取测向站列表
      getDictdfStationList() {
        this.dictListLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$dictdfStation_API.list, requestValue, res => {
          console.log("测向站数据列表", res);
          if (res.status == 200) {
            this.dictdfStationData = res.data.value;
            this.total = res.data.page.total;
            this.dictListLoading = false;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '获取测向站数据失败'
            })
          }
        })
      },
      // 打开弹出框
      AddDictStation() {
        this.addDictStationDialog = true;
        this.$refs["addDictStation"].resetFields();
      },
      // 添加测向站
      addDictStationSubmit() {
        let dictStationJson = JSON.stringify(this.addDictStation);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: dictStationJson,
        }
        this.$sendRequest2Server(this.$OptType.ADD, this.$dictdfStation_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addDictStation"].resetFields();
            this.addDictStationDialog = false;
            this.getDictdfStationList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.addDictStationDialog = false;
          }
        });
      },
      // 打开编辑弹出框
      handleEdit() {
        this.updateDictStationDialog = true;
        this.updateDictStation = Object.assign({}, this.clickRowData);
      },
      updateDictStationSubmit() {
        let dictStationJson = JSON.stringify(this.updateDictStation);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: dictStationJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$dictdfStation_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["updateDictStation"].resetFields();
            this.updateDictStationDialog = false;
            this.btnDisabled = true;
            this.getDictdfStationList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.updateDictStationDialog = false
          }
        });
      },
      del() {
        this.delLoading = true;
        let DictStationId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${DictStationId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$dictdfStation_API.delete, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.dictStationNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getDictdfStationList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.dictStationNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      dictStationSearch() {
        this.dictdfStationData = [];
        this.searchLoading = true;
        this.listLoading = true;
        let search = [{
          rule: 3,
          key: 'name',
          value: this.dictStationSearchValue
        }]
        let JsonParam = `[${JSON.stringify(search)}]`;
        let search_params = JSON.stringify(JsonParam);
        let url_params = `current=${this.current}&pageSize=${this.pageSize}`;
        let requestValue = {
          urlParamers: url_params,
          bodyParamers: search_params
        }
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$dictdfStation_API.mapSearch, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.dictdfStationData = res.data.value;
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
        this.searchLoading = false;
      }
    },
    mounted() {
      let pageSetting = this.$getPageSetting("dictdfStation");
      if (pageSetting != '') {
        this.pageSize = pageSetting.pageSize;
        this.current = pageSetting.current;
      } else {
        this.pageSize = 10;
        this.current = 1;
      }
      this.getDictdfStationList();
    }
  }
</script>

<style scoped>
  .dialog-footer {
    margin-top: -30px;
  }
</style>
