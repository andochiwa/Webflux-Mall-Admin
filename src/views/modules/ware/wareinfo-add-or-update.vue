<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="仓库名" prop="name">
      <el-input v-model="dataForm.name" placeholder="仓库名"></el-input>
    </el-form-item>
    <el-form-item label="仓库地址" prop="address">
      <el-input v-model="dataForm.address" placeholder="仓库地址"></el-input>
    </el-form-item>
    <el-form-item label="区域编码" prop="areaCode">
      <el-input v-model="dataForm.areaCode" placeholder="区域编码"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import wareInfo from "@/api/ware/wareInfo";

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          address: '',
          areaCode: ''
        },
        dataRule: {
          name: [
            { required: true, message: '仓库名不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '仓库地址不能为空', trigger: 'blur' }
          ],
          areaCode: [
            { required: true, message: '区域编码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(async () => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            const {data} = await wareInfo.getById(this.dataForm.id)
            if (data && data.code === 200) {
              this.dataForm.name = data.data.wareInfo.name
              this.dataForm.address = data.data.wareInfo.address
              this.dataForm.areaCode = data.data.wareInfo.areaCode
            }
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate(async (valid) => {
          if (valid) {
            const operatorData = {
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'address': this.dataForm.address,
              'areaCode': this.dataForm.areaCode
            }
            const {data} = !operatorData.id ? await wareInfo.save(operatorData) : await wareInfo.update(operatorData)
            if (data && data.code === 200) {
              this.$message.success("操作成功")
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.data.msg)
            }
          }
        })
      }
    }
  }
</script>
