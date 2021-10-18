<template>
  <el-tree
    :data="menus"
    :props="defaultProps"
    node-key="id"
    ref="menuTree"
    @node-click="nodeClick"
  >
  </el-tree>
</template>

<script>
import category from "@/api/product/category";

export default {
  data() {
    return {
      expendedKey: [],
      menus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this.getTreeData()
  },
  methods: {
    async getTreeData() {
      const {data} = await category.getTreeData();
      this.menus = data.data.category;
    },
    nodeClick(data, node, component) {
      this.$emit("tree-node-click", data, node, component)
    }
  }
}
</script>

<style scoped>

</style>
