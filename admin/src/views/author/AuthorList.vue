<template>
  <div class="author-list">
    <el-table :data="authorList">
      <el-table-column label="id" prop="_id"> </el-table-column>
      <el-table-column label="作者名字" prop="name"></el-table-column>
      <el-table-column label="作者头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            class="pr-20"
            type="primary"
            :underline="false"
            @click="authorEdit(scope.row)"
            >编辑</el-link
          >
          <el-link
            type="danger"
            :underline="false"
            @click="authorDelete(scope.row)"
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
      authorList: [],
    }
  },

  created() {
    this.fetchAuthorList()
  },

  methods: {
    async fetchAuthorList() {
      const res = await this.$http.get('/authors')
      if (res.status === 200) {
        this.authorList = res.data
      }
    },
    authorEdit(author) {
      this.$router.push(`/author/edit/${author._id}`)
    },
    async authorDelete(author) {
      const { _id, name } = author
      const res = await this.$http.delete(`/authors/${_id}`)
      if (res.status === 200) {
        this.fetchAuthorList()
        this.$message.success(`删除作者${name}成功`)
      }
    },
  },
}
</script>
