<template>
    <el-form :model="form" ref="form" label-width="80px" :inline="true" size="normal" style="padding-top: 10px">
      <el-form-item label="一级分类">
        <el-select :disabled="show" v-model="form.category1Id" placeholder="请选择" @change="changeCategory1(form.category1Id)">
          <el-option v-for="c1 in form.category1List" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="show" v-model="form.category2Id" placeholder="请选择" @change="changeCategory2(form.category2Id)">
          <el-option v-for="c2 in form.category2List" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="show" v-model="form.category3Id" placeholder="请选择" @change="changeCategory3(form.category3Id)">
          <el-option v-for="c3 in form.category3List" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Selections',
  data() {
    return {
      form: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        category1List: [],
        category2List: [],
        category3List: [],
      },
    };
  },
  props: ['show'],
  methods: {
    // 获取一级列表
    async getCategory1() {
      const result = await this.$API.selections.reqCategory1();
      if (result.code === 200) this.form.category1List = result.data;
    },
    // 改变一级列表，获取二级列表
    async changeCategory1(id) {
      this.form.category2Id = '';
      this.form.category3Id = '';
      this.form.category2List = [];
      this.form.category3List = [];
      const result = await this.$API.selections.reqCategory2(id);
      if (result.code === 200) this.form.category2List = result.data;
      // 向父组件发送1id
      this.$emit('changeCategory', { categoryId: id, Level: 1 });
    },
    // 获取三级列表
    async changeCategory2(id) {
      this.form.category3Id = '';
      this.form.category3List = [];
      const result = await this.$API.selections.reqCategory3(id);
      if (result.code === 200) this.form.category3List = result.data;
      // 向父组件发送2id
      this.$emit('changeCategory', { categoryId: id, Level: 2 });
    },
    // 点击三级列表
    changeCategory3(id) {
      // 向父组件发送3id
      this.$emit('changeCategory', { categoryId: id, Level: 3 });
    },
  },
  mounted() {
    this.getCategory1();
  },
};
</script>

<style></style>
