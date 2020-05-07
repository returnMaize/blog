<template>
  <div class="blog-list">
    <el-table :data="blogList">
      <el-table-column label="id" prop="_id"></el-table-column>
      <el-table-column
        label="博客所属分类"
        prop="category.name"
      ></el-table-column>
      <el-table-column label="博客标题" prop="title"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            type="primary"
            class="pr-20"
            :underline="false"
            @click="blogEdit(scope.row)"
            >编辑</el-link
          >
          <el-link
            type="danger"
            :underline="false"
            @click="blogDelete(scope.row)"
            >删除</el-link
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogList: [],
    }
  },
  created() {
    this.fetchBlogList()
  },
  methods: {
    async fetchBlogList() {
      const res = await this.$http.get('/blogs')
      if (res.status === 200) {
        this.blogList = res.data
      }
    },
    blogEdit(blog) {
      this.$router.push(`/blog/edit/${blog._id}`)
    },
    async blogDelete(blog) {
      const res = await this.$http.delete(`/blogs/${blog._id}`)
      if (res.status === 200) {
        this.fetchBlogList()
        this.$message.success('删除博客成功')
      }
    },
  },
}
</script>
