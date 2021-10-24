<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="sku_id" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="sku_id"></el-input>
      </el-form-item>
      <el-form-item label="仓库" prop="wareId">
        <el-select v-model="dataForm.wareId" placeholder="请选择仓库" clearable>
          <el-option :label="w.name" :value="w.id" v-for="w in wareList" :key="w.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存数" prop="stock">
        <el-input v-model="dataForm.stock" placeholder="库存数"></el-input>
      </el-form-item>
      <el-form-item label="sku_name" prop="skuName">
        <el-input v-model="dataForm.skuName" placeholder="sku_name"></el-input>
      </el-form-item>
      <el-form-item label="锁定库存" prop="stockLocked">
        <el-input v-model="dataForm.stockLocked" placeholder="锁定库存"></el-input>
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
import wareSku from "@/api/ware/wareSku";

export default {
  data() {
    return {
      visible: false,
      wareList: [],
      dataForm: {
        id: 0,
        skuId: "",
        wareId: "",
        stock: 0,
        skuName: "",
        stockLocked: 0
      },
      dataRule: {
        skuId: [{ required: true, message: "sku_id不能为空", trigger: "blur" }],
        wareId: [
          { required: true, message: "仓库id不能为空", trigger: "blur" }
        ],
        stock: [{ required: true, message: "库存数不能为空", trigger: "blur" }],
        skuName: [
          { required: true, message: "sku_name不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created(){
    this.getWares();
  },
  methods: {
    async getWares() {
      const {data} = await wareInfo.getWarePagination(1, 500)
      this.wareList = data.data.list
    },
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(async () => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          const {data} = await wareSku.getById(this.dataForm.id)
          if (data && data.code === 200) {
            this.dataForm.skuId = data.data.wareSku.skuId;
            this.dataForm.wareId = data.data.wareSku.wareId;
            this.dataForm.stock = data.data.wareSku.stock;
            this.dataForm.skuName = data.data.wareSku.skuName;
            this.dataForm.stockLocked = data.data.wareSku.stockLocked;
          }
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(async valid => {
        if (valid) {
          let dataForm = {
            id: this.dataForm.id || undefined,
            skuId: this.dataForm.skuId,
            wareId: this.dataForm.wareId,
            stock: this.dataForm.stock,
            skuName: this.dataForm.skuName,
            stockLocked: this.dataForm.stockLocked
          }
          const {data} = !dataForm.id ? await wareSku.save(dataForm) : await wareSku.update(dataForm)
          if (data && data.code === 200) {
            this.$message.success("操作成功")
            this.visible = false;
            this.$emit("refreshDataList");
          } else {
            this.$message.error(data.data.msg);
          }
        }
      });
    }
  }
};
</script>
