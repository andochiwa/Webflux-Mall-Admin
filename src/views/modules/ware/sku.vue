<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="仓库">
        <el-select style="width:160px;" v-model="dataForm.wareId" placeholder="请选择仓库" clearable>
          <el-option :label="w.name" :value="w.id" v-for="w in wareList" :key="w.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="skuId">
        <el-input v-model="dataForm.skuId" placeholder="skuId" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('ware:waresku:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          v-if="isAuth('ware:waresku:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
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
      <el-table-column prop="skuId" header-align="center" align="center" label="sku_id"></el-table-column>
      <el-table-column prop="wareId" header-align="center" align="center" label="仓库id"></el-table-column>
      <el-table-column prop="stock" header-align="center" align="center" label="库存数"></el-table-column>
      <el-table-column prop="skuName" header-align="center" align="center" label="sku_name"></el-table-column>
      <el-table-column prop="stockLocked" header-align="center" align="center" label="锁定库存"></el-table-column>
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
import AddOrUpdate from "./waresku-add-or-update";
import wareSku from "@/api/ware/wareSku";
import wareInfo from "@/api/ware/wareInfo";

export default {
  data() {
    return {
      wareList: [],
      dataForm: {
        wareId: "",
        skuId: ""
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
    console.log("接收到", this.$route.query.skuId);
    if (this.$route.query.skuId) {
      this.dataForm.skuId = this.$route.query.skuId;
    }
    this.getWares();
    this.getDataList();
  },
  methods: {
    async getWares() {
      const {data} = await wareInfo.getWarePagination(1, 500)
      this.wareList = data.data.list
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const {data} = await wareSku.getPagination(this.pageIndex, this.pageSize, this.dataForm.skuId, this.dataForm.wareId)
      if (data && data.code === 200) {
        this.dataList = data.data.list;
        this.totalPage = data.data.totalCount;
      } else {
        this.dataList = [];
        this.totalPage = 0;
      }
      this.dataListLoading = false;
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
        return item.id
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
      const {data} = await wareSku.delete(ids)
      if (data && data.code === 200) {
        this.$message.success("操作成功");
        await this.getDataList();
      } else {
        this.$message.error(data.data.msg);
      }
    }
  }
};
</script>
