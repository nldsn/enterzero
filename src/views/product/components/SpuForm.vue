<template>
  <el-form label-width="80px" :model="spuInfo">
    <el-form-item label="SPU名称">
      <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option v-for="tradeMark in tradeMarkList" :key="tradeMark.id" :label="tradeMark.tmName" :value="tradeMark.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input v-model="spuInfo.description" type="textarea" rows="4"></el-input>
    </el-form-item>
    <!-- 图片上传 -->
    <el-form-item label="SPU图片">
      <el-upload :file-list="spuImageList" action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select :placeholder="unUsedSpuSaleAttrList.length > 0 ? `还有${unUsedSpuSaleAttrList.length}个未选择` : '没有了'" v-model="spuSaleAttrIdName">
        <el-option v-for="item in unUsedSpuSaleAttrList" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`"> </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="addSpuSaleAttr">添加销售属性</el-button>
      <!-- 表单 -->
      <el-table style="margin: 20px 0" border :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column label="属性名" align="left">
          <template slot-scope="{ row }">{{ row.saleAttrName }}</template>
        </el-table-column>
        <el-table-column prop="tag" label="属性值名称列表" align="left">
          <template slot-scope="{ row }">
            <el-tag v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList" :key="spuSaleAttrValue.id" closable @close="row.spuSaleAttrValueList.splice(index, 1)">
              {{ spuSaleAttrValue.saleAttrValueName }}
            </el-tag>
            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" placeholder="名称" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)"> </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="{ $index }">
            <el-popconfirm title="这是一段内容确定删除吗？">
              <el-button type="danger" icon="el-icon-delete" circle slot="reference" @click="spuInfo.spuSaleAttrList.splice($index, 1)"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spuInfo: {
        category3Id: 0, // 三级分类id ,
        description: '', // 商品描述(后台简述） ,
        spuImageList: [],
        spuName: '', // 商品名称
        spuSaleAttrList: [],
        tmId: 0, // 品牌id
      },
      category3Id: '',
      spuSaleAttrIdName: '',
      spuImageList: [],
      tradeMarkList: [], // 品牌列表
      baseSaleAttrList: [], // 已经有了的属性值=>颜色、版本等
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 请求获取初始化数据
    async initUpdateSpuFormData(spu) {
      // 获取spu的详情
      const result = await this.$API.spu.get(spu.id);
      this.spuInfo = result.data;

      // 获取spu的图片列表数据
      const imgResult = await this.$API.sku.getSpuImageList(spu.id);
      this.spuImageList = imgResult.data;
      this.spuImageList.forEach((item) => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      // 获取所有的品牌数据
      const tmResult = await this.$API.trademark.getTrademarkList();
      this.tradeMarkList = tmResult.data;
      // 获取所有的销售属性数据
      const SaResult = await this.$API.spu.getSaleAttrList();
      this.baseSaleAttrList = SaResult.data;
    },
    async initAddSpuFormData(category3Id) {

      this.spuInfo.category3Id = category3Id;
      //获取所有的品牌数据
      const tmResult = await this.$API.trademark.getTrademarkList();
      if (tmResult.code === 200) {
       this.tradeMarkList = tmResult.data;
      }
      //获取所有的销售属性数据
      const SaResult = await this.$API.spu.getSaleAttrList();
      if (SaResult.code === 200) {
        this.baseSaleAttrList = SaResult.data;
      }
    },
    // 点击添加销售属性
    addSpuSaleAttr() {
      // 将收集到的数据，构造成一个如下对象，
      // 把这个对象添加到指定的 spuInfo.spuSaleAttrList 里面
      let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(':');
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuInfo.spuSaleAttrList.push(obj);
      this.spuSaleAttrIdName = '';
    },

    showInput(row) {
      // 显示当前行的input，当前行就是当前的这个销售属性
      this.$set(row, 'inputVisible', true);
      // 自动获取聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },

    // input失去焦点或者回车后的回调
    handleInputConfirm(row) {
      // 从当前行也就是当前的这个属性对象上，把input输入的数据给获取到
      let saleAttrValueName = row.inputValue;
      let baseSaleAttrId = row.baseSaleAttrId;

      // 条件约束
      if (saleAttrValueName.trim() === '') {
        row.inputValue = '';
        return;
      }
      // 判断这个值不能和已经存在的属性值名称重复
      // 上次在平台属性内部，我们判断重复是需要除去自身
      // 这次不需要，因为我们这次并没有添加占位内容
      let isRepeat = row.spuSaleAttrValueList.some((item) => item.saleAttrValueName === saleAttrValueName);
      if (isRepeat) {
        this.$message.info('输入的属性值名称不能重复');
        row.inputValue = '';
        return;
      }
      // 数据整理，形成对象
      let obj = {
        saleAttrValueName,
        baseSaleAttrId,
      };
      // 把结构数据添加到对应的属性值列表中
      row.spuSaleAttrValueList.push(obj);
      // 把原来的input清空
      row.inputValue = '';
      // 再让input为成按钮
      row.inputVisible = false;
    },
    async save() {
      // 获取收集的数据
      let { spuInfo, spuImageList, category3Id } = this;
      // 数据整理
      // 1.整理图片列表
      // 图片列表现有数据与目标数据的差异比较
      spuInfo.spuImageList = spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        };
      });

      // 3.删除属性当中的inputVisible和inputValue
      spuInfo.spuSaleAttrList.forEach((item) => {
        delete item.inputVisible;
        delete item.inputValue;
      });
      try {
        await this.$API.spu.addUpdate(spuInfo);
        // 成功
        // 1.提示
        this.$message.success('保存成功');
        // 2.返回列表页
        this.$emit('update:visible', false);
        // 3.通过父组件成功返回，父组件需要处理一些工作
        this.$emit('successBack');

        // 4.清空当前组件的data中所有数据
        // 为什么需要清，如果先修改，再添加，数据依然存在，因为不是路由组件，数据必须手动清空
        Object.assign(this.$data, this.$options.data());
      } catch (error) {
        // 失败
        this.$message.error('保存失败');
      }
    },
  },
  computed: {
    // 计算未添加的销售属性
    unUsedSpuSaleAttrList() {
      return this.baseSaleAttrList.filter((item) => this.spuInfo.spuSaleAttrList.every((ele) => item.name !== ele.saleAttrName));
    },
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
