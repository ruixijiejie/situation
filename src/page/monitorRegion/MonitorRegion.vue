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
          <el-input v-model="regionSearchValue" @keyup.enter.native="search" style="width: 330px;"
                    placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger" style="margin-left: 20px;">提示：&nbsp;请转到地图首页右上角工具箱中添加监控区域</el-tag>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ExportXMLFile">导入</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!---------------------------------------------------地理围栏管理列表-------------------------------------------------------------->
    <el-table :data="regionData" highlight-current-row border :loading="listLoading" size="mini" @row-click="rowClick">
      <el-table-column prop="name" label="地理围栏名称" align="left" min-width="120" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="points_simple" label="区域边界" align="left" min-width="120" sortable
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="thumbanail" label="缩略图" align="center" min-width="90" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="click">
            <img :src="scope.row.thumbanail" min-width="70%" height="70%" alt="">
            <img slot="reference" :src="scope.row.thumbanail" min-width="70" height="70" alt="">
          </el-popover>

        </template>
      </el-table-column>
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
    <el-dialog title="编辑策略预警信息" :visible.sync="editRegionVisible" width="30%" :close-on-click-modal="false">
      <el-form v-model="editRegion" label-width="150px" :rules="addFormRules" ref="editRegion"
               style="margin-left: 45px;">
        <el-form-item label="地理围栏名称">
          <el-input style="width: 72%;" v-model="editRegion.name" placeholder="请输入地理围栏名称"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度类型">
          <el-select style="width: 72%" v-model="editRegion.longitudetype_Str" prop="longitudetype_Str"
                     placeholder="请选择经度类型">
            <el-option label="东经" value="东经"></el-option>
            <el-option label="西经" value="西经"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度">
          <el-input style="width: 72%;" v-model="editRegion.longitude" prop="longitude" placeholder="请输入经度"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="纬度类型">
          <el-select style="width: 72%" v-model="editRegion.latitudetype_Str" prop="latitudetype_Str"
                     placeholder="请选择纬度类型">
            <el-option label="北纬" value="北纬"></el-option>
            <el-option label="南纬" value="南纬"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input style="width: 72%" v-model="editRegion.latitude" prop="latitude" placeholder="请输入纬度"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="editRegion.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRegionVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------------------------------------------新增弹出框----------------------------------------------------->
    <el-dialog title="添加地理围栏信息" :visible.sync="addRegionVisible" :close-on-click-modal="false" width="32%">
      <el-form v-model="addRegion" label-width="150px" :rules="addFormRules" ref="addRegion"
               style="margin-left: 30px;">
        <el-form-item label="地理围栏名称">
          <el-input style="width: 72%;" v-model="addRegion.name" placeholder="请输入地理围栏名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度类型">
          <el-select style="width: 72%" v-model="addRegion.longitudetype_Str" prop="longitudetype_Str"
                     placeholder="请选择经度类型">
            <el-option label="东经" value="东经"></el-option>
            <el-option label="西经" value="西经"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度">
          <el-input style="width: 72%;" v-model="addRegion.longitude" prop="longitude" placeholder="请输入经度"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="纬度类型">
          <el-select style="width: 72%" v-model="addRegion.latitudetype_Str" prop="latitudetype_Str"
                     placeholder="请选择纬度类型">
            <el-option label="北纬" value="北纬"></el-option>
            <el-option label="南纬" value="南纬"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input style="width: 72%" v-model="addRegion.latitude" prop="latitude" placeholder="请输入纬度"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select style="width: 72%;" v-model="addRegion.type" placeholder="请选择" @change="changeType">
            <el-option value="1" label="共享"></el-option>
            <el-option value="0" label="私有"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addRegionVisible = false">取消</el-button>
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
        <p style="margin: 15px 0 0 10px;">请输入地理围栏名称进行删除确认。</p>
        <el-input v-model="regionNameInput" @change="changeRegionNameInput"
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
        regionData: [],
        clickRowData: {},
        editRegion: {},
        regionNameInput: "",
        regionSearchValue: "",
        all: "全部",
        total: 0,
        current: 0,
        pageSize: 0,
        listLoading: false,
        editLoading: false,
        addLoading: false,
        delLoading: false,
        addRegionVisible: false,
        editRegionVisible: false,
        delDialog: false,
        delStatus: false,
        btnDisabled: true,
        addFormRules: {
          name: [
            {required: true, message: '请输入网台名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addRegion: {
          name: '',
          longitudetype_Str: '',
          longitude: '',
          latitudetype_Str: '',
          latitude: '',
          points: '',
          type: ''
        },
      }
    },
    methods: {
      // 获取地理围栏列表
      getRegionList() {
        this.regionData = [];
        this.listLoading = true;
        let params = `current=${this.current}&pageSize=${this.pageSize}`
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: params
        }
        this.$sendRequest2Server(this.$OptType.LIST, this.$region_API.list, requestValue, res => {
          console.log("返回地理围栏列表数据", res);
          if (res.status == 200) {
            this.regionData = res.data.value;
            this.total = res.data.page.total;
            this.listLoading = false;
            this.btnDisabled = true;
          } else {
            this.$message({
              type: 'error',
              message: '获取地理围栏列表失败'
            })
          }
        })
      },
      // 添加地理围栏信息
      addSubmit() {
        let temp = [
          {longitudetype_Str: this.addRegion.longitudetype_Str},
          {longitude: this.addRegion.longitude},
          {latitudetype_Str: this.addRegion.latitudetype_Str},
          {latitude: this.addRegion.latitude}
        ]
        let params = {
          name: this.addRegion.name,
          type: this.addRegion.type,
          points: temp
        };
        let regionJson = JSON.stringify(params);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: regionJson,
        }
        console.log("添加的字段", regionJson);
        this.$sendRequest2Server(this.$OptType.ADD, this.$region_API.add, requestValue, res => {
          console.log("添加返回结果", res);
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.$refs["addRegion"].resetFields();
            this.addRegionVisible = false;
            this.getRegionList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
            this.$refs["addRegion"].resetFields();
            this.addRegionVisible = false;
          }
        });
      },
      // 更新地理围栏信息
      editSubmit() {
        let temp = [
          {longitudetype_Str: this.editRegion.longitudetype_Str},
          {longitude: this.editRegion.longitude},
          {latitudetype_Str: this.editRegion.latitudetype_Str},
          {latitude: this.editRegion.latitude}
        ]
        let params = {
          name: this.editRegion.name,
          type: this.editRegion.type,
          points: temp
        };
        let regionJson = JSON.stringify(params);
        let requestValue = {
          genType: this.$GenType.body,
          bodyParamers: regionJson,
        }
        this.$sendRequest2Server(this.$OptType.UPDATE, this.$region_API.update, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$refs["editRegion"].resetFields();
            this.editRegionVisible = false;
            this.btnDisabled = true;
            this.getRegionList();
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
            this.$refs["editRegion"].resetFields();
            this.editRegionVisible = false;
          }
        });
      },
      // 删除地理围栏信息
      del() {
        this.delLoading = true;
        let regionId = this.clickRowData.id;
        let requestValue = {
          genType: this.$GenType.url,
          urlParamers: `ids=${regionId}`,
        }
        this.$sendRequest2Server(this.$OptType.DELETE, this.$region_API.delete, requestValue, res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.regionNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
            this.getRegionList();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            this.btnDisabled = true;
            this.delLoading = false;
            this.delDialog = false;
            this.regionNameInput = '';
            this.delStatus = false;
            this.clickRowData = {};
          }
        });
      },
      // 搜索望台通联预警信息
      search() {
        this.regionData = [];
        this.listLoading = true;
        let search_one = [{
          rule: 3,
          key: "name",
          value: this.regionSearchValue
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
            this.regionData = res.data.value;
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
        this.editRegionVisible = true;
        this.editRegion = Object.assign({}, this.clickRowData);
      },
      // 点击行时启用编辑
      rowClick(row) {
        this.btnDisabled = false
        this.clickRowData = row;
      },
      // 删除确认
      changeRegionNameInput() {
        if (this.regionNameInput === this.clickRowData.name) {
          this.delStatus = true;
        } else {
          this.delStatus = false;
        }
      },
      // 分页导航
      handleCurrentChange(current) {
        this.current = current
        this.$setPageSetting("MonitorRegion", this.current, this.pageSize);
        this.getRegionList(this.current, this.pageSize);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.$setPageSetting("MonitorRegion", this.current, this.pageSize);
        this.getRegionList(this.current, this.pageSize);
      },
      cancelDelDialog() {
        this.delDialog = false;
        this.regionNameInput = '';
        this.delStatus = false;
      },
      refresh() {
        this.regionSearchValue = '',
          this.getRegionList();
      },
      changeType(val) {
        if (val === "1") {
          this.addRegion.type = val;
        } else if (val === "0") {
          this.addRegion.type = val;
        }
      }
    },
    mounted() {
      let pageSetting = this.$getPageSetting("MonitorRegion");
      if (pageSetting != '') {
        this.pageSize = pageSetting.pageSize;
        this.current = pageSetting.current;
      } else {
        this.pageSize = 10;
        this.current = 1;
      }
      this.getRegionList();
    }
  }
</script>

<style scoped>

</style>
