<template>
  <div>
    <el-button type="danger" @click="deleteALl">删除所有选中的菜单</el-button>
    <el-tree
      :data="menus"
      :default-expanded-keys="expendedKey"
      :expand-on-click-node="false"
      :props="defaultProps"
      node-key="id"
      show-checkbox
      ref="categoryTree"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            size="mini"
            type="text"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button
            v-if="node.isLeaf"
            size="mini"
            type="text"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="() => update(node, data)"
          >
            Update
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="30%"
      :showClose="false"
    >
      <el-form :model="category">
        <el-form-item label="name" label-width="120px">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="icon" label-width="120px">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="product_unit" label-width="120px">
          <el-input v-model="category.productUnit" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import category from "@/api/product/category";

export default {
  name: "category",
  data() {
    return {
      category: {
        id: null,
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        icon: null,
        productUnit: null,
        productCount: 0
      },
      dialogVisible: false,
      dialogTitle: "save",
      expendedKey: [],
      menus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    async getTreeData() {
      const {data} = await category.getTreeData();
      this.menus = data.data.category;
    },

    append(data) {
      this.dialogVisible = true;
      this.category.parentCid = data.id
      this.category.catLevel = data.catLevel * 1 + 1
      this.dialogTitle = "save category"
    },

    async addCategory() {
      let {data} = await category.save(this.category)
      if (data.data.code === 200) {
        this.$message.success("save data success")
        await this.getTreeData()
      } else {
        this.$message.error("save data fail")
      }
      this.dialogVisible = false
      this.category = {}
      this.expendedKey = [this.category.parentCid]
    },

    async remove(node, data) {
      console.log(node, data);
      let confirm = await this.$confirm(
        `delete [${data.name}] or not?`,
        `warning`,
        {
          confirmButtonText: "confirm",
          cancelButtonText: "cancel",
          type: "warning"
        }
      ).catch(() => {
        this.$message.info("cancel delete")
      });
      if (!confirm) {
        return
      }
      await category.deleteById(data.id);
      this.$message.success("delete success");
      await this.getTreeData();
      this.expendedKey = [data.parentCid];
    },

    update(node, data) {
      this.dialogVisible = true
      // resolve two-way binding(deep copy)
      this.category = JSON.parse(JSON.stringify(data))
      this.dialogTitle = "update category"
    },

    async updateCategory() {
      let {data} = await category.update(this.category)
      if (data.data.code === 200) {
        this.$message.success("update data success")
        await this.getTreeData()
      } else {
        this.$message.error("update data fail")
      }
      this.dialogVisible = false
      this.expendedKey = [this.category.parentCid]
    },

    async deleteALl() {
      let checkedIds = this.$refs.categoryTree
        .getCheckedNodes(false, false)
        .map(data => data.id)
      let confirm = await this.$confirm(`delete [${checkedIds}] or not?`, `warning`, {
        confirmButtonText: "confirm",
        cancelButtonText: "cancel",
        type: "warning"
      }).catch(() => {
        this.$message.info("cancel delete")
      })
      if (!confirm) {
        return
      }
      let { data } = await category.deleteAll(checkedIds);
      if (data.data.code === 200) {
        this.$message.success("success delete")
      } else {
        this.$message.error("error delete")
      }
      await this.getTreeData()

    },

    submitData() {
      if (this.category.id === null) {
        this.addCategory()
      } else {
        this.updateCategory()
      }
    },

    cancel() {
      this.dialogVisible = false
      this.category = {}
    }
  },
  created() {
    this.getTreeData();
  }
};
</script>

<style scoped></style>
