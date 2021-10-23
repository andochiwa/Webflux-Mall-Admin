<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="170px">
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="等级名称"></el-input>
      </el-form-item>
      <el-form-item label="所需成长值" prop="growthPoint">
        <el-input-number v-model="dataForm.growthPoint" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="默认等级" prop="defaultStatus">
        <el-checkbox v-model="dataForm.defaultStatus" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="免运费标准" prop="freeFreightPoint">
        <el-input-number :min="0" v-model="dataForm.freeFreightPoint"></el-input-number>
      </el-form-item>
      <el-form-item label="每次评价获取的成长值" prop="commentGrowthPoint">
        <el-input-number :min="0" v-model="dataForm.commentGrowthPoint"></el-input-number>
      </el-form-item>
      <el-form-item label="是否有免邮特权" prop="privilegeFreeFreight">
        <el-checkbox v-model="dataForm.privilegeFreeFreight" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否有会员价格特权" prop="privilegeFreeFreight">
        <el-checkbox v-model="dataForm.privilegeMemberPrice" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否有生日特权" prop="privilegeBirthday">
        <el-checkbox v-model="dataForm.privilegeBirthday" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="dataForm.note" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import memberLevel from "@/api/member/memberLevel";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        growthPoint: 0,
        defaultStatus: 0,
        freeFreightPoint: 0,
        commentGrowthPoint: 0,
        privilegeFreeFreight: 0,
        privilegeMemberPrice: 0,
        privilegeBirthday: 0,
        note: ""
      },
      dataRule: {
        name: [
          {required: true, message: '等级名称不能为空', trigger: 'blur'}
        ],
        growthPoint: [
          {required: true, message: '等级需要的成长值不能为空', trigger: 'blur'}
        ],
        defaultStatus: [
          {required: true, message: '是否为默认等级[0->不是；1->是]不能为空', trigger: 'blur'}
        ],
        freeFreightPoint: [
          {required: true, message: '免运费标准不能为空', trigger: 'blur'}
        ],
        commentGrowthPoint: [
          {required: true, message: '每次评价获取的成长值不能为空', trigger: 'blur'}
        ],
        privilegeFreeFreight: [
          {required: true, message: '是否有免邮特权不能为空', trigger: 'blur'}
        ],
        privilegeMemberPrice: [
          {required: true, message: '是否有会员价格特权不能为空', trigger: 'blur'}
        ],
        privilegeBirthday: [
          {required: true, message: '是否有生日特权不能为空', trigger: 'blur'}
        ],
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
          const {data} = await memberLevel.getById(this.dataForm.id)
          if (data && data.data.code === 200) {
            this.dataForm.name = data.data.memberLevel.name
            this.dataForm.growthPoint = data.data.memberLevel.growthPoint || 0
            this.dataForm.defaultStatus = data.data.memberLevel.defaultStatus || 0
            this.dataForm.freeFreightPoint = data.data.memberLevel.freeFreightPoint || 0
            this.dataForm.commentGrowthPoint = data.data.memberLevel.commentGrowthPoint || 0
            this.dataForm.privilegeFreeFreight = data.data.memberLevel.privilegeFreeFreight || 0
            this.dataForm.privilegeMemberPrice = data.data.memberLevel.privilegeMemberPrice || 0
            this.dataForm.privilegeBirthday = data.data.memberLevel.privilegeBirthday || 0
            this.dataForm.note = data.data.memberLevel.note
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const operatorData = {
            'id': this.dataForm.id || undefined,
            'name': this.dataForm.name,
            'growthPoint': this.dataForm.growthPoint,
            'defaultStatus': this.dataForm.defaultStatus,
            'freeFreightPoint': this.dataForm.freeFreightPoint,
            'commentGrowthPoint': this.dataForm.commentGrowthPoint,
            'privilegeFreeFreight': this.dataForm.privilegeFreeFreight,
            'privilegeMemberPrice': this.dataForm.privilegeMemberPrice,
            'privilegeBirthday': this.dataForm.privilegeBirthday,
            'note': this.dataForm.note
          }
          const {data} = !operatorData.id ? await memberLevel.save(operatorData) : await memberLevel.update(operatorData)
          if (data && data.data.code === 200) {
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
