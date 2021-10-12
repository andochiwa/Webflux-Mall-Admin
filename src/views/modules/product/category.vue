<template>
  <el-tree :data="menus" :props="defaultProps"/>
</template>

<script>
/* eslint-disable */
import category from '@/api/product/category'

export default {
  name: "category",
  data() {
    return {
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  methods: {
    async getTreeData() {
      const {data} = await category.getTreeData()
      this.menus = data.data.category
    }
  },
  created() {
    this.getTreeData()
  }
}
</script>

<style scoped>

</style>
