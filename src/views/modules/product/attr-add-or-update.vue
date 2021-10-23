<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="dialogClose"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <!--       @keyup.enter.native="dataFormSubmit()" -->
      <el-form-item label="属性名" prop="attrName">
        <el-input v-model="dataForm.attrName" placeholder="属性名"></el-input>
      </el-form-item>
      <el-form-item label="属性类型" prop="attrType">
        <el-select v-model="dataForm.attrType" placeholder="请选择">
          <el-option label="规格参数" :value="1"></el-option>
          <el-option label="销售属性" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="值类型" prop="valueType">
        <el-switch
          v-model="dataForm.valueType"
          active-text="允许多个值"
          inactive-text="只能单个值"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :inactive-value="0"
          :active-value="1"
        ></el-switch>
      </el-form-item>
      <el-form-item label="可选值" prop="valueSelect">
        <!-- <el-input v-model="dataForm.valueSelect"></el-input> -->
        <el-select
          v-model="dataForm.valueSelect"
          multiple
          filterable
          allow-create
          placeholder="请输入内容"
        ></el-select>
      </el-form-item>
      <el-form-item label="属性图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="属性图标"></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="catelogId">
        <category-cascader :catelogPath.sync="catelogPath"></category-cascader>
      </el-form-item>
      <el-form-item label="所属分组" prop="attrGroupId" v-if="type === 1">
        <el-select ref="groupSelect" v-model="dataForm.attrGroupId" placeholder="请选择">
          <el-option
            v-for="item in attrGroups"
            :key="item.id"
            :label="item.attrGroupName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可检索" prop="searchType" v-if="type === 1">
        <el-switch
          v-model="dataForm.searchType"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="快速展示" prop="showDesc">
        <el-switch
          v-model="dataForm.showDesc"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="启用状态" prop="enable">
        <el-switch
          v-model="dataForm.enable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CategoryCascader from "@/views/common/category-cascader";
import attrgroup from "@/api/product/attrgroup";
import attr from "@/api/product/attr";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        attrName: "",
        searchType: 0,
        valueType: 1,
        icon: "",
        valueSelect: "",
        attrType: 1,
        enable: 1,
        catelogId: "",
        attrGroupId: "",
        showDesc: 0
      },
      catelogPath: [],
      attrGroups: [],
      dataRule: {
        attrName: [
          {required: true, message: "属性名不能为空", trigger: "blur"}
        ],
        searchType: [
          {
            required: true,
            message: "是否需要检索不能为空",
            trigger: "blur"
          }
        ],
        // valueType: [
        //   {
        //     required: true,
        //     message: "值类型不能为空",
        //     trigger: "blur"
        //   }
        // ],
        icon: [
          {required: true, message: "属性图标不能为空", trigger: "blur"}
        ],
        attrType: [
          {
            required: true,
            message: "属性类型不能为空",
            trigger: "blur"
          }
        ],
        enable: [
          {
            required: true,
            message: "启用状态不能为空",
            trigger: "blur"
          }
        ],
        catelogId: [
          {
            required: true,
            message: "需要选择正确的三级分类数据",
            trigger: "blur"
          }
        ],
        showDesc: [
          {
            required: true,
            message: "快速展示不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  watch: {
    async catelogPath(path) {
      //监听到路径变化需要查出这个三级分类的分组信息
      console.log("路径变了", path);
      this.attrGroups = [];
      this.dataForm.attrGroupId = "";
      this.dataForm.catelogId = path[path.length - 1];
      if (path && path.length === 3) {
        const {data} = await attrgroup.getListPaginationByCategoryId(1, 100000, "", this.dataForm.catelogId)
        if (data && data.data.code === 200) {
          this.attrGroups = data.data.attrgroup;
        } else {
          this.$message.error(data.data.msg)
        }
      } else if (path.length === 0) {
        this.dataForm.catelogId = "";
      } else {
        this.$message.error("请选择正确的分类");
        this.dataForm.catelogId = "";
      }
    }
  },
  components: {CategoryCascader},
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.dataForm.attrType = this.type;
      this.visible = true;
      this.$nextTick(async () => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          const {data} = await attr.getAttrInfo(this.dataForm.id)
          if (data && data.data.code === 200) {
            this.dataForm.attrName = data.data.attr.attrName;
            this.dataForm.searchType = data.data.attr.searchType;
            this.dataForm.valueType = data.data.attr.valueType;
            this.dataForm.icon = data.data.attr.icon;
            this.dataForm.valueSelect = data.data.attr.valueSelect.split(";");
            this.dataForm.attrType = data.data.attr.attrType;
            this.dataForm.enable = data.data.attr.enable;
            this.dataForm.catelogId = data.data.attr.catelogId;
            this.dataForm.showDesc = data.data.attr.showDesc;
            this.catelogPath = data.data.attr.catelogPath;
            this.$nextTick(() => {
              this.dataForm.attrGroupId = data.data.attr.attrGroupId;
            });
          }
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(async valid => {
        if (valid) {
          const saveData = {
            id: this.dataForm.id || undefined,
            attrName: this.dataForm.attrName,
            searchType: this.dataForm.searchType,
            valueType: this.dataForm.valueType,
            icon: this.dataForm.icon,
            valueSelect: this.dataForm.valueSelect.join(";"),
            attrType: this.dataForm.attrType,
            enable: this.dataForm.enable,
            catelogId: this.dataForm.catelogId,
            attrGroupId: this.dataForm.attrGroupId,
            showDesc: this.dataForm.showDesc
          }
          const {data} = !this.dataForm.id? await attr.save(saveData) : await attr.update(saveData)
          if (data && data.data.code === 200) {
            this.$message.success("操作成功")
            this.visible = false;
            this.$emit("refreshDataList");
          } else {
            this.$message.error(data.data.msg);
          }
        }
      });
    },
    //dialogClose
    dialogClose() {
      this.catelogPath = [];
    }
  }
};
</script>
