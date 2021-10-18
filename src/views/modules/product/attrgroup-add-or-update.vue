<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close="dialogClose"
    :showClose="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="组名" prop="attrGroupName">
        <el-input v-model="dataForm.attrGroupName" placeholder="组名"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="组图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="组图标"></el-input>
      </el-form-item>
      <el-form-item label="所属分类id" prop="catelogId">
        <el-cascader
          v-model="dataForm.catelogPath"
          :options="categoryTree"
          filterable
          :props="defaultProps"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import attrgroup from "@/api/product/attrgroup";
import category from "@/api/product/category";

export default {
  data() {
    return {
      visible: false,
      defaultProps: {
        value: "id",
        children: "children",
        label: "name"
      },
      categoryTree: [],
      dataForm: {
        id: 0,
        attrGroupName: '',
        sort: '',
        description: '',
        icon: '',
        catelogPath: [],
        catelogId: 0
      },
      dataRule: {
        attrGroupName: [
          {required: true, message: '组名不能为空', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '排序不能为空', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '描述不能为空', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: '组图标不能为空', trigger: 'blur'}
        ],
        catelogId: [
          {required: true, message: '所属分类id不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        console.log("data pre=", this.dataForm)
        if (this.dataForm.id) {
          const {data} = await attrgroup.getById(id)
          if (data && data.data.code === 200) {
            this.dataForm.attrGroupName = data.data.attrGroup.attrGroupName
            this.dataForm.sort = data.data.attrGroup.sort
            this.dataForm.description = data.data.attrGroup.description
            this.dataForm.icon = data.data.attrGroup.icon
            this.dataForm.catelogId = data.data.attrGroup.catelogId
            this.dataForm.catelogPath = data.data.attrGroup.catelogPath
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.dataForm.id = this.dataForm.id || undefined
          this.dataForm.catelogId = this.dataForm.catelogPath[this.dataForm.catelogPath.length - 1]
          const {data} = !this.dataForm.id ? await attrgroup.save(this.dataForm) : await attrgroup.update(this.dataForm)
          if (data && data.data.code === 200) {
            this.$message.success("操作成功")
          } else {
            this.$message.error(data.data.msg)
          }
          this.visible = false
          this.$emit('refreshDataList')
        }
      })
    },
    async getTreeData() {
      const {data} = await category.getTreeData();
      this.categoryTree = data.data.category;
    },
    dialogClose() {
      this.dataForm.catelogPath = []
    },
  },
  created() {
    this.getTreeData()
  }
}
</script>
