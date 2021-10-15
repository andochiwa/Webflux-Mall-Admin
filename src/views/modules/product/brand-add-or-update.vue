<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="品牌名" prop="name">
      <el-input v-model="dataForm.name" placeholder="品牌名"></el-input>
    </el-form-item>
    <el-form-item label="品牌logo地址" prop="logo">
      <single-upload v-model="dataForm.logo"/>
    </el-form-item>
    <el-form-item label="介绍" prop="description">
      <el-input v-model="dataForm.description" placeholder="介绍"></el-input>
    </el-form-item>
    <el-form-item label="显示状态" prop="showStatus">
      <el-switch v-model="dataForm.showStatus" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"/>
    </el-form-item>
    <el-form-item label="检索首字母" prop="firstLetter">
      <el-input v-model="dataForm.firstLetter" placeholder="检索首字母"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import brand from "@/api/product/brand";
import SingleUpload from "@/components/upload/singleUpload";

export default {
  components: {SingleUpload},
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        logo: '',
        description: '',
        showStatus: 1,
        firstLetter: '',
        sort: ''
      },
      dataRule: {
        name: [
          {required: true, message: '品牌名不能为空', trigger: 'blur'}
        ],
        logo: [
          {required: true, message: '品牌logo地址不能为空', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '介绍不能为空', trigger: 'blur'}
        ],
        showStatus: [
          {required: true, message: '显示状态[0-不显示；1-显示]不能为空', trigger: 'blur'}
        ],
        firstLetter: [
          {required: true, message: '检索首字母不能为空', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '排序不能为空', trigger: 'blur'}
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
        if (this.dataForm.id) {
          const {data} = await brand.getById(this.dataForm.id)
          if (data.data && data.data.code === 200) {
            this.dataForm.name = data.data.brand.name
            this.dataForm.logo = data.data.brand.logo
            this.dataForm.description = data.data.brand.description
            this.dataForm.showStatus = data.data.brand.showStatus
            this.dataForm.firstLetter = data.data.brand.firstLetter
            this.dataForm.sort = data.data.brand.sort
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.dataForm.id = this.dataForm.id || undefined
          const {data} = this.dataForm.id ? await brand.update(this.dataForm) : await brand.save(this.dataForm)
          if (data.data.code === 200) {
            this.$message.success("Successful operation")
            this.visible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.data.msg)
          }
        }
      })
    }
  },
}
</script>
