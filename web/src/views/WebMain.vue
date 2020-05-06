<template>
  <div class="web-main">
    <el-header class="text-default bg-black px-0">
      <el-row>
        <el-col
          :span="16"
          :offset="4"
          style="height: 60px"
          class="d-flex ai-center jc-between"
        >
          <div class="author d-flex ai-center">
            <img :src="author.avatar" width="40" class="border-radius-4" />
            <span class="pl-10">{{ author.name }}</span>
          </div>
          <div class="music">music</div>
        </el-col>
      </el-row>
    </el-header>

    <div class="banner" :style="{ 'background-image': `url(${bg})` }">
      <el-row>
        <el-col :span="16" :offset="4">
          <div class="title text-default text-20 pt-30">
            欢迎来到 {{ author.name }} 的博客
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      author: {},
      bg: '',
    }
  },
  created() {
    this.fetchAuthor()
    this.fetchBg()
  },
  methods: {
    async fetchAuthor() {
      const res = await this.$http.get('/authors')
      if (res.status === 200) {
        this.author = res.data[0]
      }
    },
    async fetchBg() {
      const res = await this.$http.get('/bgs')
      if (res.status === 200) {
        this.bg = res.data[0].imgUrl
      }
    },
  },
}
</script>

<style scoped>
.banner {
  height: 400px;
  background-position: center;
  background-size: cover;
}
</style>
