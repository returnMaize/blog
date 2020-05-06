<template>
  <div class="bg-list">
    <el-table :data="bgList">
      <el-table-column label="id" prop="_id"> </el-table-column>
      <el-table-column label="背景图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            class="pr-20"
            type="primary"
            :underline="false"
            @click="bgEdit(scope.row)"
            >编辑</el-link
          >
          <el-link type="danger" :underline="false" @click="bgDelete(scope.row)"
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
      bgList: [],
    }
  },

  created() {
    this.fetchBgList()
  },

  methods: {
    async fetchBgList() {
      const res = await this.$http.get('/bgs')
      if (res.status === 200) {
        this.bgList = res.data
      }
    },
    bgEdit(img) {
      this.$router.push(`/bg/edit/${img._id}`)
    },
    async bgDelete(img) {
      const res = await this.$http.delete(`/bgs/${img._id}`)
      if (res.status === 200) {
        this.fetchBgList()
        this.$message.success('删除背景图片成功')
      }
    },
  },
}
</script>
