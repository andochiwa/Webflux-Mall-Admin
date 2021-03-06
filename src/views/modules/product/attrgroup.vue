<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <category @tree-node-click="treeNodeClick"/>
      </el-col>
      <el-col :span="18">
        <div class="mod-config">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
              <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="getDataList(catId)">查询</el-button>
              <el-button type="success" @click="getDataList(0)">查询全部</el-button>
              <el-button v-if="isAuth('product:attrgroup:save')" type="primary" @click="addOrUpdateHandle()">新增
              </el-button>
              <el-button v-if="isAuth('product:attrgroup:delete')" type="danger" @click="deleteHandle()"
                         :disabled="dataListSelections.length <= 0">批量删除
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="id"
              header-align="center"
              align="center"
              label="分组id">
            </el-table-column>
            <el-table-column
              prop="attrGroupName"
              header-align="center"
              align="center"
              label="组名">
            </el-table-column>
            <el-table-column
              prop="sort"
              header-align="center"
              align="center"
              label="排序">
            </el-table-column>
            <el-table-column
              prop="description"
              header-align="center"
              align="center"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="icon"
              header-align="center"
              align="center"
              label="组图标">
            </el-table-column>
            <el-table-column
              prop="catelogId"
              header-align="center"
              align="center"
              label="所属分类id">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="relationHandle(scope.row.id)">关联</el-button>
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
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList(catId)"></add-or-update>
          <!-- 处理关联关系 -->
          <relation-update v-if="relationVisible" ref="relationUpdate" @refreshData="getDataList(catId)"></relation-update>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from "@/views/common/category";
import AddOrUpdate from "@/views/modules/product/attrgroup-add-or-update"
import attrgroup from "@/api/product/attrgroup";
import RelationUpdate from "./attr-group-relation"

export default {
  components: {Category, AddOrUpdate, RelationUpdate},
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
      catId: 0,
      relationVisible: false
    }
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList(categoryId = 0) {
      this.dataListLoading = true
      const {data} = categoryId === 0 ? await attrgroup.getListPagination(this.pageIndex, this.pageSize, this.dataForm.key)
        : await attrgroup.getListPaginationByCategoryId(this.pageIndex, this.pageSize, this.dataForm.key, categoryId)
      if (data && data.data.code === 200) {
        this.dataList = data.data.attrgroup
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
      this.getDataList(this.catId)
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList(this.catId)
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
      })
      if (!confirm) {
        return
      }
      const {data} = await attrgroup.deleteByIds(ids)
      if (data && data.data.code === 200) {
        this.$message.success("操作成功")
      } else {
        this.$message.error(data.data.msg)
      }
      await this.getDataList(this.catId)
    },
    // 树节点被点击
    treeNodeClick(data, node, component) {
      if (node.level === 3) {
        this.catId = data.id
        this.getDataList(data.id)
      } else {
        this.catId = 0
        this.getDataList()
      }
    },
    //处理分组与属性的关联
    relationHandle(groupId) {
      this.relationVisible = true;
      this.$nextTick(() => {
        this.$refs.relationUpdate.init(groupId);
      });
    },
  }
}
</script>

<style scoped>

</style>
