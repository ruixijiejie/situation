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
          <el-button type="danger" :disabled="btnDisabled" @click="delDialog=true">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnDisabled" @click="handleEdit">编辑
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="fixSearchValue" @keyup.enter.native="fixSearch" style="width: 330px;"
                    placeholder="请输入网台名称/国别/使用国别/性质"></el-input>
        </el-form-item>
      </el-form>
    </el-col>
    <!--------------------------------------------------网台管理列表-------------------------------------------------------------->
    <el-table :data="tableData" highlight-current-row border :v-loading="listLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="name" label="网台名称" min-width="110" align="center" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="belongcountry" label="国别" min-width="110" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="usecountry" label="使用国别" min-width="95" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="nature" label="性质" min-width="110" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="longitudetype_Str" label="经度类型" min-width="110" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="longitude" label="经度" min-width="110" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="latitudetype_Str" label="纬度类型" min-width="95" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="latitude" label="纬度" min-width="110" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="ispublicStr" label="系统/私有" min-width="110" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdtime" label="创建时间" min-width="110" align="center"
                       show-overflow-tooltip></el-table-column>
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
    <!--------------------------------------------------------编辑弹出框 ------------------------------------------------------->
    <el-dialog title="编辑网台信息" :visible.sync="editFixVisable" width="32%" :close-on-click-modal="false">
      <el-form v-model="editFix" label-width="80px" :rules="addFormRules" ref="editFix" style="margin-left: 45px;">
        <el-form-item label="网台名称">
          <el-input style="width: 250px;" v-model="editFix.name" prop="name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input style="width: 250px;" v-model="editFix.longitude" prop="longitude" auto-complete="off"></el-input>
          <el-tag type="danger">+东经&nbsp;&nbsp;-西经</el-tag>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input style="width: 250px;" v-model="editFix.latitude" prop="latitude" auto-complete="off"></el-input>
          <el-tag type="danger">+北纬&nbsp;&nbsp;-南纬</el-tag>
        </el-form-item>
        <el-form-item label="所属国别">
          <el-input style="width: 250px;" v-model="editFix.belongcountry" prop="belongcountry"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用国别">
          <el-input style="width: 250px;" v-model="editFix.usecountry" prop="usecountry" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性质">
          <el-input style="width: 250px;" v-model="editFix.nature" prop="nature" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editFix.ispublic" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFixVisable = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------ -新增弹出框--------------------------------------------------------->
    <el-dialog title="添加网台信息" :visible.sync="addFixVisable" :close-on-click-modal="false" width="32%">
      <el-form v-model="addFix" label-width="80px" :rules="addFormRules" ref="addFixStation" style="margin-left: 45px;">
        <el-form-item label="网台名称">
          <el-input style="width: 72%;" v-model="addFix.name" prop="name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input style="width: 72%;" v-model="addFix.longitude" prop="longitude" auto-complete="off"></el-input>
          <el-tag type="danger">+东经&nbsp;&nbsp;-西经</el-tag>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input style="width: 72%" v-model="addFix.latitude" prop="latitude" auto-complete="off"></el-input>
          <el-tag type="danger">+北纬&nbsp;&nbsp;-南纬</el-tag>
        </el-form-item>
        <el-form-item label="所属国别">
          <el-input style="width: 72%" v-model="addFix.belongcountry" prop="belongcountry"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用国别">
          <el-input style="width: 72%" v-model="addFix.usecountry" prop="usecountry" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性质">
          <el-input style="width: 72%" v-model="addFix.nature" prop="nature" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addFix.ispublic" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFixVisable = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--------------------------------------------------------删除网台------------------------------------------------------------>
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
  import {drawMarkers} from "../api_map/baidu_map_api";

  export default {
    name: 'Network',
    data() {
      return {
        bmap: "",
        props: {
          drawPictureParams: "",
        },
        clickRowData: {},
        fixSearchValue: '',
        btnDisabled: true,
        delDialog: false,
        delLoading: false,
        delStatus: false,
        searchLoading: false,
        tableData: [],
        fixNameInput: '',
        current: 0,
        pageSize: 0,
        total: 0,
        listLoading: false,
        editFixVisable: false,  // 编辑界面是否显示
        editLoading: false,
        editFix: {},
        addFixVisable: false,   // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addFix: {
          name: "",
          longitude: "",
          latitude: "",
          belongcountry: "",
          usecountry: "",
          nature: "",
          ispublic: "",
        },
      }
    },
    methods: {
      // 1.获取网台列表
      getFixList() {
        this.tableData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$Fixstation_API.list, requestValue, res => {
          console.log("网台列表数据", res);
          if (res.status == 200) {
            this.tableData = res.data.value;
            for (let i = 0; i < this.tableData.length; i++) {
              let myIcon = new BMap.Icon("/static/8网-30.png", new BMap.Size(26, 30));
              let points = new BMap.Point(this.tableData[i].longitude, this.tableData[i].latitude);
              let fixStationContext = `
                <p>网台名称：${this.tableData[i].name}</p><br>
                <p>国别：${this.tableData[i].belongcountry}</p><br>
                <p>使用国别：${this.tableData[i].usecountry}</p><br>
                <p>性质：${this.tableData[i].nature}</p>
          `
              var opts = {
                width: 130,
                height: 150,
                enableMessage: true
              }
              var infoWindows = new BMap.InfoWindow(fixStationContext, opts);
              drawMarkers(this.bmap, points, myIcon, infoWindows);
            }
            this.total = res.data.page.total;
            this.listLoading = false;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '获取网台数据失败'
            })
          }
        })
      },
      // 2.添加网台信息
      addSubmit() {
        let fixStationJson = JSON.stringify(this.addFix);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: fixStationJson,
        }
        console.log(fixStationJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$Fixstation_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            //  this.$refs["addFixStation"].resetFields();
            this.addFixVisable = false;
            this.getFixList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.addFixVisable = false
          }
        });
      },
      // 3.更新网台信息
      editSubmit() {
        let fixStationJson = JSON.stringify(this.editFix);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: fixStationJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$Fixstation_API.update, requestValue, res => {

          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            // this.$refs["editFix"].resetFields();
            this.editFixVisable = false;
            this.btnDisabled = true;
            this.getFixList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.editFixVisable = false
          }
        });
      },
      // 4.点击某行删除
      del() {
        this.delLoading = true;
        let fixStationId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${fixStationId}`,
        }
        console.log(requestValue);
        this.$sendRequest2Server(this.$OptType.DELETE, this.$Fixstation_API.delete, requestValue, res => {
          console.log(res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.fixNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getFixList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.fixNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      // 5.搜索
      fixSearch() {
        this.tableData = [];
        this.searchLoading = true;
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.fixSearchValue
        }]
        let search_two = [{
          rule: 3,
          key: "belongcountry",
          value: this.fixSearchValue
        }]
        let search_three = [{
          rule: 3,
          key: "usecountry",
          value: this.fixSearchValue
        }]
        let search_four = [{
          rule: 3,
          key: "nature",
          value: this.fixSearchValue
        }]
        let JsonParam = `[${JSON.stringify(search_one)},${JSON.stringify(search_two)},${JSON.stringify(search_three)},${JSON.stringify(search_four)}]`;
        console.log("JsonParams", JsonParam)
        let search_params = JSON.stringify(JsonParam);
        console.log("search params", search_params);
        let url_params = `current=${this.current}&pageSize=${this.pageSize}`;
        let requestValue = {
          urlParamers: url_params,
          bodyParamers: search_params
        }
        this.$sendRequest2Server(this.$OptType.SEARCH, this.$Fixstation_API.mapSearch, requestValue, res => {
          console.log("搜索返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '搜索成功'
            })
            this.tableData = res.data.value;
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
      },
      // 删除确认
      changeFixNameInput() {
        if (this.fixNameInput === this.clickRowData.name) {
          console.log("变化的输入值", this.fixNameInput);
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      // 改变新增弹出框的type值  0:私有,用户组独立访问  1:共享,所有用户都可访问
      changeType(val) {
        if (val === "1") {
          this.addFix.ispublic = val;
        } else if (val === "0") {
          this.addFix.ispublic = val;
        }
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("Network", this.current, this.pageSize);
        this.getFixList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("Network", this.current, this.pageSize);
        this.getFixList(this.current, this.pageSize);
      },
      // 显示新增弹出框
      handleAdd() {
        this.addFixVisable = true;
        this.$refs["addFix"].resetFields();
      },
      // 显示编辑弹出框及数据
      handleEdit() {
        this.editFixVisable = true;
        this.editFix = Object.assign({}, this.clickRowData);
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.fixNameInput = '';
        this.delStatus = false;
      },
      refresh() {
        this.fixSearchValue = '';
        this.getFixList();
      },
      ExportXMLFile() {
        alert("导入xml文件")
      },
    },
    watch: {
      drawPictureParams(newVal) {
        this.bmap = newVal;
      }
    },
    mounted() {
      let pageSetting = this.$getPageSetting("Network");
      if (pageSetting != '') {
        this.pageSize = pageSetting.pageSize;
        this.current = pageSetting.current;
      } else {
        this.pageSize = 10;
        this.current = 1;
      }
      this.getFixList();
    }
  }

</script>

<style scoped>
  .dialog-footer {
    margin-top: -30px;
  }

</style>
