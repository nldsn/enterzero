<template>
  <div>
    <el-card style="margin: 20px">
      <el-header><Selections @changeCategory="changeCategory" style="margin-left:-30px"></Selections></el-header>
    </el-card>
    <el-card style="margin: 20px">
      <el-button type="primary" style="margin: 0 0 20px 0" icon="el-icon-plus">添加属性</el-button>
      <!-- 表格 -->
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column label="属性名称" width="180" align="center" prop="attrName"> </el-table-column>
        <el-table-column prop="tag" label="属性列表" align="center">
          <template slot-scope="{ row }">
            <el-tag type="success" disable-transitions v-for="attr in row.attrValueList" :key="attr.id">{{ attr.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
    };
  },
  methods: {
    async changeCategory({ categoryId, Level }) {
      if (Level === 1) {
        this.category1Id = categoryId;
      } else if (Level === 2) {
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        const result = await this.$API.selections.reqAttrInfoList(this.category1Id, this.category2Id, this.category3Id);
        if (result.code === 200) {
          this.attrList = result.data;
        }
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
};
</script>

<style></style>
