<template>
  <div>
    <el-select placeholder="请选择" v-model="brandId" filterable clearable>
      <el-option
        v-for="item in brands"
        :key="item.brandId"
        :label="item.brandName"
        :value="item.brandId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import categorybrandrelation from "@/api/product/categorybrandrelation";
export default {
  components: {},
  props: {},
  data() {
    //这里存放数据
    return {
      catId: 0,
      brands: [
        {
          label: "a",
          value: 1
        }
      ],
      brandId: "",
      subscribe: null
    };
  },
  computed: {},
  watch: {
    brandId(val) {
      this.PubSub.publish("brandId", val);
    }
  },
  //方法集合
  methods: {
    async getCatBrands() {
      if (!this.catId) {
        return
      }
      const {data} = await categorybrandrelation.getBrandList(this.catId)
      this.brands = data.data.list
    }
  },
  created() {},
  mounted() {
    //监听三级分类消息的变化
    this.subscribe = PubSub.subscribe("catPath", (msg, val) => {
      this.catId = val[val.length - 1];
      this.getCatBrands();
    });
  },
  beforeDestroy() {
    PubSub.unsubscribe(this.subscribe); //销毁订阅
  },
};
</script>
