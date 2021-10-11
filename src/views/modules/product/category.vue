<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"/>
</template>

<script>
/* eslint-disable */
export default {
  name: "category",
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    }
  },
  created() {
  }
}
</script>

<style scoped>

</style>
