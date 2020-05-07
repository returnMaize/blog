<template>
  <div class="category-list">
    <h3>分类列表</h3>
    <el-table class="pt-30"
      :data="categoryList">
      <el-table-column label="分类id"
        prop="_id" />
      <el-table-column label="上级分类"
        prop="parent.name" />
      <el-table-column label="分类名称"
        prop="name" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="primary"
            class="pr-20"
            :underline="false"
            @click="categoryEdit(scope.row)">编辑</el-link>
          <el-link type="danger"
            :underline="false"
            @click="categoryDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: []
    };
  },

  created() {
    this.fetchCategoryList();
  },

  methods: {
    async fetchCategoryList() {
      const res = await this.$http.get("/categories");
      if (res.status === 200) {
        this.categoryList = res.data;
      }
    },
    async categoryEdit(category) {
      this.$router.push(`/category/edit/${category._id}`);
    },
    async categoryDelete(category) {
      const res = await this.$http.delete(`/categories/${category._id}`);
      if (res.status === 200) {
        this.fetchCategoryList();
        this.$message.success(`删除${category.name}分类成功`);
      }
    }
  }
};
</script>
