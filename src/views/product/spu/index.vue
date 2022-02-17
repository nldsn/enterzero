<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin: 20px">
      <el-header><Selections @changeCategory="changeCategory" style="margin-left: -30px"></Selections></el-header>
    </el-card>
    <el-card style="margin: 20px" v-show="!isShowSpu && !isShowSku">
      <!-- 添加按钮 -->
      <el-button icon="el-icon-plus" type="primary" style="margin-bottom: 20px" :disabled="!spuList.length > 0" @click="addSpu">添加SPU</el-button>
      <!-- 表单 -->
      <el-table style="width: 100%" border :data="spuList">
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column label="SPU名称" align="left">
          <template slot-scope="{ row }">{{ row.spuName }}</template>
        </el-table-column>
        <el-table-column prop="tag" label="SPU描述" align="left">
          <template slot-scope="{ row }">{{ row.description }}</template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="{ row, $index }">
            <el-tooltip content="添加SKU" placement="top">
              <el-button type="success" icon="el-icon-plus" circle @click="showSkuList(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改SKu" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="updateSpu(row, $index)"></el-button>
            </el-tooltip>
            <el-tooltip content="查看SKU" placement="top">
              <el-button type="info" icon="el-icon-info" circle @click="showDialog(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除SKU" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-card>
        <el-dialog :title="spuName" :visible.sync="dialogTableVisible">
        <el-table :data="skuInfoData" border>
          <el-table-column label="名称" property="skuName" width="150"> </el-table-column>
          <el-table-column label="价格" width="200" property="price" align="right"></el-table-column>
          <el-table-column label="重量" property="weight" align="right"></el-table-column>
          <el-table-column label="默认图片" width="80" align="center">
            <template slot-scope="{ row }">
              <img :src="row.skuDefaultImg" width="80"/>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      </el-card>
      <!-- 分页器 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center"> </el-pagination>
    </el-card>
    <el-card style="margin: 20px" v-show="isShowSpu || isShowSku">
      <SpuForm ref="spu" v-show="isShowSpu" :visible.sync="isShowSpu" @successBack="successBack"></SpuForm>
      <SkuForm v-show="isShowSku" ref="sku" :visible.sync="isShowSku"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm';
import SkuForm from '../components/SkuForm';
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      page: 1,
      limit: 5,
      currentPage: 1,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [],
      total: 0,
      isShowSpu: false,
      isShowSku: false,
      dialogTableVisible: false,
      skuInfoData: [],
      spuName: '',
    };
  },
  methods: {
    async showDialog(row) {
      this.spuName = row.spuName;
      this.dialogTableVisible = true;
      const result = await this.$API.sku.getListBySpuId(row.id);
      if (result.code === 200) {
        this.skuInfoData = result.data;
      }
    },
    showSkuList(row) {
      this.isShowSku = true;
      this.$refs.sku.spuName = row.spuName;
      this.$refs.sku.category1Id = this.category1Id;
      this.$refs.sku.category2Id = this.category2Id;
      this.$refs.sku.skuInfo.category3Id = this.category3Id;
      this.$refs.sku.skuInfo.id = row.id;
      this.$refs.sku.getAttrInfoList();
      this.$refs.sku.getSpuById();
      this.$refs.sku.getSpuImage();
    },
    changeCategory({ categoryId, Level }) {
      if (Level === 1) {
        this.category1Id = categoryId;
      } else if (Level === 2) {
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuValueList();
      }
    },
    // 获取SPU分页列表
    async getSpuValueList(pages = 1) {
      this.page = pages;
      const result = await this.$API.spu.getList(this.page, this.limit, this.category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 分页器每页显示几条数据
    handleSizeChange(val) {
      this.limit = val;
      this.getSpuValueList();
    },
    // 分页器切换页码
    handleCurrentChange(val) {
      this.page = val;
      this.getSpuValueList(this.page);
    },
    // 添加SPU
    addSpu() {
      this.isShowSpu = true;
      this.$refs.spu.initAddSpuFormData(this.category3Id);
    },
    // 修改SPU
    updateSpu(row, index) {
      this.isShowSpu = true;
      this.$refs.spu.initUpdateSpuFormData(row);
    },
    // 成功返回后父组件工作内容
    successBack() {
      // 发送请求重新获取数据
      // 需确认修改成功返回还是添加成功返回，因为这两种重新请求的页码不一样
      if (this.flag) {
        // 修改回来
        this.getSpuValueList(this.page);
      } else {
        // 添加回来
        this.getSpuValueList();
      }

      // 清空flag标识
      this.flag = null;
    },
    // 取消返回后让父组件处理的工作内容
    cancelBack() {
      this.flag = null;
    },
  },
};
</script>

<style></style>
