<template>
  <div>
    <el-cascader
      filterable
      clearable
      v-model="paths"
      :options="categorys"
      :props="setting"
    ></el-cascader>
  </div>
</template>

<script>

import category from "@/api/product/category";

export default {
  components: {},
  //接受父组件传来的值
  props: {
    catelogPath: {
      type: Array,
      default(){
        return [];
      }
    }
  },
  data() {
    //这里存放数据
    return {
      setting: {
        value: "id",
        label: "name",
        children: "children"
      },
      categorys: [],
      paths: this.catelogPath
    };
  },
  watch:{
    catelogPath(v){
      this.paths = this.catelogPath;
    },
    paths(v){
      this.$emit("update:catelogPath",v);
      this.PubSub.publish("catPath",v);
    }
  },
  methods: {
    async getCategorys() {
      const {data} = await category.getTreeData()
      this.categorys = data.data.category
    }
  },
  created() {
    this.getCategorys();
    console.log("paths = ", this.paths)
  }
};
</script>
<style scoped>
</style>
