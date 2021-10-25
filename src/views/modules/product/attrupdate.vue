<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card">
          <el-tabs tab-position="left" style="width:98%">
            <el-tab-pane
              :label="group.attrGroupName"
              v-for="(group,gidx) in dataResp.attrGroups"
              :key="group.attrGroupId"
            >
              <!-- 遍历属性,每个tab-pane对应一个表单，每个属性是一个表单项  spu.baseAttrs[0] = [{attrId:xx,val:}]-->
              <el-form ref="form" :model="dataResp">
                <el-form-item
                  :label="attr.attrName"
                  v-for="(attr,aidx) in group.attrList"
                  :key="attr.attrId"
                >
                  <el-input
                    v-model="dataResp.baseAttrs[gidx][aidx].attrId"
                    type="hidden"
                    v-show="false"
                  ></el-input>
                  <el-select
                    v-model="dataResp.baseAttrs[gidx][aidx].attrValue"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或输入值"
                  >
                    <el-option
                      v-for="(val,vidx) in attr.valueSelect.split(';')"
                      :key="vidx"
                      :label="val"
                      :value="val"
                    ></el-option>
                  </el-select>
                  <el-checkbox
                    v-model="dataResp.baseAttrs[gidx][aidx].showDesc"
                    :true-label="1"
                    :false-label="0"
                  >快速展示</el-checkbox>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <div style="margin:auto">
            <el-button type="success" style="float:right" @click="submitSpuAttrs">确认修改</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import attr from "@/api/product/attr";
import attrgroup from "@/api/product/attrgroup";

export default {
  components: {},
  props: {},
  data() {
    return {
      spuId: "",
      catelogId: "",
      dataResp: {
        //后台返回的所有数据
        attrGroups: [],
        baseAttrs: []
      },
      spuAttrsMap: {}
    };
  },
  computed: {},
  methods: {
    clearData() {
      this.dataResp.attrGroups = [];
      this.dataResp.baseAttrs = [];
      this.spuAttrsMap = {};
    },
    async getSpuBaseAttrs() {
      let {data} = await attr.getBaseAttrValueBySpuId(this.spuId)
      data.data.list.forEach(item => {
        this.spuAttrsMap[item.attrId] = item
      })
    },
    getQueryParams() {
      this.spuId = this.$route.query.spuId;
      this.catelogId = this.$route.query.catelogId;
    },
    async showBaseAttrs() {
      let _this = this;
      let {data} = await attrgroup.getAttrGroupWithAttrsByCatelogId(this.catelogId)
      data.data.list.forEach(item => {
        let attrArray = [];
        item.attrList.forEach(attr => {
          let v = "";
          if (_this.spuAttrsMap[attr.id]) {
            v = _this.spuAttrsMap[attr.id].attrValue.split(";");
          }
          attrArray.push({
            attrId: attr.id,
            attrName: attr.attrName,
            attrValue: v,
            showDesc: _this.spuAttrsMap[attr.id]
              ? _this.spuAttrsMap[attr.id].quickShow
              : attr.showDesc
          });
        });
        this.dataResp.baseAttrs.push(attrArray);
      });
      this.dataResp.attrGroups = data.data.list;
    },
    async submitSpuAttrs() {
      let submitData = [];
      this.dataResp.baseAttrs.forEach(item => {
        item.forEach(attr => {
          let val = "";
          if (attr.attrValue instanceof Array) {
            val = attr.attrValue.join(";");
          }

          if (val !== "") {
            submitData.push({
              attrId: attr.attrId,
              attrName: attr.attrName,
              attrValue: val,
              quickShow: attr.showDesc
            });
          }
        });
      });

      let confirm = await this.$confirm("修改商品规格信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch()
      if (!confirm) {
        return
      }
      let {data} = await attr.updateAttrValue(this.spuId, submitData)
      if (data && data.code === 200) {
        this.$message.success("修改成功")
      } else {
        this.$message.error(data.data.msg)
      }
    }
  },
  created() {},
  activated() {
    this.clearData();
    this.getQueryParams();
    if (this.spuId && this.catelogId) {
      this.showBaseAttrs();
      this.getSpuBaseAttrs();
    }
  }
};
</script>
