<template>
  <el-tree
    :data="menus"
    :props="defaultProps"
    node-key="id"
    ref="menuTree"
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
  }
}
</script>

<style scoped>

</style>
