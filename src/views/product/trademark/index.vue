<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 20px 0 20px 0" @click="addDialog">添加</el-button>
    <!-- 添加、修改弹出框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="formLabelWidth" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 总表格 -->
    <el-table :data="tableData" border>
      <el-table-column type="selection" width="100" align="center"></el-table-column>
      <el-table-column label="序号" width="180" type="index" align="center"></el-table-column>

      <!-- logo -->
      <el-table-column label="logo" width="280" align="center">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" width="100" />
        </template>
      </el-table-column>

      <!-- 品牌名称 -->
      <el-table-column label="品牌名称" prop="tmName" align="center"></el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="{ row }">
          <el-button size="mini" @click="updateTm(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteTm(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center"> </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      tableData: [],
      currentPage: 1,
      page: 1,
      limit: 5,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 添加、修改品牌表单数据
      tmForm: {
        id: '',
        logoUrl: '',
        tmName: '',
      },
      // 表单验证
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
        ],
        logoUrl: [{ required: true, message: '请选择品牌图片', trigger: 'change' }],
      },
    };
  },
  methods: {
    // 分页器每页显示几条数据
    handleSizeChange(val) {
      this.limit = val;
      this.getPageList();
    },
    // 分页器切换页码
    handleCurrentChange(val) {
      this.page = val;
      this.getPageList(this.page);
    },
    // 添加品牌
    addDialog() {
      this.tmForm.id = '';
      this.dialogFormVisible = true;
    },
    // 修改品牌
    updateTm(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },
    // 删除品牌
    async deleteTm(row) {
      try {
        const result = await this.$API.tardemark.deleteTrademark(row.id);
        if (result.code === 200) {
          this.$message.success('删除成功');
          this.getPageList(this.tableData.length > 1 ? this.page : this.page -1);
        }
      } catch (error) {}
    },
    // 图片上传成功时
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.tmForm.logoUrl = res.data;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 请求页面品牌列表数据
    async getPageList(page = 1) {
      const result = await this.$API.tardemark.reqTradeMarkList(page, this.limit);
      if (result.code === 200) {
        this.tableData = result.data.records;
        this.total = result.data.total;
      }
    },
    // 点击确定按钮，提交添加或修改的品牌
    addOrUpdate() {
      // 点击确定按钮后验证整体表单是否合规
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          try {
            const result = await this.$API.tardemark.reqAddOrUpdateTrademark(this.tmForm);
            if (result.code === 200) {
              this.$message({
                message: this.tmForm.id ? '修改成功' : '添加成功',
                type: 'success',
              });
              this.tmForm.id = '';
              this.tmForm.logoUrl = '';
              this.tmForm.tmName = '';
              this.dialogFormVisible = false;
              this.getPageList();
            }
          } catch (error) {}
        }
      });
    },
    // 点击取消按钮 清空数据
    cancel() {
      this.tmForm.id = '';
      this.tmForm.logoUrl = '';
      this.tmForm.tmName = '';
      this.dialogFormVisible = false;
    },
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  /* margin-left: 120px; */
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
