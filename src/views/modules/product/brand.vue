<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('product:brand:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('product:brand:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column
        prop="id" header-align="center" align="center" label="品牌id">
      </el-table-column>
      <el-table-column
        prop="name" header-align="center" align="center" label="品牌名">
      </el-table-column>
      <el-table-column
        prop="logo" header-align="center" align="center" label="品牌logo地址">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width: 120px; height: 120px" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="description" header-align="center" align="center" label="介绍">
      </el-table-column>
      <el-table-column
        prop="showStatus" header-align="center" align="center" label="显示状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.showStatus"
            @change="changeStatus(scope.row)"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="firstLetter" header-align="center" align="center" label="检索首字母">
      </el-table-column>
      <el-table-column
        prop="sort" header-align="center" align="center" label="排序">
      </el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateCatelogHandle(scope.row.id)">关联分类</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <el-dialog title="关联分类" :visible.sync="cateRelationDialogVisible" width="30%">
      <el-popover placement="right-end" v-model="popCatelogSelectVisible">
        <category-cascader :catelogPath.sync="catelogPath"></category-cascader>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="popCatelogSelectVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="addCatelogSelect">确定</el-button>
        </div>
        <el-button slot="reference">新增关联</el-button>
      </el-popover>
      <el-table :data="cateRelationTableData" style="width: 100%">
        <el-table-column prop="id" label="#"></el-table-column>
        <el-table-column prop="brandName" label="品牌名"></el-table-column>
        <el-table-column prop="catelogName" label="分类名"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="deleteCateRelationHandle(scope.row.id)"
            >移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateRelationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateRelationDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './brand-add-or-update'
import brand from "@/api/product/brand";
import categorybrandrelation from "@/api/product/categorybrandrelation";
import CategoryCascader from "@/views/common/category-cascader"

export default {
  data() {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      cateRelationDialogVisible: false,
      popCatelogSelectVisible: false,
      catelogPath: [],
      cateRelationTableData: []
    }
  },
  components: {
    AddOrUpdate, CategoryCascader
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const {data} = await brand.getListPagination(this.pageIndex, this.pageSize, this.dataForm.key)
      if (data.data.code === 200) {
        this.dataList = data.data.brand
        this.totalPage = data.data.totalCount
      } else {
        this.dataList = []
        this.totalPage = 0
      }
      this.dataListLoading = false
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    async changeStatus(brandData) {
      let {data} = await brand.update(brandData);
      if (data.data.code === 200) {
        this.$message.success("状态更新成功")
      } else {
        this.$message.error(data.data.msg)
        await this.getDataList()
      }
    },
    updateCatelogHandle(brandId) {
      this.cateRelationDialogVisible = true;
      this.brandId = brandId;
      this.getCateRelation();
    },
    async getCateRelation() {
      const {data} = await categorybrandrelation.getCatelogList(this.brandId)
      if (data.data.code === 200) {
        this.cateRelationTableData = data.data.categoryBrandRelation
      } else {
        this.$message.error(data.data.msg)
      }
    },
    async deleteCateRelationHandle(id) {
      await categorybrandrelation.deleteById(id)
      await this.getCateRelation()
    },
    async addCatelogSelect() {
      this.popCatelogSelectVisible = false;
      await categorybrandrelation.save({
        brandId: this.brandId,
        catelogId: this.catelogPath[this.catelogPath.length - 1]
      })
      await this.getCateRelation()
    },
    // 删除
    async deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      const confirm = await this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message.info("取消删除")
      })
      if (!confirm) {
        return
      }
      const {data} = await brand.deleteByIds(ids)
      if (data.data && data.data.code === 200) {
        this.$message({
          message: '操作成功',
          type: 'success',
        })
      } else {
        this.$message.error(data.data.msg)
      }
      await this.getDataList()
    }
    }
  }
</script>
