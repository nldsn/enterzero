<template>
  <el-form :model="skuInfo" label-width="100px">
    <el-form-item label="SPU名称">
      {{ spuName }}
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuInfo.price" type="number"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input v-model="skuInfo.weight" placeholder="SKU重量" type="number"></el-input>
    </el-form-item>
    <el-form-item label="SKU规格描述">
      <el-input type="textarea" v-model="skuInfo.skuDesc" rows="3" placeholder="SKU规格描述"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form-item :label="attrInfo.attrName" v-for="attrInfo in attrInfoList" :key="attrInfo.id">
        <el-select v-model="attrInfo.attrIdValue" placeholder="请选择">
          <el-option :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" v-for="attrValue in attrInfo.attrValueList" :key="attrValue.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form-item v-for="spuSaleAttr in skuSaleAttrList.spuSaleAttrList" :key="spuSaleAttr.id" :label="spuSaleAttr.saleAttrName">
        <el-select v-model="spuSaleAttr.spuAttrIdValue" placeholder="请选择">
          <el-option :label="spuSaleAttrValue.saleAttrValueName" :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`" v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList" :key="spuSaleAttrValue.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table :data="skuImageList" border="" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" width="80" />
          </template>
        </el-table-column>

        <el-table-column label="名称" prop="imgName">
          <template slot-scope="{ row }">
            {{ row.imgName }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.isDefault === '0'" type="primary" @click="isDefaultImage(row)">{{ row.isDefault }}设置默认</el-button>
            <el-tag v-else type="success">默认图片</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuName: '',
      category1Id: 0,
      category2Id: 0,

      skuInfo: {
        category3Id: 0,
        id: 0,
        price: 0, // 价格
        skuAttrValueList: [],
        skuDefaultImg: '',
        skuDesc: '', // 规格描述
        skuImageList: [],
        skuName: '',
        skuSaleAttrValueList: [],
        spuId: 0,
        tmId: 0,
        weight: '',
      },
      attrInfoList: [], // 平台商品属性：手机一级、品牌、内存等...
      skuSaleAttrList: [], // 销售属性：颜色、版本
      skuImageList: [],
    };
  },
  methods: {
    // 获取平台属性列表
    async getAttrInfoList() {
      const result = await this.$API.selections.reqAttrInfoList(this.category1Id, this.category2Id, this.skuInfo.category3Id);
      if (result.code === 200) this.attrInfoList = result.data;
    },
    // 根据spuid获取spu信息
    async getSpuById() {
      const spuResult = await this.$API.spu.get(this.skuInfo.id);
      if (spuResult.code === 200) this.skuSaleAttrList = spuResult.data;
      this.skuInfo.spuId = spuResult.data.id;
      this.skuInfo.tmId = spuResult.data.tmId;
    },
    // 获取图片列表
    async getSpuImage() {
      const imgResult = await this.$API.sku.getSpuImageList(this.skuInfo.id);
      if (imgResult.code === 200) this.skuImageList = imgResult.data;
      // 为了实现默认图片功能，每个图片需要添加一个isDefault属性
      let skuImageList = imgResult.data;
      skuImageList.forEach((item) => (item.isDefault = '0'));
      this.skuImageList = skuImageList;
    },
    handleSelectionChange(val) {
      // this.checkedImageList = val
      // this.multipleSelection = val;
    },
    // 设置默认图片
    isDefaultImage(row) {
      this.skuImageList.forEach((item) => (item.isDefault = '0'));
      row.isDefault = '1';
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消操作
    cancel() {
      Object.assign(this.$data, this.$options.data());
      this.$emit('update:visible', false);
    },
    // 保存
    async save() {
      // 整理图片
      this.skuInfo.skuImageList = this.skuImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      // 整理平台属性和销售属性
      this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((prev, item) => {
        if (item.attrIdValue) {
          let [attrId, valueId] = item.attrIdValue.split(':');
          let obj = {
            attrId,
            valueId,
          };
          prev.push(obj);
        }
        return prev;
      }, []);

      this.skuInfo.skuSaleAttrValueList = this.skuSaleAttrList.spuSaleAttrList.reduce((prev, item) => {
        if (item.spuAttrIdValue) {
          let [saleAttrId, saleAttrValueId] = item.spuAttrIdValue.split(':');
          let obj = {
            saleAttrId,
            saleAttrValueId,
          };
          prev.push(obj);
        }
        return prev;
      }, []);
      delete this.skuInfo.id;
      // 3.发送请求
      try {
        await this.$API.sku.addUpdate(this.skuInfo);
        // 1.提示
        this.$message.success('保存SKU成功');
        // 2.返回列表，不需要父组件再发请求获取spu的列表数据，所以比较简单
        this.$emit('update:visible', false);
        // 3.重置当前的data数据
        Object.assign(this.$data, this.$options.data());
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
