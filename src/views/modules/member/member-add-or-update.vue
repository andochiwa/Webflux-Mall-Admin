<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="会员等级id" prop="levelId">
      <el-input v-model="dataForm.levelId" placeholder="会员等级id"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="dataForm.password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="dataForm.nickname" placeholder="昵称"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="dataForm.mobile" placeholder="手机号码"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item label="头像" prop="header">
      <el-input v-model="dataForm.header" placeholder="头像"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-input v-model="dataForm.gender" placeholder="性别"></el-input>
    </el-form-item>
    <el-form-item label="生日" prop="birth">
      <el-input v-model="dataForm.birth" placeholder="生日"></el-input>
    </el-form-item>
    <el-form-item label="所在城市" prop="city">
      <el-input v-model="dataForm.city" placeholder="所在城市"></el-input>
    </el-form-item>
    <el-form-item label="职业" prop="job">
      <el-input v-model="dataForm.job" placeholder="职业"></el-input>
    </el-form-item>
    <el-form-item label="个性签名" prop="sign">
      <el-input v-model="dataForm.sign" placeholder="个性签名"></el-input>
    </el-form-item>
    <el-form-item label="用户来源" prop="sourceType">
      <el-input v-model="dataForm.sourceType" placeholder="用户来源"></el-input>
    </el-form-item>
    <el-form-item label="积分" prop="integration">
      <el-input v-model="dataForm.integration" placeholder="积分"></el-input>
    </el-form-item>
    <el-form-item label="成长值" prop="growth">
      <el-input v-model="dataForm.growth" placeholder="成长值"></el-input>
    </el-form-item>
    <el-form-item label="启用状态" prop="status">
      <el-input v-model="dataForm.status" placeholder="启用状态"></el-input>
    </el-form-item>
    <el-form-item label="注册时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="注册时间"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import member from "@/api/member/member";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        levelId: '',
        username: '',
        password: '',
        nickname: '',
        mobile: '',
          email: '',
          header: '',
          gender: '',
          birth: '',
          city: '',
          job: '',
          sign: '',
          sourceType: '',
          integration: '',
          growth: '',
          status: '',
          createTime: ''
        },
        dataRule: {
          levelId: [
            { required: true, message: '会员等级id不能为空', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' }
          ],
          gender: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          integration: [
            { required: true, message: '积分不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '启用状态不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '注册时间不能为空', trigger: 'blur' }
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
            let {data} = await member.getById(this.dataForm.id)
            if (data && data.code === 200) {
              this.dataForm = data.data.member
            }
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate(async (valid) => {
          if (valid) {
            this.dataForm.id = this.dataForm.id || undefined
            let {data} = !this.dataForm.id ? await member.save(this.dataForm) : await member.update(this.dataForm)
            if (data && data.code === 200) {
              $this.$message.success("操作成功")
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
