<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('member:memberlevel:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增
        </el-button>
        <el-button
          v-if="isAuth('member:memberlevel:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="id"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="等级名称"></el-table-column>
      <el-table-column prop="growthPoint" header-align="center" align="center" label="所需成长值"></el-table-column>
      <el-table-column prop="defaultStatus" header-align="center" align="center" label="默认等级">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.defaultStatus==1"></i>
          <i class="el-icon-error" v-else></i>
        </template>
      </el-table-column>
      <el-table-column prop="freeFreightPoint" header-align="center" align="center" label="免运费标准"></el-table-column>
      <el-table-column
        prop="commentGrowthPoint"
        header-align="center"
        align="center"
        label="每次评价获取的成长值"
      ></el-table-column>
      <el-table-column align="center" label="特权">
        <el-table-column
          prop="privilegeFreeFreight"
          header-align="center"
          align="center"
          label="免邮特权"
        >
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.privilegeFreeFreight===1"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="privilegeMemberPrice"
          header-align="center"
          align="center"
          label="会员价格特权"
        >
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.privilegeMemberPrice==1"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="privilegeBirthday"
          header-align="center"
          align="center"
          label="生日特权"
        >
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.privilegeBirthday==1"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="note" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./memberlevel-add-or-update";
import memberLevel from "@/api/member/memberLevel";

export default {
  data() {
    return {
      dataForm: {
        key: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const {data} = await memberLevel.getList(this.pageIndex, this.pageSize, this.dataForm.key)
      if (data && data.data.code === 200) {
        this.dataList = data.data.list;
        this.totalPage = data.data.totalCount;
      } else {
        this.dataList = [];
        this.totalPage = 0;
      }
      this.dataListLoading = false
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    async deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id;
        });
      const confirm = await this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {})
      if (!confirm) {
        return
      }
      const {data} = await memberLevel.delete(ids)
      if (data && data.data.code === 200) {
        this.$message.success("操作成功")
      } else {
        this.$message.error(data.data.msg)
      }
      await this.getDataList();
    }
  }
};
</script>
