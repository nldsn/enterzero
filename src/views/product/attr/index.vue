<template>
  <div>
    <el-card style="margin: 20px">
      <el-header><Selections @changeCategory="changeCategory" style="margin-left: -30px" :show="!isShowList"></Selections></el-header>
    </el-card>
    <el-card style="margin: 20px">
      <el-button type="primary" style="margin: 0 0 20px 0" icon="el-icon-plus" :disabled="!attrList.length" v-show="isShowList" @click="showAdd">添加属性</el-button>
      <!-- 表格 -->
      <div v-show="isShowList">
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
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性数据表格 -->
      <div v-show="!isShowList">
        <el-form :data="addAttrForm">
          <el-form-item label="属性名">
            <el-input style="width: 180px" placeholder="请输入属性名" v-model="addAttrForm.attrName"></el-input>
          </el-form-item>
          <el-button type="primary" size="default" icon="el-icon-plus" :disabled="!addAttrForm.attrName" @click="addAttr()">添加属性值</el-button><el-button @click="cancel">取消</el-button>
          <el-table border style="margin: 20px 0" :data="addAttrForm.attrValueList">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="属性值名称">
              <template slot-scope="{ row, $index }">
                <el-input :ref="$index" v-if="row.isEdit" style="width: 180" placeholder="请输入属性值名称" v-model="row.valueName" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
                <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" slot-scope="{ row, $index }" @onConfirm="delAttr($index)">
                <el-button type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
              </el-popconfirm>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="default" @click="save" :disabled="addAttrForm.attrValueList.length < 1">保存</el-button><el-button @click="cancel">取消</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowList: true,
      // 添加属性表单数据
      addAttrForm: {
        attrName: '',
        attrValueList: [],
        categoryId: '',
        categoryLevel: '',
        id: '',
      },
    };
  },
  methods: {
    changeCategory({ categoryId, Level }) {
      if (Level === 1) {
        this.category1Id = categoryId;
      } else if (Level === 2) {
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getAttrValueList();
      }
    },
    async getAttrValueList() {
      const result = await this.$API.selections.reqAttrInfoList(this.category1Id, this.category2Id, this.category3Id);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 点击添加属性按钮，显示添加属性页面
    showAdd() {
      this.isShowList = false;
      // 把三级列表的数据传过去
      this.addAttrForm.categoryId = this.category3Id;
      this.addAttrForm.categoryLevel = 3;
    },
    // 点击添加属性值按钮，添加属性
    addAttr() {
      this.addAttrForm.attrValueList.push({
        attrId: this.addAttrForm.id,
        valueName: '',
        isEdit: true, // 默认显示编辑模式
      });
      this.$nextTick(() => {
        // 点击添加属性值时，需要获取数组长度，获取相应的文本框自动聚焦
        this.$refs[this.addAttrForm.attrValueList.length - 1].focus();
      });
    },
    cancel() {
      this.addAttrForm.attrValueList = [];
      this.addAttrForm.attrName = '';
      this.isShowList = true;
    },
    // 失去焦点，显示查看模式
    toLook(row) {
      // 输入不能为空
      if (row.valueName.trim() === '') {
        this.$message('请输入有效字符');
        return;
      }
      // 属性名称不能重复
      let isRepeat = this.addAttrForm.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      if (isRepeat) {
        this.$message('属性名称不能重复');
        return;
      }
      row.isEdit = false;
    },
    // 点击div,进入编辑模式
    toEdit(row, index) {
      row.isEdit = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    handleEdit(row) {
      this.isShowList = false;
      this.addAttrForm = cloneDeep(row);
      // 点击编辑时，给每一个数据都添加上isEdit属性
      this.addAttrForm.attrValueList.forEach((item) => this.$set(item, 'isEdit', false));
    },
    // 点击删除按钮，删除相应属性名称（不需要发请求）
    delAttr(index) {
      this.addAttrForm.attrValueList.splice(index, 1);
    },
    // 保存属性名称，提交服务器
    async save() {
      // 发送请求之前，把isEdit属性删除
      this.addAttrForm.attrValueList = this.addAttrForm.attrValueList.filter((item) => {
        if (item.valueName != '') {
          delete item.isEdit;
          return true;
        }
      });
      try {
        const result = await this.$API.selections.reqSaveAttrInfo(this.addAttrForm);
        if (result.code === 200) {
          this.$message.success('保存成功');
          this.isShowList = true;
          this.getAttrValueList();
        }
      } catch (error) {}
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
};
</script>

<style></style>
