<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="order_id" prop="orderId">
      <el-input v-model="dataForm.orderId" placeholder="order_id"></el-input>
    </el-form-item>
    <el-form-item label="order_sn" prop="orderSn">
      <el-input v-model="dataForm.orderSn" placeholder="order_sn"></el-input>
    </el-form-item>
    <el-form-item label="收货人" prop="consignee">
      <el-input v-model="dataForm.consignee" placeholder="收货人"></el-input>
    </el-form-item>
    <el-form-item label="收货人电话" prop="consigneeTel">
      <el-input v-model="dataForm.consigneeTel" placeholder="收货人电话"></el-input>
    </el-form-item>
    <el-form-item label="配送地址" prop="deliveryAddress">
      <el-input v-model="dataForm.deliveryAddress" placeholder="配送地址"></el-input>
    </el-form-item>
    <el-form-item label="订单备注" prop="orderComment">
      <el-input v-model="dataForm.orderComment" placeholder="订单备注"></el-input>
    </el-form-item>
    <el-form-item label="付款方式" prop="paymentWay">
      <template>
        <el-radio v-model="dataForm.paymentWay" :label="1">在线付款</el-radio>
        <el-radio v-model="dataForm.paymentWay" :label="2">货到付款</el-radio>
      </template>
    </el-form-item>
    <el-form-item label="任务状态" prop="taskStatus">
      <el-input v-model="dataForm.taskStatus" placeholder="任务状态"></el-input>
    </el-form-item>
    <el-form-item label="订单描述" prop="orderBody">
      <el-input v-model="dataForm.orderBody" placeholder="订单描述"></el-input>
    </el-form-item>
    <el-form-item label="物流单号" prop="trackingNo">
      <el-input v-model="dataForm.trackingNo" placeholder="物流单号"></el-input>
    </el-form-item>
    <el-form-item label="仓库id" prop="wareId">
      <el-input v-model="dataForm.wareId" placeholder="仓库id"></el-input>
    </el-form-item>
    <el-form-item label="工作单备注" prop="taskComment">
      <el-input v-model="dataForm.taskComment" placeholder="工作单备注"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wareOrderTask from "@/api/ware/wareOrderTask";
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        orderId: '',
        orderSn: '',
        consignee: '',
        consigneeTel: '',
        deliveryAddress: '',
          orderComment: '',
          paymentWay: '',
          taskStatus: '',
          orderBody: '',
          trackingNo: '',
          createTime: '',
          wareId: '',
          taskComment: ''
        },
        dataRule: {
          orderId: [
            { required: true, message: 'order_id不能为空', trigger: 'blur' }
          ],
          orderSn: [
            { required: true, message: 'order_sn不能为空', trigger: 'blur' }
          ],
          consignee: [
            { required: true, message: '收货人不能为空', trigger: 'blur' }
          ],
          consigneeTel: [
            { required: true, message: '收货人电话不能为空', trigger: 'blur' }
          ],
          deliveryAddress: [
            { required: true, message: '配送地址不能为空', trigger: 'blur' }
          ],
          paymentWay: [
            { required: true, message: '付款方式【 1:在线付款 2:货到付款】不能为空', trigger: 'blur' }
          ],
          taskStatus: [
            { required: true, message: '任务状态不能为空', trigger: 'blur' }
          ],
          trackingNo: [
            { required: true, message: '物流单号不能为空', trigger: 'blur' }
          ],
          wareId: [
            { required: true, message: '仓库id不能为空', trigger: 'blur' }
          ],
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
            let {data} = await wareOrderTask.getById(this.dataForm.id)
            if (data && data.code === 200) {
              this.dataForm = data.data.wareOrderTask
            }
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate(async (valid) => {
          if (valid) {
            this.dataForm.id = this.dataForm.id || undefined
            let {data} = !this.dataForm.id ? await wareOrderTask.save(this.dataForm) : await wareOrderTask.update(this.dataForm)
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
