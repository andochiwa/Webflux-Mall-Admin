<template>
  <div>
    <el-tree
      :data="menus"
      :default-expanded-keys="expendedKey"
      :expand-on-click-node="false"
      :props="defaultProps"
      node-key="id"
      show-checkbox
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
        </span>
      </span>
    </el-tree>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="提示"
      width="30%"
    >
      <el-form :model="category">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
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
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        productUnit: 0,
        productCount: 0
      },
      dialogVisible: false,
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
    },
    addCategory() {
      console.log(this.category);
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
        this.$message.info("cancel delete");
      });
      if (!confirm) {
        return;
      }
      await category.deleteById(data.id);
      this.$message.success("delete success");
      await this.getTreeData();
      this.expendedKey = [data.parentCid];
    }
  },
  created() {
    this.getTreeData();
  }
};
</script>

<style scoped></style>
